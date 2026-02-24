from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
from dotenv import load_dotenv
from requests_oauthlib import OAuth1Session, OAuth1
from itsdangerous import URLSafeSerializer, BadSignature
import requests
import os
import re
import secrets

# Temporary store for OAuth request tokens during the OAuth dance only
TOKEN_STORE = {}

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "dev-secret-change-me")
app.config["SESSION_COOKIE_SECURE"] = os.getenv("FLASK_ENV") == "production"
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_HTTPONLY"] = True

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
CORS(app, supports_credentials=True, origins=[FRONTEND_URL, "http://localhost:5173"])

@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin", "")
    allowed = [FRONTEND_URL, "http://localhost:5173"]
    if origin in allowed:
        response.headers["Access-Control-Allow-Origin"] = origin
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, X-Auth-Token"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response


DISCOGS_TOKEN = os.getenv("DISCOGS_TOKEN")
DISCOGS_HEADERS = {
    "Authorization": f"Discogs token={DISCOGS_TOKEN}",
    "User-Agent": "RecordFinder/1.0"
}
DISCOGS_CONSUMER_KEY = os.getenv("DISCOGS_CONSUMER_KEY")
DISCOGS_CONSUMER_SECRET = os.getenv("DISCOGS_CONSUMER_SECRET")

REQUEST_TOKEN_URL = "https://api.discogs.com/oauth/request_token"
AUTHORIZE_URL = "https://www.discogs.com/oauth/authorize"
ACCESS_TOKEN_URL = "https://api.discogs.com/oauth/access_token"


# ─── SESSION TOKEN HELPERS ───────────────────────────────────────────────────
# Tokens are signed with FLASK_SECRET_KEY, so sessions survive server restarts
# without needing a database or cache.

def _make_session_token(data):
    s = URLSafeSerializer(app.secret_key)
    return s.dumps(data)

def _load_session_token(token):
    if not token:
        return None
    s = URLSafeSerializer(app.secret_key)
    try:
        return s.loads(token)
    except (BadSignature, Exception):
        return None

def _discogs_get(url, params=None):
    """Make an authenticated Discogs API GET request, using OAuth if available."""
    raw_token = request.headers.get("X-Auth-Token", "")
    data = _load_session_token(raw_token)
    if data:
        auth = OAuth1(
            DISCOGS_CONSUMER_KEY,
            client_secret=DISCOGS_CONSUMER_SECRET,
            resource_owner_key=data["access_token"],
            resource_owner_secret=data["access_token_secret"]
        )
        return requests.get(url, auth=auth, headers={"User-Agent": "RecordFinder/1.0"}, params=params)
    return requests.get(url, headers=DISCOGS_HEADERS, params=params)


# ─── OAUTH ROUTES ────────────────────────────────────────────────────────────

@app.route("/auth/start")
def auth_start():
    oauth = OAuth1Session(
        DISCOGS_CONSUMER_KEY,
        client_secret=DISCOGS_CONSUMER_SECRET,
        callback_uri=f"{request.host_url}oauth/callback"
    )
    tokens = oauth.fetch_request_token(REQUEST_TOKEN_URL)
    TOKEN_STORE[tokens["oauth_token"]] = {"oauth_token_secret": tokens["oauth_token_secret"]}
    return jsonify({"auth_url": f"{AUTHORIZE_URL}?oauth_token={tokens['oauth_token']}"})

@app.route("/oauth/callback")
def oauth_callback():
    oauth_token = request.args.get("oauth_token")
    oauth_verifier = request.args.get("oauth_verifier")

    stored = TOKEN_STORE.pop(oauth_token, None)
    if not stored:
        return "OAuth session expired or not found. Please try again.", 400
    oauth_token_secret = stored.get("oauth_token_secret", "")

    oauth = OAuth1Session(
        DISCOGS_CONSUMER_KEY,
        client_secret=DISCOGS_CONSUMER_SECRET,
        resource_owner_key=oauth_token,
        resource_owner_secret=oauth_token_secret,
        verifier=oauth_verifier
    )
    tokens = oauth.fetch_access_token(ACCESS_TOKEN_URL)
    authed = OAuth1Session(
        DISCOGS_CONSUMER_KEY,
        client_secret=DISCOGS_CONSUMER_SECRET,
        resource_owner_key=tokens["oauth_token"],
        resource_owner_secret=tokens["oauth_token_secret"]
    )
    identity = authed.get("https://api.discogs.com/oauth/identity").json()
    username = identity.get("username")

    token = _make_session_token({
        "access_token": tokens["oauth_token"],
        "access_token_secret": tokens["oauth_token_secret"],
        "username": username
    })
    return redirect(f"{FRONTEND_URL}?auth=success&token={token}")

