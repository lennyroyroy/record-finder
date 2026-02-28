# Context Folder Guide

_How these documents work, how they relate, and how to use them effectively._

---

## The Documents

### `plan.md` — What to build and when
**Purpose:** The authoritative launch roadmap AND full feature backlog. Phased by time (Foundation → Polish → Launch Prep → Launch). Contains active to-dos, backlog, housekeeping, infrastructure bets, and Done archive — all in one place.

**When to read it:** At the start of every build session (via `/prime`). When deciding what to work on next.

**When to update it:** After shipping a feature — check off the item and move it to Done. After a planning session — adjust phases, add/remove items, update open decisions.

**Key rule:** One file, one source of truth. Do not maintain a separate ideas file.

---

### `changelog.md` — What was actually built
**Purpose:** A human-readable history of the project, session by session. Not a git log — it's a narrative: what changed, what problems were solved, and why decisions were made.

**When to read it:** At session start via `/prime` (last entry only). When debugging something that was "fixed before" — the session notes may explain the root cause.

**When to update it:** At the end of every session that ships real work, via `/update-context`. One entry per session. Short is fine.

---

### `../commands/prime.md` — Build session start
**Purpose:** Loads architecture context (CLAUDE.md, frontend/CLAUDE.md), plan.md, last changelog entry, git status. Gives a 5-line summary including suggested next action. Use at the start of any coding session.

**When to update it:** If the session orientation ritual changes or new context files are added.

---

### `../commands/ship.md` — Deploy to production
**Purpose:** Commits on dev, pushes, merges to main, confirms Netlify deploy. Deletes `.claude/previews/preview.html` before committing. Calls `/update-context` afterward to close the loop.

**When to update it:** If the deployment process changes (new branches, CI, environments).

---

### `../commands/update-context.md` — Close the loop after shipping
**Purpose:** After `/ship`, auto-updates changelog.md and plan.md from session context and git log. Asks once for new ideas. Commits and syncs docs to main.

**When to update it:** If the post-ship doc update process needs to change.

---

### `../commands/review.md` — Planning session start
**Purpose:** Lighter than `/prime` — loads only plan.md and the last changelog entry. No architecture files. Summarizes phase status, suggests next 3 priorities, flags due decisions. Use instead of `/prime` for any session where you're thinking, not building.

**When to update it:** If the planning session orientation needs to change.

---

## How They Work Together

```
plan.md            →  What we're doing this sprint + full backlog (single file)
changelog.md       →  What we've done (narrative history)

prime.md           →  How to start a BUILD session
review.md          →  How to start a PLANNING session
ship.md            →  How to finish and deploy
update-context.md  →  How to close the loop on docs after shipping
```

The build cycle: pull from `plan.md` → build → `/ship` → `/update-context` → `/clear`.
The review cycle: `/review` → think/reorganize → optional doc commit → `/clear`.

---

## Workflows

### 1. Build session — Start the day and ship a feature

```
/prime
```
→ 5-line summary: version, phase, WIP, suggested next, clear reminder.

Pick the suggested next item (or choose another from the active phase). Build it with Claude. Test on Netlify dev preview. Then:

```
/ship
```
→ Deletes preview.html, commits dev, merges to main, deploys.

```
/update-context
```
→ Auto-updates changelog and plan.md. Asks for new ideas. All docs committed.

```
/clear
```
→ Clean slate before next feature. Never skip this.

**Key rules:**
- `/prime` every build session, even if you were just here
- `/clear` between every feature, even small ones
- Don't carry coding context into a planning session or vice versa

---

### 2. Brainstorm session — Think through an idea, maybe log it

Do NOT run `/prime` — architecture docs aren't needed and waste tokens.

Just start the conversation: _"I want to think through [idea]. Open plan.md."_

Claude reads plan.md, you discuss effort/value/fit/timing. If it's worth keeping:
_"Add this to plan.md under [Backlog / Housekeeping / etc]."_

At the end:
- If plan.md was edited → `/save-docs` (stages context files, commits with `docs —` prefix, merges to main, no deploy)
- If nothing changed → `/clear`, nothing to commit.

Do NOT run `/ship` or `/update-context` — nothing was shipped.

**Key rule:** If you catch yourself going deep on implementation details, stop. Log the idea and open a proper build session for it. Brainstorm sessions are for deciding what to build, not how.

---

### 3. Mid-build idea capture — Store it without breaking flow

You're deep in a coding session and a side idea surfaces. Don't discuss it. Don't plan it. Just store it:

_"Add to plan.md under [Backlog / Hold / etc]: [one-line description of idea]."_

Claude edits plan.md inline. Continue working. The edit will be committed automatically when you `/ship` the current feature. At `/update-context` time, say "no new ideas" (it's already logged).

**Key rule:** Log it, don't discuss it. The moment you start evaluating a side idea mid-build, you burn context and lose momentum. One sentence in plan.md is enough — the detail can wait.

---

### 4. Planning session — Review context, set priorities, make decisions

Do NOT run `/prime` — it loads architecture files that add cost with no planning value.

```
/review
```
→ Loads plan.md, last changelog entry only. Summarizes phase status, suggests top 3 priorities, flags any open decisions approaching their decide-by date.

Work through: reorder items, check off open decisions, promote ideas from Hold → Build Next, adjust phase timelines, discuss anything unclear.

At the end:
- If any context files changed → `/save-docs` (stages context files, commits `docs —`, merges to main, no deploy)
- If only discussed, nothing written → `/clear`, nothing to commit.

Do NOT run `/ship` — nothing was deployed.

**Key rule:** Keep planning sessions focused on decisions, not implementations. If a conversation turns into "how would we build X," stop — that's a build session. Log the decision and open a build session.

---

## Feature Previews

When building UI features, generate a preview at `.claude/previews/preview.html`. Rules:
- **Gitignored** — never committed. Overwrite freely each time.
- `/ship` deletes it before staging (step 2).
- For QA: share a plain screenshot + one-sentence description by default. Only use the full preview when the user needs to compare layout options.
- Old/archived previews belong in `artifacts/`.

---

## Token Efficiency

| Session type | Start with | Do NOT load | End with |
|---|---|---|---|
| Building a feature | `/prime` | — | `/ship` → `/update-context` → `/clear` |
| Brainstorming an idea | Nothing | CLAUDE.md, frontend/CLAUDE.md, git | `/save-docs` or `/clear` |
| Mid-build idea | Nothing (already in session) | — | keep building; logs commit with the feature via `/ship` |
| Planning/review | `/review` | CLAUDE.md, frontend/CLAUDE.md, git | `/save-docs` or `/clear` |

**Universal rules:**
- `/clear` between context types — never carry build context into a planning session
- For planning sessions, never load architecture docs
- For quick idea capture, never discuss — just log
- If a session has gone 2+ hours on a build, `/clear` and `/prime` again before continuing

---

