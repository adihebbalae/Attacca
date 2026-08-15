# Agent instructions

Instructions for any coding agent working in this repository (Claude Code loads this via CLAUDE.md; Copilot, Cursor, Codex, and others read it natively).

## Orientation
Two files. Read both before starting work.

- `CONTEXT.md` (repo root) — **the score.** Spec, stack, key decisions with their rejected alternatives. Authoritative over every session. Append-only: a superseded decision gets a new bullet, it does not get deleted.
- `.attacca/focus.md` — **this performance.** Current focus, next steps, blockers. Rewritten every session; nothing in it is durable.

Three rules follow from that, and they cover most of what you need to know about this repo's memory:

1. **A performance never edits the score.** Do the work, then record decisions — don't reword `CONTEXT.md` in passing.
2. **You can lose a performance; you cannot lose the score.** Git can reconstruct what changed. Nothing can reconstruct what was rejected and why.
3. **When performances keep going wrong the same way, fix the score.** If you're corrected on the same point twice in one session, that's a gap in `CONTEXT.md` or this file — say so and propose the amendment, rather than just complying again.

- Don't re-litigate decisions recorded in `CONTEXT.md` — if you disagree, raise it explicitly instead of silently building something else.
- If you make a decision worth keeping, put it in `CONTEXT.md`, not `focus.md`.

## Working rules
- Ask before assuming: ambiguous requirements get questions, not guesses.
- Verify before claiming done: run the tests/linter/app; a change that was never executed is not done.
- Security: never push with known CRITICAL/HIGH findings; changes touching auth, payments, secrets, or dependencies get a security review first.
- Keep diffs scoped to the stated task; note anything out-of-scope you spotted rather than fixing it silently.

## Build / test / run
<!-- Fill in for your project: -->
- Install: `npm install`
- Test: `npm test`
- Lint: `npm run lint`
- Run: `npm run dev`
