---
name: audit-prs
description: "Parallel per-PR Security audits (v3.11.0+). Fan out independent Security reviews across 2+ branches, classify each as SIMPLE or COMPLEX, aggregate results into the review queue. Use before merging any parallel Engineer branches."
---

# Audit PRs Skill

## When to Use
- User runs `/audit-prs branch1 branch2 [branchN]`
- User runs `/audit-prs --auto` to detect all branches ahead of main
- 2+ Engineer branches are ready for review before merge

---

## Step 1: Resolve Branches

**If `--auto`**: Find all branches with commits not yet on main:
```bash
git branch --format='%(refname:short)' | while read b; do
  count=$(git log --oneline main.."$b" 2>/dev/null | wc -l)
  [ "$count" -gt 0 ] && echo "$b ($count commits)"
done
```

**If branch names provided**: Use the list directly.

---

## Step 2: Validate Each Branch

Reject any branch that fails these checks (report error, skip that branch):
- Branch exists locally (`git rev-parse --verify <branch>`)
- Has commits ahead of main (`git log main..<branch> --oneline` is non-empty)
- Commits use BDR format headers (Business / Decision / Rationale)
- Branch name is valid (no special characters)

Report validation results:
```
Validating branches...
  ✅ feature/checkout-spinner — 2 commits, BDR verified
  ✅ feature/jwt-rotation — 3 commits, BDR verified
  ❌ feature/old-work — 0 commits ahead of main (skipped)
```

---

## Step 3: Spawn Parallel Security Audits

Use the Agent tool to spawn one Security subagent per valid branch simultaneously (all in a single response, not sequentially).

Pass each Security agent **only file paths** — never implementation details, commit messages, or summaries. Anti-bias rule: Security must audit cold.

Per-agent prompt structure:
```
You are running a per-PR Security audit on branch: [branch-name]

Files changed vs main:
[output of: git diff main..[branch] --name-only]

Full diff:
[output of: git diff main..[branch]]

Run a full security audit per .claude/skills/security-audit/SKILL.md.
Classify the result as SIMPLE or COMPLEX per .agents/security-classifier.md.
Save audit report to .agents/audits/PR-[id]-[branch].md.
Return: classification, finding count, findings summary, classification reason.
```

Show dispatch status:
```
Spawning parallel Security audits...
  🔐 Security → feature/checkout-spinner
  🔐 Security → feature/jwt-rotation
```

---

## Step 4: Collect and Classify Results

After all Security subagents return, aggregate results.

**SIMPLE** (auto-landable if enabled): No findings, no sensitive code paths (auth, payments, secrets, migrations), small diff (≤50 lines), BDR headers verified.

**COMPLEX** (requires human review): Any security finding, OR touches auth/payments/secrets/migrations/permissions, OR large diff (>50 lines), OR missing BDR headers.

See `.agents/security-classifier.md` for full classification criteria.

---

## Step 5: Update `state.json`

Append to `review_queue`:

```json
"review_queue": {
  "auto_land_candidates": [
    { "branch": "feature/checkout-spinner", "classification": "SIMPLE", "audit": ".agents/audits/PR-1-checkout-spinner.md" }
  ],
  "human_review": [
    { "branch": "feature/jwt-rotation", "classification": "COMPLEX", "reason": "touches auth + migrations", "audit": ".agents/audits/PR-2-jwt-rotation.md" }
  ]
}
```

---

## Step 6: Print Summary

```
Results:
  ✅ feature/checkout-spinner — SIMPLE
     0 findings | no sensitive paths | 35 lines | BDR verified
     → auto_land_candidates

  ⚠️  feature/jwt-rotation — COMPLEX
     0 findings | touches auth + migrations + secrets
     → human_review (reason: sensitive code paths)

Summary: [N] SIMPLE / [N] COMPLEX

Full audit reports: .agents/audits/

Next steps:
  SIMPLE branches → push and merge (or auto-land if enabled in .agents/security-classifier.config.json)
  COMPLEX branches → review .agents/audits/ before merging
```

---

## Safety Properties

- **No merges** — `/audit-prs` classifies only. Merging is always a separate, explicit human step.
- **No remote actions** — all operations are read-only (git diff, git log). No pushes.
- **Parallel isolation** — each Security agent runs independently with its own context.
- **Durable audit trail** — every report saved to `.agents/audits/`. Humans can review and dispute classifications.
- **Anti-bias enforced** — Security receives only file paths and diffs, never commit messages or implementation summaries.
