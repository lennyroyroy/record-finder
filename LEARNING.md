# Spin or Stream — Learning Curriculum

Concepts encountered and implemented while building this project.
Organized by topic. Each module links to where it appears in the codebase.

---

## Module 1 — React Fundamentals

**Concepts:**
- `useState` / `useEffect` / `useRef` hooks
- Lifting state up vs. collocating state
- Controlled inputs and form handling
- Conditional rendering patterns (`&&`, ternary)
- Prop drilling (passing data/callbacks between parent and child components)

**Where it lives:** `frontend/src/App.jsx` — all tab components

---

## Module 2 — React State Patterns

**Concepts:**
- Lazy state initialization: `useState(() => computeInitialValue())` — runs once on mount, avoids expensive re-computation
- Derived state: compute values from existing state instead of storing them (`sortedItems`, `compareItems.length`)
- `useRef` for mutable values that don't trigger re-renders (e.g., abort controllers, timers)
- Why you copy arrays before sorting: `[...items].sort()` — `.sort()` mutates in place, React needs a new reference

**Where it lives:** `App.jsx` — `WantlistTab` sort logic, `compareItems.length` in JSX

---

## Module 3 — CSS Architecture (Single-File Pattern)

**Concepts:**
- All CSS stored in a `STYLES` constant injected via `<style>` tag — no `.css` files
- CSS custom properties (variables) for a design token system (`--bg`, `--accent`, `--teal`, etc.)
- Mobile-first responsive design with `@media (max-width: 540px)` breakpoints
- CSS-only components: vinyl disc using `radial-gradient` + `::before`/`::after` pseudo-elements
- BEM-like class naming (`.card`, `.card-header`, `.card-body`)

**Where it lives:** `App.jsx` — `STYLES` constant (lines 5–~400)

---

## Module 4 — localStorage as a Database

**Concepts:**
- `localStorage.getItem` / `setItem` / `JSON.parse` / `JSON.stringify`
- The `load(key, fallback)` / `save(key, value)` utility pattern
- All app state persists client-side — no backend database
- Storage keys centralized in a `KEYS` constant to prevent typos
- Tradeoffs: simple but per-browser, no cross-device sync

**Where it lives:** `App.jsx` — `KEYS` constant, `load`/`save` helpers

---

## Module 5 — Flask API (Proxy Pattern)

**Concepts:**
- Flask as a pure proxy — no database, just forwards requests to Discogs and exchange rate APIs
- Route handlers: `@app.route("/search", methods=["POST"])`
- `request.get_json()` for reading POST body
- `jsonify()` for returning JSON responses
- Environment variables via `os.getenv("KEY", "fallback")`

**Where it lives:** `backend/app.py`

---

## Module 6 — OAuth 1.0a Flow

**Concepts:**
- 3-legged OAuth: your app → Discogs → user approves → back to your app
- Request token → authorization URL → access token exchange
- `requests_oauthlib.OAuth1` for signing requests
- Why OAuth tokens can't be stored in Flask sessions on stateless servers (Render restarts = session loss)
- `itsdangerous.URLSafeTimedSerializer` — signs tokens so they can be safely sent to the frontend in the URL and verified later without server-side storage

**Where it lives:** `backend/app.py` — `/auth/start`, `/oauth/callback`, `_load_session_token`

---

## Module 7 — CORS (Cross-Origin Resource Sharing)

**Concepts:**
- Why browsers block requests from one origin (e.g., `spinorstream.com`) to another (`onrender.com`)
- `flask_cors.CORS` — sets `Access-Control-Allow-Origin` headers
- `@app.after_request` hook for custom CORS logic
- Allowlist pattern: only specific origins are permitted
- Multi-environment CORS: `FRONTEND_URL` (prod) + `DEV_FRONTEND_URL` (staging) both need to be in the allowlist
- The shared backend problem: one backend serves multiple frontend environments, so all frontend URLs must be explicitly allowed

**Where it lives:** `backend/app.py` lines 26–38

---

## Module 8 — Environment Variables

