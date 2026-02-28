# Spin or Stream — Project Changelog

High-level summary of work done per session. Not a technical deep-dive — just what changed, what was fixed, and why decisions were made.

---

## Session 11 — QA + preview workflow overhaul

**What shipped:**
- Renamed `Helpful Markdown Files/` → `artifacts/` (git mv, history preserved).
- Created `.claude/previews/` directory. Added `.claude/previews/preview.html` to `.gitignore` — previews are now ephemeral and never committed.
- Updated `CLAUDE.md`: swapped old folder reference for new previews workflow note.
- Updated `ship.md`: added step 2 to delete `preview.html` before staging.
- Rewrote `guide.md`: removed all stale `ideas.md` references (that file was merged into `plan.md` last session), updated brainstorm/mid-build workflows to reference `plan.md` directly, added Feature Previews section.
- Updated `save-docs.md`: removed `ideas.md` from the staged files list.

---

## Session 10 — 72-hour auto-reset + docs consolidation (v1.18)

**What shipped:**
- Added `weeklyReset` IIFE to `App.jsx`: on load, checks newest scan timestamp in `sos_scan_times`; if >72 hours old, silently wipes `sos_results` and `sos_scan_times`. Runs before any state initializes so the wipe is invisible to the user.
- Bumped to v1.18.
- Merged `ideas.md` into `plan.md` — one source of truth for all planning, backlog, and ideas. Deleted `ideas.md`. Updated `review.md`, `update-context.md`, and `CLAUDE.md` to remove all references to the old file.

---

## Session 9 — Phase 1 QA complete

**What shipped:**
- No code. Pure QA session.
- OAuth logout QA: full end-to-end test passed. Auth keys clear on logout, OAuth redirects back to `/app`, wantlist syncs fresh on re-login, no stale auth state.
- Rate limit stress test: 21+ items scanned back-to-back, all 200s, no 429s. Effective delay is ~9s per item (5s hardcoded + ~2-4s request time). Scan completes cleanly with "Refresh complete ✓" toast.
- Noted: `sos_results`, `sos_scan_times`, `sos_wantlist_cache` intentionally persist across logout (single-user tool). Logged multi-user stale data edge case to ideas.md under Infrastructure.
- Phase 1 is complete.

---

## Session 8 — Landing page at root, app at /app (v1.17)

**What shipped:**
- Added `_redirects` — `/` force-rewrites to landing page, `/app/*` rewrites to React SPA. Landing page is now the homepage; app lives at `/app`.
- Fixed OAuth callback: backend was redirecting to bare origin after Discogs auth, which now hits the landing page instead of the app. Changed redirect to `{origin}/app?auth=success&token=...`.
- Updated "Open App" nav link in landing page from `spinorstream.com` → `spinorstream.com/app`.
- Added `'/'` to Vite dev middleware so `localhost:5173/` serves the landing page in dev.
- Updated PWA `start_url` to `/app` in both `site.webmanifest` and VitePWA config; workbox denylist now also excludes root `/`.
- Added "Your data is saved only in this browser" disclosure on the login screen (one sentence above Privacy & Terms link).
- Also corrected plan.md drift: search bar was in ideas.md Done but still showed `[ ]` in plan.md — fixed.
- Bumped to v1.17.

---

## Session 7 — Privacy Policy + Terms of Service (v1.16)

**What shipped:**
- Created `/privacy` — combined Privacy Policy + Terms of Service page. Plain English, matches app design system (dark bg, DM Mono, orange accent). Covers localStorage-only data model, Discogs OAuth, currency API, no-tracking stance, and terms of use.
- Linked from login screen footer and landing page footer.
- Fixed Vite dev server to serve static sub-pages correctly via custom middleware (SPA fallback was intercepting `/privacy/`).
- Bumped to v1.16.

---

## Sessions 6–N — v1.1 through v1.15 (catch-up)

_Reconstructed from plan.md Done section and ideas.md Done section. Individual session boundaries not preserved._

**What shipped:**
- v1.1: Public landing/waitlist page at `/landing/`
- v1.3: PlayDropdown with YouTube Music, Spotify, Apple Music preview links; brand-colored icons for all retailers and music services (react-icons)
- v1.4: Landing page "Open App" link updated to `https://spinorstream.com`
- v1.10: Sort bar mobile overflow fix — shortened labels on mobile (Option A)
- v1.12: PWA manifest, branded vinyl icon, apple-touch-icon, theme-color; installable via Safari "Add to Home Screen". Added Discogs signup link on login screen.
- v1.13: Scan timestamp on fold row (right-aligned, amber after 24h); scan-all progress indicator ("Scanning X of Y"); Refresh All button; "Today's best deal" pinned banner; renamed "inc. shipping" → "est. shipping"
- v1.14: Refresh All button refinement + app-shell overflow fix
- v1.15: Fixed initial-load font FOUT overflow (iOS Safari)

**Infrastructure/tooling:**
- Moved context docs to `.claude/context/`, added `frontend/CLAUDE.md`
- Added `/prime` and `/ship` commands; session workflow documented in `CLAUDE.md`
- Settings tab pruned

---

