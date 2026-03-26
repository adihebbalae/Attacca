---
description: "Digest a large PRD (500–2000+ lines) into a structured project brief, full task backlog, and scaffolded state.json. Use this instead of /init-project when the PRD is too large to process inline."
agent: "manager"
---

You are running `/digest-prd`. Your job is to consume a large PRD document and produce a complete, actionable project foundation — so that no agent ever needs to read the raw PRD again.

The user will paste the PRD or point you to a file. Work through it methodically.

---

## Phase 1: Ingest

Read the entire PRD before doing anything else. If it's a file, read it fully. Do not skim.

As you read, extract into working memory:
- **Product goal** — what problem does this solve, for whom?
- **Tech stack** — languages, frameworks, databases, services
- **Core features** — what the product must do (functional requirements)
- **Non-functional requirements** — performance, scale, security, accessibility
- **Explicit constraints** — things ruled out, technology choices locked in, deadlines
- **Out of scope** — features explicitly deferred or excluded
- **Unknowns** — things the PRD left ambiguous

---

## Phase 2: Compress into Project Brief

Produce a compressed **Project Brief** — the distilled version of the PRD that fits in ~50 lines. This will be stored in `state.json` and referenced by every agent from now on.

Format:
```
## Project Brief

**Product**: [one-sentence description]
**User**: [who uses this]
**Problem**: [what it solves]

**Stack**: [tech stack list]

**Core Features** (must ship):
1. [feature] — [one-line description]
2. ...

**Non-Functional Requirements**:
- [perf / scale / security / a11y targets]

**Constraints**:
- [hard constraints: no X, must use Y, deadline Z]

**Out of Scope**:
- [explicit exclusions]

**Open Questions** (needs user input):
1. [question]
```

Write this brief in `.agents/state.md` under a `## Project Brief` section.

---

## Phase 3: Clarify Blockers Only

Look at your Open Questions list. Identify which ones are **blocking** — i.e., you cannot plan a feature without knowing the answer.

Ask the user only the blocking questions. One message, numbered list. Do not ask about nice-to-haves or things you can make reasonable defaults for.

Wait for answers. Update the brief with the answers before proceeding.

---

## Phase 4: Break Down Into Tasks

Decompose the core features into an ordered task backlog. Each task must be:
- Scoped to a single agent session (max 2–4 hours of work)
- Assigned to one agent (Engineer / Security / Designer / Consultant)
- Sequenced correctly (respect dependencies)

Format each task:
```json
{
  "id": "TASK-001",
  "title": "Short action title",
  "agent": "engineer",
  "model": "claude-sonnet",
  "depends_on": [],
  "description": "What to build",
  "acceptance_criteria": ["criterion 1", "criterion 2"],
  "why": "Why this comes first / why this approach"
}
```

Aim for 8–20 tasks for a typical project. If you have more, group smaller tasks.

---

## Phase 5: Scaffold state.json

Write the complete `.agents/state.json` with:
- `project.name`, `project.description`, `project.tech_stack`
- `project_brief` — the compressed brief from Phase 2
- `tasks` — the full task backlog from Phase 4
- `active_task` — set to `TASK-001`
- `status` — `"planning_complete"`
- `changelog` — first entry: `"digest-prd: project scaffolded from PRD"`

Also update `.agents/workspace-map.md` with the expected directory structure (even if not yet created — prefix with `[planned]`).

---

## Phase 6: Architecture Decision (if needed)

If the PRD implies meaningful architecture choices (monolith vs. microservice, REST vs. GraphQL, ORM choice, auth strategy, etc.) that are NOT locked in by constraints, surface them now:

Present 2–3 options with tradeoffs. Recommend one. Explain WHY. Ask the user to confirm before locking it in.

Update `state.json` with the confirmed decisions under `project.architecture_decisions`.

---

## Phase 7: Reflection Gate

Present the plan to the user:

```
## Project Digest Complete

**Brief**: [product goal in one sentence]
**Stack**: [confirmed stack]
**Tasks**: [N tasks queued, starting with TASK-001]
**First task**: [TASK-001 title + assigned agent]

### Task Backlog Preview
| ID | Title | Agent | Depends On |
|----|-------|-------|------------|
| TASK-001 | ... | engineer | — |
| TASK-002 | ... | engineer | TASK-001 |
...

### Open Decisions Resolved
- [decision]: [choice made and why]

### Still Open
- [anything still unresolved]

---
Ready to begin TASK-001? Or would you like to adjust the backlog first?
```

Do NOT begin implementation. Do NOT hand off to Engineer yet. Wait for explicit user approval.

---

## Phase 8: On Approval

When the user says to proceed:
1. Set `state.json` → `handoff.approved_by_user: true`
2. Write `TASK-001` details to `.agents/handoff.md`
3. Show the handoff banner:
```
╔══════════════════════════════════════════════════════════════╗
║  🔀 SWITCH TO:  @engineer   |   MODEL:  Claude Sonnet       ║
╚══════════════════════════════════════════════════════════════╝
```
Tell the user to run `/handoff-to-engineer`.

---

## Notes

- The raw PRD is **never stored** in state files — too large, too noisy. The brief is the canonical reference.
- If the PRD has a phase/milestone structure, preserve that as task groupings (e.g., `phase: "MVP"`, `phase: "v1.1"`).
- If the PRD mentions third-party integrations (Stripe, Supabase, etc.), flag them in `state.json` under `project.external_dependencies` — the Manager will identify required MCPs at task time.
