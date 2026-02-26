# Ideas — Honest Review

_Every idea captured so far. Analyzed for real effort, real value, and fit with where the app is today._
_Reorganized after v1.4. Last reviewed: 2026-02-26._

---

## Build Next
_Clear value, feasible with the current architecture, no major dependencies._

- **Search bar within the wantlist** — Filter in-memory array by string. Trivial. At 65+ items it's already useful daily.
- **Sort by price after scan** — Sort infrastructure already exists (year, artist). Price is just another key. 20 minutes.
- **"Already own this" warning** — Both wantlist and collection are in localStorage. A simple cross-check by title/id before or during scan. High value, very low effort.
- **Savings % badge per wantlist item** — Defined as "best total vs. avg price" (both already computed after scan). One-line calculation, rendered as a chip. Genuinely useful context for each item. If "vs. MSRP/list price" is the definition instead, Discogs doesn't expose that cleanly — stick to avg-based.
- **Export wantlist or collection to CSV** — Pure frontend JS, no backend needed. Practical utility, especially before cloud sync exists.
- **Scan-all progress indicator** — Batch scan logic already exists. Just needs an X of Y counter surfaced in the UI during scanning. Low effort, meaningful feedback.
- **"Today's best deal" pinned summary** — One-line banner computed from existing scan data in localStorage: cheapest best-total across all scanned items. No new data needed.
- **Label filtering on wantlist** — `item.label` is already stored. Simple filter. Useful once the list gets long.
- **Vinyl vs. streaming break-even calculator** — Small widget on the Compare card: `best total ÷ $X/mo = N months payback`. User inputs their streaming cost once. Fun, quick, fits the app's "spin or stream" theme perfectly.
- **PWA / installable app** — Vite has a well-documented PWA plugin. Adds a manifest + service worker so the app installs to the iOS/Android home screen. High value for a daily-use personal tool. Medium effort but well-trodden path.

---

## Hold — Needs a Decision First
_Good ideas, but each has a dependency or requires clarity before building._

- **"PRICE DROP" badge** — Needs price history: the current scan overwrites the previous one. You'd need to store `previous_result` alongside `result` in localStorage and compare on re-scan. Decide whether price history is worth adding to the data model first. Once you do, this is trivial on top of it.
- **Filter tabs: All / With Prices / New Listings / Best Deals** — "All" and "With Prices" are easy. "New Listings" needs price history (same dependency as above). "Best Deals" needs a definition (under avg? under threshold?). Split it: do the two simple ones now, hold the other two.
- **Price threshold indicator in Compare** — Highlight listings at or under a target price. There's already a budget slider; this may overlap. Needs clearer definition to avoid redundancy. If distinct, it's medium-quick.
- **"SPIN IT" buy verdict banner** — Logic-based buy recommendation when a good deal is detected. The idea is sound; the blocker is defining the rules. What triggers it? (e.g., best total < avg × 0.85 AND ships from US AND num_for_sale > 3). Once rules are written down, implementation is straightforward.
- **Collection value estimate** — Sum median market prices across owned records. Rate-limit concern with 300 items (one API call per item). Needs a batching strategy or a "sample only" approach before building.
- **Full listings table on detail view** — Condition, pressing, notes, seller, direct Buy button. This requires switching from `/marketplace/stats` to `/marketplace/listings` on the backend — a different endpoint that returns per-listing detail. Meaningful backend change. Worth it eventually, but clarify scope first.
- **Condition-filtered stat** — "X sellers with VG+ or better." Same backend dependency as full listings table above. Hold until that endpoint is added.
- **Discogs affiliate integration** — Implementation is just adding a referral code to existing Discogs links (a URL parameter). But you need to apply and be accepted into the Discogs affiliate program first, and the app needs real traffic. Low effort technically; the blocker is external.

---

## Rethink / Deprioritize
_Valid ideas, but the app has evolved past the original problem they were solving, or the value isn't clear enough._

