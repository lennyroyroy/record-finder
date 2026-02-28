# /save-docs — Save Context Doc Changes

Use after planning or brainstorm sessions when context files were edited but no app code was changed. Saves your thinking to git without triggering a deploy.

## Steps

1. Run `git status` — confirm only `.claude/` files are modified. If any `frontend/` or `backend/` files appear, stop and ask the user before proceeding.

2. Stage changed context files:
   ```
   git add .claude/context/plan.md .claude/context/ideas.md .claude/context/changelog.md .claude/context/guide.md
   ```
   Only stage files that are actually modified — don't add unmodified files.

3. Commit with a `docs —` prefix:
   ```
   git commit -m "docs — {brief description of what changed}"
   ```
   Examples: `docs — planning session`, `docs — add search bar idea to backlog`, `docs — reprioritize Phase 2`

4. Push to `dev` only:
   ```
   git push origin dev
   ```
   Do NOT merge to `main`. Doc changes don't need to deploy — Netlify will skip the build anyway.

5. Confirm: "Docs saved to dev. Nothing deployed."

## After saving

Remind the user: **`/clear` before starting the next session.**
