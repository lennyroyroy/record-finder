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

- [x] **72-hour auto-reset** — On app load, check most recent scan timestamp; if older than 72 hours, silently wipe results and scan times.
- [x] **QA + Preview Workflow Overhaul** — (1) QA intake: plain screenshot + one-sentence description by default. (2) Feature previews: move from `Helpful Markdown Files/` to `.claude/previews/` (gitignored); single `preview.html` overwritten each time; `/ship` auto-deletes before committing. (3) Rename `Helpful Markdown Files/` → `artifacts/`; update all references in `CLAUDE.md` and `guide.md`.
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
- [ ] **Analytics** — Add free analytics (Plausible or similar lightweight script) before launch so visitor data exists from day one. No backend changes required.
- [ ] **Landing page: "what it does" paragraph** — Add one clear paragraph of copy explaining what Spin or Stream does for a first-time visitor who doesn't know Discogs. Currently the landing page assumes too much context.

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

## Backlog — Tooling & Meta
_Workflow and developer tooling ideas. Not app features._

- **`claude-starter` — portable session workflow kit** — Extract this project's `.claude/` system (commands, context structure, CLAUDE.md template) into a standalone GitHub template repo with a `setup.sh` install script. Script prompts for project name/stack, copies generic files, fills placeholders, adds `.gitignore` entries. Supports `--update` flag to refresh command files without touching context. Repo tracks its own `CHANGELOG.md` so improvements made here (or on future projects) can be back-ported. Revisit after spinorstream launch — by then the system will be more battle-tested and easier to generalize cleanly.

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

- **Manual price comparison view on Compare card (major)** — A toggle view on the Compare card where the user manually enters prices from retailers as they browse. Each row: Vendor / Cost / Shipping / Total (auto-calculated). An "Unavailable" checkbox hides a row. Best Option at the bottom highlights the cheapest. Mockup captured. Open question: how to trigger and dismiss this view — clicking album art is one option, but the back-flip needs a clear affordance. Needs design decision before building.

- **Pending state on Compare card (major)** — A "Pending" button on the Compare card (visible on both the standard and manual-comparison views) moves an album to a Pending section inside Collection. Pending covers two states: under consideration, and ordered/in-transit. Pending albums auto-expire 2 weeks after being marked, or are removed automatically when Discogs reports the album as collected. A "Remove from pending" button exits early. Interaction model needs more thought — especially how pending interacts with the existing collection sync — before building.

- **Compare cards: side-by-side layout on desktop** — On wide viewports, Compare cards stack vertically like Wantlist cards. They should sit side by side at desktop widths. Will need layout options presented before implementing.

- **Sort on Compare tab** — Add sorting to the Compare section. Best deal should float to the top by default. Secondary sort options (artist, price) optional.

- **Country of origin setting + "ships from your country" filter** — Let the user set their country in Settings. Use it to power a filter on Wantlist and Compare that surfaces only listings shipping domestically. Both the setting and the filter are needed; build together.

- **Default currency setting** — Allow the user to select their preferred display currency in Settings. Currently hardcoded to USD.

- **Real album art in demo mode** — Demo mode uses placeholder images. Swap in real album art to make the demo feel live and reduce first-impression friction for new users.

- **Tutorial / onboarding guide** — Walkthrough for new users covering sync, scan, and compare flow. Not urgent; revisit post-launch or during a quiet session.

---

## Backlog — Brand & Design
_Logo, assets, and visual production. Feeds into landing page and social._

- **Fiverr: App Screenshot Mockups & Landing Page Assets** — Post job using the prepared brief. Share full detailed brief with seller once engaged. Scope includes logo mark cleanup if the SVG prototype (`artifacts/logo.svg`) isn't production-ready after review.

- **Logo & brand asset exports** — Send final logo mark through Vectorizer.ai to get a clean SVG master. Build master canvas in Canva (500×500px, `#1c1814` bg, centered mark with padding). Export all sized variants: Twitter/X header (1400×400), Instagram profile (320×320), Apple touch icon (180×180), favicon (32×32), Product Hunt thumbnail (240×240), Open Graph image (1200×630 with tagline "Know exactly what to buy before you spend a dollar").

- **Replace favicon** — Swap the default favicon in `public/` with the new branded 32×32 export.

- **Capture and process app screenshots** — Log in as glassmouse and capture all 6 raw screenshots in one session. Process through Shots.so with consistent dark settings. Build three-panel fanned composite hero in Canva (1400×900, Wantlist / Compare / Collection). Banks the assets needed for the landing page upgrade already in Backlog — Hold.

- **Demo video** — Install Screen Studio. Record a 60–90s walkthrough following the outlined flow. Edit down to a 30–45s Reel cut for social.

