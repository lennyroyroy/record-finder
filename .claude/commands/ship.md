# /ship — Deploy to Production

Stages, commits, and deploys everything to prod, then updates all context docs.

## Steps

1. Run `git status` — show what's about to be committed, ask for confirmation if anything looks unexpected
2. Delete `.claude/previews/preview.html` if it exists (it's gitignored but clean it up anyway)
3. Stage all modified and untracked files relevant to the current work (be specific — don't `git add .`)
4. Write a commit message following the project's style: `v{version} — {short description}` or `fix — {short description}` for patches. Check `git log --oneline -5` for style reference.
5. Commit on `dev`
6. Push `dev` to origin
7. Checkout `main`, merge `dev`, push `main`
8. Checkout `dev`
9. Confirm: "Deployed. Netlify will pick up the change from main."
10. **Run `/update-context` automatically** — updates changelog.md, checks off plan.md, prompts for new ideas, then commits and pushes doc changes to keep dev and main in sync.

## After everything completes

Remind the user: **run `/clear` before starting the next feature.**
