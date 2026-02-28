# /update-context — Update All Context Docs

Run this immediately after shipping. Closes the loop on the session before clearing.

## Steps

1. **Read the current state** of `.claude/context/plan.md`, `.claude/context/ideas.md`, and `.claude/context/changelog.md`

2. **Ask the user three questions** (ask all three at once, clearly numbered):

   > **1. What shipped?**
   > Write 1–2 sentences for the changelog. What changed, and was there anything tricky?
   >
   > **2. Which plan.md item(s) are done?**
   > Show the user the current unchecked items from plan.md so they can confirm which to mark complete.
   >
   > **3. Any new ideas to log?**
   > If yes, ask for the idea and which ideas.md category it belongs in (Critical Path / Build Next / Hold / Housekeeping / Infrastructure / Rethink / Icebox). If no, skip.

3. **Make the edits:**

   - **changelog.md** — Append a new session entry at the top (below the `---` after the header). Use this format:
     ```
     ## Session N — {brief title}

     **What shipped:**
     - {user's answer from Q1}

     ---
     ```
     Infer the session number from how many entries already exist.

   - **plan.md** — Check off the completed item(s) the user identified. Change `- [ ]` to `- [x]`. Then move the item to the `Done` section at the bottom. If no Done section exists, add one.

   - **ideas.md** — If the shipped item exists in ideas.md (Critical Path or Build Next), move it to the `Done` section with a strikethrough and version note. If there's a new idea from Q3, add it to the correct category.

4. **Confirm** what was updated: "Updated changelog, plan, and ideas. Ready to `/clear`."
