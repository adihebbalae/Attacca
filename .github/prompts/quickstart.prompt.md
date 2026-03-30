---
description: "Interactive onboarding for first-time users. Explains the repo, walks through setup, and nudges you to start your first project with the full agent system."
agent: "manager"
---

You are running `/quickstart`. Your job is to onboard a new user who just cloned this template repo.

**Goal**: Get them from "What is this?" to "I just scaffolded my first project" in < 10 minutes.

---

## Step 1: Welcome & What Is This

Start with:

```markdown
# 👋 Welcome to Agent Boilerplate

**PRD → Research → Project.** You paste a product idea, and a multi-agent system researches the market, plans the build, writes the code, runs tests, and commits — all while you review.

This is an **orchestration layer** for GitHub Copilot. It coordinates 7 specialized agents:

| Agent | Role |
|-------|------|
| **Manager** (you’re talking to me now) | Plans, delegates, coordinates |
| **Engineer** | Writes code, runs tests, commits |
| **Security** | Audits for vulnerabilities before every push |
| **Designer** | Reviews UI/UX, provides design specs |
| **Researcher** | Competitive analysis, market intelligence |
| **Consultant** | Deep architectural reasoning (expensive, use sparingly) |
| **Medic** | Emergency incident response (SEV 1 only) |

---

## Why This vs Starting from Scratch?

**Without this system**:
- You: "Build me a SaaS app with auth and payments"
- Copilot: Generates code with bugs, no tests, hardcoded secrets, typosquatted packages, stale dependencies, no deployment plan
- You: Spend 3 weeks debugging, refactoring, and hardening

**With this system**:
- You: `/init-project` + paste PRD
- Manager: Researches competitors, asks clarifying questions, scaffolds project with GitHub Issues, MCP config, module registry, research-backed tech recommendations
- Engineer: Implements features with tests
- Security: Audits before every push (OWASP Top 10 + supply chain defense)
- You: Review, approve, ship — **production-ready in days, not weeks**

---

## What Makes This Different?

✅ **Research-first**: Every project starts with competitive/market/tech intelligence (not hunches)  
✅ **Supply chain security**: 4-gate defense prevents malware/typosquats  
✅ **Module-aware**: Complex projects (20+ files) get automatic module registry + context routing  
✅ **Budget-adaptive**: Free vs paid infrastructure researched automatically  
✅ **Multi-agent coordination**: Work gets routed to the right specialist (not a general chatbot)  
✅ **State persistence**: `.agents/state.json` tracks everything across sessions  
✅ **Dual-mode**: Works in GitHub Copilot (160k context) OR Claude Code CLI (1M context)  

---

Ready to set up your first project?
```

---

## Step 2: Tool Assessment

**Ask the user**:

```markdown
## ⚙️ Quick Setup Questions

### Q1: What tools do you have?
- [ ] **GitHub Copilot + VS Code** (you’re using this now — good start!)
- [ ] **Claude Code CLI** (optional — unlocks 1M context for complex projects)
- [ ] **Not sure / Just Copilot**

### Q2: Have you used AI coding assistants before?
- [ ] **First time** (I’ll explain everything)
- [ ] **Used Copilot/Cursor/etc.** (I’ll focus on what’s unique here)
- [ ] **Power user** (show me the advanced stuff)
```

Wait for their answer.

---

## Step 3: Tailored Walkthrough

**Based on their answers**, show the appropriate guide:

### If "First time" or "Just Copilot":

```markdown
## 🎯 Your First Project (5-Minute Walkthrough)

Let’s build something small to see how the system works.

### Option A: Guided PRD Builder
Don’t have a project idea yet? I’ll interview you and we’ll build a PRD together.

**Run**: `/prd-builder`

I’ll ask Socratic questions until we have a complete PRD. Then we’ll use it to scaffold a full project.

---

### Option B: Start with a Simple Idea
Already know what you want to build? Let’s start.

**Run**: `/init-project`  
**Then paste**: A 3-5 sentence description of what you want to build.

Example:
```
Build a URL shortener SaaS.
- Users can shorten long URLs
- Track click analytics
- Free tier (1000 links) + paid tier (unlimited)
- Deploy to Vercel free tier
```

Manager will:
1. 🔍 Research competitors (bit.ly, TinyURL, etc.)
2. ⚙️ Ask setup questions (tools + budget)
3. 📝 Generate full project plan
4. ✅ You approve
5. 🚀 System scaffolds everything (GitHub Issues, tech stack, module breakdown)

---

### Common Commands You’ll Use

| Command | When to Use |
|---------|-------------|
| `/init-project` | Start a new project from a PRD |
| `/prd-builder` | Build a PRD from scratch (Socratic method) |
| `/mvp` | Max velocity mode (fast iteration, deferred gates) |
| `/list-modules` | See module status (complex projects only) |
| `/setup-budget` | Change your tools/budget settings |
| `/quickstart` | You’re here now! Re-run anytime |

**Pro tip**: After scaffolding, Manager spawns Engineer and Security agents automatically. You just review and approve.

---

### What Happens Behind the Scenes

1. **Manager reads your PRD** → identifies research needs
2. **Researcher agent** → gathers competitive/market/tech intel (saved to `.agents/research/`)
3. **Manager shows findings** → you see evidence before decisions
4. **Manager asks clarifications** → resolves ambiguity
5. **Manager scaffolds project**:
   - Creates `.agents/state.json` (project state)
   - Creates `.agents/MODULES.md` (if 3+ modules)
   - Creates GitHub Issues for all tasks
   - Generates MCP config (Context7 for library docs)
6. **Engineer implements** → writes code + tests
7. **Security audits** → checks for vulns before push
8. **Manager pushes** → only after Security approval

**You control the loop**: Review, approve, or request changes at any step.

---

Ready to try it? Pick Option A (guided) or Option B (direct) above.
```

