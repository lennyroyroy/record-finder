# Context Folder Guide

_How these documents work, how they relate, and how to use them effectively._

---

## The Documents

### `plan.md` — What to build and when
**Purpose:** The authoritative launch roadmap. Phased by time (Foundation → Polish → Launch Prep → Launch). Contains the active to-do list for shipping a public product by April 2026.

**When to read it:** At the start of every session (via `/prime`). When deciding what to work on next.

**When to update it:** After shipping a feature — check off the item. After a planning conversation — adjust phases or add/remove items.

**Key rule:** If it's in `plan.md`, it's committed. It belongs to a phase, has a deadline implied by that phase, and should be treated as a real obligation.

---

### `ideas.md` — What might be worth building
**Purpose:** The full feature backlog. Everything is categorized by real effort and real value: Critical Path, Build Next, Hold, Housekeeping, Infrastructure, Rethink, Icebox, Done. It's the honest version of the roadmap — no false urgency.

**When to read it:** When looking for the next thing to build after finishing a plan.md item. When evaluating whether a new idea has real value.

**When to update it:** When a new idea comes up — add it to the right category, don't just dump it. When something ships — move it to `Done`. When a "Hold" item gets unblocked — promote it to `Build Next`.

**Key rule:** `plan.md` is a subset of `ideas.md`. If something is in `plan.md`, it was promoted from `ideas.md`. These two documents should stay in sync — the same item shouldn't be described differently in both.

---

### `changelog.md` — What was actually built
**Purpose:** A human-readable history of the project, session by session. Not a git log — it's a narrative: what changed, what problems were solved, and why decisions were made. Useful for context when returning after a long break.

**When to read it:** When you've been away and need to remember where things stand beyond what `plan.md` shows. When debugging something that was "fixed before" — the session notes may explain the root cause.

**When to update it:** At the end of every session that ships real work. One entry per session. Short is fine — what changed, what was tricky, what was decided.

**Current gap:** As of v1.15, the changelog only covers Sessions 1–5. Sessions 6–N are missing. This should be updated.

---

### `learning.md` — The post-launch coding course
**Purpose:** A course outline for understanding every concept used in this app — React, Flask, OAuth, localStorage, deployment — well enough to rebuild it from scratch.

**When to read it:** After launch. This is a post-launch document.

**When to update it:** When the course is actually being built.

**Note:** This file has no pre-launch value and adds visual noise when scanning the folder. Consider moving it to a `post-launch/` subfolder until it's relevant.

---

### `../commands/prime.md` — Session start
**Purpose:** Tells Claude exactly what to load and summarize when you run `/prime`. It defines the orientation ritual: read CLAUDE.md, frontend/CLAUDE.md, plan.md, run git status, give a 4-line summary.

**When to update it:** If the session orientation ritual needs to change — e.g., if changelog.md should be read on every session, or if a new context file is added.

---

### `../commands/ship.md` — Deploy to production
**Purpose:** Tells Claude the exact steps for committing, pushing dev, merging to main, and confirming the Netlify deploy. The commit message format is specified here.

**When to update it:** If the deployment process changes (e.g., new branches, new environments, CI checks added).

---

## How They Work Together

```
plan.md       →  What we're doing this sprint
ideas.md      →  What comes after (or what we're skipping)
changelog.md  →  What we've done (narrative history)
learning.md   →  What to understand deeply (post-launch)

prime.md      →  How to start (reads plan.md)
ship.md       →  How to finish (writes to changelog.md, checks off plan.md)
```

The flow is linear: you pull work from `plan.md`, build it, ship it via `ship.md`, then record it in `changelog.md` and check it off in `plan.md`. `ideas.md` feeds the next cycle.

---

## Sample Session Workflow

**1. Start the session**
```
/prime
```
Claude reads CLAUDE.md, frontend/CLAUDE.md, plan.md, git status. Tells you the version, current phase, any WIP.

**2. Pick something from plan.md**
Phase 1 is active. Grab the next unchecked item. Example: *"Your data lives in your browser" disclosure.*

**3. Build it**
Ask Claude to implement. Refer to CLAUDE.md for architecture, frontend/CLAUDE.md for CSS patterns. Work happens in `dev` branch.

**4. Review and test**
Check the Netlify preview URL for `dev`. Confirm the feature works. Run lint if touching frontend.

**5. Ship**
```
/ship
```
Claude commits on dev, pushes, merges to main, confirms Netlify will deploy. Bump `APP_VERSION` in App.jsx if it's a meaningful release.

**6. Update docs**
- Check off the item in `plan.md`
- Add a changelog entry in `changelog.md` (brief: what shipped, what was tricky)
- If the feature was in `ideas.md`, move it to `Done`

**7. Clear before next feature**
```
/clear
```
Start the next session fresh. Don't carry context across features.

---

## System Applied

The following improvements were applied to this folder on 2026-02-28 and are now the documented standard:

- `ideas.md` Critical Path section replaced with a pointer to `plan.md` — single source of truth for active work
- `changelog.md` caught up with a Sessions 6–N block covering v1.1–v1.15
- `prime.md` updated to read the last changelog entry on session start
- `learning.md` moved to `.claude/post-launch/` — out of active context path until post-launch
- `ship.md` wired to `/update-context` as the mandatory close-the-loop step
- Open Decisions in `plan.md` given decide-by dates and next actions
