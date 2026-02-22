from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import requests
import os
import re
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

DISCOGS_TOKEN = os.getenv("DISCOGS_TOKEN")
DISCOGS_HEADERS = {
    "Authorization": f"Discogs token={DISCOGS_TOKEN}",
    "User-Agent": "RecordFinder/1.0"
}

SCRAPE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

# Fallback exchange rates to USD if API fails
FALLBACK_RATES = {
    "USD": 1.0,
    "GBP": 1.27,
    "EUR": 1.08,
    "CAD": 0.74,
    "AUD": 0.65,
    "JPY": 0.0067,
    "SEK": 0.096,
    "NOK": 0.093,
    "DKK": 0.145,
    "NZD": 0.60,
    "CHF": 1.13,
}

_exchange_rate_cache = {}

def get_exchange_rate(currency):
    """Get exchange rate to USD. Returns 1.0 if currency is USD or unknown."""
    currency = currency.upper()
    if currency == "USD":
        return 1.0

    if currency in _exchange_rate_cache:
        return _exchange_rate_cache[currency]

    try:
        response = requests.get(
            f"https://open.er-api.com/v6/latest/USD",
            timeout=5
        )
        if response.status_code == 200:
            data = response.json()
            rates = data.get("rates", {})
            # Cache all rates we got back
            for code, rate in rates.items():
                # Rate is how many units per 1 USD, so to convert TO usd: 1/rate
                _exchange_rate_cache[code] = 1.0 / rate
            if currency in _exchange_rate_cache:
                print(f"Exchange rate {currency} -> USD: {_exchange_rate_cache[currency]} (live)")
                return _exchange_rate_cache[currency]
    except Exception as e:
        print(f"Exchange rate API failed: {e}, using fallback")

    # Use fallback
    rate = FALLBACK_RATES.get(currency, 1.0)
    print(f"Exchange rate {currency} -> USD: {rate} (fallback)")
    return rate


def to_usd(amount, currency):
    """Convert any amount to USD."""
    if amount is None:
        return None
    rate = get_exchange_rate(currency)
    return round(amount * rate, 2)


# --- DISCOGS ---

def search_discogs(artist, album):
    url = "https://api.discogs.com/database/search"
    params = {
        "artist": artist,
        "release_title": album,
        "type": "release",
        "format": "vinyl",
        "per_page": 5
    }
    response = requests.get(url, headers=DISCOGS_HEADERS, params=params)
    if response.status_code != 200:
        print(f"Search error: {response.status_code} - {response.text}")
        return []
    results = response.json().get("results", [])
    print(f"Found {len(results)} releases")
    return results


def get_discogs_listings(releases):
    us_listings = []
    intl_listings = []

    for release in releases[:5]:
        release_id = release["id"]
        country = release.get("country", "Unknown")

        stats_url = f"https://api.discogs.com/marketplace/stats/{release_id}"
        stats_response = requests.get(stats_url, headers=DISCOGS_HEADERS)
        if stats_response.status_code != 200:
            print(f"Stats error for {release_id}: {stats_response.status_code}")
            continue

        stats = stats_response.json()
        lowest = stats.get("lowest_price")
        num_for_sale = stats.get("num_for_sale", 0)

        if not lowest or num_for_sale == 0:
            continue

        # Discogs returns prices in USD already
        entry = {
            "price": round(lowest["value"], 2),
            "currency": "USD",
            "condition": "Various",
            "ships_from": country,
            "num_for_sale": num_for_sale,
            "url": f"https://www.discogs.com/release/{release_id}"
        }

        if country == "US":
            us_listings.append(entry)
        else:
            intl_listings.append(entry)

    return us_listings, intl_listings


# --- BANDCAMP ---

