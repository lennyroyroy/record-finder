from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

DISCOGS_TOKEN = os.getenv("DISCOGS_TOKEN")
DISCOGS_HEADERS = {
    "Authorization": f"Discogs token={DISCOGS_TOKEN}",
    "User-Agent": "RecordFinder/1.0"
}

# --- DISCOGS ---

def search_discogs(artist, album):
    url = "https://api.discogs.com/database/search"
    params = {
        "artist": artist,
        "release_title": album,
        "type": "release",
        "format": "vinyl",
        "per_page": 10
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

    for release in releases[:10]:
        release_id = release["id"]
        country = release.get("country", "Unknown")

        stats_url = f"https://api.discogs.com/marketplace/stats/{release_id}"
        stats_response = requests.get(stats_url, headers=DISCOGS_HEADERS)
        if stats_response.status_code != 200:
            print(f"Stats error for {release_id}: {stats_response.status_code}")
            continue

        stats = stats_response.json()
        print(f"Stats for {release_id} ({country}): {stats}")

        lowest = stats.get("lowest_price")
        num_for_sale = stats.get("num_for_sale", 0)

        if not lowest or num_for_sale == 0:
            continue

        entry = {
            "price": lowest["value"],
            "currency": lowest["currency"],
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


# --- DECISION ENGINE ---

def make_decision(threshold, bandcamp_digital, bandcamp_vinyl, bandcamp_vinyl_intl_shipping, discogs_us, discogs_intl, retail):
    options = []

    # Discogs US vinyl
    if discogs_us:
        best_discogs_us = discogs_us[0]["price"]
        vinyl_premium = best_discogs_us - (bandcamp_digital or 0)
        options.append({
            "source": "Discogs (US seller)",
            "format": "Vinyl",
            "price": best_discogs_us,
            "premium_over_digital": vinyl_premium,
            "within_threshold": vinyl_premium <= threshold,
            "url": discogs_us[0]["url"],
            "condition": discogs_us[0]["condition"]
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

    # Bandcamp digital always an option
    if bandcamp_digital:
        options.append({
            "source": "Bandcamp",
            "format": "Digital",
            "price": bandcamp_digital,
            "premium_over_digital": 0,
            "within_threshold": True,
            "url": "",
        })

    # Find best option
    vinyl_options = [o for o in options if o["format"] != "Digital" and o["within_threshold"]]
    digital_options = [o for o in options if o["format"] == "Digital"]

    if vinyl_options:
        best_vinyl = min(vinyl_options, key=lambda x: x["price"])
        recommendation = {
            "decision": "Buy Vinyl",
            "best_option": best_vinyl,
            "reason": f"Vinyl from {best_vinyl['source']} is ${best_vinyl['premium_over_digital']:.2f} over digital — within your ${threshold} threshold.",
            "runner_up": digital_options[0] if digital_options else None,
            "all_options": options
        }
    else:
        recommendation = {
            "decision": "Buy Digital",
            "best_option": digital_options[0] if digital_options else None,
            "reason": f"No vinyl option found within your ${threshold} threshold. Digital is the best value.",
            "runner_up": None,
            "all_options": options
        }

    return recommendation


# --- ROUTES ---

@app.route("/search", methods=["GET"])
def search():
    artist = request.args.get("artist", "")
    album = request.args.get("album", "")
    threshold = float(request.args.get("threshold", 15))

    if not artist or not album:
        return jsonify({"error": "Artist and album are required"}), 400

    # Search Discogs
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

    # Placeholders until Bandcamp scraping is added
    bandcamp_digital = None
    bandcamp_vinyl = None
    bandcamp_vinyl_intl_shipping = None
    retail = None

    decision = make_decision(
        threshold=threshold,
        bandcamp_digital=bandcamp_digital,
        bandcamp_vinyl=bandcamp_vinyl,
        bandcamp_vinyl_intl_shipping=bandcamp_vinyl_intl_shipping,
        discogs_us=discogs_us,
        discogs_intl=discogs_intl,
        retail=retail
    )

    return jsonify({
        "release": release_info,
        "discogs_us": discogs_us[:5],
        "discogs_intl": discogs_intl[:5],
        "decision": decision
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5001)