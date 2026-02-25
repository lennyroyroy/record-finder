# Spin or Stream — Product Roadmap

_Last updated: 2026-02_

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

---

## Dropped

_Ruled out — kept here so the reasoning isn't lost_

| Idea | Reason |
|---|---|
| Affiliate links on "Find Elsewhere" buttons | Conflicts with mission; see MONETIZATION.md |
| Amazon/Target/Walmart price scraping | Legal/ToS risk; linking is fine, scraping is not |
