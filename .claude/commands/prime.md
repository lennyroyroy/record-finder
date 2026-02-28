# /prime — Session Orientation

Run this at the start of every session.

1. Read `CLAUDE.md` — architecture, stack, commands, design system
2. Read `frontend/CLAUDE.md` — CSS variables, component patterns, mobile rules
3. Read `.claude/context/plan.md` — current launch phase and open to-dos
4. Read the **most recent entry only** from `.claude/context/changelog.md` — what was last built and any context worth carrying in
5. Run `git status` and `git log --oneline -5`

Then summarize in 4 lines:
- Current app version and what was last shipped (from changelog + git log)
- Which launch phase we're in (from plan.md)
- Any uncommitted changes or open work in progress
- One reminder: if we've just finished something, run `/clear` before starting the next feature
