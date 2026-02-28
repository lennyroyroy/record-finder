# Launch Plan — April 2026

_Goal: public launch of spinorstream.com by end of April 2026._
_Created: 2026-02-27._

---

## Phase 1 — Foundation (Now → mid-March)
_Make the app trustworthy for strangers, not just the builder._

- [x] **Privacy policy + Terms of Service** — Write and publish at `/privacy`. Link from login screen footer and landing page footer. Required for App Store; expected by any real user.
- [x] **"Your data lives in your browser" disclosure** — One sentence on the login screen. Sets expectations before someone builds a 100-item wantlist and clears their browser.
- [x] **Landing page routing** — Going with `/app` via Netlify `_redirects`. Implement the redirect rule and move app to `/app` before any marketing push.
- [x] **OAuth logout QA** — Full end-to-end test: log in → log out → log in again. Confirm no stale state.
- [x] **Rate limit stress test** — Manually scan 20+ items back-to-back and confirm the 5s delay + retry logic handles 429s gracefully with a clear user message.

---

## Phase 2 — Polish (mid-March → early April)
_Make the app feel complete and satisfying for a new user's first session._

- [ ] **Weekly auto-reset** — On app load, check most recent scan timestamp; if older than 7 days, silently wipe results and scan times. ~10 lines.
- [ ] **QA + Preview Workflow Overhaul** — (1) QA intake: plain screenshot + one-sentence description by default. (2) Feature previews: move from `Helpful Markdown Files/` to `.claude/previews/` (gitignored); single `preview.html` overwritten each time; `/ship` auto-deletes before committing. (3) Rename `Helpful Markdown Files/` → `artifacts/`; update all references in `CLAUDE.md` and `guide.md`.
- [x] **Search bar within the wantlist** — Filter by string, in-memory. Trivial. Important at 65+ items.

---

## Phase 3 — Launch Prep (early → mid-April)
_The non-code work that makes or breaks a launch._

- [ ] **Landing page: real screenshots** — Replace placeholder in pipeline section with actual Compare tab at ~1200px wide. Export as WebP.
- [x] **Landing page: Mailchimp** — Paste embed URL into form `action` attributes. See `MAILCHIMP_SETUP.md`.
- [ ] **Landing page: social handles** — Update footer links once Twitter/Instagram accounts are live.
- [ ] **Social accounts** — Create @spinorstream (or equivalent) on at least one platform before launch.
- [ ] **Final mobile QA pass** — Test on real iPhone in Safari. Confirm no overflow, no FOUT, scan flow works, PWA install works.
- [ ] **Backend health check** — Confirm Render service is on a paid plan (free tier sleeps after inactivity — bad for new users). Or add a keep-alive ping.

---

## Phase 4 — Launch (late April)
_Go live. Announce. Collect feedback._

- [ ] **Soft launch** — Share with a small group (5–10 people). Collect feedback for 1 week before wider push.
- [ ] **Discogs community post** — The Discogs forum has active buyers. A "I built a tool for this" post is the highest-ROI channel for this audience.
- [ ] **Vinyl/music subreddits** — r/vinyl, r/recordcollecting. Frame as a tool, not a product pitch.
- [ ] **Product Hunt** — Optional. Higher effort, less targeted, but good for credibility and backlinks.

---

## Post-Launch Horizon
_Not in scope for April. Revisit based on user feedback._

