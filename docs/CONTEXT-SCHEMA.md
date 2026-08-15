# CONTEXT.md + focus.md — schema and rules

Attacca's committed project memory is **two files split by rate of change**:

| | `CONTEXT.md` (repo root) | `.attacca/focus.md` |
|---|---|---|
| Holds | Project, Stack, Key Decisions | Current Focus, Next Steps, Blockers |
| Changes between sessions | Rarely | Every session |
| Edit mode | Append-only | Rewritten wholesale |
| Model should | Internalise as constraints | Process as the current task |
| Budget | ~100 lines | ~30 lines |
| In short | **the score** | **a performance** |

Both are committed. Together they replace v3's `state.json` + `state.md` + `workspace-map.md` with something both humans and agents actually read.

## Score and performance

*Attacca* is a musical instruction: proceed to the next movement without pause. The two files are what make that possible across sessions, and the same vocabulary tells you which file anything belongs in.

**`CONTEXT.md` is the score.** What the piece *is* — its shape, its constraints, every decision about how it's meant to go. Written once, amended deliberately, authoritative over every performance.

**`.attacca/focus.md` is a performance.** One session's rendering: where you got to, what's next, what stopped you. Complete in itself and superseded by the next one.

Three rules fall out of that, and they're the whole discipline:

1. **A performance never edits the score.** `/wrap-session` rewrites `focus.md` wholesale and *appends* to `CONTEXT.md` only when a decision was actually made. A session that merely did work leaves the score untouched.
2. **You can lose a performance. You cannot lose the score.** Hence the append-only decision trail, and hence never gitignoring `.attacca/` wholesale. Git history can reconstruct what changed; nothing can reconstruct what was rejected and why.
3. **When performances keep going wrong the same way, fix the score.** Correcting the same thing twice in one session is not a preference, it's a gap in `CONTEXT.md` or `AGENTS.md`. Patch the output and you fix this session; patch the score and you fix every session after it.

Rule 3 is the one that pays compound interest, and it's the reason the split matters beyond tidiness — a project whose score improves gets better with use, while one that only ever fixes its output stays exactly as good as its last correction.

## Why two files

They were one file through 4.2. That conflated material with opposite lifecycles: an append-only decision trail meant to survive the life of the project, and a task list that is stale within a week. Three concrete failures came out of that:

1. **The ~100-line cap put them in competition.** The trail is the part that can't be regenerated — git history records *what* changed, never *what was rejected and why*. Under pressure to prune, it was the section that got cut, because Next Steps always looks more urgent.
2. **`/wrap-session` rewrote stable content every session** just to update the churning half, giving every session a chance to silently reword a decision nobody revisited.
3. **The model got no signal about which half was which.** Rules to obey and work to do arrived as one undifferentiated blob, leaving it to sort them out per read.

This is the Layer 3 / Layer 4 distinction from Van Clief & McDermott's *Interpretable Context Methodology* (arXiv:2603.16021): reference material stable across runs, separated in the filesystem from per-run working artifacts, so the separation is structural rather than something the model has to infer. See `DESIGN-DECISIONS.md` for what else from ICM was adopted and what was rejected.

## Schema — CONTEXT.md

```markdown
# Project Context
Last updated: 2026-08-14

## Project
What this is, why it exists, who uses it. 2-4 sentences.

## Stack
Languages, frameworks, DB, hosting, auth/payment providers.

## Key Decisions
- Chose X over Y because Z. (append-only; one bullet per decision, rejected alternative named)
```

## Schema — .attacca/focus.md

```markdown
# Focus
Last updated: 2026-08-14

## Current Focus
What is being built right now. 1-3 bullets.

## Next Steps
Queued work in order. Pruned when stale.

## Blockers
Waiting-on-human or external items. "None" if clear.
```

## Rules

- **Both committed**, always — their whole value is surviving clones and machines.
- **`.attacca/focus.md` must not be gitignored.** If a project ignores `.attacca/` wholesale, narrow the ignore to `.attacca/audits/` and `.attacca/sbom/`. A teammate cloning the repo reads `focus.md` first; an ignored one hands them an empty desk.
- **`CONTEXT.md` under ~100 lines; `focus.md` under ~30.** They're bookmarks, not journals. If either scrolls, prune — but prune `focus.md`, never the decision trail.
- **Key Decisions is append-only.** A decision that changed gets a new entry superseding the old, so the reasoning trail survives. Nothing in `focus.md` is append-only; it is meant to be overwritten.
- **Never duplicate git history** in either — no file-change lists, no "what we did" narration.
- **One schema per filename.** `CONTEXT.md` means *this* schema everywhere in Attacca. The domain glossary that `grill-with-docs` maintains is a separate artifact at `docs/GLOSSARY.md` for exactly this reason.
- Maintained by `/wrap-session` at session end and `/interrogate` at project start; edit by hand freely.

## Migrating a 4.2 project

Mechanical, one time:

1. `mkdir -p .attacca`
2. Move the `## Current Focus`, `## Next Steps`, and `## Blockers` sections out of `CONTEXT.md` into `.attacca/focus.md`, under a `# Focus` heading.
3. Check `.gitignore` — if it has a bare `.attacca/` line, replace it with `.attacca/audits/` and `.attacca/sbom/`.
4. `git add .attacca/focus.md`

`/retrofit` does this automatically on an existing repo. Nothing breaks if you skip it: skills that read `focus.md` fall back to `CONTEXT.md` when it's absent.

## Division of labor with native memory

Claude Code's auto-memory (machine-local) remembers *your* habits and the codebase's quirks. `CONTEXT.md` remembers *the project's* intent and decisions; `.attacca/focus.md` remembers where the work stopped. If a fact must survive a `git clone` onto a fresh machine, it belongs in one of the two files; otherwise let native memory handle it.
