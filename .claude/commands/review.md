# /review — Planning Session

For strategy, prioritization, and context review. No code changes expected.

**Do NOT use `/prime` for planning sessions** — it loads architecture docs you don't need and wastes tokens.

## Steps

1. Read `.claude/context/plan.md` — phases, unchecked items, open decisions with due dates
2. Read `.claude/context/ideas.md` — full backlog by category
3. Read the **last entry only** from `.claude/context/changelog.md` — recent context

Do NOT read `CLAUDE.md` or `frontend/CLAUDE.md` — architecture context is not needed for planning.

Then summarize:
- Current phase and how many items remain
- Suggested next 3 actions based on phase priority + effort/value
- Any open decisions with passed or approaching decide-by dates

## After a review session

**If doc changes were made** (reordering, new ideas, decisions logged, priorities shifted):
```
/save-docs
```
Stages changed context files, commits with `docs —` prefix, merges to main. No deploy. Then `/clear`.

**If only discussed, nothing changed in files:**
Just `/clear`. Nothing to commit.
