# Attacca 4.0 Plugin Architecture

Attacca ships as three Claude Code plugins from one marketplace (`/plugin marketplace add adihebbalae/Attacca`). Install what you need; each works standalone, together they form a loop.

## The loop

```
/interrogate  ──►  CONTEXT.md spec  ──►  plan mode  ──►  build
     ▲                                                    │
     │                                          /quality-gate · /code-review · critic
/wrap-session ◄──  session ends                           │
                                                 /security-audit ──► .attacca/audits/latest.md
                                                          │
                                        audit-gate hook unblocks `git push`
```

## attacca-core — workflow skills + hooks
- **Skills**: diagnose, tdd, code-review, quality-gate, karpathy-guidelines, prototype, grill-me, grill-with-docs, improve-codebase-architecture, llm-wiki, incident-response, to-issues, to-prd, caveman, zoom-out, wrap-session, bdr-commit.
- **Subagents**: `critic` (fresh-context quality review — over-engineering, slop, claims-vs-diff), `researcher` (isolated-context web research). Both `model: sonnet` — they read and judge; they don't need top-tier reasoning.
- **Hooks**: `read-once.mjs` (PreToolUse Read — blocks re-reading unchanged files, large token savings), auto-lint (PostToolUse Write/Edit).

## attacca-security — the gate
- **Skills**: security-audit (OWASP sweep), supply-chain (package gates, typosquatting), sbom.
- **Subagent**: `security-auditor` — invoked with **file paths only**, never implementation details or commit messages. The clean context is the adversarial advantage: it audits like an attacker, blind to intent.
- **Hook**: `audit-gate.mjs` (PreToolUse Bash) — blocks `git push` unless `.attacca/audits/latest.md` exists, ends with `VERDICT: CLEAN`, and postdates the last commit. Emergency bypass: `ATTACCA_SKIP_AUDIT=1`.
- **Reference**: `references/security-classifier.md` — SIMPLE/COMPLEX branch classification criteria.

## attacca-init — project intake
- **Skills**: interrogate (disambiguates vague build requests into a CONTEXT.md spec — the flagship), init-project (scaffold from spec), retrofit (adopt an existing repo), mvp (speed-first defaults), quickstart (onboarding pointer).
- Pairs with attacca-core; works standalone for intake alone.

## Where state lives
- **CONTEXT.md** (committed): spec, decisions, current focus — the cross-session, cross-machine, cross-person memory. See CONTEXT-SCHEMA.md.
- **Claude Code native auto-memory** (machine-local): everything else. Attacca deliberately has no other state — no state.json, no handoff files, no workspace map.
- **.attacca/** (project-local): generated artifacts only (audit reports, SBOMs). Commit or ignore per project taste.
