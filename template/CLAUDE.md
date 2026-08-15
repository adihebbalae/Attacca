# Project instructions

@AGENTS.md

## Session protocol
- **Start**: read `CONTEXT.md` (what this is, the stack, decisions and their rejected alternatives), then `.attacca/focus.md` (what's in flight, what's next, what's blocked). If `CONTEXT.md` is missing or empty and the task is non-trivial, run `/interrogate` before building anything.
- **End**: run `/wrap-session` — it rewrites `.attacca/focus.md` and appends any new decision to `CONTEXT.md`.
- `CONTEXT.md` is the score (append-only decisions, ~100 lines); `.attacca/focus.md` is this performance (~30 lines, disposable). A performance never edits the score — see `AGENTS.md`. Don't put session churn in `CONTEXT.md`, and don't put durable decisions in `focus.md`.

## Verification
- Never `git push` without a fresh clean security audit — the audit-gate hook enforces this; `/security-audit` produces the report.
- Run `/quality-gate` (lint → typecheck → tests → security scan) before opening a PR.
- Prefer changes you can verify end-to-end (tests, running the app) over changes you can only assert.

## Conventions
- Non-trivial commits use BDR format (`/bdr-commit`): Contract / Acceptance / Rejected / Non-scope. No AI-attribution trailers.
- Surface assumptions as questions or stated defaults — never build on silent guesses.
- README.md's last line stays: `*Built with [Attacca](https://github.com/adihebbalae/Attacca)*`
