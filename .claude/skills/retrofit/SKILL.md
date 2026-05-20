---
name: retrofit
description: "Retrofit an existing project with the Attacca agent system. Audits project structure, generates a customized retrofit plan, and wires up agent scaffolding without touching source code or existing deployments."
---

# Retrofit Skill

## When to Use
- User runs `/retrofit` on an existing codebase
- Project already has source code but no Attacca scaffolding
- User wants to add the agent system to an existing project

---

## Phase 1: Audit the Existing Project

Read the workspace and answer:

**Project basics**:
- Name (from `package.json` / `pyproject.toml` / `go.mod` / `Gemfile`)
- Language/stack (Node+React, Python+Django, Go+Echo, Rails, etc.)
- Age (first commit: `git log --oneline | tail -1`)
- Last active (most recent commit date)

**File structure** — scan and document:
```
project-root/
  src/ or app/ or lib/     ← source code
  tests/ or __tests__/     ← tests
  node_modules / venv      ← dependencies
  package.json / pyproject.toml ← manifest
  .github/workflows/       ← CI/CD
  docker-compose.yml       ← deployment
```

**Build & test commands** — run dry (no commits):
```bash
npm run build   # or: python -m build, go build
npm test        # or: pytest, go test
npm run lint    # or: ruff check, golangci-lint
```

Document what works and what fails.

**Deployment pipeline** — check `.github/workflows/`:
- CI system (GitHub Actions, GitLab CI, Jenkins)
- Deployment target (Vercel, Heroku, Lambda, Docker)
- Secrets strategy (GitHub Secrets, Vault, .env)
- Main branch: auto-deploy or manual?

**Existing agent-like workflows**:
- Pre-commit hooks?
- PR review checklist (CONTRIBUTING.md)?
- Branch protection rules?
- Manual QA gates?

---

## Phase 2: Clarify Retrofit Scope

Present options and wait for user to choose:

```
## Retrofit Scope

Option A: Full Integration
  Agents for all new features, quality-gate on every push,
  optional retroactive security audit on existing code.

Option B: Selective
  Agents only for specific teams or features, quality-gate
  on main branch only, manual cost-benefit per use.

Option C: Read-Only Trial
  Agents in advisory mode — Manager plans, user approves
  before any Engineer implements. No auto-push.
  Best for teams evaluating before committing.

Which fits your team?
```

---

## Phase 3: Generate Retrofit Plan

Produce a customized step-by-step guide:

```markdown
# Retrofit Plan for [Project Name]

## Pre-Retrofit Checklist
- [ ] Tests pass: `[command]`
- [ ] Lints clean: `[command]`
- [ ] Deployed to production (baseline snapshot)
- [ ] Team informed of trial period

## Step 1: Copy Boilerplate Files
git clone https://github.com/adihebbalae/Attacca.git _tmp_attacca
cp -r _tmp_attacca/.github .
cp -r _tmp_attacca/.agents .
cp -r _tmp_attacca/.claude .
cp _tmp_attacca/.gitignore.project .gitignore.attacca
rm -rf _tmp_attacca
git add .github .agents .claude .gitignore.attacca

## Step 2: Merge Gitignore
Keep .gitignore (existing) and .gitignore.attacca (boilerplate).
Do NOT gitignore .github/ or .agents/.

## Step 3: Customize CLAUDE.md
[Auto-generate section from audit:]

## Project Conventions
### Stack
- Language: [detected]
- Framework: [detected]
- Test framework: [detected]
- Deploy: [detected]

### Build Commands
- Build: `[command]`
- Test: `[command]`
- Lint: `[command]`

### Secrets
- Strategy: [detected strategy]

## Step 4: Initialize State
[Generate .agents/state.json with project details]

## Step 5: First Commit
git add .github .agents .claude .gitignore
git commit -m "retrofit: add Attacca agent system

Non-breaking integration for new feature planning and code review.
Existing workflows unaffected; agents assist on opt-in basis."
git push
```

---

## Phase 4: Customization Recommendations

Based on the audit, suggest:

1. **Project-specific skills**: "Using Supabase? I can create a `/supabase` skill for schema migrations." "Using Stripe? I can add payment integration patterns."

2. **Integration points**: "Your CI runs `npm test` — quality-gate can run pre-push." "You use GitHub Secrets — I can update CLAUDE.md with secret-handling rules."

3. **Team adoption path**: "Start with Manager + Engineer on ONE feature. After that succeeds, add Security reviews."

4. **Avoiding conflicts**: "Existing pre-commit hooks are preserved — document how agents cooperate." "Existing deployment pipeline is untouched — agents won't bypass it."

---

## Phase 5: Present Plan and Confirm

```
## Retrofit Plan Ready

Project: [Name] ([Stack])
Status: [Active / Maintenance / Legacy]
Scope: [Option A/B/C]

What will change:
  ✅ Added: .github/agents/, prompts, skills
  ✅ Added: .agents/ state management
  ✅ Added: .claude/ skills (Claude Code)
  ✅ Updated: CLAUDE.md with project conventions
  ⚠️  Changed: .gitignore (merged, kept both)
  ❌ No changes to: source code, deployments, config files

First steps: follow Step 1–5 above on a feature branch.

Ready to proceed?
```

**Do NOT commit anything.** Wait for user approval.

---

## Phase 6: Post-Approval

When user confirms:
1. Show exact commands to run (Steps 1–5 from Phase 3)
2. Remind them: commit to a feature branch first, merge after team review
3. Write `.agents/state.json` with `status: "retrofitting"` and project details
4. Offer to troubleshoot once they've run the commands

---

## Notes

- Never modify source code, existing tests, or deployment configs
- If project already has a `.github/` directory, merge carefully — don't overwrite existing workflows
- If existing `CLAUDE.md` is present, show diff and ask before overwriting
- The `.agents/state.json` written here has `status: "retrofitting"` — update to `planning_complete` when the user starts their first feature with `/init-project`
