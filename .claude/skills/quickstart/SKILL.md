---
name: quickstart
description: "Onboarding guide for new users. Assesses what tools they have (Claude Code, GitHub Copilot, both), explains the agent system based on their experience level, and points them to their first action. Run this first if you're new to the boilerplate."
---

# Quickstart Skill

## When to Use
- User runs `/quickstart`
- User is new to this boilerplate and wants orientation
- User asks "how do I get started?" or "what do I do first?"

---

## Step 1: Welcome

```
Welcome to Attacca — a multi-agent development system built on top of Claude Code.

Here's the model: you talk to the Manager (that's me). I plan, delegate, and
coordinate. I never write application code. Instead, I spawn specialized subagents:

  Engineer  → writes code, runs tests, commits
  Security  → audits before any push
  Designer  → reviews UI/UX
  Researcher → competitive and market research
  Consultant → architecture decisions when Engineer is blocked

Let me figure out the right starting point for you.
```

---

## Step 2: Tool Assessment

Ask in a single message:

```
Two quick questions:

1. What are you using?
   A) Claude Code only (CLI / IDE extension / desktop app)
   B) GitHub Copilot only
   C) Both

2. What are you starting with?
   A) A new project idea
   B) An existing codebase I want to add this system to
   C) I want to explore / understand the system first
```

Wait for the user's answer. Tailor the rest of the walkthrough based on their response.

---

## Step 3: Tailored Walkthrough

### If: New user, Claude Code, new project

```
Perfect setup. Here's the flow:

  /prd-builder  → I'll ask questions until we have a complete PRD
  /init-project → Reads your PRD, runs research, scaffolds the plan
                  Then spawns an Engineer to start TASK-001

For a fast MVP instead of production-grade scaffolding:
  /mvp  → Aggressive parallelization, scope locked, ships fast

Quick orientation on what you'll find here:
  .agents/state.json  → machine state, task queue, active task
  .agents/state.md    → human-readable dashboard
  .agents/handoff.md  → what the current Engineer is working on
  CLAUDE.md           → project conventions and rules

You never need to touch these manually — I manage them.
```

### If: New user, Claude Code, existing project

```
Use /retrofit to wire up the agent system without touching your source code.

It will:
  → Audit your project structure, build commands, and deployment pipeline
  → Ask your preferred scope (full integration / selective / advisory-only)
  → Generate a step-by-step retrofit plan
  → Generate a customized CLAUDE.md section for your stack

What does NOT change:
  → Your source code
  → Your existing tests
  → Your deployment pipeline
  → Your existing GitHub Actions workflows

Run: /retrofit
```

### If: New user, GitHub Copilot only

```
You're using the Copilot side of this system. The same agent roles apply,
but the mechanics are different:

  - Open the Copilot Chat panel
  - Use @manager, @engineer, @security as named agents
  - Slash commands: /init-project, /mvp, /update-boilerplate, etc.

The agent files live in .github/prompts/ — each is a .prompt.md file
that Copilot loads when you use the corresponding slash command or @agent.

To get started: open Copilot Chat → type /init-project
```

### If: New user, both tools

```
Both tools are wired up. The recommended split:

  Claude Code   → active development sessions (Engineer, Security, Parallelize)
  GitHub Copilot → inline code suggestions, quick single-file questions

For project planning and agent orchestration, Claude Code gives you
more control (parallel subagents, state management, audit trails).

Start here: /prd-builder or /init-project in Claude Code.
```

### If: Exploring / wants to understand the system

```
Here's the mental model:

  Manager (you're talking to me now)
    ↓ spawns
  Engineer → Security → (push)
                ↓ if 2+ parallel branches
  /audit-prs → classifies each as SIMPLE or COMPLEX → human merges

State lives in .agents/state.json. Every task flows through:
  Planning → Handoff → Engineer codes → Security audits → Push

Key skills:
  /init-project    → full project scaffold from a PRD
  /mvp             → fast MVP mode, aggressive parallelization
  /parallelize     → fan out 2+ independent tasks to parallel Engineers
  /audit-prs       → parallel Security review across branches
  /retrofit        → add the system to an existing project
  /prd-builder     → Socratic PRD interview before /init-project
  /update-boilerplate → sync to the latest boilerplate version

The full protocol is in .github/agents/manager.agent.md.
```

---

## Step 4: Nudge to Action

End every path with a clear next step:

**New project**:
```
Ready? Run: /prd-builder
(or /mvp if you want to skip planning and ship fast)
```

**Existing project**:
```
Ready? Run: /retrofit
```

**Exploring**:
```
When you're ready to start a project: /prd-builder
To explore the state files now: read .agents/state.md
```

Do not scaffold, write files, or start any tasks. Quickstart is orientation only.