def search_bandcamp(artist, album):
    """Search Bandcamp and return the best matching album URL."""
    query = f"{artist} {album}"
    search_url = f"https://bandcamp.com/search?q={requests.utils.quote(query)}&item_type=a"

    try:
        response = requests.get(search_url, headers=SCRAPE_HEADERS, timeout=10)
        if response.status_code != 200:
            print(f"Bandcamp search error: {response.status_code}")
            return None

        soup = BeautifulSoup(response.text, "html.parser")
        results = soup.select(".result-items .searchresult")
        print(f"Bandcamp search results: {len(results)}")

        for result in results[:5]:
            result_type = result.select_one(".itemtype")
            if result_type and "ALBUM" in result_type.text.upper():
                link = result.select_one(".itemurl a")
                if link:
                    url = link.get("href", "").split("?")[0]
                    print(f"Bandcamp album URL: {url}")
                    return url

        return None

    except Exception as e:
        print(f"Bandcamp search exception: {e}")
        return None


def detect_bandcamp_country(soup, pkg):
    """
    Try multiple methods to detect if a Bandcamp vinyl ships internationally.
    Returns (ships_from_string, is_international_bool)
    """
    # Method 1: ships_from_country_name in package JSON
    ships_from = pkg.get("ships_from_country_name", "") or ""
    if ships_from:
        is_intl = ships_from.lower() not in ["united states", "us", "usa"]
        return ships_from, is_intl

    # Method 2: ships_from_country in package JSON (ISO code)
    ships_from_code = pkg.get("ships_from_country", "") or ""
    if ships_from_code:
        is_intl = ships_from_code.upper() not in ["US", "USA"]
        return ships_from_code, is_intl

    # Method 3: Look for currency — non-USD strongly suggests international
    currency = pkg.get("currency", "USD") or "USD"
    if currency != "USD":
        return f"International ({currency})", True

    # Method 4: Scrape the page for shipping text
    shipping_text = ""
    for tag in soup.find_all(text=re.compile(r"ships from", re.I)):
        shipping_text = tag.strip()
        break
    if shipping_text:
        is_intl = "united states" not in shipping_text.lower() and "us" not in shipping_text.lower()
        return shipping_text, is_intl

    return "", False


def scrape_bandcamp_album(url):
    """
    Scrape a Bandcamp album page for digital price, vinyl price,
    currency, and shipping origin. All prices converted to USD.
    """
    result = {
        "url": url,
        "digital_price": None,
        "digital_price_original": None,
        "digital_currency": "USD",
        "vinyl_price": None,
        "vinyl_price_original": None,
        "vinyl_currency": "USD",
        "vinyl_ships_from": None,
        "vinyl_is_intl": False,
        "vinyl_sold_out": False,
        "found": False
    }

    try:
        response = requests.get(url, headers=SCRAPE_HEADERS, timeout=10)
        if response.status_code != 200:
            print(f"Bandcamp album page error: {response.status_code}")
            return result

        soup = BeautifulSoup(response.text, "html.parser")
        result["found"] = True

        scripts = soup.find_all("script", {"data-tralbum": True})
        if not scripts:
            print("No data-tralbum script found on Bandcamp page")
            return result

        data = json.loads(scripts[0]["data-tralbum"])
        packages = data.get("packages") or []
        current = data.get("current", {})

        # --- Digital price ---
        digital_currency = current.get("currency", "USD") or "USD"
        digital_raw = current.get("minimum_price")
        if digital_raw is None:
            digital_raw = current.get("price")

        # Bandcamp sometimes reports digital currency as USD even for non-US labels
        # If a vinyl package has a different currency, trust that instead
        for pkg in packages:
            pkg_currency = pkg.get("currency", "USD") or "USD"
            if pkg_currency != "USD":
                digital_currency = pkg_currency
                print(f"Overriding digital currency from USD to {pkg_currency} based on package")
                break

        if digital_raw is not None:
            result["digital_price_original"] = float(digital_raw)
            result["digital_currency"] = digital_currency
            result["digital_price"] = to_usd(float(digital_raw), digital_currency)

        # --- Vinyl from packages ---
        for pkg in packages:
            title = (pkg.get("title") or "").lower()
            desc = (pkg.get("description_summary") or "").lower()

            is_vinyl = any(kw in title or kw in desc for kw in ["vinyl", " lp", "12\"", "12 inch", "record", "7\"", "7 inch"])
            if not is_vinyl:
                continue

            # Sold out check
            qty_available = pkg.get("qty_available", 1)
            sold_out = qty_available is not None and qty_available <= 0
            result["vinyl_sold_out"] = sold_out

            vinyl_currency = pkg.get("currency", digital_currency) or digital_currency
            vinyl_raw = pkg.get("price")

            if vinyl_raw is not None:
                result["vinyl_price_original"] = float(vinyl_raw)
                result["vinyl_currency"] = vinyl_currency
                result["vinyl_price"] = to_usd(float(vinyl_raw), vinyl_currency)

            ships_from, is_intl = detect_bandcamp_country(soup, pkg)
            result["vinyl_ships_from"] = ships_from
            result["vinyl_is_intl"] = is_intl

            print(f"Bandcamp vinyl: {vinyl_raw} {vinyl_currency} = ${result['vinyl_price']} USD, ships from '{ships_from}', intl={is_intl}, sold_out={sold_out}")
            break

        print(f"Bandcamp digital: {result['digital_price_original']} {result['digital_currency']} = ${result['digital_price']} USD")
        return result

    except Exception as e:
        print(f"Bandcamp scrape exception: {e}")
        return result