**Concepts:**
- `.env` files for local secrets — never committed to git (in `.gitignore`)
- `python-dotenv` loads `.env` into `os.environ` for Flask
- Vite's `import.meta.env.VITE_*` pattern for frontend env vars
- `.env.local` (dev) vs `.env.production` (prod build) in Vite
- `render.yaml` declares which env vars exist on Render (`sync: false` = set manually in dashboard)

**Where it lives:** `backend/.env`, `frontend/.env.local`, `frontend/.env.production`, `render.yaml`

---

## Module 9 — Error Handling as Typed Signals

**Concepts:**
- Using Python's built-in exception types as control flow signals between functions
- `PermissionError` → 401 Unauthorized (auth failed)
- `RuntimeError("rate_limited")` → 429 Too Many Requests
- Route handlers catch these and return appropriate HTTP status codes
- `log.warning()` / `log.error()` instead of silent `except: pass`

**Where it lives:** `backend/app.py` — `_discogs_get`, route handlers

---

## Module 10 — Guest / Demo Mode

**Concepts:**
- Frontend-only fixture data: `GUEST_DATA` constant with pre-populated wantlist/results/collection
- `isGuest` boolean flag gates all API calls — no backend requests in guest mode
- Login wipes guest state and replaces with real data
- Lazy state initialization ensures guest data loads immediately without a fetch

**Where it lives:** `App.jsx` — `GUEST_DATA`, `isGuest`, `handleGuestMode`, `handleExitGuest`

---

## Module 11 — Version Management

**Concepts:**
- `APP_VERSION` constant at the top of `App.jsx` — one place to bump the version number
- Rendered as a subtle chip in the sidebar so it's always visible
- Convention: bump manually before each `main` merge (v0.07, v0.08, etc.)
- Keep version in sync with git commit messages for traceability

**Where it lives:** `App.jsx` line 3, sidebar JSX

---

## Module 12 — DNS & Custom Domains

