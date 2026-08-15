# Attacca 4.0 Plugin Architecture

Attacca ships as three Claude Code plugins from one marketplace (`/plugin marketplace add adihebbalae/Attacca`). Install what you need; each works standalone, together they form a loop.

## The loop

```
/interrogate  ──►  CONTEXT.md  +  .attacca/focus.md  ──►  plan mode  ──►  build
     ▲             (stable)        (per-session)                        │
     │                                          /quality-gate · /code-review · critic
/wrap-session ◄──  session ends                           │
                                                 /security-audit ──► .attacca/audits/latest.md
                                                          │
                                        audit-gate hook unblocks `git push`
```

## attacca-core — workflow skills + hooks
- **Skills**: diagnose, tdd, code-review, quality-gate, karpathy-guidelines, prototype, grill-me, grill-with-docs, improve-codebase-architecture, llm-wiki, incident-response, to-issues, to-prd, caveman, zoom-out, wrap-session, bdr-commit.
- **Subagents**: `critic` (fresh-context quality review — over-engineering, slop, claims-vs-diff), `researcher` (isolated-context web research). Both `model: sonnet` — they read and judge; they don't need top-tier reasoning.
- **Hooks**: `read-once.mjs` (PreToolUse Read — blocks re-reading unchanged files, large token savings), auto-lint (PostToolUse Write/Edit), `context-watch.mjs` (UserPromptSubmit — reads the usage snapshot teed by `template/statusline.mjs` and advises the model when context or rate-limit usage crosses a threshold; never runs `/clear`/`/compact` itself).

## attacca-security — the gate
- **Skills**: security-audit (OWASP sweep), supply-chain (package gates, typosquatting), sbom.
- **Subagent**: `security-auditor` — invoked with **file paths only**, never implementation details or commit messages. The clean context is the adversarial advantage: it audits like an attacker, blind to intent.
- **Hook**: `audit-gate.mjs` (PreToolUse Bash) — blocks `git push` unless `.attacca/audits/latest.md` exists, ends with `VERDICT: CLEAN`, and postdates the last commit. Emergency bypass: `ATTACCA_SKIP_AUDIT=1`.
- **Reference**: `references/security-classifier.md` — SIMPLE/COMPLEX branch classification criteria.

## attacca-init — project intake
- **Skills**: interrogate (disambiguates vague build requests into a CONTEXT.md spec — the flagship), init-project (scaffold from spec), retrofit (adopt an existing repo), mvp (speed-first defaults), quickstart (onboarding pointer).
- Pairs with attacca-core; works standalone for intake alone.

## Where state lives

Two committed files, split by rate of change (the Layer 3 / Layer 4 distinction — see CONTEXT-SCHEMA.md):

- **CONTEXT.md** (committed, repo root): project, stack, append-only decision trail. Stable reference; the model should read it as constraints.
- **.attacca/focus.md** (committed): current focus, next steps, blockers. Per-session working state; rewritten by `/wrap-session` every time.
- **Claude Code native auto-memory** (machine-local): everything else. Attacca deliberately has no other state — no state.json, no handoff files, no workspace map.
- **.attacca/audits/**, **.attacca/sbom/**, **.attacca/validation/** (project-local): generated artifacts. Commit or ignore per project taste.

Everything a skill generates lives under `.attacca/`, one convention rather than one per skill. **Never gitignore `.attacca/` wholesale** — that silently drops `focus.md` from the repo, which is the one file in there a teammate needs on clone. Ignore the generated subdirectories individually.

## Reading contract

Skills that load reference files declare an **Inputs table** — which file, which sections, and why — before their process. Section-scoping matters: a stage that needs 40 lines of a 160-line reference should say so rather than pulling the whole file, because every irrelevant token in the window competes with the ones that matter ([Liu et al., *Lost in the Middle*](https://arxiv.org/abs/2307.03172)). The table is also the audit surface: you can read what a skill will load without running it.