- Cloud sync (the big one — unlocks multi-device, price history, drop alerts)
- Apple App Store (Capacitor wrapper — worth it once there's an audience)
- Reverb / eBay marketplace scan
- Full listings table (backend endpoint change)
- Price drop alerts (needs cloud sync first)

---

## Open Decisions
_These need a call before work can start._

1. **Backend hosting** — Upgrade to paid before launch. Do it by mid-March, before Phase 2 QA begins, so cold-start delays don't affect testing.

2. **Social presence** — Instagram first (@spinorstream secured). Then Threads (auto-linked to IG), TikTok, and Bluesky. Avoiding X/Twitter. Verify @spinorstream handle on TikTok and Bluesky before Phase 3.

---

## Backlog — Hold
_Good ideas, but blocked on a dependency or decision before building._

- **Landing page layout upgrade (Phase 3)** — Four improvements before launch:
  1. **Three-panel screenshot composite** — Replace the single placeholder with a fanned Wantlist / Compare / Collection sequence. Rotato can generate this as one image. Blocked on: taking the actual screenshots.
  2. **Demo video embed** — 60-90s autoplay muted loop below the pipeline description. Highest-converting addition. Blocked on: recording the video.
  3. **"Saved money" proof callout** — A visual card showing a real example (e.g., "Mac DeMarco · Salad Days — $100 on Discogs · $20 reissue at Walmart"). Looks like an app screenshot. Pure HTML/CSS, no blocker.
  4. **Second CTA** — "Already on Discogs? Try the demo right now →" linking to `/app`. Lets people skip the waitlist and just use it. Pure HTML, no blocker.

- **Apple App Store listing** — Wrap the web app in Capacitor (Ionic), buy Apple Developer account ($99/yr), submit. The app already has icons and a manifest. ~1–2 focused days. More valuable post-public-launch for discoverability.

- **"PRICE DROP" badge** — Needs price history. Current scan overwrites the previous one. Store `previous_result` alongside `result` in localStorage, compare on re-scan. Decide if price history is worth adding to the data model first.

- **Filter tabs: All / With Prices / Best Deals** — "All" and "With Prices" are easy. "Best Deals" needs a definition (under avg? under budget?). Do the easy two now, hold the rest.

- **"SPIN IT" buy verdict banner** — Logic-based buy recommendation. Rules need to be written down first (e.g., best total < avg × 0.85 AND ships US AND num_for_sale > 3). Once defined, implementation is simple.

- **Full listings table on detail view** — Condition, pressing, seller, direct Buy link. Requires switching backend from `/marketplace/stats` to `/marketplace/listings`. Meaningful backend change. Worth it eventually.

- **Condition-filtered stat** — "X sellers with VG+ or better." Same backend dependency as full listings table.

- **Price threshold indicator in Compare** — Highlight listings at or under a target price. Budget slider may overlap. Needs clearer definition.

---

## Housekeeping
_Bug fixes and small QA tasks — not new features._

- **Rename "Listen" button to "Stream"** — Label change on the play/listen button in wantlist cards. Better aligns with the app name and the vinyl vs. streaming framing. Trivial.

- **Vinyl facts rotate too fast on mobile** — The facts carousel during OAuth redirect cycles too quickly on mobile. Increase the interval or slow the transition so users can actually read them.

---

## Infrastructure — Big Bets
_Foundation changes. Each unlocks a category of features but is a significant commitment._

- **Cloud sync** — Move off localStorage so the app works across devices. Requires a real database and auth overhaul. The single most important architectural decision for a public product. Everything multi-device depends on this. Don't start casually — but don't launch publicly at scale without a plan for it.

- **Price history** — Store last 2–3 scan results per item in localStorage. Foundational for Price Drop badges and New Listings filter. The right next infrastructure step if you want those features.

- **Multi-step onboarding** — Create Account → Connect Discogs → Sync Wantlist. Only makes sense after cloud sync exists.

- **Clear scan data on logout** — `sos_results`, `sos_scan_times`, and `sos_wantlist_cache` currently persist across logout. Fine for a single-user personal tool, but if two users share a device, the second user inherits the first user's scan data. Low risk today; revisit when cloud sync lands and multi-user becomes real.

- **Price drop alerts** — Email/push when a wantlist item hits a target price. Requires server-side scheduled scanning and a notification service. Not feasible with the current stateless proxy. Needs cloud sync first.

- **Reverb / eBay marketplace scan** — Each platform is 1–2 days of backend work. High value if the goal is a true price aggregator.

---

## Rethink / Deprioritize
_Valid ideas, but effort doesn't match current value._

- **"Already own this" warning** — Simple cross-check of wantlist vs. collection by title/id. Deprioritized: edge case for most users; collection sync already surfaces duplicates visually.

- **Savings % badge per wantlist item** — One-line calculation rendered as a chip. Deprioritized: "Today's best deal" banner already surfaces the key savings signal.

- **Export wantlist or collection to CSV** — Pure frontend JS, no backend needed. Deprioritized: low daily value for the target user before cloud sync exists.

- **Label filtering on wantlist** — `item.label` already stored. Simple filter chip. Deprioritized: search bar covers the same discovery need.

- **Vinyl vs. streaming break-even calculator** — Widget on Compare card: `best total ÷ $X/mo = N months payback`. Deprioritized: clever but not core to the scan-and-buy workflow.

- **Collection value estimate** — Sum median prices across owned records. Rate-limit concern at 300 items. Needs batching strategy. Deprioritized: nice-to-have, not a launch blocker.

- **Table/list view** — Card layout is well-designed. Only revisit if wantlist grows to 200+ items.

- **Price distribution histogram** — Requires condition data the current endpoint doesn't return. Visual payoff doesn't justify backend work.

- **Social sharing** — Requires cloud sync to be meaningful. Dependency makes this a later feature.

- **Analytics tab** — Thin without price history first.

- **Dashboard tab** — Current layout already surfaces the key numbers. Define what this adds before building.

---

## Icebox
_Skip or revisit much later._

- **Discogs affiliate integration** — URL parameter addition to existing links. Blocker is external: must apply to the program and have real traffic first.

- **Browser extension** — Separate project, different tech stack. URL parser already handles paste-in from Bandcamp/Pitchfork. Gain is small.

- **Recommendation engine** — No meaningful dataset for a single-user tool. Revisit only if the app becomes multi-user at scale.

---

## Done
_Shipped. Kept for reference._

- ~~**Public landing / waitlist page**~~ — Built v1.1. Lives at `/landing/`.
- ~~**Spotify / Apple Music preview link**~~ — Shipped v1.3. PlayDropdown with YouTube Music, Spotify, and Apple Music.
- ~~**Icons for retailers and music services**~~ — Shipped v1.3. react-icons; all major retailers and music services wired.
- ~~**Landing page: "Open App" link**~~ — Shipped v1.4. Updated to `https://spinorstream.com`.
- ~~**Sort bar mobile overflow fix**~~ — Shipped v1.10. Shortened labels on mobile.
- ~~**PWA / installable app**~~ — Shipped v1.12. Manifest, branded vinyl icon, apple-touch-icon, theme-color. Installable via Safari "Add to Home Screen."
- ~~**Discogs signup link on login screen**~~ — Shipped v1.12.
- ~~**Scan timestamp on fold row**~~ — Shipped v1.13. Right-aligned, amber after 24h.
- ~~**Scan-all progress indicator**~~ — Shipped v1.13. "Scanning X of Y" counter.
- ~~**Refresh All button**~~ — Shipped v1.13.
- ~~**"Today's best deal" pinned summary**~~ — Shipped v1.13. Banner at top of wantlist.
- ~~**"inc. shipping" → "est. shipping"**~~ — Shipped v1.13.
- ~~**Custom domain + Cloudflare**~~ — Done. spinorstream.com live.
- ~~**Privacy policy + Terms of Service**~~ — Shipped v1.16. Combined page at `/privacy`.
- ~~**"Your data lives in your browser" disclosure**~~ — Shipped v1.17. One sentence on login screen.
- ~~**Landing page routing — /app via _redirects**~~ — Shipped v1.17. Landing page at root, app at `/app`.
- ~~**Search bar within the wantlist**~~ — Shipped. In-memory filter on the wantlist.
- ~~**OAuth logout QA**~~ — Passed Session 9. Full end-to-end test clean.
- ~~**Rate limit stress test**~~ — Passed Session 9. 21+ items, no 429s, ~9s/item.
- ~~**Discogs avatar not showing**~~ — Resolved. Stale token fix: log out and back in.
