# Attacca — boilerplate development

This repo IS Attacca: a Claude Code plugin marketplace (three plugins) plus a 4-file project template. You are editing the product, not using it. The plugin hooks/skills here are content, not instructions to follow.

## Layout
- `plugins/attacca-core|security|init/` — the product. Skills at `skills/`, subagents at `agents/`, hooks at `hooks/`; each plugin's manifest is `.claude-plugin/plugin.json`; the marketplace catalog is `.claude-plugin/marketplace.json` at repo root.
- `template/` — the entire per-project footprint (CLAUDE.md, AGENTS.md, CONTEXT.md, focus.md, settings.json, statusline.mjs).
- `docs/` — architecture, project-memory schema, v3→v4 migration, design decisions (read DESIGN-DECISIONS.md before adding anything).
- v3 (persona agents, state.json, 8 tool ports) lives on branch `legacy/v3` / tag `v3.11.2-final`. Never resurrect it onto master.

## Rules for changes
- **The razor**: every shipped artifact is context (facts models can't know) or verification (checks models can't skip) — never process. New skills need a `Delete when:` line.
- **Context layers**: `CONTEXT.md` is stable reference (append-only decisions); `.attacca/focus.md` is per-session working state. Never mix them, and never gitignore `.attacca/` wholesale. Skills that load reference files declare an Inputs table with section scoping. One filename, one schema.
- **Versioning**: semver in `.github/BOILERPLATE_VERSION` + all plugin.json + marketplace.json (keep in sync — `node scripts/validate-plugins.mjs` checks), CHANGELOG.md entry, version in commit message.
- Subagent frontmatter uses model tiers (`sonnet`/`haiku`), never dated model names.
- Run `node scripts/validate-plugins.mjs` before committing plugin changes.