- **Table/list view as alternative to card layout** — Was more relevant when cards were cramped. The card layout is now well-designed. Unless the wantlist grows to 200+ items and scrolling becomes painful, this adds complexity without solving a real current problem.
- **Price distribution histogram** — Bar chart of listing prices by condition. Requires condition data, which `/marketplace/stats` doesn't return. Would need a backend endpoint change just to get the data. Visual payoff doesn't justify the API work.
- **Genre filtering on wantlist** — Genre metadata from Discogs is inconsistently tagged and often missing entirely. Label filtering (already in Build Next) solves the same organizational need more reliably.
- **Dark/light mode toggle** — Sounds like a toggle, is actually a full second theme design. The CSS is a 1200-line string with no theming system. Would need CSS variable overrides, a light-mode palette, and persistence. More importantly: the dark aesthetic is the product's identity. Light mode dilutes that for a personal tool without adding daily value.
- **Bulk-import wantlist from CSV** — The app already syncs from Discogs wantlist, which covers the main use case. Who is bulk-importing from CSV if Discogs sync works? Worth revisiting only if a specific use case (e.g., importing from a spreadsheet someone kept before Discogs) comes up.
- **Social sharing — "here's my wantlist"** — Requires a public shareable URL, which requires cloud sync to be meaningful. Listed as Medium, actually Large (dependency). Move to Infrastructure tier mentally.
- **Analytics tab** — Total saved, avg discount, trends chart. Depends entirely on price history existing. Without history data, the analytics would be thin. Hold until price history is built.
- **Dashboard tab** — Home screen with mission control stats. The current layout with Compare already surfaces the most important numbers. Define clearly what this adds before building — risk of building something that duplicates what Compare does.

---

## Infrastructure — Big Bets
_These change the foundation. Each one unlocks a category of features but is a significant commitment._

- **Price history** — Store last 2–3 scan results per item in localStorage. Foundational for Price Drop badges, New Listings filter, and the Analytics tab. Relatively contained (localStorage only, no backend change). The right next infrastructure step if you want those features.
- **Cloud sync** — Move off localStorage so the app works across devices. Requires a real database and an auth system overhaul. This is the single biggest architectural decision. Everything in the "Very Large" tier depends on it. Don't start this casually — it changes everything about how the app stores and retrieves data.
- **Multi-step onboarding** — Create Account → Connect Discogs → Sync Wantlist. Only makes sense after cloud sync exists. Correct to keep as a dependency.
- **Price drop alerts** — Email or push notification when a wantlist item hits a target price. Requires server-side scheduled scanning (a cron job), a notification service (email or push), and user-set price targets. Not feasible with the current stateless Flask proxy. Needs cloud sync + infrastructure first.
- **Reverb / eBay marketplace scan** — Expand price search beyond Discogs. eBay and Reverb both have APIs. Each is a meaningful backend feature with its own rate limits, data mapping, and error handling. High value if you want to be a true price aggregator. Each platform is roughly 1–2 days of backend work.

---

## Icebox — Skip or Revisit Much Later
_Not worth the effort now. Either the complexity is too high, the value is unclear, or the app isn't at the scale where it matters._

- **Browser extension — "Add to Wantlist" on Bandcamp / Pitchfork / RYM** — Separate project with a completely different tech stack (browser extension APIs, manifest v3, content scripts). High effort, hard to maintain, and the current URL parser in the app already handles Bandcamp/Pitchfork paste-in. The gain over the current flow is small.
- **Recommendation engine — "if you want X, you might like Y"** — Requires collaborative filtering data or ML. For a personal single-user tool, there's no meaningful dataset to learn from. Doesn't make sense until the app is multi-user with real usage data.
- **Public landing / waitlist page** — Already built at `/landing/`. Done.
- **Spotify / Apple Music preview link** — Already built in v1.3. Done.
