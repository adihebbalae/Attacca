# Attacca

<p align="center"><em>attacca (Italian) — proceed to the next movement without pause.</em></p>

**A context-engineering toolkit for Claude Code.** Three plugins that add what the model can't provide for itself: the questions your project needs answered before building, and the gates it can't skip before shipping.

Attacca 4.0 ships nothing the model already knows how to do. Every artifact is either **context** (interrogation frameworks, decision records) or **verification** (hooks, audits, gates) — see [docs/DESIGN-DECISIONS.md](docs/DESIGN-DECISIONS.md).

## Install

```
/plugin marketplace add adihebbalae/Attacca
/plugin install attacca-core@attacca
/plugin install attacca-security@attacca
/plugin install attacca-init@attacca
```

Install only what you need — each plugin works standalone.

| Plugin | What it adds |
|---|---|
| **attacca-core** | Workflow skills (diagnose, tdd, code-review, quality-gate, prototype, grill-me, wrap-session, bdr-commit, more), `critic` + `researcher` subagents, token-saving read-once hook, auto-lint hook, context-budget advisory hook |
| **attacca-security** | Security-audit / supply-chain / SBOM skills, an isolated-context `security-auditor` subagent, and a hook that **blocks `git push` until a fresh clean audit exists** |
| **attacca-init** | `/interrogate` — turns "build me a webstore with stripe and auth" into structured questions (auth, payments, data, hosting, budget, non-goals) and a committed `CONTEXT.md` spec — plus init-project, retrofit, mvp |

## Start a project

```bash
mkdir my-app && cd my-app && git init && claude
```

Then: install the plugins, describe what you want to build, and `/interrogate` fires on anything ambiguous. Answers become `CONTEXT.md` — the committed file every future session (and teammate, and cloud agent) reads to orient. End sessions with `/wrap-session` to keep it current.

For the minimal per-project files (CLAUDE.md, AGENTS.md, CONTEXT.md skeleton, settings.json, statusline.mjs), copy [`template/`](template/) — five small files, that's the whole footprint. `settings.json` wires the statusLine to `statusline.mjs`, which feeds attacca-core's context-watch hook so the model can see its own context/rate-limit budget and flag it instead of quietly rotting or reflex-compacting. Existing codebase? Run `/retrofit`.

## Using another tool?

`template/AGENTS.md` is the [cross-tool standard](https://agents.md) read natively by Copilot, Cursor, Codex, and 30+ agents (Claude Code loads it via the `@AGENTS.md` import in CLAUDE.md). That one file is Attacca's entire multi-tool story — the v3 per-tool ports live on the [`legacy/v3`](../../tree/legacy/v3) branch.

## Docs

- [Plugin architecture](docs/PLUGIN-ARCHITECTURE.md) — what's in each plugin and how they loop together
- [CONTEXT.md schema](docs/CONTEXT-SCHEMA.md) — the project-memory convention
- [Migrating from v3](docs/MIGRATION-v3-to-v4.md) — state.json → CONTEXT.md, personas → subagents
- [Design decisions](docs/DESIGN-DECISIONS.md) — why 4.0 looks like this

## Version

`v4.2.0` — see [CHANGELOG.md](CHANGELOG.md). v3.11.2 (the multi-tool boilerplate era) is preserved at tag `v3.11.2-final`.

---

*Built with [Attacca](https://github.com/adihebbalae/Attacca)*
