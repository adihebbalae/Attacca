---
description: "Ship a working MVP as fast as possible. Aggressive parallelization + vibe mode + scope ruthlessness. Skips Designer, defers Security, assumes instead of clarifying. For production: switch to /init-project."
agent: "manager"
argument-hint: "Paste your idea, PRD, or describe what you want to build"
---

You are running `/mvp`. This is **maximum velocity mode**. Your job is to get to a working, shippable product as fast as possible.

**MVP Mindset**: Cut everything that isn't the core loop. Ship ugly. Fix later. Every minute spent planning is a minute not shipping.

---

## Phase 1: 60-Second Intake

Read the PRD or description below. **Do NOT interrogate endlessly.** Ask at most **3 clarifying questions** — only blockers that would break the entire scope. Make reasonable assumptions for everything else. Document assumptions in state.json.

Typical assumptions you CAN make without asking:
- Auth: use a basic email/password or third-party OAuth (guess based on PRD context)
- DB: use the simplest option for the stack (SQLite for local, Postgres for hosted)
- Styling: use a component library (Tailwind, ShadCN, etc.) — no custom design
- Tests: smoke tests only, not full coverage
- Deployment: the default for the detected stack (Vercel for Next.js, Railway for Node, etc.)

PRD / Idea:
$ARGUMENTS

---

## Phase 2: MVP Scope Razor

For every feature in the PRD, apply this filter:

```
Does the product BREAK without this feature?
  YES → Include in MVP
  NO  → Defer to v2
```

Present the scope decision as a table:

```
## MVP Scope

| Feature | Decision | Reason |
|---------|----------|--------|
| [feature] | ✅ MVP | Core loop — product doesn't work without it |
| [feature] | 🚫 v2 | Nice-to-have — doesn't block first users |
| [feature] | 🚫 v2 | Can be a manual process for first 100 users |
```

State the **single sentence** that defines the MVP: "A user can [do the one core thing]."

---

## Phase 3: Parallel Task Breakdown

Break the MVP into tasks that can run **simultaneously**. The goal is maximum parallelization — multiple Engineer sessions running at the same time.

Rules for parallel tasks:
- Each task must be **self-contained** (can be implemented without waiting for another)
- Tasks that share data models go FIRST (foundation tasks) — everything else can parallelize after
- Target: 2–4 parallel streams after foundation

Format:
```
## Parallel Execution Plan

### 🏗️ Foundation (sequential — do first)
TASK-001: [Set up project, DB schema, auth scaffold] — ~[time]

### ⚡ Parallel Stream A (start after TASK-001)
TASK-002: [Feature A] — ~[time]

### ⚡ Parallel Stream B (start after TASK-001)
TASK-003: [Feature B] — ~[time]

### ⚡ Parallel Stream C (start after TASK-001)
TASK-004: [Feature C] — ~[time]

### 🔗 Integration (after streams complete)
TASK-005: [Wire it all together, smoke test, deploy] — ~[time]
```

---

## Phase 4: MVP Mode Settings

Set `mode: "mvp"` in `.agents/state.json`. This activates these behaviors across all agents:

```json
{
  "mode": "mvp",
  "mvp_settings": {
    "vibe_mode": true,
    "skip_designer": true,
    "skip_tdd": true,
    "skip_full_security_audit": true,
    "defer_sbom": true,
    "parallelization": "aggressive",
    "scope_locked": true
  }
}
```

**What changes in MVP mode:**

| Gate / Process | Normal | MVP Mode |
|----------------|--------|----------|
| Clarifying questions | Unlimited | Max 3 |
| Designer review | Required | **Skipped** |
| TDD | Encouraged | **Skipped** — ship first |
| Security audit | Pre-push | **Deferred** — run post-MVP |
| SBOM generation | On dep changes | **Deferred** — run post-MVP |
| Quality gate | Full 4-stage | **Lite** — lint + basic test only |
| Consultant escalation | On blockers | **Haiku fallback first** |
| Engineer reporting | Full step-by-step | **Vibe mode** — final summary only |
| Scope changes | Normal | **Locked** — no scope creep |

**What does NOT change in MVP mode (non-negotiable):**
- No hardcoded secrets
- No dependency added without Gate 1 approval (supply chain Gate 1 still active)
- Commits still happen (no uncommitted work)
- `npm audit` / `pip-audit` quick scan still runs before deploy

---

## Phase 5: Parallel Launch Instructions

After scaffolding state.json and workspace-map.md, give the user this exact launch plan:

```
╔══════════════════════════════════════════════════════════════════╗
║  🚀 MVP MODE ACTIVE — PARALLEL EXECUTION READY                  ║
╚══════════════════════════════════════════════════════════════════╝

Foundation first:
  → Open 1 Engineer chat → /handoff-to-engineer → run TASK-001
  → Wait for TASK-001 to complete

Then launch all streams simultaneously:
  → Open Engineer chat #1 → /handoff-to-engineer → run TASK-002
  → Open Engineer chat #2 → /handoff-to-engineer → run TASK-003
  → Open Engineer chat #3 → /handoff-to-engineer → run TASK-004
  (All 3 run at the same time — don't wait for one to finish)

While streams run:
  → Switch back here (Manager) to monitor / answer blockers

When all streams done:
  → Open 1 Engineer chat → TASK-005 (integration + smoke test)
  → Run lite quality-gate (lint + tests)
  → Deploy

Total parallel sessions: [n]
Estimated wall time: [foundation + longest stream + integration]
```

---

## Phase 6: Scaffold

Execute the scaffolding:
1. Delete `.gitignore`, rename `.gitignore.project` → `.gitignore`
2. Write `.agents/state.json` with `mode: "mvp"`, all tasks, parallel plan
3. Update `.agents/state.md` with MVP scope and parallel map
4. Update `.agents/workspace-map.md` with planned structure
5. Write minimal `.github/copilot-instructions.md` (stack + commands only — no lengthy conventions, MVP moves fast)
6. Generate GitHub Issues for each task (optional — skip if user wants to move immediately)

Do not generate extensive project documentation. Write the minimum context an Engineer needs to ship. MVP = move.

---

## Post-MVP Checklist (share at end)

When the MVP ships, hand the user this:

```
## Post-MVP Hardening (when you're ready)

Now that it ships, run these before real users:
- [ ] /security-audit — OWASP review on auth + API
- [ ] supply-chain skill — full 4-gate dependency review
- [ ] sbom skill — generate SBOM, scan CVEs
- [ ] quality-gate — full 4-stage (lint + type + test + security)
- [ ] Add Designer: review UX flows before marketing push
- [ ] Add tests: migrate smoke tests to proper coverage
- [ ] Set mode: "production" in state.json
```

Ship first. Harden second.
