---
description: "Build a comprehensive PRD from scratch using Socratic questioning. Manager interrogates your idea until zero ambiguity, then generates a complete PRD ready for /init-project."
agent: "manager"
---

You are running `/prd-builder`. Your job is to help the user create a **production-grade PRD from scratch** using the Socratic method.

**Do NOT skip this step**: Interrogate endlessly. Ask clarifying questions until there is **zero ambiguity**. A complete PRD is the difference between a 3-week build and a 3-month struggle.

---

## Phase 1: Initial Intake

**Ask the user**:

```
## 📝 PRD Builder

Let's build your PRD together. I'll ask questions until we have zero ambiguity.

**Start with the core idea**:
1. What problem are you solving?
2. Who has this problem?
3. How do they solve it today? (manual process, competitor product, spreadsheet, etc.)
4. Why is now the right time to build this?
```

Wait for their answer. Then proceed to Phase 2.

---

## Phase 2: Interrogate the Problem

**Dig deeper on the problem**:
- How do you know this problem exists? (user interviews, personal pain, market research?)
- How painful is it? (annoying vs blocking vs expensive?)
- How many people have this problem? (niche vs mass market?)
- What happens if they do nothing? (status quo acceptable or urgent?)

**Validate the user**:
- Who specifically are you building for? ("developers" is too broad — "solo devs shipping SaaS" is specific)
- What’s their current workflow? (step by step)
- What do they love about the current solution? What do they hate?
- Are you one of these users? If not, how will you validate assumptions?

**Challenge the timing**:
- Why now? (new technology, market shift, regulation, trend?)
- What changed recently that makes this possible or necessary?
- Is this a "nice to have" or "must have"?

---

## Phase 3: Interrogate the Solution

**Core features**:
- What are the 3-5 features that MUST exist for this to be useful?
- What does "done" look like for v1? (be ruthlessly specific)
- What are you explicitly NOT building in v1? (scope fence)

**Tech stack**:
- What tech are you already comfortable with? (use what you know for speed)
- Any hard constraints? (must be serverless, must run on Windows, must integrate with X)
- Performance/scale targets? (10 users? 10k? 10M?)
- Compliance requirements? (GDPR, HIPAA, SOC 2?)

**Differentiation**:
- How is this different from [competitor X]?
- What’s your unfair advantage? (distribution, expertise, unique insight?)
- Why would someone switch from their current solution to yours?

---

## Phase 4: Interrogate Feasibility

**Build timeline**:
- How long do you have to ship v1? (1 week? 1 month? 3 months?)
- Are you building solo or with a team?
- How many hours/week can you dedicate to this?
- What’s your experience level with the tech stack?

**Go-to-market**:
- How will the first 10 users find this?
- What’s the business model? (free, freemium, paid, enterprise?)
- What’s the pricing if paid?
- When do you need revenue? (bootstrapped vs funded?)

**Risk assessment**:
- What’s the biggest technical risk? (can you build X?)
- What’s the biggest market risk? (will anyone use it?)
- What assumptions MUST be true for this to work?
- What’s your backup plan if this fails?

---

## Phase 5: Generate the PRD

Once you have answers to the questions above (keep interrogating until you do), generate a complete PRD:

