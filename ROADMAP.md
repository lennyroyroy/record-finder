# Spin or Stream — Product Roadmap

_Last updated: 2026-02-24_

---

## How This Works

A product roadmap answers one question: **what gets built, in what order, and why?**

It is not a promise or a schedule. It is a living document — ideas move up, down, and get dropped as you learn more. The value is in having one place to think, prioritize, and say "not now" clearly.

**The four horizons used here:**

| Horizon | Meaning |
|---|---|
| **Now** | Actively being worked on or queued for next session |
| **Next** | Clearly scoped, probably 1–3 months out |
| **Later** | Good ideas, not yet fully thought through, 3–6 months |
| **Someday** | Big vision bets, years away or needs a trigger event |

There's also an **Icebox** for ideas that aren't ready to place yet, and a **Dropped** section so you remember what you ruled out and why.

**How to use it week to week:**
- Add new ideas to the Icebox first — don't assign a horizon until you've sat with them
- During a "planning" moment (could be 10 minutes), pull Icebox items into a horizon or drop them
- If something is blocked or deprioritized, move it down — don't delete it
- When something ships, move it to CHANGELOG.md and delete it here

---

## Now

_What's actively in progress or up next_

- [ ] Polish mobile layout below 540px (cards feel cramped)
- [ ] Review Discogs OAuth session handling — token persists but logout flow is unclear

---

## Next

_Clearly scoped, builds directly on what exists_

- [ ] **Sort + filter the Wantlist** — by artist (A–Z), year, or price-after-scan. Wantlist grows and gets hard to navigate without this.
- [ ] **Spotify / Apple Music preview link** — alongside the YT Music circle button, same small-icon treatment. Two streaming options is better than one.
- [ ] **Price threshold indicator in Compare** — let user set a target price per item; highlight when a listing is at or under it. Ties directly into the budget slider that already exists.
- [ ] **Scan-all progress indicator** — when batch scanning the wantlist, show X of Y instead of just a spinner per card.

---

## Later

_Good ideas that need more scoping before they're ready_

- [ ] **Price history** — store the last 2–3 scan results per item so you can see if a price went up or down. Biggest question: localStorage size limits. May need to prune old records.
- [ ] **Collection value estimate** — sum the current median Discogs market price across owned records. Would require a scan step; might be a "Collection" tab enhancement.
- [ ] **Export to CSV** — wantlist or collection export for spreadsheet users. Simple to build, surprisingly useful.
- [ ] **Discogs affiliate integration** — see MONETIZATION.md. Once traffic justifies it, Discogs marketplace links can earn revenue without conflicting with the app's mission. Requires Discogs partner approval.
- [ ] **"Already own this" warning** — cross-check wantlist against collection before scanning; surface a warning if the item is already in your collection.

---

## Someday

_Big swings — need a trigger (time, users, revenue) before pursuing_

- [ ] **Price drop alerts** — notify user (email or browser push) when a wantlist item hits a target price. Requires a backend job, persistent user data, and notification infrastructure. Big lift, high value.
- [ ] **Cloud sync** — move off localStorage so the app works across devices. Requires auth + a real database. Would change the architecture significantly; only worth it if there are real users beyond yourself.
- [ ] **Browser extension** — "Add to Wantlist" button that appears on Bandcamp, Pitchfork, RateYourMusic. Currently the app parses those URLs manually; an extension would make it instant.
- [ ] **PWA / installable app** — add a manifest and service worker so the app installs to home screen on iOS/Android. Low effort, meaningful UX improvement for mobile users.
- [ ] **Reverb / eBay marketplace scan** — expand beyond Discogs. Massive scope increase; would require separate scrapers or APIs for each platform.

---

## Icebox

_Ideas that aren't ready to place yet — add freely, sort later_

- Social sharing ("here's my wantlist")
- Recommendation engine ("if you want X, you might want Y")
- Label/genre filtering on wantlist
- Bulk-import wantlist from CSV
- Dark/light mode toggle (currently dark only)
- Show Discogs Avatar in app sidebar 


## Small Visual Edits
- Discgos button on Watchlist needs a new design, needs to be resized 


### From mockup review — 2026-02-24

Ideas surfaced by AI-generated concept designs. None of these exist yet. Grouped by area for easier prioritization later.

**Wantlist view**
- Table/list view as an alternative to the current card layout — better for dense wantlists
- Search bar within the wantlist to find a specific record quickly
- Filter tabs: All / With Prices / New Listings / Best Deals
- "PRICE DROP" badge on records where the latest scan is lower than the previous one (requires price history)
- Savings % badge per item showing how far below list price the best listing is
- "Today's best deal" pinned bar at the bottom of the wantlist — one-line summary of the single best opportunity right now

**Record detail / expanded view**
- "SPIN IT" buy verdict banner — logic-based recommendation ("best listing found, here's why it's worth it") shown when a good deal is detected
- Vinyl vs. streaming break-even calculator — e.g. $12 vinyl ÷ $10.99/mo Spotify = break-even in ~1 month; helps the user make the actual buy-vs-stream call
- Price distribution histogram — bar chart of all listing prices bucketed by condition (NM, VG+, VG, etc.), shows where the market clusters
- Full listings table on detail view — pressing/country, condition, notes from seller, seller name, with a direct "Buy on Discogs" button on the best row
- Condition-filtered stat — "X sellers with VG+ or better" surfaced alongside the best price

**Analytics tab (entirely new)**
- Total $ saved counter — cumulative across all time, with a "+$X this month" delta
- Avg discount % — across all scanned wantlist items vs list price
- Best deal found — highlighted record with % off and list price
- Price trends chart — line chart showing price history per record over time (needs price history data first)
- Listings by condition chart — breakdown of what condition most marketplace copies are in
- Savings over time — cumulative bar chart month by month
- Collection intel panel — stats like avg days to find a deal, top seller region, total searches run

**Onboarding & landing**
- Public marketing/waitlist landing page — separate from the app itself, for when you want to share it with others or build a waitlist before opening it up
- Multi-step onboarding flow — Create Account → Connect Discogs → Sync Wantlist → Start Finding Deals (only relevant once there are accounts / cloud sync)

**Dashboard tab**
- Home screen with summary stats: records tracked, prices tracked, avg savings, best deal today — a "mission control" view before diving into the wantlist

---

## Dropped

_Ruled out — kept here so the reasoning isn't lost_

| Idea | Reason |
|---|---|
| Affiliate links on "Find Elsewhere" buttons | Conflicts with mission; see MONETIZATION.md |
| Amazon/Target/Walmart price scraping | Legal/ToS risk; linking is fine, scraping is not |
