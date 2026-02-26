# Plan

---

## Do Now

_Nothing committed yet — pull from Do Someday when ready._

---

## Do Later

_Nothing committed yet — pull from Do Someday when ready._

---

## Do Someday

_Things promised, owed, or deferred — pull up when ready to act._

- [ ] **Landing page routing** — `/landing/` works but isn't the homepage yet. When ready: add `frontend/public/_redirects` with `/ /landing/ 200` and move the app to `/app`. Netlify will serve landing at root. Or set up a subdomain (app.spinorstream.com).
- [ ] **OAuth token / logout flow** — token persists correctly but the logout sequence hasn't been fully QA'd end-to-end. Test: log in → log out → log in again and confirm no stale state.
- [ ] **Discogs avatar not showing** — avatar URL is stored in `sos_avatar` (localStorage) via OAuth. Most likely cause: user may not have an avatar set on Discogs, or the `avatar_url` field is returning empty from the identity API. To debug: after login, open DevTools → Application → Local Storage → check `sos_avatar` value. If blank, Discogs isn't returning it. If set, check the Network tab for a failed image request.
- [ ] **Landing page: real app screenshots** — placeholder block in `/landing/` pipeline section. Swap for a real Compare tab screenshot at ~1200px wide. Saved as WebP.
- [ ] **Landing page: social handles** — Twitter and Instagram links in footer are placeholders (`spinorstream`). Update when accounts are created.
- [ ] **Landing page: Mailchimp** — forms are wired and ready. See MAILCHIMP_SETUP.md for the 3-step integration. Just needs the Mailchimp embed URL pasted into the `action` attributes.
- [ ] **Landing page: "Open App" link** — currently points to `/app` which doesn't exist until routing is set up. For now, update to point directly to `https://spinorstream.com` (the app itself) as a stopgap.
- [ ] **Icons for retailers and music services** — current buttons use text labels. When ready to add brand icons: install `react-icons` (`npm install react-icons --save` in frontend/). Then use `FaSpotify`, `SiApplemusic`, `SiYoutubemusic`, `FaAmazon`, `SiWalmart`, `SiTarget`, `FaBandcamp` from their respective modules.
