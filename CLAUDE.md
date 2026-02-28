# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Spin or Stream (formerly Record Finder) is a vinyl procurement tool for public launch April 2026. It syncs a Discogs wantlist, scans marketplace prices, and tracks a collection through a three-stage pipeline: Wantlist → Compare → Collection.

## Session Workflow

### Starting a session
Run `/prime` — loads context, checks git status, summarizes where we are.

### Finishing a feature
Run `/ship` — commits, pushes dev, merges to main, deploys to prod.

### Between features
**Run `/clear` before starting something new.** This is a hard habit. Don't carry feature context across sessions — it bloats tokens and causes drift. If the user hasn't cleared after shipping, remind them.

## Context Files

All planning and reference docs live in `.claude/`:
- `.claude/context/plan.md` — April launch plan, phased to-dos
- `.claude/context/ideas.md` — feature backlog with effort/value analysis
- `.claude/context/learning.md` — course outline (post-launch)
- `.claude/context/changelog.md` — version history
- `.claude/commands/prime.md` — session start command
- `.claude/commands/ship.md` — deploy command

HTML feature previews stay in `Helpful Markdown Files/` (visual artifacts, not context).

## Commands

### Backend (Python/Flask)
```bash
cd backend
source venv/bin/activate
python app.py          # Dev server at http://localhost:5001
gunicorn app:app       # Production server
```

### Frontend (React/Vite)
```bash
cd frontend
npm run dev            # Dev server at http://localhost:5173
npm run build          # Production build to dist/
npm run lint           # ESLint
npm run preview        # Preview production build
```

There are no automated tests.

## Architecture

### Three-Tab Pipeline

The UI is a single React SPA with three tabs that items flow through:

1. **Wantlist** — Sync from Discogs or add manually (parses Bandcamp/Pitchfork/Amazon/Discogs URLs). Batch-scans marketplace prices via `/search`. Rate-limit aware (5s delay, 3 retries).
2. **Compare** — Budget slider (0–200 USD). Shows all-in price vs. budget threshold. Links to retail (Amazon, Target, Bandcamp). Compares vinyl vs. digital pricing.
3. **Collection** — Tracks acquired items (vinyl/digital/free). Syncs from Discogs collection (capped at 6 pages / 300 items). Deduplicates against app items.

### State Management

No Redux or Context — all state is persisted directly to `localStorage`. Storage keys are defined in the `KEYS` constant in `App.jsx`. There is no backend database; the Flask API is purely a proxy layer.

### Frontend

`frontend/src/App.jsx` is a single ~1,800-line monolithic file containing all component logic, a `STYLES` constant with all CSS (including Google Font imports), utility functions (`load`, `save`, `genId`), and all three tab components. Styles use CSS variables with a warm beige/orange/teal design system. Responsive breakpoint at 540px.

Environment-aware API URL via `import.meta.env.VITE_API_URL`:
- Dev: `http://localhost:5001` (`.env.local`)
- Prod: `https://record-finder-backend.onrender.com` (`.env.production`)

### Backend

`backend/app.py` exposes 4 endpoints:
- `POST /search` — Searches Discogs database, fetches marketplace listings, separates US vs. international, estimates shipping from hardcoded per-country table (`SHIPPING_ESTIMATES`), converts currency via open.er-api.com with `FALLBACK_RATES` as backup.
- `GET /wantlist?username=` — Paginates through Discogs wantlist (50/page).
- `GET /collection?username=` — Fetches Discogs collection (max 6 pages).
- `GET /health` — Health check.

Requires `DISCOGS_TOKEN` in `backend/.env`.

### Deployment

- **Frontend**: Netlify (auto-deploy from GitHub `main`)
- **Backend**: Render (`render.yaml` defines the service — Python, `gunicorn app:app`, root `backend/`)