@app.route("/oauth/logout")
def oauth_logout():
    # Tokens are stateless (signed), so logout is handled client-side by clearing localStorage
    return jsonify({"ok": True})

@app.route("/oauth/me")
def oauth_me():
    token = request.headers.get("X-Auth-Token")
    data = _load_session_token(token)
    if not data:
        return jsonify({"authenticated": False}), 401
    return jsonify({"authenticated": True, "username": data["username"]})


# ─── EXCHANGE RATES & SHIPPING ───────────────────────────────────────────────

FALLBACK_RATES = {
    "USD": 1.0, "GBP": 1.27, "EUR": 1.08, "CAD": 0.74,
    "AUD": 0.65, "JPY": 0.0067, "SEK": 0.096, "NOK": 0.093,
    "DKK": 0.145, "NZD": 0.60, "CHF": 1.13,
}

SHIPPING_ESTIMATES = {
    # North America
    "US": (0, 0), "Canada": (8, 16), "Mexico": (10, 20),
    # Latin America
    "Colombia": (18, 38), "Brazil": (20, 40), "Argentina": (22, 42),
    "Chile": (20, 38), "Peru": (20, 38), "Venezuela": (22, 42),
    "Ecuador": (20, 38), "Bolivia": (22, 42), "Uruguay": (22, 42),
    "Paraguay": (22, 42), "Cuba": (24, 44),
    # Europe
    "UK": (12, 22), "Germany": (10, 22), "France": (10, 22),
    "Netherlands": (10, 20), "Belgium": (10, 20), "Italy": (12, 24),
    "Spain": (12, 24), "Sweden": (12, 22), "Denmark": (12, 22),
    "Norway": (12, 22), "Finland": (12, 22), "Switzerland": (12, 24),
    "Austria": (10, 22), "Poland": (12, 22), "Portugal": (12, 22),
    "Czech Republic": (12, 22), "Hungary": (12, 22), "Romania": (14, 26),
    "Greece": (14, 26), "Turkey": (14, 28), "Ukraine": (16, 30),
    "Russia": (18, 36),
    # Asia Pacific
    "Japan": (18, 35), "Australia": (18, 32), "New Zealand": (20, 36),
    "South Korea": (18, 32), "Hong Kong": (16, 30), "Taiwan": (16, 30),
    "China": (16, 32), "Singapore": (16, 30), "Thailand": (16, 30),
    "Indonesia": (18, 34), "Philippines": (18, 34), "India": (18, 34),
    # Middle East / Africa
    "South Africa": (20, 38),
}

US_SHIPPING_LOW = 4
US_SHIPPING_HIGH = 8

DEFAULT_SHIPPING = (15, 32)

_rate_cache = {}


def get_exchange_rate(currency):
    currency = currency.upper()
    if currency == "USD":
        return 1.0
    if currency in _rate_cache:
        return _rate_cache[currency]
    try:
        r = requests.get("https://open.er-api.com/v6/latest/USD", timeout=5)
        if r.status_code == 200:
            for code, rate in r.json().get("rates", {}).items():
                _rate_cache[code] = 1.0 / rate
            if currency in _rate_cache:
                return _rate_cache[currency]
    except Exception:
        pass
    return FALLBACK_RATES.get(currency, 1.0)


def clean_artist(name):
    return re.sub(r'\s*\(\d+\)$', '', name).strip()


def shipping_for(country):
    return SHIPPING_ESTIMATES.get(country, DEFAULT_SHIPPING)


# ─── DISCOGS SEARCH ──────────────────────────────────────────────────────────

def search_discogs(artist, album):
    r = _discogs_get(
        "https://api.discogs.com/database/search",
        params={"artist": artist, "release_title": album,
                "type": "release", "format": "vinyl", "per_page": 5}
    )
    if r.status_code != 200:
        return []
    return r.json().get("results", [])


def get_discogs_listings(releases):
    us_listings = []
    intl_listings = []

    for release in releases[:5]:
        release_id = release["id"]
        country = release.get("country", "Unknown")

        r = _discogs_get(f"https://api.discogs.com/marketplace/stats/{release_id}")
        if r.status_code != 200:
            continue

        stats = r.json()
        lowest = stats.get("lowest_price")
        num_for_sale = stats.get("num_for_sale", 0)
        if not lowest or num_for_sale == 0:
            continue

        price = round(lowest["value"], 2)
        ship_low, ship_high = shipping_for(country)

        entry = {
            "price": price,
            "ships_from": country,
            "year": release.get("year", ""),
            "num_for_sale": num_for_sale,
            "url": f"https://www.discogs.com/release/{release_id}",
            "shipping_low": ship_low,
            "shipping_high": ship_high,
            "total_low": round(price + ship_low, 2),
            "total_high": round(price + ship_high, 2),
        }

        if country == "US":
            us_listings.append(entry)
        else:
            intl_listings.append(entry)

    return us_listings, intl_listings