---

## Backlog — Marketing: Pre-Launch
_Setup and content creation before the public announcement._

- **Social: full profile setup** — Claim @spinorstream on Instagram and Twitter/X (Phase 3 covers claiming; this covers setup). Write bios, upload logo mark as profile photo, upload Twitter/X header banner. Follow target accounts on Instagram (discogs, bandcamp, thevinyfactory, vinyljunkies, recordstoreday, vinylcollectors, analogplanet, musiconcvinyl, waxworkrecords, local NYC record stores) and Twitter/X (discogs, bandcamp, pitchfork, thewiremagazine).

- **Social content: first 5 posts** — Create in Canva: (1) intro post with login screen mockup, (2) how it works carousel — 4 slides, (3) real example post with Compare screenshot, (4) 30–45s Reel cut of demo video, (5) photo of physical record collection. Schedule all 5 in Buffer (free tier).

- **Reddit warm-up** — Spend one week engaging genuinely in r/vinyl and r/recordcollectors before any promotion. Then post a tester recruitment post in r/vinyl targeting 10–15 beta testers. DM the link, collect structured feedback.

- **Mailchimp: confirmation email** — Set up the welcome/confirmation email in Mailchimp triggered on form signup (free automation). Distinct from the embed already done in Phase 3 — this is the email the subscriber actually receives.

---

## Backlog — Marketing: Launch
_Execution during and immediately after the public launch window._

- **Reddit launch posts** — Write r/vinyl post (origin story framing, Mac DeMarco real-world example) and r/recordcollectors post (wantlist-to-collection pipeline angle). Different copy for each community. Schedule for launch week: Monday and Wednesday.

- **Discogs community forum** — Find and post in the Tools & Apps section of the Discogs community forum. Highest-ROI channel for the core audience.

- **Product Hunt** — Create PH account. Build full listing: screenshots, description, maker comment written as an origin story. Identify a hunter with PH reputation to submit. Coordinate beta testers to upvote on launch day. Schedule for a Thursday during launch week (highest traffic day).

- **Substack outreach** — Identify 2–3 Substack writers covering vinyl and record collecting. Send short, personal cold emails — not a pitch, a genuine heads-up.

---

## Housekeeping
_Bug fixes and small QA tasks — not new features._

- **Rename "Listen" button to "Stream"** — Label change on the play/listen button in wantlist cards. Better aligns with the app name and the vinyl vs. streaming framing. Trivial.

- **Vinyl facts rotate too fast on mobile** — The facts carousel during OAuth redirect cycles too quickly on mobile. Increase the interval or slow the transition so users can actually read them.

- **Auth page layout cleanup** — The login screen has grown crowded with recent additions. QA and simplify: reduce visual noise, improve hierarchy. Present design options before implementing.

- **Button color audit** — Today's Best Deal banner, Listings badge, Sync from Discogs, and Refresh All are all rendered in green. Green should signal one thing — revisit the color system and propose a cleaner palette where each action type has a distinct, intentional color.

- **Desktop: search bar layout compression** — When the wantlist search bar is active, the surrounding content area compresses noticeably. Investigate and fix the layout shift.

- **Mobile: persistent right-side cutoff (dedicated session)** — Content is clipped on the right side on mobile. This has been attempted multiple times without a clean fix. Dedicate a full session: audit all previous fix attempts, identify the true root cause, and resolve — even if it means restructuring the mobile layout significantly.

- **Price accuracy QA** — Spotted a disconnect between the card price and what's actually listed on Discogs (e.g., $13 shown for Set Em Wild, Set Em Free — couldn't find that listing on Discogs). Investigate whether this is a stale cache issue, marketplace data timing, or a display bug. Reproduce consistently before fixing.

- **Shopping QA: end-to-end purchase validation** — Pick a real album, follow the price from the card into Discogs, and confirm the listing exists at or near the shown price. Document any gaps. Requires spending real money to validate the full experience honestly.

- **Stress test: add 100+ albums to wantlist** — Manually add 100+ albums on Discogs to push the wantlist past ~166 items. Surface any layout, performance, or scan issues not visible at the current 66-item count.

- **External testing: create a friend's Discogs account** — Set up a secondary Discogs account to QA the new-user flow from a completely fresh perspective, separate from the builder's account.

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
- ~~**72-hour auto-reset**~~ — Shipped v1.18. Wipes `sos_results` + `sos_scan_times` on load if newest scan is >72h old.
- ~~**QA + Preview Workflow Overhaul**~~ — Done Session 11. Previews gitignored at `.claude/previews/`, `Helpful Markdown Files/` → `artifacts/`, `guide.md` rewritten, `ship.md` auto-deletes preview before commit.
