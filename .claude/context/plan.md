# Launch Plan — April 2026

_Goal: public launch of spinorstream.com by end of April 2026._
_Created: 2026-02-27. Updated: 2026-02-28._
_Versioning: v1.x = the entire launch era. v2.0 = cloud sync ships. Post-2.0 = what cloud sync unlocks._

---

## Phase 3 — Launch Prep (Now → mid-March)
_Non-code and quick-win tasks that unlock the launch. Ordered by unblockedness._

- [x] **Landing page: Mailchimp** — Embed URL pasted into form `action` attributes.
- [ ] **Analytics** — Drop in Plausible (or equivalent lightweight script) before launch. No backend changes. Gives day-one visitor data from the moment the app goes public.
- [ ] **Landing page: "what it does" paragraph** — One clear paragraph for visitors who don't know Discogs. Currently the landing page assumes too much context.
- [ ] **Backend health check** — Confirm Render is on a paid plan (free tier sleeps after inactivity — bad first impression for new users). Add a keep-alive ping if still on free tier. _(Decide-by was mid-March — do this now.)_
- [ ] **Final mobile QA pass** — Real iPhone, Safari. Confirm no overflow, no FOUT, scan flow works, PWA install works.
- [ ] **Social accounts** — Create @spinorstream on Instagram first (Threads auto-links). Verify handle on TikTok and Bluesky before Phase 5. Avoiding X/Twitter.
- [ ] **Landing page: real screenshots** — Replace placeholder in pipeline section with actual Compare tab at ~1200px wide. Export as WebP. _(Blocked on Brand Sprint.)_
- [ ] **Landing page: social handles** — Update footer links once accounts are live.

---

## Phase 4 — Pre-Launch Polish (mid-March → early April)
_Must-fix before strangers use the app. Bugs, brand, and trust._

