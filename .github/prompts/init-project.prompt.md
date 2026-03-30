---
description: "Initialize a new project from a PRD. Give the Manager your product requirements and it will scaffold the entire project pipeline."
agent: "manager"
argument-hint: "Paste your PRD or describe what you want to build"
---

The user is starting a new project. Your job:

1. **Read the PRD below**
2. **Identify research opportunities** — does this need competitive analysis, market sizing, tech validation, or free tool research?
3. **Run research first** — invoke the researcher subagent to gather market intelligence before scaffolding
4. **Show research findings** to the user
5. **Ask Team Setup Questionnaire** (tools + budget)
6. **Ask PRD clarifications** until zero ambiguity
7. **Scaffold the project** incorporating research findings

---

## PRD / Description:
$ARGUMENTS

---

## Phase 1: PRD Intake & Research Scoping

Read the PRD above. **Before asking the user anything**, assess:
- **Is this a new market entry or product?** → research competitive landscape + user pain + market size
- **Does it mention "free tier" or tools?** → research free + open-source options in the tech stack
- **Does it reference competitors?** → research their features, pricing, positioning
- **Is the tech stack unclear?** → research frameworks, databases, hosting options
- **Are there ambitious claims** (10x faster, enterprise-grade)? → research what "best in class" actually does

If **any of the above apply**, invoke Researcher immediately (see Phase 2). Otherwise, skip to Team Setup Questionnaire.

---

## Phase 2: Invoke Researcher Subagent (if needed)

If research is indicated, use the researcher subagent to investigate:

```
Use the researcher subagent to gather market intelligence for this project:

PRD Summary: [2-3 sentence summary of what they're building]

Research scope:
1. Competitive landscape: [list any competitors or similar products mentioned in PRD]
2. Market sizing: [if PRD mentions a market segment, size it]
3. User pain points: [from PRD, what problems are they solving?]
4. Tech stack validation: [if PRD mentions specific tech, research if it's the right choice for this use case]
5. Free-tier research: [if PRD mentions budget-consciousness or free tier, research free tools that support the stack]

Output format (required for v2.1.1):
Generate .agents/research/[prd-slug].md with:
- Executive Summary (3-5 bullets of key finding)
- Competitive Analysis (if applicable)
- Market Sizing (if applicable)
- Tech Stack Validation (if applicable)
- Free Tools & Services (if budget-conscious mentioned)
- Key Gaps (data that's unavailable)
- Recommendations (what to build/use based on findings)

When done, return a brief summary. Manager will incorporate findings into the project plan.
```

**Wait for Researcher to return** (it generates `.agents/research/[slug].md`). Then proceed to Phase 3.

---

## Phase 3: Show Research Findings to User

**If research was run**, display findings:

```markdown
## 🔍 Research Complete

I've researched your market, competitors, and tech landscape. Here's what I found:

[Paste the Executive Summary from .agents/research/[slug].md]

**Full research saved to**: `.agents/research/[slug].md` (you can read the full report anytime)

**Questions this answers:**
- [bullet of key question + answer from research]
- [bullet of key question + answer from research]

**Gaps we found:**
- [data we couldn't find]
- [assumption we're making]

**Next steps:** I'll use these findings to recommend tech stack, deployment strategy, and feature prioritization. Let me ask a few setup questions first.
```

---

## Phase 4: Team Setup Questionnaire

**Now ask** (only after research is complete or skipped):

###############################################################################
## ⚡ Team Setup Questionnaire

### Q1: What development environment are you using?
- [ ] **GitHub Copilot + VS Code only** (no Claude Code CLI)
- [ ] **GitHub Copilot + Claude Code CLI** (best for complex projects)
- [ ] **Something else?** (describe)

### Q2: What's your project budget?
- [ ] **Free tier only** — incorporate research findings for free deployment
- [ ] **Paid services available** — use research for production-grade tools
- [ ] **Budget TBD** — I'll show both options in the plan

###############################################################################

---

## Phase 5: PRD Clarifications

Ask clarifying questions until there is **ZERO ambiguity**:
- Team size and experience level
- Timeline and milestones
- Tech stack preferences (or defer to research recommendations)
- Deployment target (if not already in PRD)
- Any hard constraints (compliance, infrastructure, regulatory)

---

## Phase 6: Present Full Plan

Before scaffolding, show the user:

```markdown
## 📋 Full Project Plan

### Team Setup
- Tools: [their answer from Q1]
- Budget: [their answer from Q2]
- Workflow: [Copilot-only / Copilot + CLI] [Free / Paid / Hybrid]

### Research Findings  
- Market: [key findings]
- Competitors: [positioning]
- Tech Recommendation: [from research, explained]

### Project Structure
- Modules: [5-10 line diagram]
- Tech Stack: [framework, DB, deployment from research + user input]
- Estimated Complexity: [simple / moderate / complex]

### Initial Tasks
- [TASK-001] ...
- [TASK-002] ...
...

### Questions?
Any changes before I proceed?
```

