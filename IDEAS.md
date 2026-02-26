# Ideas — Simple to Complex

_Unordered list. Every idea captured so far, roughly ordered from easiest to hardest to build._

---

## Small / Quick

- Savings % badge per wantlist item (how far below list price the best listing is)
- "PRICE DROP" badge when latest scan is lower than previous scan
- Search bar within the wantlist to find a record quickly
- Filter tabs on wantlist: All / With Prices / New Listings / Best Deals
- Sort wantlist by price (after scan)
- Export wantlist or collection to CSV
- Label/genre filtering on wantlist
- Bulk-import wantlist from CSV
- Dark/light mode toggle (currently dark-only)
- "Already own this" warning — cross-check wantlist against collection before scanning

## Medium

- Table/list view as alternative to card layout (better for dense wantlists)
- "Today's best deal" pinned bar — one-line summary of the single best opportunity in wantlist
- Price threshold indicator in Compare — highlight listings at or under a target price
- Spotify / Apple Music preview link alongside YT Music (same circle button treatment)
- Scan-all progress indicator — show X of Y when batch scanning instead of spinner per card
- Vinyl vs. streaming break-even calculator — e.g. $12 vinyl ÷ $10.99/mo Spotify = ~1 month payback
- Price distribution histogram — bar chart of all listing prices bucketed by condition
- Full listings table on detail view — condition, pressing/country, notes, seller, direct Buy button
- Condition-filtered stat — "X sellers with VG+ or better" surfaced alongside best price
- "SPIN IT" buy verdict banner — logic-based recommendation when a good deal is detected
- Collection value estimate — sum current median market price across owned records
- PWA / installable app — manifest + service worker so app installs to home screen on iOS/Android
- Social sharing — "here's my wantlist"

## Large

- Price history — store last 2–3 scan results per item to show price trend over time
- Analytics tab — total saved, avg discount, price trends chart, condition breakdown, savings over time
- Dashboard tab — home screen with mission control stats: records tracked, prices tracked, best deal today
- Browser extension — "Add to Wantlist" button on Bandcamp, Pitchfork, RateYourMusic
- Price drop alerts — notify (email or push) when a wantlist item hits target price
- Reverb / eBay marketplace scan — expand beyond Discogs
- Recommendation engine — "if you want X, you might want Y"

## Very Large / Requires Infrastructure Change

- Cloud sync — move off localStorage so the app works across devices (requires auth + database)
- Multi-step onboarding — Create Account → Connect Discogs → Sync Wantlist (only after cloud sync exists)
- Public landing / waitlist page — already built at /landing/
- Discogs affiliate integration — revenue from marketplace purchases (see MONETIZATION.md)
