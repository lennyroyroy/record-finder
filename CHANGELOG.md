# Spin or Stream — Project Changelog

High-level summary of work done per session. Not a technical deep-dive — just what changed, what was fixed, and why decisions were made.

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