- [ ] **Rename "Listen" → "Stream"** — Label change on the play button. Trivial. Aligns with the app name and the vinyl vs. streaming framing.
- [ ] **Mobile: right-side cutoff** — Dedicated session. Audit all previous fix attempts, identify true root cause, resolve — even if it means restructuring the mobile layout significantly.
- [ ] **Button color audit** — Green is overloaded (Best Deal banner, Listings badge, Sync from Discogs, Refresh All). Revisit color system; propose a palette where each action type has a distinct, intentional color.
- [ ] **Price accuracy QA** — Investigate disconnect between card price and actual Discogs listings (e.g., $13 shown for Set Em Wild — couldn't find that listing). Reproduce consistently before fixing.
- [ ] **Shopping QA: end-to-end** — Pick a real album, follow the price from card into Discogs, confirm the listing exists at or near the shown price. Document any gaps.
- [ ] **Auth page layout cleanup** — Login screen has grown crowded with recent additions. QA and simplify: reduce visual noise, improve hierarchy. Present design options before implementing.

---

## Phase 5 — Launch (late April)
_Go live. Announce. Collect feedback._

- [ ] **Soft launch** — Share with 5–10 people. Collect feedback for 1 week before wider push.
- [ ] **Discogs community post** — Tools & Apps section of the Discogs forum. Highest-ROI channel for this audience.
- [ ] **Vinyl/music subreddits** — r/vinyl, r/recordcollecting. Frame as a tool, not a product pitch.
- [ ] **Product Hunt** — Optional. Higher effort, less targeted, but good for credibility and backlinks.

---

## Brand Sprint
_Visual production. Feeds Phase 3 (screenshots, favicon) and Marketing (social assets). Can run in parallel with Phases 3–4._

- [ ] **Fiverr: Screenshot Mockups & Landing Page Assets** — Post job using the prepared brief. Scope includes logo mark cleanup if `artifacts/logo.svg` isn't production-ready after review.
- [ ] **Logo & brand asset exports** — Vectorizer.ai for clean SVG master. Canva master canvas (500×500px, `#1c1814` bg). Export all sized variants: Twitter/X header (1400×400), Instagram profile (320×320), Apple touch icon (180×180), favicon (32×32), PH thumbnail (240×240), OG image (1200×630 with tagline "Know exactly what to buy before you spend a dollar").
- [ ] **Replace favicon** — Swap the default favicon in `public/` with the new 32×32 export.
- [ ] **Capture and process app screenshots** — Log in as glassmouse, capture all 6 raw screenshots in one session. Process through Shots.so with consistent dark settings. Build three-panel fanned composite hero in Canva (1400×900, Wantlist / Compare / Collection).
- [ ] **Demo video** — Install Screen Studio. Record 60–90s walkthrough following the outlined flow. Edit to 30–45s Reel cut for social.

---

## Marketing
_Unified: pre-launch setup and launch-week execution. Run setup in parallel with Phases 3–4._

### Setup (before Phase 5)

- [ ] **Social: full profile setup** — Write bios, upload logo as profile photo, upload header banner. Follow target accounts on Instagram (discogs, bandcamp, thevinyfactory, vinyljunkies, recordstoreday, vinylcollectors, analogplanet, musiconcvinyl, waxworkrecords, local NYC record stores).
- [ ] **Social content: first 5 posts** — Canva: (1) intro post with login screen mockup, (2) how-it-works carousel (4 slides), (3) real Compare screenshot example, (4) 30–45s Reel cut of demo video, (5) photo of physical record collection. Schedule all 5 in Buffer (free tier).
- [ ] **Reddit warm-up** — One week of genuine engagement in r/vinyl and r/recordcollectors before any promotion. Then post a tester recruitment thread targeting 10–15 beta testers. DM the link, collect structured feedback.
- [ ] **Mailchimp: confirmation email** — Set up the welcome/confirmation email triggered on form signup. Distinct from the embed already live — this is the email the subscriber actually receives.

### Launch week

- [ ] **Reddit launch posts** — r/vinyl (origin story framing, Mac DeMarco real-world example) and r/recordcollectors (wantlist-to-collection pipeline angle). Different copy for each community. Monday and Wednesday of launch week.
- [ ] **Discogs community forum** — Tools & Apps section. Highest-ROI channel for the core audience.
- [ ] **Product Hunt** — Full listing: screenshots, description, maker comment written as an origin story. Identify a hunter with PH reputation to submit. Coordinate beta testers to upvote on launch Thursday.
- [ ] **Substack outreach** — 2–3 writers covering vinyl and record collecting. Short, personal cold emails — not a pitch, a genuine heads-up.

---

## Backlog — v1
_Nice-to-haves that could ship before 2.0 if there's time. Not launch blockers._

- **Filter tabs: All / With Prices / Best Deals** — "All" and "With Prices" are easy. "Best Deals" needs a definition (under avg? under budget?). Do the easy two first.
- **Sort on Compare tab** — Best deal floats to top by default. Secondary sort options (artist, price) optional.
- **Country of origin setting + "ships from your country" filter** — User sets country in Settings. Powers a filter surfacing domestic listings on Wantlist and Compare. Both the setting and the filter; build together.
- **Default currency setting** — User selects preferred display currency in Settings. Currently hardcoded to USD.
- **Real album art in demo mode** — Swap placeholder images for real art. Reduces first-impression friction for new users.
- **"SPIN IT" buy verdict banner** — Logic-based buy recommendation. Rules must be defined first (e.g., best total < avg × 0.85 AND ships US AND num_for_sale > 3). Once defined, implementation is simple.
- **Manual price comparison view on Compare card** — Toggle on the Compare card; user manually enters prices from retailers as they browse. Each row: Vendor / Cost / Shipping / Total (auto-calculated). Needs design decision on trigger/dismiss before building.
- **Pending state on Compare card** — "Pending" button moves album to a Pending section inside Collection. Auto-expires 2 weeks, or clears when Discogs marks it collected. Interaction model needs more thought before building.
- **Compare cards: side-by-side layout on desktop** — At wide viewports, cards sit side by side instead of stacking. Present layout options before implementing.
- **Full listings table on detail view** — Condition, pressing, seller, direct Buy link. Requires backend switch from `/marketplace/stats` to `/marketplace/listings`.
- **Condition-filtered stat** — "X sellers with VG+ or better." Same backend dependency as full listings table.
- **Tutorial / onboarding guide** — Walkthrough for new users covering sync, scan, and compare. Revisit post-launch or during a quiet session.

---

## v2.0 — Cloud Sync Era
_Cloud sync is the anchor. Everything below depends on it or is meaningfully enabled by it. Don't start casually — but don't scale publicly without a plan for it._

- **Cloud sync** — Move off localStorage. Real database + auth overhaul. Required for all multi-device features. The single most important architectural decision for a public product.
- **Price history** — Store last 2–3 scan results per item. Foundational for Price Drop badges and drop alerts.
- **"PRICE DROP" badge** — Compare current vs. previous scan. Needs price history.
- **Price drop alerts** — Email/push when a wantlist item hits a target price. Needs cloud sync + price history + a notification service.
- **Multi-step onboarding** — Create Account → Connect Discogs → Sync Wantlist. Only makes sense with cloud sync.
- **Clear scan data on logout** — `sos_results`, `sos_scan_times`, `sos_wantlist_cache` persist across logout. Fine for single-user; revisit when cloud sync makes multi-user real.
- **Apple App Store** — Capacitor wrapper. ~1–2 focused days once cloud sync makes multi-device real. Worth it once there's an audience.
- **Reverb / eBay marketplace scan** — 1–2 days per platform. High value as a true price aggregator. No hard cloud sync dependency, but more meaningful post-launch with real users.
- **Social sharing** — Requires cloud sync to be meaningful.

---

## Icebox
_Shelved. Revisit only if circumstances change significantly._

- **Discogs affiliate integration** — Must apply to the program; needs real traffic first.
- **Browser extension** — Separate project, different stack. URL parser already handles paste-in from Bandcamp/Pitchfork. Gain is small.
- **Recommendation engine** — No meaningful dataset for a single-user tool. Only relevant at scale.
- **Table/list view** — Card layout is well-designed. Only revisit if wantlist grows to 200+ items.
- **Price distribution histogram** — Requires condition data the current endpoint doesn't return.
- **Analytics tab** — Thin without price history first.
- **Dashboard tab** — Unclear what it adds over current layout. Define the delta before building.
- **Collection value estimate** — Rate-limit concern at 300 items. Needs batching strategy.
- **Export to CSV** — Low daily value before cloud sync exists.
- **Label filtering** — Search bar already covers this discovery need.
- **Savings % badge** — "Today's best deal" banner already surfaces the key signal.
- **"Already own this" warning** — Edge case; collection sync already surfaces duplicates visually.
- **Vinyl vs. streaming break-even calculator** — Clever but not core to the scan-and-buy workflow.

---

## Housekeeping — Post-Launch
_Lower-stakes fixes. Not blocking launch._

- **Vinyl facts rotate too fast on mobile** — Increase the interval during OAuth redirect so users can actually read them.
- **Desktop: search bar layout compression** — Content area compresses noticeably when search bar is active. Investigate and fix the layout shift.
- **Stress test: add 100+ albums** — Manually push wantlist past ~166 items. Surface any layout, performance, or scan issues not visible at current count.
- **External testing: friend's Discogs account** — Set up a secondary account to QA the new-user flow from a completely fresh perspective.

---

## Post-Launch Tooling
_After spinorstream is live and the workflow is battle-tested._

- **`claude-starter` — portable session workflow kit** — Extract this project's `.claude/` system (commands, context structure, CLAUDE.md template) into a standalone GitHub template repo with a `setup.sh` install script. Script prompts for project name/stack, copies generic files, fills placeholders. Supports `--update` flag to refresh command files without touching context. Revisit after launch.

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
