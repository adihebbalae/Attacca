# CONTEXT.md — schema and rules

`CONTEXT.md` is the project's committed memory: the one file a fresh session, a teammate, or a cloud agent reads to orient. It replaces v3's `state.json` + `state.md` + `workspace-map.md` with something both humans and agents actually read.

## Schema

```markdown
# Project Context
Last updated: 2026-07-08

## Project
What this is, why it exists, who uses it. 2-4 sentences.

## Stack
Languages, frameworks, DB, hosting, auth/payment providers.

## Key Decisions
- Chose X over Y because Z. (append-only; one bullet per decision, rejected alternative named)

## Current Focus
What is being built right now.

## Next Steps
Queued work in order. Pruned when stale.

## Blockers
Waiting-on-human or external items. "None" if clear.
```

## Rules
- **Committed**, always — its whole value is surviving clones and machines.
- **Under ~100 lines.** It's a bookmark, not a journal. If it scrolls, prune.
- **Never duplicate git history** — no file-change lists, no "what we did" narration. Decisions and direction only.
- **Key Decisions is append-only** — a decision that changed gets a new entry superseding the old, so the reasoning trail survives.
- Maintained by `/wrap-session` at session end and `/interrogate` at project start; edit by hand freely.

## Division of labor with native memory
Claude Code's auto-memory (machine-local) remembers *your* habits and the codebase's quirks. CONTEXT.md remembers *the project's* intent and decisions. If a fact must survive a `git clone` onto a fresh machine, it belongs in CONTEXT.md; otherwise let native memory handle it.
