# /save-docs — Save Context Doc Changes

Use after planning or brainstorm sessions when context files were edited but no app code was changed. Saves your thinking to git and keeps dev and main in sync without triggering a deploy.

## Steps

1. Run `git status` — confirm only `.claude/` files are modified. If any `frontend/` or `backend/` files appear, stop and ask the user before proceeding.

2. Stage all changed `.claude/` files:
   ```
   git add .claude/context/plan.md .claude/context/changelog.md .claude/context/guide.md
   ```
   Also stage any modified `.claude/commands/` files if they were edited this session. Only stage files that are actually modified — don't add unmodified files.

3. Commit with a `docs —` prefix:
   ```
   git commit -m "docs — {brief description of what changed}"
   ```
   Examples: `docs — planning session`, `docs — add search bar idea to backlog`, `docs — reprioritize Phase 2`

4. Push dev, merge to main, push main:
   ```
   git push origin dev
   git checkout main
   git merge dev
   git push origin main
   git checkout dev
   ```
   Netlify will not trigger a meaningful rebuild — no frontend source files changed.

5. Confirm: "Docs saved. Dev and main are in sync. Nothing deployed."

## After saving

Remind the user: **`/clear` before starting the next session.**
