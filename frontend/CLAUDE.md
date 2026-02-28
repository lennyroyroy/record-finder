# Frontend — CLAUDE.md

Context for the React frontend. Read alongside the root `CLAUDE.md`.

---

## File Structure

- `src/App.jsx` — Single monolithic file (~1,800 lines). All components, all CSS, all state. Do not split without explicit instruction.
- `src/main.jsx` — Entry point only. Injects the `<style>` tag from `App.jsx`'s STYLES constant.
- `src/index.css` — Minimal resets only. All real styles live in the STYLES constant in App.jsx.
- `index.html` — Google Fonts loaded here via `<link>` with preconnect (not inside JS).
- `public/` — Static assets: icons, manifest, landing page.

---

## CSS Architecture

All styles are in the `STYLES` constant (a template literal string) at the top of `App.jsx`. This string is injected into a `<style>` tag at runtime by `main.jsx`. There is no CSS module system, no Tailwind, no styled-components.

### CSS Variables (defined in `:root`)

```
--bg:          #1c1814   /* page background */
--surface:     #242018   /* sidebar, cards */
--surface2:    #2c2820   /* hover states, inputs */
--border:      #3a3530   /* all borders */
--text:        #f0e8d8   /* primary text */
--text-muted:  #9a8f80   /* secondary text */
--text-dim:    #6a6058   /* labels, timestamps, placeholders */
--accent:      #e07840   /* orange — CTAs, active states, highlights */
--accent-dim:  #9a4e1e   /* darker orange — hover on accent */
--teal:        #4a9080   /* teal — success, collection, secondary actions */
--teal-dim:    #2a5548   /* darker teal */
--danger:      #c0504a   /* destructive actions */
--radius:      8px
--radius-lg:   14px
--sidebar-w:   220px
```

### Typography

- **Body / UI:** `DM Mono`, monospace — all UI text, labels, buttons, prices
- **Brand / Headings:** `Fraunces`, serif — sidebar logo, major headings only
- Both fonts loaded from Google Fonts in `index.html`

### Responsive Breakpoint

Single breakpoint at `540px`. Mobile styles use `@media (max-width: 540px)`.

Key mobile behaviors:
- Sidebar collapses to bottom nav bar (`.mobile-nav`)
- `.mobile-user-bar` appears at top with username + sync button
- Sort bar labels shorten: price count hidden (`.sort-count { display: none }`), "Clear" → "✕", "Collapse All" → "⊖ All" (`.sort-label-full { display: none }`)
- `.main` padding reduces from `32px 48px` to `16px 10px`

---

## Component Architecture

Everything lives in `App.jsx` as plain functions. No separate component files. Structure:

```
App()                  — root, manages tab routing, auth state, global modals
├── LoginScreen()      — Discogs OAuth + guest mode entry
├── Sidebar()          — desktop nav, user info
├── MobileNav()        — bottom nav bar on mobile
├── WantlistTab()      — main tab: scan, sort, filter, cards
│   └── WantlistCard() — individual item card (collapsed/expanded)
├── CompareTab()       — budget slider, all-in pricing
├── CollectionTab()    — acquired items, Discogs collection sync
├── DiscoverTab()      — RSS-based music discovery (NME, Pitchfork)
└── SettingsTab()      — guest mode settings, data management
```

---

## State Management

No Redux, no Context. All state is `useState` + `localStorage`.

Key localStorage keys (defined in `KEYS` constant in App.jsx):
- `sos_wantlist` — wantlist items array
- `sos_results` — scan results object, keyed by item id
- `sos_scan_times` — scan timestamps object, keyed by item id
- `sos_collection` — collection items array
- `sos_auth` — auth token
- `sos_username`, `sos_avatar` — user identity

Helpers: `load(key, fallback)` and `save(key, value)` wrap JSON parse/stringify.

---

## Key Patterns

### Adding a new CSS class
Add it directly to the `STYLES` constant string in App.jsx. Follow the existing section comments (`/* ── SECTION ── */`). Use existing CSS variables — never hardcode colors.

### Adding a new button
Match the existing button patterns. Sort bar buttons use `.sort-btn` / `.sort-btn.active`. Action buttons use `.btn`, `.btn-primary`, `.btn-ghost`. Never add inline styles for color — use variables.

### Scan timestamp
`formatScanAge(ts)` and `isScanStale(ts)` are module-level functions (not inside any component). `isScanStale` returns true after 24h. Stale timestamps render with class `card-scan-ts stale` which applies amber color.

### Mobile overflow rule
`html, body`, `.app-shell`, and `.main` all have `overflow-x: hidden`. iOS Safari requires all three. Do not remove any of them — the overflow issue took multiple sessions to fully fix.

---

## Version Tracking

`APP_VERSION` constant at top of App.jsx. Format: `"v1.15"` (bumped manually with each release). Shows in sidebar footer on desktop.
