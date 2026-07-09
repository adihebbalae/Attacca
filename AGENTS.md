# Attacca (repo instructions for coding agents)

This repository is a Claude Code plugin marketplace — three plugins (`plugins/attacca-core`, `plugins/attacca-security`, `plugins/attacca-init`) and a minimal project template (`template/`). It is not an application; there is no build or test suite beyond `node scripts/validate-plugins.mjs`.

When editing:
- Skills/agents/hooks under `plugins/` are shipped product content — keep frontmatter valid, keep model references as tiers (`sonnet`, `haiku`), and preserve each skill's `Delete when:` line.
- Version bumps touch four places together: `.github/BOILERPLATE_VERSION`, each `plugin.json`, `marketplace.json`, and `CHANGELOG.md`.
- Design rationale lives in `docs/DESIGN-DECISIONS.md`; don't add process-style skills (see the context/verification razor there).
- Legacy v3 content is on branch `legacy/v3` — reference it, don't merge it.
