---
name: prd-builder
description: "Socratic PRD builder. Interrogates the user through problem, solution, and feasibility phases until zero ambiguity, then generates a structured PRD and saves it to .agents/prd.md. Run /init-project after to scaffold the project."
---

# PRD Builder Skill

## When to Use
- User runs `/prd-builder` with an idea or no input
- User wants to build a PRD before running `/init-project`
- User wants structured interrogation before committing to a project plan

---

## Phase 1: Initial Intake

Read what the user provided after the command. If they gave a description, use it as the starting point. If nothing was provided, open with:

```
Let's build your PRD. I'll ask questions until we have zero ambiguity.

Start here: what's the one-sentence version of what you're building?
```

Do not proceed until you have at least a rough description of the product idea.

---

## Phase 2: Interrogate the Problem

Ask until you can answer all of these with confidence — no guessing:

**The problem**:
- What specific problem does this solve?
- Who has this problem? (Not "developers" — "solo devs shipping SaaS with no ops team")
- How painful is it? (Nice-to-have or blocking their work?)
- How do they solve it today? (Manual workaround, competing tool, ignoring it?)

**Market signal**:
- Have you talked to anyone who has this problem?
- Are there existing solutions? What's wrong with them?

Ask in batches of 2–3 questions. Don't dump all at once. Wait for answers before continuing.

---

## Phase 3: Interrogate the Solution

Ask until you can answer all of these:

**The product**:
- What does the product do, step by step, from the user's perspective?
- What's the core loop — the thing a user does every single session?
- What are the 3–5 features that MUST exist for v1?
- What are you explicitly NOT building in v1?

**Users and access**:
- Who are the target users?
- How do they access it? (Web app, CLI, API, mobile, desktop?)
- Is there a concept of accounts, teams, or shared workspaces?

**Data**:
- What data does the product create or consume?
- Does it persist data? Where? (local, cloud, user-owned?)
- Any sensitive data? (PII, financial, health?)

---

## Phase 4: Interrogate Feasibility

Ask until you can answer all of these:

**Tech**:
- Any strong preference on stack? (Language, framework, hosting?)
- Budget: free-tier only, or paid services available?
- Existing infrastructure to integrate with? (Auth provider, database, APIs?)

**Constraints**:
- Timeline for v1? Hard deadline or aspirational?
- Team size? Solo or collaborators?
- Compliance requirements? (GDPR, HIPAA, SOC 2, etc.)

**Success criteria**:
- How do you know v1 is working? What's the first signal of success?
- What's the riskiest assumption in this plan?

---

## Phase 5: Generate PRD

Once all phases are resolved, produce the PRD:

```markdown
# Product Requirements Document

## Product
[One sentence: what it is]

## Problem
[The specific problem, who has it, how painful, current solutions and their gaps]

## Target User
[Specific persona — not a demographic, a person with a specific context and job]

## Solution
[What the product does, the core loop, how it solves the problem]

## Core Features (v1 must-haves)
1. [Feature] — [Why it's essential]
2. [Feature] — [Why it's essential]
...

## Out of Scope (v1)
- [Explicit exclusions with brief reason]

## Technical Constraints
- Stack: [language, framework, database, hosting]
- Budget: [free / paid / hybrid]
- Timeline: [v1 target]
- Team: [size]
- Compliance: [requirements or none]

## Non-Functional Requirements
- [Performance, scale, security, accessibility, etc.]

## Success Criteria
- [How you'll know v1 is working]

## Riskiest Assumptions
1. [Assumption] — [Mitigation plan]

## Open Questions
1. [Unresolved question]
```

---

## Phase 6: Validate and Refine

Present the PRD and ask:

```
Here's your PRD. Review it and tell me:
- Anything wrong or missing?
- Any scope that should shift?
- Any constraints I got wrong?

I'll revise until you're satisfied, then save it.
```

Iterate until the user confirms the PRD is accurate. Do NOT save until confirmed.

---

## Phase 7: Save and Hand Off

Once confirmed:

1. Save the PRD to `.agents/prd.md`
2. Confirm save with:

```
PRD saved to .agents/prd.md

Next step: run /init-project — it will read your PRD automatically, run research,
and scaffold the full project plan without repeating these questions.
```

Do NOT scaffold, create tasks, or write `state.json` — that's `/init-project`'s job.

---

## Notes

- Never generate the PRD speculatively before the user confirms the intake phases
- If the user provides a fully-formed idea upfront, you can compress Phases 2–4 into fewer questions — but still verify all the required fields before generating
- If the user says "just generate it" before all fields are resolved, list what you're assuming and ask them to confirm the assumptions before proceeding
