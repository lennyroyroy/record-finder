# Launch Plan — April 2026

_Goal: public launch of spinorstream.com by end of April 2026._
_Created: 2026-02-27._

---

## Phase 1 — Foundation (Now → mid-March)
_Make the app trustworthy for strangers, not just the builder._

- [ ] **Privacy policy + Terms of Service** — Write and publish at `/privacy`. Link from login screen footer and landing page footer. Required for App Store; expected by any real user.
- [ ] **"Your data lives in your browser" disclosure** — One sentence on the login screen. Sets expectations before someone builds a 100-item wantlist and clears their browser.
- [ ] **Landing page routing decision** — Decide: Netlify `_redirects` (move app to `/app`) vs. subdomain (`app.spinorstream.com`). Implement before any marketing push to avoid breaking links.
- [ ] **OAuth logout QA** — Full end-to-end test: log in → log out → log in again. Confirm no stale state. Should take 15 minutes.
- [ ] **Rate limit stress test** — Manually scan 20+ items back-to-back and confirm the 5s delay + retry logic handles 429s gracefully with a clear user message.

---

## Phase 2 — Polish (mid-March → early April)
_Make the app feel complete and satisfying for a new user's first session._

- [ ] **Search bar within the wantlist** — Filter by string, in-memory. Trivial. Important at 65+ items.
- [ ] **"Already own this" warning** — Cross-check wantlist against collection by title/id. Surface a chip or muted badge on the card.
- [ ] **Savings % badge** — Best total vs. avg price. One calculation, one chip. Useful context after a scan.
- [ ] **Weekly auto-reset** — 7-day staleness check on app load. Silent wipe of scan results and timestamps. ~10 lines.
- [ ] **Export to CSV** — Wantlist and/or collection. Pure frontend, no backend needed. Practical for power users.

---

## Phase 3 — Launch Prep (early → mid-April)
_The non-code work that makes or breaks a launch._

- [ ] **Landing page: real screenshots** — Replace placeholder in pipeline section with actual Compare tab at ~1200px wide. Export as WebP.
- [ ] **Landing page: Mailchimp** — Paste embed URL into form `action` attributes. See `MAILCHIMP_SETUP.md`.
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
_These need a call before work can start. Each has a decide-by date — missing it blocks downstream work._

1. **Landing page routing** — `/app` subdirectory vs. `app.spinorstream.com` subdomain. Affects OAuth redirect URLs and CORS config. **Decide by March 10** — Phase 1 work (privacy page, data disclosure) will create links that need to point somewhere stable.

2. **Backend hosting** — Is Render free tier acceptable for launch, or upgrade now? Free tier sleeps after inactivity, which means a 30s cold start for new users' first scan. **Decide by March 15** — if upgrading, want it running before Phase 2 QA begins. Next action: check Render pricing and decide.

3. **Social presence** — Which platform first? Twitter/X, Instagram, or Bluesky? **Decide by April 1** — Phase 3 requires accounts to be live before updating footer links. Next action: pick one platform, create @spinorstream, confirm handle availability.

---

## Done

- ~~Sort bar mobile overflow (v1.10)~~
- ~~PWA manifest + icons (v1.12)~~
- ~~Discogs signup link on login (v1.12)~~
- ~~Scan timestamp on fold row (v1.13)~~
- ~~Refresh All button (v1.13)~~
- ~~Custom domain + Cloudflare~~
