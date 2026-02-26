from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
from requests_oauthlib import OAuth1Session, OAuth1
from itsdangerous import URLSafeSerializer, BadSignature
import requests
import logging
import os
import re
import secrets
import time
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

# Temporary store for OAuth request tokens during the OAuth dance only
TOKEN_STORE = {}

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "dev-secret-change-me")
app.config["SESSION_COOKIE_SECURE"] = os.getenv("FLASK_ENV") == "production"
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["MAX_CONTENT_LENGTH"] = 1 * 1024 * 1024  # 1MB max request size

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=[],
    storage_uri="memory://",
)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
# DEV_FRONTEND_URL can be a comma-separated list of allowed dev/preview origins
# e.g. "https://dev--spinorstream.netlify.app,https://abc123--spinorstream.netlify.app"
_DEV_ORIGINS = [u.strip() for u in os.getenv("DEV_FRONTEND_URL", "").split(",") if u.strip()]
_ALLOWED_ORIGINS = [o for o in [FRONTEND_URL] + _DEV_ORIGINS + ["http://localhost:5173"] if o]
CORS(app, supports_credentials=True, origins=_ALLOWED_ORIGINS)

@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin", "")
    allowed = _ALLOWED_ORIGINS
    if origin in allowed:
        response.headers["Access-Control-Allow-Origin"] = origin
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, X-Auth-Token"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


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
    """Make an OAuth-authenticated Discogs API GET request. Requires a valid session token."""
    raw_token = request.headers.get("X-Auth-Token", "")
    data = _load_session_token(raw_token)
    if not data:
        raise PermissionError("Authentication required")
    auth = OAuth1(
        DISCOGS_CONSUMER_KEY,
        client_secret=DISCOGS_CONSUMER_SECRET,
        resource_owner_key=data["access_token"],
        resource_owner_secret=data["access_token_secret"]
    )
    return requests.get(url, auth=auth, headers={"User-Agent": "RecordFinder/1.0"}, params=params)


# ─── OAUTH ROUTES ────────────────────────────────────────────────────────────

@app.route("/auth/start")
@limiter.limit("10 per minute")
def auth_start():
    origin = request.headers.get("Origin", FRONTEND_URL)
    redirect_back = origin if origin in _ALLOWED_ORIGINS else FRONTEND_URL
    # Sign redirect_back into the callback URL so it survives server restarts
    state = _make_session_token({"redirect_back": redirect_back})
    oauth = OAuth1Session(
        DISCOGS_CONSUMER_KEY,
        client_secret=DISCOGS_CONSUMER_SECRET,
        callback_uri=f"{request.host_url}oauth/callback?state={state}"
    )
    tokens = oauth.fetch_request_token(REQUEST_TOKEN_URL)
    # TOKEN_STORE only holds the request token secret (needed for leg 2 of the dance)
    TOKEN_STORE[tokens["oauth_token"]] = tokens["oauth_token_secret"]
    return jsonify({"auth_url": f"{AUTHORIZE_URL}?oauth_token={tokens['oauth_token']}"})

@app.route("/oauth/callback")
def oauth_callback():
    oauth_token = request.args.get("oauth_token")
    oauth_verifier = request.args.get("oauth_verifier")

    # redirect_back is encoded in the signed state param — survives server restarts
    state_data = _load_session_token(request.args.get("state", "")) or {}
    redirect_back = state_data.get("redirect_back", FRONTEND_URL)

    oauth_token_secret = TOKEN_STORE.pop(oauth_token, None)
    if not oauth_token_secret:
        return "OAuth session expired or not found. Please try again.", 400

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
    user_profile = authed.get(f"https://api.discogs.com/users/{username}").json()
    avatar_url = user_profile.get("avatar_url", "")

    token = _make_session_token({
        "access_token": tokens["oauth_token"],
        "access_token_secret": tokens["oauth_token_secret"],
        "username": username,
        "avatar_url": avatar_url,
    })
    return redirect(f"{redirect_back}?auth=success&token={token}")

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
    username = data["username"]
    try:
        profile = _discogs_get(f"https://api.discogs.com/users/{username}").json()
        avatar_url = profile.get("avatar_url", "")
    except Exception:
        avatar_url = data.get("avatar_url", "")
    return jsonify({"authenticated": True, "username": username, "avatar_url": avatar_url})


