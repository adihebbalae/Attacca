# /audit-prs

> Parallel per-PR Security audits (v3.11.0+). Fan out independent Security reviews across 2+ branches, aggregate results into the review queue.

## Command
`/audit-prs [branch1] [branch2] ... [branchN]`

or

`/audit-prs --auto` (detects all branches with unpushed commits ahead of main)

## What it does

1. **Validates inputs** — Each branch must have commits with BDR-formatted messages
2. **Spawns parallel Security agents** — One per branch, using the per-PR Security audit mode
3. **Collects results** — Each Security agent produces `.agents/audits/<pr-id>.md`
4. **Classifies** — Each audit is classified SIMPLE or COMPLEX per `.agents/security-classifier.md`
5. **Updates state.json** — Populates `review_queue.auto_land_candidates` (SIMPLE) and `review_queue.human_review` (COMPLEX)
6. **Prints summary** — N SIMPLE / N COMPLEX / any blockers

## Example

```
You: /audit-prs feature/checkout-spinner feature/jwt-rotation

Manager:
  Validating branches...
    ✅ feature/checkout-spinner — 2 commits with BDR headers
    ✅ feature/jwt-rotation — 3 commits with BDR headers
  
  Spawning parallel Security audits...
    🔐 Security → feature/checkout-spinner
    🔐 Security → feature/jwt-rotation
  
  [parallel execution — 30 seconds]
  
  Results:
    ✅ feature/checkout-spinner — SIMPLE (0 findings, no sensitive code, 35 lines, BDR verified)
      → auto_land_candidates (if auto-land enabled)
    ⚠️  feature/jwt-rotation — COMPLEX (0 findings, but touches auth + migrations + secrets)
      → human_review (reason: sensitive code paths)
  
  Summary: 1 SIMPLE / 1 COMPLEX
  
  Next: Run /review or /land (if auto-land enabled)
```

## Validation checks

Each branch is rejected with an error if:
- No commits found (branch matches upstream)
- Commits lack BDR headers (legacy format)
- Branch name is invalid
- Branch doesn't exist in local repo

## Output location

Results written to:
- `.agents/audits/PR-<id>-<branch>.md` — Full audit report
- `.agents/state.json` — Review queue entries appended

## Auto-detect mode

`/audit-prs --auto` finds all branches with commits not yet on main:

```
git log --graph --decorate --oneline main..HEAD | grep '^[*|\\ ].*commit' | wc -l
```

Invokes Security for each unique branch tip.

## Safety properties

- **No local merges yet** — `/audit-prs` classifies only; doesn't land. Use `/land` to auto-merge SIMPLE branches (requires config).
- **No remote actions** — All operations are read-only (git diff, git log). No pushes.
- **Parallel isolation** — Each Security agent runs independently with its own context. Results are aggregated in the final state.json update.
- **Durable audit trail** — Every audit report is saved to `.agents/audits/`. Humans can review and dispute classifications.

## Next commands

After audits complete:

- `/review` — Show human-review queue (COMPLEX PRs)
- `/land` — Auto-land SIMPLE PRs (if enabled and available)
- `/unskip <pr-id>` — Manually move a SIMPLE PR to human_review (if you disagree with the classification)

See Manager protocol's "Per-PR Review (Parallel Mode)" for full workflow.
