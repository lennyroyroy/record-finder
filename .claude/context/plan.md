# Launch Plan — April 2026

_Goal: public launch of spinorstream.com by end of April 2026._
_Created: 2026-02-27._

---

## Phase 1 — Foundation (Now → mid-March)
_Make the app trustworthy for strangers, not just the builder._

- [x] **Privacy policy + Terms of Service** — Write and publish at `/privacy`. Link from login screen footer and landing page footer. Required for App Store; expected by any real user.
- [ ] **"Your data lives in your browser" disclosure** — One sentence on the login screen. Sets expectations before someone builds a 100-item wantlist and clears their browser.
- [ ] **Landing page routing** — ~~Decision made:~~ Going with `/app` via Netlify `_redirects`. Implement the redirect rule and move app to `/app` before any marketing push.
- [ ] **OAuth logout QA** — Full end-to-end test: log in → log out → log in again. Confirm no stale state. Should take 15 minutes.
- [ ] **Rate limit stress test** — Manually scan 20+ items back-to-back and confirm the 5s delay + retry logic handles 429s gracefully with a clear user message.

---

## Phase 2 — Polish (mid-March → early April)
_Make the app feel complete and satisfying for a new user's first session._

- [ ] **Weekly auto-reset** — On app load, check most recent scan timestamp; if older than 7 days, silently wipe results and scan times. ~10 lines.
- [ ] **QA + Preview Workflow Overhaul** — (1) QA intake: plain screenshot + one-sentence description by default. (2) Feature previews: move from `Helpful Markdown Files/` to `.claude/previews/` (gitignored); single `preview.html` overwritten each time; `/ship` auto-deletes before committing. (3) Rename `Helpful Markdown Files/` → `artifacts/`; update all references in `CLAUDE.md` and `guide.md`.
- [ ] **Search bar within the wantlist** — Filter by string, in-memory. Trivial. Important at 65+ items.
- [ ] **"Already own this" warning** — Cross-check wantlist against collection by title/id. Surface a chip or muted badge on the card.
- [ ] **Savings % badge** — Best total vs. avg price. One calculation, one chip. Useful context after a scan.
- [ ] **Export to CSV** — Wantlist and/or collection. Pure frontend, no backend needed. Practical for power users.

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
_These need a call before work can start. Each has a decide-by date — missing it blocks downstream work._

1. **Landing page routing** — ~~`/app` subdirectory vs. `app.spinorstream.com` subdomain.~~ **Decided:** `/app` via Netlify `_redirects`. No CORS or OAuth redirect changes needed.

2. **Backend hosting** — ~~Is Render free tier acceptable for launch, or upgrade now?~~ **Decided:** Upgrade to paid before launch. Do it by mid-March, before Phase 2 QA begins, so cold-start delays don't affect testing.

3. **Social presence** — ~~Which platform first?~~ **Decided:** Instagram first (@spinorstream secured). Then Threads (auto-linked to IG), TikTok, and Bluesky. Avoiding X/Twitter. Verify @spinorstream handle on TikTok and Bluesky before Phase 3.

---

## Done

- ~~Sort bar mobile overflow (v1.10)~~
- ~~PWA manifest + icons (v1.12)~~
- ~~Discogs signup link on login (v1.12)~~
- ~~Scan timestamp on fold row (v1.13)~~
- ~~Refresh All button (v1.13)~~
- ~~Custom domain + Cloudflare~~
- ~~Privacy policy + Terms of Service (v1.16)~~
