# Attacca

> *attacca* (Italian, musical direction) — "proceed to the next movement without pause."

**Multi-agent AI coding orchestrator for VS Code.**

One command. Full agent system. Manager plans, Engineer builds, Security audits, then you push — each movement flowing into the next without pause. That's Attacca.

---

## What It Does

AI-assisted development is most effective when specialized personas handle different responsibilities in sequence: one plans, one implements, one audits. Attacca sets up that entire system in any project and gives you a live control panel to conduct it.

The handoff is the core mechanic — when one agent finishes, it writes a structured handoff prompt, and the next agent picks it up immediately. *Attacca.* Proceed without pause.

---

## Features

### One-Command Initialization
Run **Attacca: Initialize Project** → 4-step wizard:
1. **AI Tool** — Copilot, Cursor, Claude Code, Codex CLI, Cline, Windsurf, Gemini, or Antigravity
2. **LLM Mode** — Cloud, Local (Ollama/LM Studio), or Hybrid
3. **Agent Complexity** — Full ensemble (7 agents) or Simplified trio (Manager + Engineer + Security)
4. **Skill Packs** — Engineering, Marketing, or both

Writes every config file your chosen tool needs: agent instructions, prompt templates, state tracking, handoff protocol, workspace map, and `.gitignore` — all pre-wired.

### Live Dashboard
A sidebar panel reads `.agents/state.json` in real time:
- Active agent and current phase
- Current task and assignment
- Blocked status with reason (amber warning)
- Handoff banner when approval is pending
- Security clearance status
- One-click agent buttons: Manager, Engineer, Security, Designer, Researcher, Consultant, Medic
- Quick actions: View State, Open Handoff, Pick Skill, Check Updates

### Status Bar
Two always-visible items at the bottom of VS Code:
- **Main** — active agent + phase (e.g., `Engineer · Phase 3`). Click → dashboard.
- **Blocked** — yellow background when `blocked_on` is set. Click → `state.json`.

### Agent Handoffs
Click any agent button in the dashboard. Copilot Chat opens pre-seeded with the correct handoff prompt — the next movement begins immediately. Falls back to clipboard if Copilot Chat isn't available.

### Skill Picker
**Attacca: Pick a Skill** — searchable list of every skill in `.github/skills/`. Select one to open its `SKILL.md` in the editor.

### Updater
**Attacca: Check for Updates** — compares your local version against GitHub, shows the changelog, patches only template files. Your `.agents/` state is never touched.

---

## Requirements

- VS Code 1.87.0+
- GitHub Copilot (recommended) or any AI chat panel

---

## Getting Started

### Install

1. Download `attacca-x.x.x.vsix`
2. Open VS Code → Extensions sidebar (`Ctrl+Shift+X`)
3. `···` menu → **Install from VSIX...** → select the file

Or:
```bash
code --install-extension attacca-x.x.x.vsix
```

### Initialize

1. Open any project folder
2. Command Palette (`Ctrl+Shift+P`) → **Attacca: Initialize Project**
3. Follow the 4-step wizard

Copilot Chat opens automatically with a quickstart prompt when done.

---

## Commands

| Command | Description |
|---|---|
| `Attacca: Initialize Project` | Run the setup wizard |
| `Attacca: Show Dashboard` | Open the sidebar panel |
| `Attacca: Switch Agent` | Quick-pick an agent to hand off to |
| `Attacca: Pick a Skill` | Browse and open skill files |
| `Attacca: Check for Updates` | Pull latest templates from GitHub |
| `Attacca: Open State File` | Jump to `.agents/state.json` |

---

## How It Works

```
User → Manager (plans) → Engineer (builds) → Security (audits) → push
         │                    │                    │
         └── handoff.md ──────┘── handoff.md ──────┘
```

Each agent has a role-specific instruction file (`.github/agents/*.agent.md`), prompt shortcuts (`.github/prompts/*.prompt.md`), and shared state. Handoffs flow through `.agents/handoff.md` — the outgoing agent writes it, the next agent reads it, and the movement continues.

**State files:**
- `.agents/state.json` — machine-readable project state (the dashboard reads this)
- `.agents/state.md` — human-readable summary
- `.agents/workspace-map.md` — file map so agents orient instantly
- `.agents/handoff.md` — current inter-agent handoff

---

## Supported Tools

| Tool | Config Written |
|---|---|
| GitHub Copilot | `.github/copilot-instructions.md`, `.github/agents/`, `.github/prompts/` |
| Cursor | `.cursor/rules/` |
| Claude Code | `CLAUDE.md`, `AGENTS.md` |
| Codex CLI | `AGENTS.md` |
| Cline | `.clinerules` |
| Windsurf | `.windsurfrules` |
| Gemini | `GEMINI.md` |
| Antigravity | `.antigravity/rules/` |

---

## The Name

In a musical score, *attacca* is the instruction written between movements: **proceed immediately to the next section without stopping.** That's exactly what this system does — one agent finishes, writes the handoff, and the next begins. No pause. No context loss. The work flows forward.

---

## License

MIT
