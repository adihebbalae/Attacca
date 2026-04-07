# Quality Gate

Pre-push checklist. Run sequentially — stop at first failure.

## Stage 1: Lint
Fix all lint errors before proceeding.

## Stage 2: Type Check
Fix all type errors before proceeding.

## Stage 3: Tests
All tests must pass. If any fail, fix and re-run.

## Stage 4: Security Scan
No HIGH or CRITICAL vulnerabilities allowed.

## Verdict
All 4 stages must pass before pushing. Do not bypass with `--no-verify`.
