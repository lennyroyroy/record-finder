# Ideas — Honest Review

_Every idea captured so far. Analyzed for real effort, real value, and fit with where the app is today._
_Goal: public launch April 2026. Reorganized 2026-02-27._

---

## Critical Path — Must Ship Before Launch
_Tracked in `plan.md` by phase. See there for active status and priority order._

---

## Build Next — High Value, Low Effort
_Clear value, feasible with current architecture, no major dependencies._

- **Search bar within the wantlist** — Filter in-memory array by string. Trivial. At 65+ items it's already useful daily.
- **"Already own this" warning** — Both wantlist and collection are in localStorage. Simple cross-check by title/id before or during scan. High value, very low effort.
- **Savings % badge per wantlist item** — Best total vs. avg price (both already computed). One-line calculation rendered as a chip.
- **Export wantlist or collection to CSV** — Pure frontend JS, no backend needed. Practical utility especially before cloud sync.
- **Label filtering on wantlist** — `item.label` already stored. Simple filter chip. Useful as lists grow.
- **Vinyl vs. streaming break-even calculator** — Widget on Compare card: `best total ÷ $X/mo = N months payback`. User enters streaming cost once. Fits the "spin or stream" theme exactly.

---

## Hold — Needs a Decision First
_Good ideas with a dependency or a question that must be answered before building._

- **Weekly auto-reset** — On app load, check most recent scan timestamp; if older than 7 days, silently wipe results and scan times. Stale amber indicators handle soft nudges; this is the hard weekly cleanup. ~10 lines once decided.
- **Apple App Store listing** — Wrap the web app in Capacitor (Ionic), buy Apple Developer account ($99/yr), submit. The app already has icons and a manifest. ~1–2 focused days. The question: does App Store add value over Safari "Add to Home Screen" for a personal tool? More valuable post-public-launch for discoverability.
- **"PRICE DROP" badge** — Needs price history. Current scan overwrites the previous one. Store `previous_result` alongside `result` in localStorage, compare on re-scan. Decide if price history is worth adding to the data model first.
- **Filter tabs: All / With Prices / Best Deals** — "All" and "With Prices" are easy. "Best Deals" needs a definition (under avg? under budget?). Split: do the easy two now, hold the rest.
- **"SPIN IT" buy verdict banner** — Logic-based buy recommendation. Rules need to be written down first (e.g., best total < avg × 0.85 AND ships US AND num_for_sale > 3). Once defined, implementation is simple.
- **Full listings table on detail view** — Condition, pressing, seller, direct Buy link. Requires switching backend from `/marketplace/stats` to `/marketplace/listings`. Meaningful backend change. Worth it eventually.
- **Condition-filtered stat** — "X sellers with VG+ or better." Same backend dependency as above.
- **Price threshold indicator in Compare** — Highlight listings at or under a target price. Budget slider may overlap. Needs clearer definition.
- **Collection value estimate** — Sum median prices across owned records. Rate-limit concern at 300 items. Needs batching strategy.
- **Discogs affiliate integration** — URL parameter addition to existing links. Blocker is external: must apply to the program and have real traffic first.
- **Landing page routing** — `/landing/` works but isn't the homepage. Two options: Netlify `_redirects` rule (app moves to `/app`), or subdomain (`app.spinorstream.com`). Has downstream effects on OAuth redirect URLs and CORS. Decide before launch.

---

## Housekeeping
_Bug fixes and QA tasks — not new features._

- **OAuth logout QA** — Full logout sequence hasn't been tested end-to-end. Test: log in → log out → log in again, confirm no stale state.

- **QA + Preview Workflow Overhaul** — Tooling/workflow decisions. Nothing user-facing. (1) QA intake: plain screenshot + one-sentence description is the default; Figma annotations only when spatial relationships are hard to describe; text-only for logic/behavior bugs. (2) Feature previews: move from `Helpful Markdown Files/` to `.claude/previews/` (gitignored); single `preview.html` overwritten each time; `/ship` auto-deletes it before committing; previews are static HTML only — inline only relevant CSS, hardcode representative data, approximate look but not behavior. (3) Rename `Helpful Markdown Files/` → `artifacts/`; update all references in `CLAUDE.md` and `guide.md`.