# ─── MUSIC DISCOVERY ─────────────────────────────────────────────────────────

_DISCOVER_CACHE = {"data": None, "expires": 0}
_DISCOVER_TTL = 6 * 3600  # 6 hours

_RSS_HEADERS = {"User-Agent": "SpinOrStream/1.0 (+https://spinorstream.com)"}

def _fetch_xml(url):
    r = requests.get(url, headers=_RSS_HEADERS, timeout=10)
    r.raise_for_status()
    return ET.fromstring(r.content)

def _norm(s):
    """Lowercase + strip punctuation for deduplication matching."""
    return re.sub(r"[^\w\s]", "", (s or "").lower()).strip()

def _parse_date(s):
    """Parse an RSS pubDate string to ISO 8601."""
    if not s:
        return None
    for fmt in ("%a, %d %b %Y %H:%M:%S %z", "%a, %d %b %Y %H:%M:%S GMT"):
        try:
            return datetime.strptime(s.strip(), fmt).astimezone(timezone.utc).isoformat()
        except ValueError:
            pass
    return s

def _fetch_pitchfork():
    """Pitchfork Best New Music RSS — each item is one BNM review."""
    albums = []
    try:
        root = _fetch_xml("https://pitchfork.com/feed/feed-best/rss")
        for item in root.iter("item"):
            title = (item.findtext("title") or "").strip()
            # Try "Artist: Album" format, fall back to whole title
            if ":" in title:
                artist, album = title.split(":", 1)
            else:
                artist, album = "", title
            url = item.findtext("link") or ""
            date = _parse_date(item.findtext("pubDate"))
            desc = item.findtext("description") or ""
            score_match = re.search(r"\b([0-9]\.[0-9]|10\.0)\b", desc)
            score = float(score_match.group(1)) if score_match else None
            genres = [c.text for c in item.findall("category") if c.text]
            if artist.strip() or album.strip():
                albums.append({
                    "artist": artist.strip(),
                    "album": album.strip(),
                    "source": "pitchfork",
                    "date": date,
                    "score": score,
                    "genres": genres,
                    "url": url,
                })
    except Exception as e:
        log.warning("Pitchfork RSS failed: %s", e)
    return albums

def _fetch_stereogum():
    """Stereogum RSS — album reviews identified by category or title separator."""
    albums = []
    try:
        root = _fetch_xml("https://www.stereogum.com/feed")
        for item in root.iter("item"):
            title = (item.findtext("title") or "").strip()
            categories = [c.text for c in item.findall("category") if c.text]
            cats_lower = " ".join(c.lower() for c in categories)
            # Accept if category mentions album/review, OR title has artist–album separator
            has_review_cat = "album" in cats_lower or "review" in cats_lower
            sep_found = None
            for sep in [" \u2013 ", " \u2014 ", " - "]:
                if sep in title:
                    sep_found = sep
                    break
            if not has_review_cat and not sep_found:
                continue
            if sep_found:
                artist, album = title.split(sep_found, 1)
            elif ": " in title:
                artist, album = title.split(": ", 1)
            else:
                artist, album = "", title
            url = item.findtext("link") or ""
            date = _parse_date(item.findtext("pubDate"))
            genres = [c for c in categories if c.lower() not in ("album review", "reviews", "music")]
            albums.append({
                "artist": artist.strip(),
                "album": album.strip(),
                "source": "stereogum",
                "date": date,
                "score": None,
                "genres": genres[:3],
                "url": url,
            })
    except Exception as e:
        log.warning("Stereogum RSS failed: %s", e)
    return albums