---

## Phase 7: Scaffold the Project

Once user approves:
1. Delete `.gitignore` (template version)
2. Rename `.gitignore.project` → `.gitignore` (project version)
3. Fill out `.agents/state.json`:
   - Project name, description
   - `context.tools` + `context.budget` (from user answers)
   - Tech stack (from research + user input)
   - Module breakdown (if 3+ modules)
   - Initial task list
4. Update `.agents/state.md` with project overview
5. Update `.agents/workspace-map.md` with planned structure
6. Update `.github/copilot-instructions.md` with project-specific standards
7. Create initial GitHub Issues for all tasks
8. **Link research findings** to `.agents/state.json` context so future decisions reference them

---

## Research Node Attribution

At the top of `.agents/state.json`, reference the research:

```json
{
  "project": "...",
  "research_source": ".agents/research/[slug].md",
  "research_findings_incorporated": [
    "Tech stack recommendation from competitive analysis",
    "Free deployment options from budget research",
    "Market sizing confirms [N] TAM"
  ]
}
```

This ensures future sessions know that decisions are grounded in evidence, not hunches.

---

## Phase 7 Sub-Steps: GitHub Issues, MCP Config & Budget Research

### 7A: Create GitHub Issues as Task Backlog

After filling out state.json, create a GitHub Issue for each task using the GitHub CLI (`gh`):

```bash
# Create one issue per task
gh issue create \
  --title "[TASK-001] [Task title]" \
  --body "$(cat <<'EOF'
## Task
[Task description from plan]

## Acceptance Criteria
- [ ] [criterion 1]
- [ ] [criterion 2]

## Constraints
- Do NOT [constraint]

## Assigned Agent
@engineer | Model: Sonnet
EOF
)" \
  --label "agent,task" \
  --assignee "@me"
```