---

### If "Used Copilot/Cursor/etc.":

```markdown
## 🚀 What’s Different Here (For Experienced Users)

You’ve used AI assistants before. Here’s what this system adds:

### 1. Research-First Scaffolding
**Other tools**: You describe what to build → AI generates code  
**This system**: PRD → Researcher gathers market intel → Tech stack recommendations grounded in evidence → Then scaffold

**Why it matters**: Prevents expensive pivot-backs mid-project. "Should we use PostgreSQL or MongoDB?" is answered with competitive analysis, not hunches.

---

### 2. Multi-Agent Specialization
**Other tools**: One generalist model does everything  
**This system**: 7 specialized agents with enforced context isolation

- **Security agent** audits cold (no implementation context) — adversarial advantage
- **Engineer** can’t add packages without Manager approval — supply chain defense
- **Consultant** (Opus) only invoked for deep architectural reasoning — cost control

---

### 3. State Persistence Across Sessions
**Other tools**: Every chat starts from zero  
**This system**: `.agents/state.json` + `.agents/MODULES.md` track everything

- Come back 3 weeks later → Manager knows exactly where you left off
- Module dependencies tracked → knows what’s blocked vs ready
- Research findings referenced → future decisions grounded in original evidence

---

### 4. Supply Chain Security (4-Gate Defense)
**Other tools**: Copilot suggests packages, you install them  
**This system**:
1. Manager pre-approves dependencies before Engineer sees them
2. Engineer forbidden from adding unapproved packages
3. Quality gate catches HIGH/CRITICAL CVEs
4. Security agent reviews SBOM before any push with dependency changes

**Prevents**: Typosquatting, abandoned packages, malicious deps

---

### 5. Complex Project Mode (3+ Modules)
**Other tools**: Context window fills up around 20 files  
**This system**: Module registry + intelligent routing

- `MODULES.md` tracks dependencies (auth → api → frontend)
- Manager routes small tasks to Copilot (160k), large tasks to Claude Code CLI (1M)
- Parallel build groups identified automatically

---

### Commands You’ll Use Most

| Command | Use Case |
|---------|----------|
| `/init-project` | Scaffold new project (research-first) |
| `/mvp` | Velocity mode (parallel Engineer sessions, deferred gates) |
| `/list-modules` | See what’s blocked vs ready (complex projects) |
| `/show-graph` | ASCII dependency graph + critical path |
| `/quality-gate` | Pre-push gate (lint → type → test → security) |
| `/hotfix` | SEV 1 incident response (Medic agent) |

---

### Try It: Scaffold a Real Project

Run `/init-project` with a PRD for something you’ve been meaning to build.

Manager will:
- Research competitors automatically
- Ask tools + budget questions
- Generate full module breakdown (if complex)
- Create GitHub Issues for every task
- Show you the build order (parallel groups + critical path)

Then Engineer executes while Security audits. You just review.

**Difference**: This isn’t autocomplete. It’s orchestrated multi-agent project execution.
```

---

### If "Power user":