```markdown
# [Project Name] — Product Requirements Document

**Author**: [User name]
**Date**: [Today’s date]
**Status**: Draft v1 (ready for /init-project)

---

## Executive Summary

**Problem**: [1-2 sentence problem statement]
**Solution**: [1-2 sentence solution]
**Target User**: [specific user persona]
**Differentiation**: [why this vs alternatives]
**Timeline**: [v1 ship date target]

---

## Problem Statement

### The Problem
[Detailed description of the problem. Include evidence: user research, market data, personal experience]

### Current Solutions
[How do users solve this today? What are the alternatives? Where do they fall short?]

### Why Now
[What changed that makes this the right time? New tech? Market shift? Regulation?]

---

## User Persona

**Who**: [Specific user type — not "developers" but "solo developers shipping SaaS products"]
**Current Workflow**: [Step-by-step how they do this today]
**Pain Points**: [Ranked list of frustrations with current solution]
**Jobs to be Done**: [What outcome are they hiring this product to achieve?]
**Success Metrics**: [How will they measure success? Time saved? Revenue increase? Error reduction?]

---

## Solution Overview

[2-3 paragraphs describing what you’re building at a high level. Include screenshots/mockups if available.]

---

## Core Features (v1 Must-Haves)

### Feature 1: [Name]
**User Story**: As a [user], I want to [action] so that [outcome].
**Acceptance Criteria**:
- [ ] [Specific, testable criterion]
- [ ] [Specific, testable criterion]

**Technical Notes**: [Any implementation detail constraints]

### Feature 2: [Name]
[Repeat format]

...

---

## Out of Scope (Deferred to v2+)

- [Feature explicitly not building now]
- [Feature explicitly not building now]

**Why deferred**: [Rationale — complexity? low ROI? validate first?]

---

## Technical Requirements

### Tech Stack
- **Frontend**: [Framework + reasoning]
- **Backend**: [Framework + reasoning]
- **Database**: [DB + reasoning]
- **Hosting**: [Platform + reasoning]
- **CI/CD**: [Tool + reasoning]

### Non-Functional Requirements
- **Performance**: [Target load time, throughput, etc.]
- **Scale**: [Concurrent users, data volume]
- **Security**: [Auth method, data encryption, compliance]
- **Accessibility**: [WCAG level, screen reader support?]

### Hard Constraints
- [Must use X because Y]
- [Cannot use Z because W]

---

## Go-to-Market Plan

### Launch Strategy
- **Target Launch Date**: [Date]
- **First 10 Users**: [How will you get them?]
- **Distribution Channels**: [Reddit? Twitter? SEO? Paid ads?]

### Business Model
- **Pricing**: [Free / $X per month / Enterprise]
- **Revenue Target**: [Year 1 goal if applicable]
- **Unit Economics**: [CAC, LTV if known]

---

## Success Metrics

### v1 Success Criteria
- [ ] [X users signed up]
- [ ] [Y% activation rate]
- [ ] [Z NPS score]
- [ ] [Technical: uptime, performance]

### Assumptions to Validate
1. [Assumption] — How to test: [method]
2. [Assumption] — How to test: [method]

---

## Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Technical risk] | High/Med/Low | High/Med/Low | [How to reduce] |
| [Market risk] | High/Med/Low | High/Med/Low | [How to reduce] |

---

## Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Phase 1: Scaffolding | [N weeks] | Project initialized, CI/CD set up |
| Phase 2: Core Features | [N weeks] | Features 1-3 implemented + tested |
| Phase 3: Polish | [N weeks] | UI/UX finalized, edge cases handled |
| Phase 4: Beta Launch | [N weeks] | First 10 users onboarded |

**Target Ship Date**: [Date]

---

## Appendix

### Competitive Analysis
[If applicable, include competitor feature matrix]

### User Research
[If applicable, include interview notes, survey data]

### References
[Links to market research, technical docs, design inspiration]

```

---

## Phase 6: Validate & Refine

**Show the PRD to the user** and ask:

```
## ✅ PRD Draft Complete

I’ve generated a comprehensive PRD based on our conversation.

**Review it carefully**:
- Is anything missing?
- Is anything wrong?
- Is anything too vague?

**Once you approve**, I’ll save this PRD to `.agents/prd.md` and you can run:
  `/init-project` — to scaffold the full project using this PRD

**Want to refine it?** Tell me what to change and I’ll iterate.
```

---

## Phase 7: Save PRD

Once the user approves, write the PRD to `.agents/prd.md`.

Then tell the user:

```
✅ PRD saved to `.agents/prd.md`

Next step: Run `/init-project` and paste the PRD.

Manager will:
1. Research your market/competitors/tech stack
2. Ask setup questions (tools + budget)
3. Scaffold the full project
4. Create GitHub Issues for all tasks
5. Ground all decisions in research + your PRD

Ready to build?
```