# --- DECISION ENGINE ---

def make_decision(threshold, bandcamp_digital, bandcamp_vinyl, bandcamp_vinyl_intl_shipping, discogs_us, discogs_intl, retail):
    options = []

    # Discogs US vinyl
    if discogs_us:
        best_discogs_us = min(discogs_us, key=lambda x: x["price"])
        vinyl_premium = best_discogs_us["price"] - (bandcamp_digital or 0)
        options.append({
            "source": "Discogs (US seller)",
            "format": "Vinyl",
            "price": best_discogs_us["price"],
            "premium_over_digital": vinyl_premium,
            "within_threshold": vinyl_premium <= threshold,
            "url": best_discogs_us["url"],
            "condition": best_discogs_us["condition"]
        })

    # Retail vinyl
    if retail:
        vinyl_premium = retail["price"] - (bandcamp_digital or 0)
        options.append({
            "source": retail["source"],
            "format": "Vinyl",
            "price": retail["price"],
            "premium_over_digital": vinyl_premium,
            "within_threshold": vinyl_premium <= threshold,
            "url": retail.get("url", ""),
        })

    # Bandcamp vinyl with international shipping
    if bandcamp_vinyl and bandcamp_vinyl_intl_shipping:
        total = bandcamp_vinyl + bandcamp_vinyl_intl_shipping
        vinyl_premium = total - (bandcamp_digital or 0)
        options.append({
            "source": "Bandcamp (vinyl + intl shipping)",
            "format": "Vinyl + Digital",
            "price": total,
            "premium_over_digital": vinyl_premium,
            "within_threshold": vinyl_premium <= threshold,
            "url": "",
        })
    elif bandcamp_vinyl:
        vinyl_premium = bandcamp_vinyl - (bandcamp_digital or 0)
        options.append({
            "source": "Bandcamp (vinyl)",
            "format": "Vinyl + Digital",
            "price": bandcamp_vinyl,
            "premium_over_digital": vinyl_premium,
            "within_threshold": vinyl_premium <= threshold,
            "url": "",
        })

    # Bandcamp digital
    if bandcamp_digital is not None:
        options.append({
            "source": "Bandcamp",
            "format": "Digital",
            "price": bandcamp_digital,
            "premium_over_digital": 0,
            "within_threshold": True,
            "url": "",
        })

    vinyl_options = [o for o in options if o["format"] != "Digital" and o["within_threshold"]]
    digital_options = [o for o in options if o["format"] == "Digital"]

    if vinyl_options:
        best_vinyl = min(vinyl_options, key=lambda x: x["price"])
        return {
            "decision": "Buy Vinyl",
            "best_option": best_vinyl,
            "reason": f"Vinyl from {best_vinyl['source']} is ${best_vinyl['premium_over_digital']:.2f} over digital — within your ${threshold} threshold.",
            "runner_up": digital_options[0] if digital_options else None,
            "all_options": options
        }
    elif digital_options:
        return {
            "decision": "Buy Digital",
            "best_option": digital_options[0],
            "reason": f"No vinyl option found within your ${threshold} threshold. Buy digital on Bandcamp.",
            "runner_up": None,
            "all_options": options
        }
    else:
        return {
            "decision": "No Results",
            "best_option": None,
            "reason": "No pricing data found. Try searching Bandcamp and Discogs manually.",
            "runner_up": None,
            "all_options": options
        }