## Session 1 — Initial Build

**What was built:**
- Three-tab pipeline: Wantlist → Compare → Collection
- Discogs wantlist sync + manual add (parses Bandcamp, Pitchfork, Amazon, Discogs URLs)
- Marketplace price search with US vs. international listing separation
- Budget slider on Compare tab (0–200 USD)
- Collection tab with Discogs sync (capped at 300 items)
- All state persisted to localStorage — no backend database
- Flask backend as a pure proxy (no database, just talks to Discogs + exchange rate APIs)

---

## Session 2 — Auth & OAuth

**What was fixed/built:**
- Replaced personal Discogs token fallback with proper OAuth 1.0a flow
- Built `/auth/start` and `/oauth/callback` endpoints
- Solved the stateless server problem: Render restarts wiped Flask sessions, so switched to `itsdangerous` signed tokens passed via URL to the frontend
- Added Discogs consumer key/secret to environment variables
- Fixed CORS configuration to allow the production frontend URL
- Added all missing env vars to `render.yaml` so Render has them on deploy

---

## Session 3 — QA Round 1 & 2 + Guest Mode

**What was fixed/built:**
- Added guest/demo mode — pre-populated fixture data lets users explore the app without logging in
- Login wipes guest state and replaces with real Discogs data
- Built CSS-only vinyl disc backdrop for the login screen
- Added vinyl facts carousel during OAuth redirect wait (addresses the Render cold-start 30s delay)
- Wantlist: added sort by artist/year with toggle direction pill buttons
- Wantlist cards: VinylPh placeholder when no cover art, estimated shipping footnotes, YouTube Music button
- Compare tab: redesigned Find Elsewhere row with brand-colored buttons (Discogs, Amazon, Target, Walmart, YT Music, Bandcamp)
- Compare tab: progress bar added, shipping estimate footnotes
- Collection grid: tightened card sizing, mobile column override
- Mobile: added sticky user bar at top of main content (logout/login always visible on small screens)
- Guest banner shown when in demo mode
- Replaced all silent `except: pass` error handling in Flask with `logging` module
- Added 429 rate-limit detection for Discogs API calls
- Python error handling now uses typed exceptions as signals (`PermissionError` → 401, `RuntimeError` → 429)

---

## Session 4 — Domain, Branch Strategy & Infrastructure

**What was fixed/built:**
- Added `APP_VERSION` constant to App.jsx — one place to bump version number manually
- Version chip rendered in sidebar below tagline
- Moved production domain from `recordfinder.netlify.app` to `spinorstream.com`
- Updated `FRONTEND_URL` env var to `https://spinorstream.com`
- Set up `dev` branch as staging environment — Netlify builds a preview URL on every push
- Added `DEV_FRONTEND_URL` to CORS allowlist so the dev preview can reach the backend
- Established git workflow: work on `dev` → test at preview URL → merge to `main` for prod
- Created `LEARNING.md` — full technical curriculum (15 modules) for future reference

**Problems solved:**
- DNS verification failing in Netlify — root cause was a one-digit typo in the A record (`72.2.60.5` instead of `75.2.60.5`)
- CORS errors on dev preview — backend only knew about prod URL, not the Netlify preview URL
- Dev branch CORS fix not running on Render — backend deploys from `main` only, fix had to be cherry-picked to `main`
- Branches out of sync — reset `dev` to match `main` exactly using `git reset --hard` for a clean slate

---

## Session 5 — Security, Legal & Production Polish

**What was fixed/built:**
- Added `APP_VERSION` constant to App.jsx — single place to bump version, renders as dim chip in sidebar
- Moved production to `spinorstream.com` — updated `FRONTEND_URL` env var across backend and Render
- Added OG / Twitter Card meta tags to `index.html` — proper title, description, image for link previews
- Created `og-image.svg` (1200×630) — branded share preview card with vinyl disc, orange title, dark background
- Added Discogs attribution to sidebar: "Data by Discogs. Cover art © respective rights holders."
- Added Flask-Limiter: per-IP rate limits (20/min on `/search`, 10/min on others)
- Added security headers on all responses: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`
- Added 1MB `MAX_CONTENT_LENGTH` to Flask to prevent payload abuse
- Removed unused `DISCOGS_TOKEN` / `DISCOGS_HEADERS` dead code from backend
- Created `MONETIZATION.md` — logged no-affiliate-links decision and future-compatible monetization paths
- Added `CHANGELOG.md` (this file) and `LEARNING.md` curriculum to the repo

**Problems solved:**
- Desktop showing Squarespace instead of app — `nslookup` revealed 4 conflicting A records (2 Squarespace default, 2 Netlify). Root cause: Squarespace silently injects its own hosting IPs alongside custom records. Fix: switch to Netlify DNS (nameserver delegation) to remove Squarespace from the DNS equation entirely
- CORS errors on dev preview URL (`dev--recordfinder.netlify.app`) — added `DEV_FRONTEND_URL` env var to CORS allowlist, required cherry-picking the fix to `main` since Render deploys from `main` only
- Netlify deploy cancellations on docs-only commits — expected behavior, Netlify skips rebuilds when no frontend source files changed