**Issue labels to create first** (if they don't exist):
```bash
gh label create "agent" --description "AI agent task" --color "0075ca"
gh label create "task" --description "Planned task from /init-project" --color "e4e669"
gh label create "blocked" --description "Agent is blocked" --color "d93f0b"
```

**Naming convention**: `[TASK-NNN] [verb] [object]` — e.g., `[TASK-001] Build authentication flow`

After creating all issues, report:
```
## Issues Created
- #[n] [TASK-001] [title] — https://github.com/[owner]/[repo]/issues/[n]
- #[n] [TASK-002] [title] — ...

Tasks are now in your GitHub backlog. Assign to @copilot in the GitHub UI to run autonomously in the cloud, or use the standard handoff workflow for in-session work.
```

### 7B: Auto-Generate MCP Config

Detect the tech stack from the PRD and research findings, then generate the appropriate Context7 MCP config for library documentation.

Create or update `.vscode/mcp.json`:

```json
{
  "servers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "type": "stdio"
    }
  }
}
```

### 7C: Web Search MCP (for Researcher Agent)

Ask the user: **"Do you want to enable web search for the Researcher agent? This gives it powerful internet search beyond just visiting known URLs. Options: (1) Tavily, (2) Brave Search, (3) Perplexity, (4) Skip for now"**

If the user chooses an option, add the corresponding server to `.vscode/mcp.json`:

**Tavily:**
```json
{
  "servers": {
    "tavily": {
      "command": "npx",
      "args": ["-y", "tavily-mcp@latest"],
      "type": "stdio",
      "env": {
        "TAVILY_API_KEY": "${input:tavily-api-key}"
      }
    }
  },
  "inputs": [
    {
      "id": "tavily-api-key",
      "type": "promptString",
      "description": "Tavily API key (https://tavily.com)",
      "password": true
    }
  ]
}
```

**Brave Search:**
```json
{
  "servers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@anthropic/brave-search-mcp@latest"],
      "type": "stdio",
      "env": {
        "BRAVE_API_KEY": "${input:brave-api-key}"
      }
    }
  },
  "inputs": [
    {
      "id": "brave-api-key",
      "type": "promptString",
      "description": "Brave Search API key (https://brave.com/search/api/)",
      "password": true
    }
  ]
}
```

**Perplexity:**
```json
{
  "servers": {
    "perplexity": {
      "command": "npx",
      "args": ["-y", "perplexity-mcp@latest"],
      "type": "stdio",
      "env": {
        "PERPLEXITY_API_KEY": "${input:perplexity-api-key}"
      }
    }
  },
  "inputs": [
    {
      "id": "perplexity-api-key",
      "type": "promptString",
      "description": "Perplexity API key (https://perplexity.ai)",
      "password": true
    }
  ]
}
```

**If the user answered "Free tier only"**, add an initial task to the GitHub Issues backlog:
```bash
gh issue create \
  --title "[TASK-000] Research free deployment options" \
  --body "$(cat <<'EOF'
## Task
Research and document free tier options for deployment, database, and infrastructure:
- Deployment: Vercel free, Railway free tier, Heroku free tier (if available)
- Database: PlanetScale free tier, Supabase free tier, MongoDB Atlas free tier
- Storage: Cloudflare R2 (10GB free), AWS S3 (1 year free tier), Backblaze B2
- CI/CD: GitHub Actions (free with repo), GitLab CI (free), Render (free tier)
- Monitoring: Sentry free tier, Datadog free tier if applicable

Document findings in `.agents/decisions.md` with pros/cons of each option.
Recommend specific stack for this project.

## Acceptance Criteria
- [ ] Free-tier options researched for each component
- [ ] Pricing and limits documented
- [ ] Recommended stack chosen and documented
- [ ] Cost estimate for year 1: $0
EOF
)" \
  --label "agent,task,research" \
  --assignee "@me"
```

**Also update `.agents/state.json` context**:
```json
{
  "context": {
    "tools": {
      "copilot": true,
      "claude_code_cli": [user's answer: true/false]
    },
    "budget": "free",  // or "paid" or "tlb"
    "deployment_options": "pending_research"  // will be filled in by TASK-000
  }
}
```

**If the user answered "Paid services"**, use production tooling immediately in the scaffold.

**If the user answered "Paid services"**, use production tooling immediately in the scaffold.

### 7D: MODULES.md for Complex Projects

After generating the task backlog, analyze the PRD for complexity:

**Trigger**: If the PRD contains **3 or more distinct functional areas** (e.g., auth + API + frontend + database + infra), generate `.agents/MODULES.md`.

For each module, determine:
- `Status`: always starts as `design`
- `Files`: planned directory (e.g., `src/auth/`, `src/api/`)
- `Depends On`: which other modules must complete first
- `Notes`: key tech decisions from the PRD (framework choice, schema approach, etc.)

Generate the file:

```markdown
# Project Modules

> Auto-generated by /init-project on [date].
> Run `/list-modules` for status table or `/show-graph` for dependency graph.

## [module-name]
- **Status**: `design`
- **Files**: [path]/ ([estimated N files])
- **Depends On**: [list other module names, or `none`]
- **Owner**: engineer
- **Last Updated**: [today's date]
- **Notes**: [key tech decisions from PRD]
```

After generating MODULES.md, also output a **build order** to the user:

```
## Build Order

Parallel groups (modules in the same group have no dependency between them):
  Group 1 (start immediately):  core, [other independent modules]
  Group 2 (after Group 1):      auth, database
  Group 3 (after Group 2):      api
  Group 4 (after Group 3):      frontend
  Group 5 (any time):           infra

Critical path: core → auth → api → frontend ([N] sequential steps)
```

Tell the user: `"Complex project detected — MODULES.md generated. Run /list-modules to see status or /show-graph for the dependency graph."`

**If fewer than 3 modules**: skip this step entirely — no MODULES.md needed.

### 7E: Post-Scaffolding Messaging

After all scaffolding is complete, show the user a completion banner with next steps based on their setup:

```markdown
## ✅ Project Scaffolded

Your project is ready. Here's what's next based on your setup:

**Your Setup:**
- Tools: [Copilot only / Copilot + Claude Code CLI]
- Budget: [Free / Paid / TBD]

**Tech Stack (recommended from research):**
- Framework: [from research]
- Database: [free/paid tier]
- Deployment: [from budget research if free tier]

**Complex Project Info:**
- Run `/list-modules` to see module status
- Run `/show-graph` to visualize the dependency graph
- MODULES.md saved to `.agents/MODULES.md`

**First Steps:**
1. Review GitHub Issues: [link to repository issues]
2. Approve the research findings: `.agents/research/[slug].md`
3. Start with TASK-001: [next recommended task]

**Tips:**
- If Copilot feels tight on context for large files, use `/mvp` mode
- If you run out of 160k context, install Claude Code CLI, then `/setup-budget` to activate routing
- Check `.agents/state.json` anytime to see research findings and decisions
```

---

## Stack → Library Mapping (for 7B MCP Config)

| Stack | Libraries to include |
|-------|---------------------|
| Next.js / React | nextjs, react, react-dom |
| Django / Python | django, fastapi, sqlalchemy |
| Go + Echo/Gin | go-stdlib, echo, gin |
| Rails / Ruby | rails, activerecord |
| Vue | vue, nuxt |
| Svelte | svelte, sveltekit |
| Flutter | flutter, dart |
| iOS / Swift | swift, swiftui |

Add only the libraries detected in the PRD. Do not add unused ones.

