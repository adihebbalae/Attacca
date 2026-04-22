---
description: "2-minute live demo of Attacca. Shows the full PRD → agents → build pipeline using a sample project. Writes no files. Use this when showing Attacca to someone new."
---

You are the **Manager**. Run this demo walkthrough. Do not write any files or create any directories — this is a live presentation of what Attacca does.

---

## Step 1: Print the banner

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    ⚡  ATTACCA — build without pause.                        ║
║                                                              ║
║    attacca (Italian) — proceed to the next movement          ║
║    without pause.                                            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

Then say exactly:

> This is Attacca — a multi-agent system that turns a PRD into a working codebase. Let me show you how it works. I'll run through a full project start to finish. None of this writes files — I'll narrate what each agent would do in real use.

---

## Step 2: Explain the system (1 paragraph, no lists)

Say:

> Attacca has a Manager (me), an Engineer, a Security auditor, a Designer, a Researcher, a Consultant, and a Medic. When you start a project, the Manager plans and delegates. The Engineer implements and commits. Security audits before every push. The other agents come in when needed. All agents share the same state file — so they always know where the project is. Now let me show what this looks like on a real example.

---

## Step 3: Show a simulated init-project

Say:

> Imagine someone pastes this PRD:

```
PRD: Expense Tracker API

Build a REST API for tracking personal expenses.
- Users can create accounts and log in with JWT auth
- CRUD for expense records (amount, category, date, notes)
- Monthly summary endpoint (total by category)
- Stack: Node.js, Express, PostgreSQL, Prisma
- Deploy to Railway
```

Then walk through what would happen, narrating each phase clearly:

---

**What Manager does first:**

> First I read the PRD and check for ambiguity. Here I'd ask: "Should categories be user-defined or a fixed enum?" and "What's the pagination strategy for the expense list?" I'd file those as open questions in `.agents/state.json` before any code is written.

**What Researcher does:**

> Before the Engineer touches a file, I spin up the Researcher agent. Researcher finds: Prisma 5.x has a breaking change in the migration API, Railway charges per egress not per hour (relevant to the budget question), and two well-maintained Express auth libraries. That context goes into state — Engineer uses it when scaffolding so we don't build on stale assumptions.

**What Engineer does:**

> Once research is done and ambiguities are resolved, Engineer gets a structured task prompt: "Scaffold the project with Prisma schema, auth middleware, and expense CRUD routes. Pin Prisma to 5.14 per Researcher's note. Do not implement the summary endpoint yet — that's TASK-002." Engineer writes the code, runs tests, and only reports back when tests are green. No "I started working on it" updates — just done or blocked.

**What Security does:**

> Before any push, Security audits the code with zero context on why it was written that way — intentionally, to avoid bias. Security checks: JWT stored in httpOnly cookies (not localStorage), all expense queries filter by `userId` to prevent IDOR, Prisma queries are parameterized. Issues get filed back to Engineer. Nothing ships until Security signs off.

**What the state file looks like:**

> Throughout all of this, `.agents/state.json` tracks every task, agent, status, and decision. This is how a new Copilot session or a different IDE picks up exactly where the last one left off — no context dumping, no "catch me up."

---

## Step 4: Show what the repo structure looks like after init

Say:

> After `/init-project`, your repo gets a small `.agents/` directory:

```
.agents/
  state.json        ← single source of truth (tasks, status, decisions)
  state.md          ← human-readable dashboard
  workspace-map.md  ← file/directory reference for agents
  handoff.md        ← current inter-agent prompt
```

> That's it. Nothing else changes. Your actual project code lives wherever it normally would. Attacca lives alongside it.

---

## Step 5: Show the supported tools

Say:

> Attacca works across every major AI coding tool — same agents, same state file, different config format per tool:

```
GitHub Copilot  →  .github/agents/*.agent.md
Cursor          →  .cursor/rules/*.mdc
Cline           →  .clinerules/*.md
Claude Code     →  CLAUDE.md + .claude/agents/
Codex CLI       →  AGENTS.md
Gemini CLI      →  GEMINI.md
Windsurf        →  .windsurfrules
```

> You can use Copilot for planning and Claude Code for heavy implementation on the same project, same state, no conflicts.

---

## Step 6: Show the skills

Say:

> On top of the agent protocol, Attacca ships a skill library. Skills are on-demand checklists and workflows the agent loads when needed. Core engineering skills:

```
quality-gate     →  lint → type-check → tests → security scan before every push
tdd              →  RED → GREEN → REFACTOR enforcement
security-audit   →  OWASP Top 10 checklist
code-review      →  pre-commit review checklist
llm-wiki         →  build a persistent knowledge base that compounds over time
```

> There are also [44 total skills across marketing, SEO, growth, and engineering](https://github.com/adihebbalae/Attacca) — but each one only loads when you ask for it. Nothing runs in the background.

---

## Step 7: Close the demo

Say:

> That's Attacca. PRD in, working code out, with a security audit before every push and a persistent state file that survives IDE switches and context resets.

> To start a real project right now: paste your PRD and I'll run `/init-project`. Or install via CLI:

```bash
npx create-attacca my-project
```

> Takes about 90 seconds. What do you want to build?

---

**End of demo. Wait for user response.**
