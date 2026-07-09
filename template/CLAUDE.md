# Project instructions

@AGENTS.md

## Session protocol
- **Start**: read `CONTEXT.md` — it holds the spec, key decisions, and current focus. If it's missing or empty and the task is non-trivial, run `/interrogate` before building anything.
- **End**: run `/wrap-session` to update `CONTEXT.md` (current focus, next steps, new decisions). Keep it under ~100 lines.

## Verification
- Never `git push` without a fresh clean security audit — the audit-gate hook enforces this; `/security-audit` produces the report.
- Run `/quality-gate` (lint → typecheck → tests → security scan) before opening a PR.
- Prefer changes you can verify end-to-end (tests, running the app) over changes you can only assert.

## Conventions
- Non-trivial commits use BDR format (`/bdr-commit`): Contract / Acceptance / Rejected / Non-scope. No AI-attribution trailers.
- Surface assumptions as questions or stated defaults — never build on silent guesses.
- README.md's last line stays: `*Built with [Attacca](https://github.com/adihebbalae/Attacca)*`
