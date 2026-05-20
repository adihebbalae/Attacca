---
name: init-project
description: "Initialize a new project. Works with any input: point to a PRD file, paste one inline, or describe your idea and Manager will build the PRD with you. Full research → plan → scaffold → subagent dispatch."
---

# Init Project Skill

## When to Use
- User runs `/init-project` with a PRD path, inline description, or no input
- Starting any new project from scratch

---

## Phase 0: Safety Check

Read `.agents/state.json`. If `status` is `planning_complete` or `in_progress`:

```
⚠️  Project already initialized: [project.name]
Status: [status] | Active task: [active_task]

Re-running /init-project will OVERWRITE all planning work.

Options:
  1. Continue current project — ask Manager to resume
  2. Start fresh — type "yes overwrite" to confirm
```

Wait for user response before proceeding.

---

## Phase 1: PRD Detection & Intake

Check what the user provided (in order):

**1A — File path given**: Read the file fully. Never skim.

**1B — No input**: Scan root for `prd.md`, `PRD.md`, `*prd*.md`, `*spec*.md`, `*requirements*.md`, `*brief*.md`. If one match, confirm with user. If multiple, ask them to pick.

**1C — No PRD anywhere**: Run Socratic intake inline:

```
No PRD found. Let's build one — I'll ask until we have zero ambiguity.

1. What problem are you solving?
2. Who has this problem? (specific: not "developers" — "solo devs shipping SaaS")
3. How do they solve it today?
4. What are the 3–5 features that MUST exist for v1?
5. What are you explicitly NOT building in v1?
```

Keep probing until you can answer without guessing: what it does, who uses it, tech stack, v1 scope, hard constraints. Then generate a PRD and save to `.dev/prd/original.md`.

---

## Phase 1.5: Stage the PRD

