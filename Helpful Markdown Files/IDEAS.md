# Ideas — Honest Review

_Every idea captured so far. Analyzed for real effort, real value, and fit with where the app is today._
_Reorganized after v1.4. Last reviewed: 2026-02-26._

---

## Build Next
_Clear value, feasible with the current architecture, no major dependencies._

- **Search bar within the wantlist** — Filter in-memory array by string. Trivial. At 65+ items it's already useful daily.
- **Sort by price after scan** — Sort infrastructure already exists (year, artist). Price is just another key. 20 minutes.
- **"Already own this" warning** — Both wantlist and collection are in localStorage. A simple cross-check by title/id before or during scan. High value, very low effort.
- **Savings % badge per wantlist item** — Defined as "best total vs. avg price" (both already computed after scan). One-line calculation, rendered as a chip. Genuinely useful context. Note: if the definition is "vs. MSRP/list price," Discogs doesn't expose that cleanly — stick to avg-based.
- **Export wantlist or collection to CSV** — Pure frontend JS, no backend needed. Practical utility, especially before cloud sync exists.
- **Scan-all progress indicator** — Batch scan logic already exists. Just needs an X of Y counter surfaced in the UI. Low effort, meaningful feedback.
- **"Today's best deal" pinned summary** — One-line banner computed from existing scan data in localStorage: cheapest best-total across all scanned wantlist items. No new data needed.
- **Label filtering on wantlist** — `item.label` is already stored. Simple filter. Useful once the list grows.
- **Vinyl vs. streaming break-even calculator** — Small widget on the Compare card: `best total ÷ $X/mo = N months payback`. User inputs their streaming cost once. Fun, quick, fits the "spin or stream" theme exactly.
- **PWA / installable app** — Vite has a well-documented PWA plugin. Manifest + service worker so the app installs to the home screen on iOS/Android. High value for a daily-use personal tool.

---

## Hold — Needs a Decision First
_Good ideas, but each has a dependency or requires clarity before building._

- **"PRICE DROP" badge** — Needs price history: the current scan overwrites the previous one. Store `previous_result` alongside `result` in localStorage, compare on re-scan. Decide if price history is worth adding to the data model first. Once that decision is made, this is trivial.
- **Filter tabs: All / With Prices / New Listings / Best Deals** — "All" and "With Prices" are easy. "New Listings" needs price history (same dependency). "Best Deals" needs a definition (under avg? under threshold?). Split: do the two simple ones now, hold the history-dependent ones.
- **Price threshold indicator in Compare** — Highlight listings at or under a target price. There's already a budget slider — this may overlap. Needs clearer definition to avoid redundancy. If distinct, it's medium-quick.
- **"SPIN IT" buy verdict banner** — Logic-based buy recommendation when a good deal is detected. The idea is sound; the blocker is defining the rules clearly (e.g., best total < avg × 0.85 AND ships from US AND num_for_sale > 3). Once rules are written down, implementation is straightforward.
- **Collection value estimate** — Sum median market prices across owned records. Rate-limit concern with 300 items (one API call per item). Needs a batching strategy or "sample only" approach before building.
- **Full listings table on detail view** — Condition, pressing, notes, seller, direct Buy button. Requires switching from `/marketplace/stats` to `/marketplace/listings` on the backend — a different endpoint returning per-listing detail. Meaningful backend change. Worth it eventually.
- **Condition-filtered stat** — "X sellers with VG+ or better." Same backend dependency as full listings table. Hold until that endpoint is added.
- **Discogs affiliate integration** — Adding a referral code to existing Discogs links is a URL parameter. But requires applying to the Discogs affiliate program and having real traffic first. Low effort technically; the blocker is external.
- **Landing page routing** — `/landing/` works but isn't the homepage yet. Two approaches: (1) add `frontend/public/_redirects` with `/ /landing/ 200` so Netlify serves landing at root, app moves to `/app`; (2) use a subdomain (`app.spinorstream.com`). Decision needed before building. Has downstream effects on OAuth redirect URLs and CORS config.

---

## Housekeeping
_Bug fixes, QA tasks, and tests of existing functionality — not new features._

- **OAuth logout QA** — Token persists correctly but the full logout sequence hasn't been QA'd end-to-end. Test: log in → log out → log in again and confirm no stale state. Low effort, just needs to be done.

---

## Pending — External Actions Required
_Blocked on something outside the codebase. No code to write until the external step is done._