**Concepts:**
- **A record**: maps a domain (`spinorstream.com`) to an IP address (`75.2.60.5`)
- **CNAME record**: maps a subdomain (`www`) to another domain (`recordfinder.netlify.app`)
- **Apex domain**: the root (`spinorstream.com`) — can't use CNAME here, must use A or ALIAS
- **TTL (Time to Live)**: how long DNS resolvers cache a record before re-checking
- **DNS propagation**: after changing records, changes spread to DNS servers worldwide — can take minutes to hours
- **Common gotcha**: multiple conflicting A records (e.g., registrar's defaults + your new one) cause unpredictable routing
- Verification tool: [dnschecker.org](https://dnschecker.org) shows propagation status globally

**Applied to this project:** Squarespace DNS Settings → `@ A 75.2.60.5` + `www CNAME recordfinder.netlify.app`

---

## Module 13 — Netlify Deployment

**Concepts:**
- Auto-deploy on push to a configured branch (Netlify watches GitHub)
- **Branch deploys**: enable preview URLs per branch (e.g., `dev--recordfinder.netlify.app`)
- **Primary domain** vs **domain alias** — primary is where traffic lands, aliases redirect to it
- SSL/TLS certificate auto-provisioned by Netlify via Let's Encrypt once DNS is verified
- Production env vars set in Netlify dashboard (not in code)

**Branch setup:** `main` → `spinorstream.com` (prod), `dev` → `dev--recordfinder.netlify.app` (staging)

---

## Module 14 — Git Branch Strategy

**Concepts:**
- **`main`**: production branch — always deployable, auto-deploys to prod on push
- **`dev`**: staging branch — work happens here, tested at the Netlify preview URL
- Never commit directly to `main` for new features; always go through `dev` first
- **`git cherry-pick <hash>`**: apply a single specific commit from one branch to another — useful when you need a backend fix on `main` without merging unfinished `dev` work
- **`git reset --hard <branch>`**: reset a branch to match another exactly (destructive — rewrites history)
- **`git push --force-with-lease`**: safer force push — fails if someone else pushed since your last fetch

**Daily workflow:**
```bash
# New work
git checkout dev
# ...make changes, commit...
git push origin dev        # triggers dev preview

# Ship to prod
git checkout main
git merge dev
git push origin main       # triggers prod deploy
git checkout dev           # go back immediately
```

---

## Module 15 — Debugging Mindset

**Concepts learned from real bugs in this project:**
- **Typo in an IP address** (`72.2.60.5` vs `75.2.60.5`) — DNS verification failed for days. Lesson: always verify exact values, use a checker tool
- **Wrong Squarespace page** (Domain Nameservers vs DNS Settings) — same UI, completely different function. Lesson: read labels carefully before making changes
- **Backend code on wrong branch** — CORS fix was on `dev` but Render deploys `main`, so the fix never ran. Lesson: understand which branch each service deploys from
- **Multiple conflicting DNS records** — registrar defaults + custom records pointing different directions. Lesson: check for and remove defaults before adding new records
- **nslookup as a diagnostic tool** — `nslookup spinorstream.com` reveals exactly which IPs DNS returns. Multiple IPs = conflicting records. Lesson: always verify with the actual tool, not just the registrar UI

---

## Module 16 — Open Graph & Link Previews

**Concepts:**
- `<title>` sets the browser tab label and is also a fallback for link previews
- **Open Graph (OG) tags** — `<meta property="og:*">` — standard used by iMessage, Slack, Twitter, LinkedIn to build link preview cards
- **Twitter Card tags** — `<meta name="twitter:*">` — Twitter-specific variant, `summary_large_image` gets the full-width image format
- OG image dimensions: 1200×630 is the universal standard for link preview images
- **SVG vs PNG for OG images**: SVG works on most modern platforms (iMessage, Slack, Twitter); Facebook/WhatsApp require PNG. Swap the file and update the two `og:image` references when PNG support is needed
- The `og:image` URL must be absolute (`https://spinorstream.com/og-image.svg`), not relative
- Files in `/public/` are served at the root URL in Vite — `public/og-image.svg` → `https://spinorstream.com/og-image.svg`

**Where it lives:** `frontend/index.html`, `frontend/public/og-image.svg`

---

## Module 17 — Backend Rate Limiting

**Concepts:**
- **Flask-Limiter** — decorator-based per-IP rate limiting for Flask routes
- `get_remote_address` — built-in key function that uses the client IP as the limit identifier
- `storage_uri="memory://"` — in-process storage (resets on restart); fine for a single-server setup, would need Redis at multi-instance scale
- Rate limits are set per route with `@limiter.limit("N per minute")` — different endpoints can have different limits based on how expensive they are
- When a limit is exceeded, Flask-Limiter returns a 429 automatically — no extra code needed
- Typical limits for this app: heavy search endpoint (20/min), lighter read endpoints (10/min), auth (10/min to prevent token farming)

**Where it lives:** `backend/app.py` — `Limiter` setup, `@limiter.limit()` decorators

---

## Module 18 — HTTP Security Headers

**Concepts:**
- Security headers are set on HTTP responses to tell browsers how to handle the content
- `X-Content-Type-Options: nosniff` — prevents browsers from guessing content type (MIME sniffing attacks)
- `X-Frame-Options: DENY` — prevents your app from being embedded in an `<iframe>` (clickjacking protection)
- `Referrer-Policy: strict-origin-when-cross-origin` — controls how much URL info is sent in the `Referer` header when navigating away
- Set once in `@app.after_request` hook — applies to every response automatically
- `MAX_CONTENT_LENGTH` on Flask — caps request body size (1MB here) to prevent payload-based DoS attacks

**Where it lives:** `backend/app.py` — `add_cors_headers` after_request hook, `app.config["MAX_CONTENT_LENGTH"]`

---

## Module 19 — Nameserver Delegation (Netlify DNS)

**Concepts:**
- **Nameservers (NS records)** control which DNS provider answers queries for your domain — they sit one level above A/CNAME records
- **The problem with registrar DNS**: when your domain registrar (Squarespace) also provides DNS, they may inject their own default records (like hosting IPs) that you can't see or delete from the UI
- **Switching to Netlify DNS**: point your domain's nameservers to Netlify's NS records — Netlify then becomes the authoritative DNS provider and you manage all records there
- This removes any hidden registrar records and gives Netlify full control to auto-create optimal records
- **Nameserver propagation** is slower than A record changes — can take 1–4 hours (sometimes up to 24h) because NS changes have to propagate to root DNS servers
- After switching, `nslookup` should only return Netlify IPs — no more mixed results