1. Create `.dev/prd/`
2. Save PRD to `.dev/prd/original.md` (copy if already at root — don't delete original)

---

## Phase 2: Compress Into Project Brief

Produce a ~50-line brief — the only thing agents will ever read. Drop the raw PRD from context after this.

```
## Project Brief

**Product**: [one sentence]
**User**: [specific persona]
**Problem**: [what it solves and why]

**Stack**: [languages, frameworks, databases, services]

**Core Features** (v1 must-haves):
1. [feature] — [description]

**Non-Functional Requirements**:
- [perf / scale / security / a11y]

**Constraints**:
- [hard constraints]

**Out of Scope** (v1):
- [explicit exclusions]

**Open Questions**:
1. [question]
```

Write to `.agents/state.md` under `## Project Brief`.

---

## Phase 3: Research Scoping

Assess the brief for research needs. Spawn the Researcher subagent (via Agent tool) automatically — no user action required — if any apply:
- New market / product category → competitive landscape, market size, user pain
- Competitors mentioned → features, pricing, positioning
- Tech stack unclear → framework/database/hosting options
- Ambitious scale claims → what "best in class" actually does
- Budget-conscious → free/open-source options in the stack

Researcher prompt:
```
PRD Summary: [2-3 sentences from brief]

Research scope:
1. Competitive landscape: [competitors or closest analogues]
2. Market sizing: [if segment mentioned]
3. User pain validation
4. Tech stack validation: [proposed stack vs alternatives]
5. Free-tier options: [if budget-conscious]

Save to .agents/research/[prd-slug].md with: Executive Summary, Competitive Analysis, Tech Stack Recommendation, Free Tools, Key Gaps, Recommendations.
```

After Researcher returns, show findings to user. If no research needed, skip to Phase 4.

---

## Phase 4: Team Setup

Ask in one message:

```
## Team Setup

Q1: Development environment?
  A) Claude Code CLI only (current)
  B) Claude Code + GitHub Copilot

Q2: Project budget?
  A) Free tier only
  B) Paid services available
  C) Undecided — show both options

Q3: Team size and timeline?
  Solo or team? When does v1 ship?
```

---

## Phase 5: Clarify Until Zero Ambiguity

Ask all remaining questions in one message. Must resolve before scaffolding:
- Exactly what the product does (could you hand this to an engineer with no questions?)
- Who uses it and why (specific persona)
- Tech stack confirmed (research recommendation accepted or overridden)
- Deployment target
- v1 scope locked
- Compliance constraints (GDPR, HIPAA, SOC 2, etc.)

Update `.agents/state.md` with resolved answers before continuing.

---

## Phase 6: Architecture Decisions (if needed)

If meaningful architecture choices aren't locked in by constraints, present 2–3 options with tradeoffs and a recommendation:

```
### Architecture Decision: [topic]

Option A: [name] — Pro: [...] Con: [...]
Option B: [name] — Pro: [...] Con: [...]

Recommendation: Option [X] because [reason tied to their constraints].
Confirm?
```

Store confirmed decisions in `state.json` under `project.architecture_decisions`.

---

## Phase 7: Task Breakdown

Decompose confirmed features into ordered tasks. Each task:
- Scoped to one agent session (2–4 hours)
- Assigned to one agent: `engineer`, `security`, `designer`, or `consultant`
- Sequenced correctly (respect dependencies)

```json
{
  "id": "TASK-001",
  "title": "Short action title",
  "agent": "engineer",
  "depends_on": [],
  "description": "What to build",
  "acceptance_criteria": ["criterion 1", "criterion 2"],
  "why": "Why first / why this approach"
}
```

Aim for 8–20 tasks. If 3+ distinct functional areas exist, generate `.agents/MODULES.md`.

---

## Phase 8: Full Plan Review

Present complete plan and ask for approval — **do not scaffold until user says yes**:

```
## Project Plan — Ready for Review

✅ Zero Ambiguity Confirmed

Summary: [product] | [stack] | [deployment] | [team/budget]

Research Findings:
- [key finding 1]
- [key finding 2]

Architecture Decisions:
- [decision]: [choice and why]

Task Backlog ([N] tasks):
| ID       | Title | Agent    | Depends On |
|----------|-------|----------|------------|
| TASK-001 | ...   | engineer | —          |

First 3 tasks: [descriptions]

Approve this plan?
```

---

## Phase 9: Scaffold

Once approved:

**9A — Remove unused adapter directories.** Delete any tool directories the user isn't using (confirmed in Phase 4). Always keep `.agents/`. Always keep `.claude/` since they're using Claude Code.

**9B — Rename gitignore**: Delete `.gitignore` (template). Rename `.gitignore.project` → `.gitignore`. Ensure `.dev/` and `_dev/` are gitignored.

**9C — Write `.agents/state.json`**:
```json
{
  "project": {
    "name": "[name]",
    "description": "[one sentence]",
    "tech_stack": ["..."],
    "architecture_decisions": {},
    "external_dependencies": []
  },
  "research_source": ".agents/research/[slug].md",
  "research_findings_incorporated": ["..."],
  "context": { "budget": "[free/paid/tbd]" },
  "project_brief": "[compressed brief]",
  "tasks": [...],
  "active_task": "TASK-001",
  "status": "planning_complete",
  "handoff": { "approved_by_user": false, "target_agent": null },
  "changelog": ["init-project: scaffolded [date]"],
  "last_updated": "[date]",
  "last_updated_by": "manager"
}
```

**9D — Update `.agents/state.md`**: Human-readable overview with project name, brief, stack, task count, first task.

**9E — Update `.agents/workspace-map.md`**: Planned directory structure (prefix `[planned]` for not-yet-created paths).

**9F — Update `CLAUDE.md`**: Add project-specific standards — stack, naming conventions, test framework, linting rules.

**9G — Create GitHub Issues** (one per task):
```bash
gh issue create --title "[TASK-001] [title]" --body "..." --label "agent,task" --assignee "@me"
```

Create labels first if needed: `agent` (0075ca), `task` (e4e669), `blocked` (d93f0b).

**9H — Generate `.vscode/mcp.json`** with Context7 for library docs. Ask about web search provider: Tavily / Brave / Perplexity / Skip.

**9I — Generate `.agents/MODULES.md`** if 3+ distinct functional areas (module registry, statuses, dependencies, build order).

**9J — Budget research task**: If free tier, create TASK-000 to research free deployment options before TASK-001.

---

## Phase 10: Launch

```
## ✅ Project Initialized

[Project Name] is ready.

Stack: [stack] | Budget: [free/paid] | Tasks: [N] queued
Research: .agents/research/[slug].md
Issues: [repo link]

Next: TASK-001 — [title]
```

Set `state.json → handoff.approved_by_user: true`, write TASK-001 to `.agents/handoff.md`, then spawn the Engineer subagent (via Agent tool) to begin TASK-001.

---

## Notes

- Raw PRD is never stored in state — too large. The brief is the canonical reference.
- Third-party integrations (Stripe, Supabase, etc.) → flag under `project.external_dependencies`.
- Phase 0 safety check prevents data loss if user accidentally re-runs on an existing project.