def _fetch_bandcamp():
    """Bandcamp Daily RSS — recent editorial posts (reviews, essential releases, album of the day)."""
    albums = []
    try:
        root = _fetch_xml("https://daily.bandcamp.com/feed")
        SKIP = ("interview", "playlist", "label profile", "best of", "year in")
        for item in root.iter("item"):
            raw_title = (item.findtext("title") or "").strip()
            title_lower = raw_title.lower()
            if any(kw in title_lower for kw in SKIP):
                continue
            categories = [c.text for c in item.findall("category") if c.text]
            url = item.findtext("link") or ""
            date = _parse_date(item.findtext("pubDate"))
            # Try to split "Artist – Album" format; otherwise treat whole title as feature name
            artist, album = "", raw_title
            for sep in [" \u2013 ", " \u2014 ", " - "]:
                if sep in raw_title:
                    artist, album = raw_title.split(sep, 1)
                    break
            albums.append({
                "artist": artist.strip(),
                "album": album.strip(),
                "source": "bandcamp",
                "date": date,
                "score": None,
                "genres": categories or ["Bandcamp Daily"],
                "url": url,
            })
        albums = albums[:15]  # cap at 15 most recent
    except Exception as e:
        log.warning("Bandcamp RSS failed: %s", e)
    return albums

def _deduplicate(all_albums):
    """Merge albums that appear across multiple sources."""
    seen = {}  # (norm_artist, norm_album) -> index in result
    result = []
    for a in all_albums:
        key = (_norm(a["artist"]), _norm(a["album"]))
        if key in seen:
            existing = result[seen[key]]
            if a["source"] not in existing["sources"]:
                existing["sources"].append(a["source"])
                existing["appears_on_multiple_sources"] = True
                if a.get("score") and not existing.get("score"):
                    existing["score"] = a["score"]
                if a.get("genres"):
                    existing["genres"] = list(dict.fromkeys(existing["genres"] + a["genres"]))
        else:
            seen[key] = len(result)
            result.append({
                "artist": a["artist"],
                "album": a["album"],
                "sources": [a["source"]],
                "appears_on_multiple_sources": False,
                "date": a["date"],
                "score": a.get("score"),
                "genres": a.get("genres", []),
                "url": a["url"],
            })
    return sorted(result, key=lambda x: x["date"] or "", reverse=True)

@app.route("/discover")
@limiter.limit("20 per minute")
def discover():
    now = time.time()
    if _DISCOVER_CACHE["data"] and now < _DISCOVER_CACHE["expires"]:
        return jsonify(_DISCOVER_CACHE["data"])

    pitchfork = _fetch_pitchfork()
    stereogum = _fetch_stereogum()
    bandcamp  = _fetch_bandcamp()

    albums = _deduplicate(pitchfork + stereogum + bandcamp)
    payload = {
        "albums": albums,
        "sources": {
            "pitchfork": len(pitchfork),
            "stereogum": len(stereogum),
            "bandcamp":  len(bandcamp),
        },
        "cached_at": datetime.now(timezone.utc).isoformat(),
    }
    _DISCOVER_CACHE["data"] = payload
    _DISCOVER_CACHE["expires"] = now + _DISCOVER_TTL
    return jsonify(payload)


# ─── EXCHANGE RATES & SHIPPING ───────────────────────────────────────────────

FALLBACK_RATES = {
    "USD": 1.0, "GBP": 1.27, "EUR": 1.08, "CAD": 0.74,
    "AUD": 0.65, "JPY": 0.0067, "SEK": 0.096, "NOK": 0.093,
    "DKK": 0.145, "NZD": 0.60, "CHF": 1.13,
}