```markdown
## ⚡ Advanced Features (Power User Mode)

### 1. Subagent Orchestration (v2.0)
Manager spawns worker agents autonomously. No manual copy-paste handoffs.

**How**: After PRD approval, Manager uses `runSubagent` to spawn Engineer, Security, etc.  
**Break conditions**: 3 Engineer retries → escalate to user. CRITICAL security finding → halt queue.  
**Anti-bias**: Security gets ONLY file list (no implementation context) — enforced context isolation.

---

### 2. Context Budget Routing (v2.1)
Manager checks task scope and routes intelligently:

```
≤3 files, 1 module      → Copilot subagent (160k)
4-10 files, 2 modules   → Copilot + /compact checkpoint
10+ files, 3+ modules   → Claude Code CLI (1M)
Cross-module changes    → Claude Code CLI
```

**Enable**: Answer "Yes" to "Do you have Claude Code CLI?" in `/init-project` or `/setup-budget`.

---

### 3. Module Dependency Graph (v2.1)
For projects with 3+ modules, Manager generates `MODULES.md`:

```markdown
## auth
- Status: complete
- Depends On: core

## api
- Status: blocked
- Depends On: auth, database
```

**Commands**:  
`/list-modules` — status table  
`/show-graph` — ASCII graph + parallel build groups + critical path

**Auto-checkpoint**: After every Engineer commit, Manager updates status → identifies newly unblocked modules.

---

### 4. Research Attribution (v2.2)
Every project starts with research. Findings saved to `.agents/research/[slug].md`.

**state.json references it**:
```json
{
  "research_source": ".agents/research/url-shortener-saas.md",
  "research_findings_incorporated": [
    "Tech stack: Next.js recommended over React+Express (competitor analysis)",
    "Free deployment: Vercel free tier supports this use case"
  ]
}
```

Future sessions know WHY decisions were made.

---

### 5. Budget-Aware Scaffolding (v2.1.1)
Answer "Free tier only" in setup → Manager adds research task for free infrastructure:
- Deployment: Railway free, Vercel free
- Database: PlanetScale free, Supabase free
- Storage: Cloudflare R2 (10GB free)

All recommendations come with pricing/limits documented.

---

### 6. MVP Mode
`/mvp` activates velocity-first behavior:
- Max 3 clarifying questions (assume the rest)
- Scope frozen (reject all additions)
- Designer handoff skipped
- Security audit deferred
- Parallel Engineer sessions recommended
- Quality gate: lint + basic test only (no full scan)

Upgrade to production mode: set `"mode": "production"` in state.json.

---

### 7. Supply Chain Defense
4-gate system prevents dependency attacks:
1. Manager pre-approves all packages
2. Engineer can’t install unapproved deps
3. Quality gate runs `npm audit` / `pip-audit`
4. Security reviews SBOM on any dep change

**30-day package age policy**: All new deps must be ≥30 days old (exception: security patches).

---

### Skill System
Specialized workflows in `.github/skills/`:

- `tdd` — RED → GREEN → REFACTOR enforcement
- `quality-gate` — pre-push 4-stage gate
- `security-audit` — OWASP Top 10 checklist
- `supply-chain` — standalone dependency defense
- `code-review` — on-demand review checklist
- `sbom` — native SBOM generation via syft/cdxgen
- `product-research` — ICP, TAM/SAM/SOM, JTBD, GTM
- `incident-response` — SEV 1 runbooks

Manager auto-suggests skills based on context.

---

### State Files (Never Proliferate)
5 canonical files — nothing else:
1. `.agents/state.json` — machine state
2. `.agents/state.md` — human dashboard
3. `.agents/workspace-map.md` — file structure
4. `.agents/handoff.md` — inter-agent prompts
5. `.agents/MODULES.md` — module registry (complex projects)

If it’s not in these 5 files, it doesn’t exist.

---

### Try Advanced Workflow

1. Run `/prd-builder` — build a complex PRD (Socratic method)
2. Run `/init-project` — watch research phase + module breakdown
3. Let system scaffold + execute
4. Run `/list-modules` mid-project — see dependency unblocking
5. If context gets tight, `/setup-budget` → enable Claude Code CLI
6. Run `/show-graph` — visualize build order

You’re orchestrating 7 agents. Not writing code manually.
```

---

## Step 4: Nudge to Action

**End with**:

```markdown
---

## 🚀 Ready to Build?

Pick one:

**A) Build a PRD from scratch**  
Run: `/prd-builder`  
I’ll interview you Socratically, then generate a complete PRD.

**B) Start with an existing idea**  
Run: `/init-project`  
Paste a 3-5 sentence description or a full PRD.

**C) Explore commands**  
Run: `/meta`  
Ask me anything about the framework.

---

**What happens next**:
1. Manager researches your market/competitors/tech
2. Shows you findings (evidence-backed recommendations)
3. Asks setup questions (tools + budget)
4. Scaffolds full project (GitHub Issues, MCP config, modules)
5. Engineer + Security execute while you review

**Time to first commit**: ~10 minutes after PRD approval.  
**Time to production-ready**: Hours (not weeks).

Let’s ship something.
```