---

## Infrastructure — Big Bets
_Foundation changes. Each unlocks a category of features but is a significant commitment._

- **Cloud sync** — Move off localStorage so the app works across devices. Requires a real database and auth overhaul. The single most important architectural decision for a public product. Everything multi-device depends on this. Don't start casually — but don't launch publicly at scale without a plan for it.
- **Price history** — Store last 2–3 scan results per item in localStorage. Foundational for Price Drop badges and New Listings filter. The right next infrastructure step if you want those features.
- **Multi-step onboarding** — Create Account → Connect Discogs → Sync Wantlist. Only makes sense after cloud sync exists.
- **Price drop alerts** — Email/push when a wantlist item hits a target price. Requires server-side scheduled scanning and a notification service. Not feasible with the current stateless proxy. Needs cloud sync first.
- **Reverb / eBay marketplace scan** — Each platform is 1–2 days of backend work. High value if the goal is a true price aggregator.

---

## Rethink / Deprioritize
_Valid ideas, but the effort doesn't match the current value._

- **Table/list view** — Card layout is well-designed. Only revisit if wantlist grows to 200+ items.
- **Price distribution histogram** — Requires condition data the current endpoint doesn't return. Visual payoff doesn't justify backend work.
- **Genre filtering** — Discogs genre data is inconsistently tagged. Label filtering (already in Build Next) solves the same need more reliably.
- **Dark/light mode toggle** — The dark aesthetic is the product's identity. A full second theme on a 1200-line CSS string is expensive for a personal tool.
- **Bulk-import from CSV** — Discogs sync already covers the main case. Revisit only for a specific stated need.
- **Social sharing** — Requires cloud sync to be meaningful. Dependency makes this a later feature.
- **Analytics tab** — Thin without price history first.
- **Dashboard tab** — Current layout already surfaces the key numbers. Define what this adds before building.

---

## Icebox — Skip or Revisit Much Later

- **Browser extension** — Separate project, different tech stack. URL parser already handles paste-in from Bandcamp/Pitchfork. Gain is small.
- **Recommendation engine** — No meaningful dataset for a single-user tool. Revisit only if the app becomes multi-user at scale.

---

## Done
_Shipped. Kept here for reference._

- ~~**Spotify / Apple Music preview link**~~ — Shipped v1.3. PlayDropdown with YouTube Music, Spotify, and Apple Music.
- ~~**Icons for retailers and music services**~~ — Shipped v1.3. react-icons; FaAmazon, SiWalmart, SiTarget, FaBandcamp, SiDiscogs, SiYoutubemusic, FaSpotify, SiApplemusic all wired.
- ~~**Landing page: "Open App" link**~~ — Shipped v1.4. Updated to `https://spinorstream.com`.
- ~~**Discogs avatar not showing**~~ — Resolved. Stale token from before profile photo was set. Fix: log out and back in.
- ~~**Public landing / waitlist page**~~ — Built v1.1. Lives at `/landing/`.
- ~~**Sort bar mobile overflow fix**~~ — Shipped v1.10. Option A: shortened labels on mobile.
- ~~**PWA / installable app**~~ — Shipped v1.12. Manifest, branded vinyl icon, apple-touch-icon, theme-color. Installable via Safari "Add to Home Screen."
- ~~**Discogs signup link on login screen**~~ — Shipped v1.12.
- ~~**Scan timestamp on fold row**~~ — Shipped v1.13. Right-aligned, amber after 24h.
- ~~**Scan-all progress indicator**~~ — Shipped v1.13. "Scanning X of Y" counter.
- ~~**Refresh All button**~~ — Shipped v1.13. Appears when 0 items left to scan.
- ~~**"Today's best deal" pinned summary**~~ — Shipped. Banner at top of wantlist.
- ~~**"inc. shipping" → "est. shipping"**~~ — Shipped v1.13.
- ~~**Custom domain + Cloudflare**~~ — Done. spinorstream.com live.