@app.route("/search", methods=["GET"])
def search():
    artist = request.args.get("artist", "").strip()
    album = request.args.get("album", "").strip()
    if not artist or not album:
        return jsonify({"error": "Artist and album are required"}), 400

    releases = search_discogs(artist, album)
    release_info = {}
    discogs_us = []
    discogs_intl = []

    if releases:
        first = releases[0]
        release_info = {
            "title": first.get("title"),
            "year": first.get("year"),
            "cover_url": first.get("cover_image"),
            "discogs_url": f"https://www.discogs.com/release/{first['id']}"
        }
        discogs_us, discogs_intl = get_discogs_listings(releases)

    best_us = min(discogs_us, key=lambda x: x["price"]) if discogs_us else None
    best_intl = min(discogs_intl, key=lambda x: x["total_low"]) if discogs_intl else None

    return jsonify({
        "release": release_info,
        "discogs_us": discogs_us[:5],
        "discogs_intl": discogs_intl[:5],
        "best_us": best_us,
        "best_intl": best_intl,
        "us_only_warning": (not discogs_us) and bool(discogs_intl),
        "us_shipping_estimate": f"${US_SHIPPING_LOW}–${US_SHIPPING_HIGH}",
    })


# ─── WANTLIST ─────────────────────────────────────────────────────────────────

@app.route("/wantlist", methods=["GET"])
def wantlist():
    raw_token = request.headers.get("X-Auth-Token")
    token_data = _load_session_token(raw_token)
    username = (token_data or {}).get("username") or request.args.get("username", "").strip()
    if not username:
        return jsonify({"error": "Username is required"}), 400

    all_items = []
    page = 1
    while True:
        r = _discogs_get(
            f"https://api.discogs.com/users/{username}/wants",
            params={"page": page, "per_page": 50}
        )
        if r.status_code == 404:
            return jsonify({"error": f"User '{username}' not found on Discogs"}), 404
        if r.status_code != 200:
            return jsonify({"error": "Failed to fetch wantlist"}), 500

        data = r.json()
        for want in data.get("wants", []):
            basic = want.get("basic_information", {})
            artists = basic.get("artists", [])
            all_items.append({
                "id": str(basic.get("id", "")),
                "artist": clean_artist(artists[0]["name"]) if artists else "Unknown",
                "title": basic.get("title", ""),
                "year": basic.get("year", ""),
                "cover_url": basic.get("cover_image", ""),
                "discogs_url": f"https://www.discogs.com/release/{basic.get('id', '')}"
            })

        pagination = data.get("pagination", {})
        if page >= pagination.get("pages", 1):
            break
        page += 1

    return jsonify({"items": all_items, "total": len(all_items)})


# ─── COLLECTION ───────────────────────────────────────────────────────────────

@app.route("/collection", methods=["GET"])
def collection():
    raw_token = request.headers.get("X-Auth-Token")
    token_data = _load_session_token(raw_token)
    username = (token_data or {}).get("username") or request.args.get("username", "").strip()
    if not username:
        return jsonify({"error": "Username is required"}), 400

    all_items = []
    page = 1
    max_pages = 6

    while page <= max_pages:
        r = _discogs_get(
            f"https://api.discogs.com/users/{username}/collection/folders/0/releases",
            params={"page": page, "per_page": 50, "sort": "added", "sort_order": "desc"}
        )
        if r.status_code == 404:
            return jsonify({"error": "Collection not found or is private"}), 404
        if r.status_code != 200:
            return jsonify({"error": "Failed to fetch collection"}), 500

        data = r.json()
        for item in data.get("releases", []):
            basic = item.get("basic_information", {})
            artists = basic.get("artists", [])
            all_items.append({
                "id": str(basic.get("id", "")),
                "artist": clean_artist(artists[0]["name"]) if artists else "Unknown",
                "title": basic.get("title", ""),
                "year": basic.get("year", ""),
                "cover_url": basic.get("cover_image", ""),
                "discogs_url": f"https://www.discogs.com/release/{basic.get('id', '')}",
                "date_added": item.get("date_added", ""),
            })

        pagination = data.get("pagination", {})
        if page >= pagination.get("pages", 1):
            break
        page += 1

    return jsonify({"items": all_items, "total": len(all_items)})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5001)
