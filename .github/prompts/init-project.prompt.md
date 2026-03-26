---
description: "Initialize a new project from a PRD. Give the Manager your product requirements and it will scaffold the entire project pipeline."
agent: "manager"
argument-hint: "Paste your PRD or describe what you want to build"
---

The user is starting a new project. Your job:

1. Read the PRD or description provided below
2. Ask clarifying questions until there is ZERO ambiguity — interrogate endlessly
3. Once clear, scaffold the project:
   - Delete `.gitignore` (template version)
   - Rename `.gitignore.project` → `.gitignore` (project version)
   - Fill out `.agents/state.json` with the project plan, phases, and initial tasks
   - Update `.agents/state.md` with project overview
   - Update `.agents/workspace-map.md` with planned structure
   - Update `.github/copilot-instructions.md` with project-specific standards
   - Identify and list any MCPs, skills, or tools needed for this specific project
4. **GitHub Issues as task backlog** (see Step 4A below)
5. **MCP config generation** (see Step 4B below)
6. Present the full plan to the user for approval before proceeding

PRD / Description:
$ARGUMENTS

---

## Step 4A: Create GitHub Issues as Task Backlog

After the user approves the plan, create a GitHub Issue for each task using the GitHub CLI (`gh`):

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

---

## Step 4B: Auto-Generate MCP Config

Detect the tech stack from the PRD and generate the appropriate Context7 MCP config for library documentation.

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

## Step 4C: Web Search MCP (for Researcher Agent)

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

Merge the chosen server into the existing `.vscode/mcp.json` (alongside context7, not replacing it). If the user skips, the Researcher agent will still work using `browser` to visit known sources directly — just without broad search capability.

Add to `.github/copilot-instructions.md`:
```markdown
## Web Search MCP
- Search MCP: [provider name] — available to Researcher agent for market/competitive research
- Researcher agent: check `.vscode/mcp.json` for available search tools before defaulting to manual URL visits
```

Then, based on detected stack, add the relevant library hints to `.github/copilot-instructions.md`:

```markdown
## MCP Context (Auto-Generated)

Libraries in this project — use Context7 for up-to-date docs:
- [library-name]: use `use context7` to load latest docs
```

**Stack → library mapping:**

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

