# Migrating a project from Attacca v3 to v4

v4 is a breaking redesign: the clone-a-boilerplate model and the Manager/Engineer orchestration are gone, replaced by three plugins and one committed context file. v3 lives forever on the `legacy/v3` branch (tag `v3.11.2-final`).

## Concept mapping

| v3 | v4 |
|---|---|
| Clone template, cherry-pick files | `/plugin marketplace add adihebbalae/Attacca` + `/plugin install` |
| `.agents/state.json`, `state.md` | `CONTEXT.md` (committed, human-readable) |
| `.agents/workspace-map.md` | deleted — native search + memory |
| `.agents/handoff.md`, handoff prompts | deleted — native subagents / agent teams |
| Manager / Engineer / Designer / Medic / Consultant personas | deleted — main loop + plan mode |
| Security agent + "never push without audit" protocol rule | `security-auditor` subagent + audit-gate **hook** (enforced, not requested) |
| Critic agent (Copilot-only) | `critic` subagent (attacca-core) |
| `/prd-builder`, setup questions | `/interrogate` |
| `/update-boilerplate` | plugin updates via marketplace |
| Skills duplicated across `.claude/`, `.github/`, `.agents/`, per-tool dirs | one copy, inside a plugin |
| Cursor/Cline/Windsurf/Gemini/Kiro/Antigravity ports | one `AGENTS.md` (read natively by 30+ tools) |

## Steps for an existing v3 project

1. Install the plugins (marketplace add + install attacca-core, attacca-security, attacca-init).
2. Create `CONTEXT.md` from your v3 state: `## Project` from the PRD, `## Key Decisions` from `state.json` history / BDR commits, `## Current Focus`/`## Next Steps` from `state.md`. Or ask Claude: "read .agents/state.json and .agents/state.md and generate CONTEXT.md per the attacca schema".
3. Delete `.agents/` (after step 2), `.github/agents/`, `.github/prompts/`, `.cursor/`, `.clinerules/`, `.windsurfrules`, `.gemini/`, `GEMINI.md`, `ANTIGRAVITY.md`, and per-tool skill copies.
4. Replace your project `CLAUDE.md` with the v4 template (`template/CLAUDE.md`), keep an `AGENTS.md` (template provided), port any project-specific rules into it.
5. Commit. Run `/security-audit` once so the push gate has a report.