# --- ROUTES ---

@app.route("/search", methods=["GET"])
def search():
    artist = request.args.get("artist", "")
    album = request.args.get("album", "")
    threshold = float(request.args.get("threshold", 15))

    if not artist or not album:
        return jsonify({"error": "Artist and album are required"}), 400

    # Discogs
    releases = search_discogs(artist, album)
    discogs_us = []
    discogs_intl = []
    release_info = {}

    if releases:
        first = releases[0]
        release_info = {
            "title": first.get("title"),
            "year": first.get("year"),
            "cover": first.get("cover_image"),
            "discogs_url": f"https://www.discogs.com/release/{first['id']}"
        }
        discogs_us, discogs_intl = get_discogs_listings(releases)

    # Bandcamp
    bandcamp_digital = None
    bandcamp_vinyl = None
    bandcamp_vinyl_intl_shipping = None
    bandcamp_url = None
    bc_data = {}

    bc_album_url = search_bandcamp(artist, album)
    if bc_album_url:
        bc_data = scrape_bandcamp_album(bc_album_url)
        bandcamp_url = bc_album_url
        bandcamp_digital = bc_data.get("digital_price")

    if bc_data.get("vinyl_price") and not bc_data.get("vinyl_sold_out"):
        bandcamp_vinyl = bc_data["vinyl_price"]
        if bc_data.get("vinyl_is_intl"):
            try:
                bandcamp_vinyl_intl_shipping = float(request.args.get("shipping_cost", 20.0))
            except (ValueError, TypeError):
                bandcamp_vinyl_intl_shipping = 20.0

    decision = make_decision(
        threshold=threshold,
        bandcamp_digital=bandcamp_digital,
        bandcamp_vinyl=bandcamp_vinyl,
        bandcamp_vinyl_intl_shipping=bandcamp_vinyl_intl_shipping,
        discogs_us=discogs_us,
        discogs_intl=discogs_intl,
        retail=None
    )

    return jsonify({
        "release": release_info,
        "discogs_us": discogs_us[:5],
        "discogs_intl": discogs_intl[:5],
        "bandcamp": {
            "url": bandcamp_url,
            "digital_price": bc_data.get("digital_price"),
            "digital_price_original": bc_data.get("digital_price_original"),
            "digital_currency": bc_data.get("digital_currency", "USD"),
            "vinyl_price": bc_data.get("vinyl_price"),
            "vinyl_price_original": bc_data.get("vinyl_price_original"),
            "vinyl_currency": bc_data.get("vinyl_currency", "USD"),
            "vinyl_is_intl": bc_data.get("vinyl_is_intl", False),
            "vinyl_ships_from": bc_data.get("vinyl_ships_from"),
            "vinyl_sold_out": bc_data.get("vinyl_sold_out", False)
        } if bc_album_url else None,
        "decision": decision
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5001)