- **Landing page: real app screenshots** — Placeholder in `/landing/` pipeline section. Swap for a real Compare tab screenshot at ~1200px wide. Save as WebP. Just needs someone to take and export the screenshot.
- **Landing page: social handles** — Twitter and Instagram links in footer are placeholders (`spinorstream`). Update once the accounts are created.
- **Landing page: Mailchimp** — Forms are wired and ready. See `MAILCHIMP_SETUP.md` for the 3-step integration. Just needs the Mailchimp embed URL pasted into the form `action` attributes.

---

## Rethink / Deprioritize
_Valid ideas, but the app has evolved past the original problem, or the value isn't clear enough._

- **Table/list view as alternative to card layout** — Was relevant when cards were cramped. The card layout is now well-designed. Unless the wantlist grows to 200+ items and scrolling becomes painful, this adds complexity without solving a real current problem.
- **Price distribution histogram** — Bar chart of listing prices by condition. Requires condition data, which `/marketplace/stats` doesn't return. Backend endpoint change just for the data. Visual payoff doesn't justify the API work.
- **Genre filtering on wantlist** — Discogs genre metadata is inconsistently tagged and often missing. Label filtering (already in Build Next) solves the same organizational need more reliably.
- **Dark/light mode toggle** — Sounds like a toggle, is actually a full second theme design. The CSS is a 1200-line string with no theming system. Needs CSS variable overrides, a light-mode palette, and persistence. More importantly: the dark aesthetic is the product's identity. Light mode dilutes that for a personal tool without adding daily value.
- **Bulk-import wantlist from CSV** — The app already syncs from Discogs wantlist, which covers the main use case. Worth revisiting only if a specific use case (e.g., importing from a pre-Discogs spreadsheet) comes up.
- **Social sharing — "here's my wantlist"** — Requires a public shareable URL, which requires cloud sync to be meaningful. Sounds Medium, actually Large (infrastructure dependency).
- **Analytics tab** — Total saved, avg discount, trends chart. Thin without price history existing first.
- **Dashboard tab** — Home screen with mission control stats. The current layout already surfaces the most important numbers. Define clearly what this adds before building — risk of duplicating Compare.

---

## Infrastructure — Big Bets
_These change the foundation. Each one unlocks a category of features but is a significant commitment._

- **Price history** — Store last 2–3 scan results per item in localStorage. Foundational for Price Drop badges, New Listings filter, and the Analytics tab. Relatively contained (localStorage only, no backend change). The right next infrastructure step if you want those features.
- **Cloud sync** — Move off localStorage so the app works across devices. Requires a real database and an auth system overhaul. The single biggest architectural decision. Everything in the Very Large tier depends on it. Don't start this casually.
- **Multi-step onboarding** — Create Account → Connect Discogs → Sync Wantlist. Only makes sense after cloud sync exists.
- **Price drop alerts** — Email or push notification when a wantlist item hits a target price. Requires server-side scheduled scanning, a notification service, and user-set price targets. Not feasible with the current stateless Flask proxy. Needs cloud sync first.
- **Reverb / eBay marketplace scan** — eBay and Reverb both have APIs. Each platform is roughly 1–2 days of backend work. High value if the goal is to be a true price aggregator.

---

## Icebox — Skip or Revisit Much Later
_Too complex, unclear value, or the app isn't at the scale where it matters yet._

- **Browser extension — "Add to Wantlist" on Bandcamp / Pitchfork / RYM** — Separate project, completely different tech stack (manifest v3, content scripts). The current URL parser already handles Bandcamp/Pitchfork paste-in. Gain over current flow is small.
- **Recommendation engine — "if you want X, you might like Y"** — Requires collaborative filtering or ML. For a single-user personal tool, there's no meaningful dataset. Revisit if the app ever becomes multi-user.

---

## Done
_Shipped. Kept here for reference._

- ~~**Spotify / Apple Music preview link**~~ — Shipped v1.3. PlayDropdown with YouTube Music, Spotify, and Apple Music.
- ~~**Icons for retailers and music services**~~ — Shipped v1.3. react-icons installed; FaAmazon, SiWalmart, SiTarget, FaBandcamp, SiDiscogs, SiYoutubemusic, FaSpotify, SiApplemusic all wired.
- ~~**Landing page: "Open App" link**~~ — Shipped v1.4. Updated to `https://spinorstream.com`.
- ~~**Discogs avatar not showing**~~ — Resolved. Root cause: stale session token stored from before user set their Discogs profile photo. Fix: log out and log back in. The `/oauth/identity` call on fresh login fetches the current avatar URL.
- ~~**Public landing / waitlist page**~~ — Built in v1.1. Lives at `/landing/`.
