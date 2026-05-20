---
name: mvp
description: "Ship a working MVP as fast as possible. Aggressive parallelization, scope ruthlessness, deferred gates. Skips Designer, defers Security, assumes instead of clarifying. Switch to /init-project for production-grade scaffolding."
---

# MVP Skill

## When to Use
- User runs `/mvp` with an idea, description, or PRD
- Speed is the priority over thoroughness

**MVP Mindset**: Cut everything that isn't the core loop. Ship ugly. Fix later. Every minute planning is a minute not shipping.

---

## Phase 1: 60-Second Intake

Read what the user provided. **Ask at most 3 clarifying questions** — only true blockers that would break the entire scope. Assume everything else. Document assumptions in `state.json`.

Safe assumptions (make without asking):
- Auth → email/password or OAuth (pick based on context)
- DB → SQLite for local, Postgres for hosted
- Styling → Tailwind or ShadCN, no custom design
- Tests → smoke tests only, not full coverage
- Deployment → default for detected stack (Vercel for Next.js, Railway for Node, etc.)

---

## Phase 2: MVP Scope Razor

For every feature, apply: **Does the product BREAK without this?**
- YES → MVP
- NO → Defer to v2

```
## MVP Scope

| Feature  | Decision | Reason                                      |
|----------|----------|---------------------------------------------|
| [feature] | ✅ MVP  | Core loop — product doesn't work without it |
| [feature] | 🚫 v2  | Nice-to-have, doesn't block first users     |
```

State the MVP in one sentence: "A user can [do the one core thing]."

---

## Phase 3: Parallel Task Breakdown

Break MVP into tasks that run **simultaneously**. Goal: maximum parallelization.

Rules:
- Each task must be self-contained (no waiting on another)
- Shared data models go first (foundation)
- Target: 2–4 parallel streams after foundation

```
## Parallel Execution Plan

### Foundation (sequential — do first)
TASK-001: [Project setup, DB schema, auth scaffold] — ~[time]

### Stream A (start after TASK-001)
TASK-002: [Feature A] — ~[time]

### Stream B (start after TASK-001)
TASK-003: [Feature B] — ~[time]

### Stream C (start after TASK-001)
TASK-004: [Feature C] — ~[time]

### Integration (after all streams)
TASK-005: [Wire together, smoke test, deploy] — ~[time]
```

---

## Phase 4: Set MVP Mode

Write `state.json` with `mode: "mvp"`:

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

| Gate / Process        | Normal        | MVP Mode                         |
|-----------------------|---------------|----------------------------------|
| Clarifying questions  | Unlimited     | Max 3                            |
| Designer review       | Required      | Skipped                          |
| TDD                   | Encouraged    | Skipped — ship first             |
| Security audit        | Pre-push      | Deferred — run post-MVP          |
| SBOM                  | On dep change | Deferred                         |
| Quality gate          | Full 4-stage  | Lite — lint + basic test only    |
| Consultant escalation | On blockers   | Haiku fallback first             |
| Scope changes         | Normal        | Locked — no creep                |

**Non-negotiable even in MVP mode:**
- No hardcoded secrets
- No dependency added without supply chain Gate 1 approval
- All work committed (no uncommitted changes)
- `npm audit` / `pip-audit` quick scan before deploy

---

## Phase 5: Scaffold

1. Delete `.gitignore`, rename `.gitignore.project` → `.gitignore`
2. Write `.agents/state.json` with `mode: "mvp"`, all tasks, parallel plan
3. Update `.agents/state.md` with MVP scope and parallel map
4. Update `.agents/workspace-map.md` with planned structure
5. Write minimal `CLAUDE.md` addition: stack + commands only (no lengthy conventions)
6. Create GitHub Issues for each task (optional — skip if user wants to move immediately)

---

## Phase 6: Launch Plan

Tell the user exactly how to execute:

```
╔══════════════════════════════════════════════════════════════════╗
║  🚀 MVP MODE ACTIVE — PARALLEL EXECUTION READY                   ║
╚══════════════════════════════════════════════════════════════════╝

Foundation first:
  → Manager spawns Engineer subagent → TASK-001
  → Wait for TASK-001 to complete

Then launch all streams simultaneously:
  → Manager spawns Engineer subagents for TASK-002, TASK-003, TASK-004 in parallel
  → All 3 run at the same time

While streams run:
  → Manager monitors / answers blockers

When streams complete:
  → Engineer TASK-005: wire together, smoke test, deploy
  → Lite quality gate: lint + basic tests
  → Ship

Total parallel sessions: [n]
Estimated wall time: [foundation + longest stream + integration]
```

Manager then spawns Engineer for TASK-001 immediately.

---

## Post-MVP Hardening Checklist

Share this when the MVP ships:

```
## Post-MVP Hardening (run before real users)

- [ ] /security-audit — OWASP review on auth + API
- [ ] supply-chain skill — full 4-gate dependency review
- [ ] sbom skill — generate SBOM, scan CVEs
- [ ] quality-gate — full 4-stage (lint + type + test + security)
- [ ] Add Designer: review UX flows before marketing push
- [ ] Migrate smoke tests to proper coverage
- [ ] Set mode: "production" in state.json
```
