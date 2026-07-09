# Agent instructions

Instructions for any coding agent working in this repository (Claude Code loads this via CLAUDE.md; Copilot, Cursor, Codex, and others read it natively).

## Orientation
- `CONTEXT.md` at the repo root is the project's memory: spec, stack, key decisions (with rejected alternatives), current focus, next steps, blockers. Read it before starting work; update it when direction changes.
- Don't re-litigate decisions recorded in CONTEXT.md — if you disagree, raise it explicitly instead of silently building something else.

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
