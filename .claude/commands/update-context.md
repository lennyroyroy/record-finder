# /update-context — Update All Context Docs

Runs automatically at the end of `/ship`. Closes the loop on the session.

## Steps

1. **Read the current state** of `.claude/context/plan.md`, `.claude/context/changelog.md`, and `git log --oneline -5`

2. **Auto-update changelog.md** — Write a new session entry at the top (below the `---` after the header). Infer everything from git log and what was built this session. No user input needed. Use this format:
   ```
   ## Session N — {brief title}

   **What shipped:**
   - {inferred from git log and session context}

   ---
   ```
   Infer the session number from how many entries already exist.

3. **Auto-check plan.md** — Compare what was shipped against open items in plan.md. Mark completed items `- [x]` (leave them in their phase) and also add a `- ~~strikethrough~~` entry to the `Done` section at the bottom with a short note on when/how it shipped. Infer from git log and session context — no user input needed.

4. **Ask one optional question:**

   > **Any new ideas to log?**
   > Describe the idea, or hit Skip to finish.

   - If skipped: proceed to step 5.
   - If an idea is provided: add it to the correct section in plan.md (Backlog — Hold / Housekeeping / Infrastructure / Rethink / Icebox). Infer the section — or ask if genuinely unclear.

5. **Commit and push the doc updates:**
   - Stage only `.claude/context/` files that changed
   - Commit message: `docs — update context after {brief description}`
   - Push to `dev`, then merge to `main` and push, return to `dev`
   - This keeps dev and main in sync on context files

6. **Confirm:** "Context updated and synced to main. Ready to `/clear`."