SHIPPING_ESTIMATES = {
    # North America
    "US": (10, 10), "Canada": (8, 16), "Mexico": (10, 20),
    # Latin America
    "Colombia": (18, 38), "Brazil": (20, 40), "Argentina": (22, 42),
    "Chile": (20, 38), "Peru": (20, 38), "Venezuela": (22, 42),
    "Ecuador": (20, 38), "Bolivia": (22, 42), "Uruguay": (22, 42),
    "Paraguay": (22, 42), "Cuba": (24, 44),
    # Europe
    "UK": (30, 30), "Germany": (10, 22), "France": (10, 22),
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

US_SHIPPING_LOW = 10
US_SHIPPING_HIGH = 10

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
    except Exception as e:
        log.warning("Exchange rate fetch failed for %s: %s — using fallback", currency, e)
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
    if r.status_code == 429:
        raise RuntimeError("rate_limited")
    if r.status_code != 200:
        log.warning("Discogs search returned %s for artist=%r album=%r", r.status_code, artist, album)
        return []
    return r.json().get("results", [])


def get_discogs_listings(releases):
    us_listings = []
    intl_listings = []

    for release in releases[:5]:
        release_id = release["id"]
        country = release.get("country", "Unknown")

        r = _discogs_get(f"https://api.discogs.com/marketplace/stats/{release_id}")
        if r.status_code == 429:
            raise RuntimeError("rate_limited")
        if r.status_code != 200:
            log.warning("Discogs marketplace/stats returned %s for release_id=%s", r.status_code, release_id)
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
@limiter.limit("20 per minute")
def search():
    artist = request.args.get("artist", "").strip()
    album = request.args.get("album", "").strip()
    if not artist or not album:
        return jsonify({"error": "Artist and album are required"}), 400

    try:
        releases = search_discogs(artist, album)
    except PermissionError:
        return jsonify({"error": "Please log in to search prices"}), 401
    except RuntimeError:
        return jsonify({"error": "Discogs rate limit reached — wait a moment and try again"}), 429

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
        try:
            discogs_us, discogs_intl = get_discogs_listings(releases)
        except PermissionError:
            return jsonify({"error": "Please log in to search prices"}), 401
        except RuntimeError:
            return jsonify({"error": "Discogs rate limit reached — wait a moment and try again"}), 429

    best_us = min(discogs_us, key=lambda x: x["total_low"]) if discogs_us else None
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
@limiter.limit("10 per minute")
def wantlist():
    raw_token = request.headers.get("X-Auth-Token")
    token_data = _load_session_token(raw_token)
    username = (token_data or {}).get("username") or request.args.get("username", "").strip()
    if not username:
        return jsonify({"error": "Username is required"}), 400

    all_items = []
    page = 1
    while True:
        try:
            r = _discogs_get(
                f"https://api.discogs.com/users/{username}/wants",
                params={"page": page, "per_page": 50}
            )
        except PermissionError:
            return jsonify({"error": "Please log in to view your wantlist"}), 401
        if r.status_code == 404:
            return jsonify({"error": f"User '{username}' not found on Discogs"}), 404
        if r.status_code == 429:
            return jsonify({"error": "Discogs rate limit reached — wait a moment and try again"}), 429
        if r.status_code != 200:
            log.error("Discogs wantlist returned %s for user=%r page=%s", r.status_code, username, page)
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
@limiter.limit("10 per minute")
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
        try:
            r = _discogs_get(
                f"https://api.discogs.com/users/{username}/collection/folders/0/releases",
                params={"page": page, "per_page": 50, "sort": "added", "sort_order": "desc"}
            )
        except PermissionError:
            return jsonify({"error": "Please log in to view your collection"}), 401
        if r.status_code == 404:
            return jsonify({"error": "Collection not found or is private"}), 404
        if r.status_code == 429:
            return jsonify({"error": "Discogs rate limit reached — wait a moment and try again"}), 429
        if r.status_code != 200:
            log.error("Discogs collection returned %s for user=%r page=%s", r.status_code, username, page)
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
