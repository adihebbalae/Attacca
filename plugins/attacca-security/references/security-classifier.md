# Security Classifier — SIMPLE vs COMPLEX branch classification

> Determines whether a pull request (or branch) is SIMPLE (auto-landable with proper governance) or COMPLEX (requires human review). Used by per-PR Security audits to guide review queue routing.

## Classification Criteria

### SIMPLE (all criteria must hold)

A PR is classified as **SIMPLE** when **all** of the following are true:

1. **Zero HIGH or CRITICAL security findings** — Per the per-PR Security audit
   - _Rationale_: Significant vulnerabilities demand expert judgment. Auto-land only for clean audits.

2. **Zero changes to sensitive code paths:**
   - Authentication logic (login, token generation, session management)
   - Schema migrations or database changes
   - Secret/credential handling (key rotation, credential storage)
   - Dependency manifests (`package.json`, `requirements.txt`, `Cargo.toml`, `go.mod`, etc.)
   - CI/CD configuration (`.github/workflows/`, deployment configs)
   - Infrastructure code (Terraform, CloudFormation, Helm charts)
   - _Rationale_: These categories have long-range consequences. A small auth bug breaks everything; a hidden dependency supply-chain attack is invisible until production. Human judgment required.

3. **Diff size and scope within thresholds:**
   - Lines changed: < 300 (default; adjust per project in CONTEXT.md Key Decisions)
   - Files touched: < 10 (default; configurable)
   - _Rationale_: Large diffs are harder to review reliably. Tight thresholds make auto-land feel boring (a good sign). Boring = safe.

4. **BDR claims are verifiable from the diff alone:**
   - Contract statement maps to code changes in the diff
   - Acceptance criteria are testable without external state (DB migration, infra deploy, config server, etc.)
   - Example PASS: "Add email validation to signup form" — changes are in form code, can be tested in a PR build.
   - Example FAIL: "Fix delayed email delivery" — depends on email service behavior, not in the diff.
   - _Rationale_: If the BDR contract references state outside the diff, the auditor can't fully verify the claim. Escalate to human.

5. **BDR claims match the diff:**
   - Contract says "refactor login form styling" and the diff touches `src/auth/LoginForm.jsx` only (no schema changes, no secret handling) → match.
   - Contract says "fix login bug" but the diff touches `src/checkout/Cart.jsx` → mismatch. Escalate.
   - No BDR present (legacy commit) → treat as COMPLEX (see below).
   - _Rationale_: Mismatches are red flags for incomplete refactoring or scope creep.

### COMPLEX (any one criterion triggers)

A PR is classified as **COMPLEX** (requires human review) when **any** of the following are true:

1. **Any HIGH or CRITICAL security finding** — BDR claim verification is suspended; human expert needed.

2. **Any change to sensitive code paths** — Same list as SIMPLE criteria #2 (auth, migrations, secrets, dependencies, CI/CD, infra).

3. **Diff exceeds size thresholds** — > 300 lines changed OR > 10 files touched (or custom thresholds if configured).

4. **BDR claims reference external state** — The contract mentions a DB migration, config change, infra deploy, or API behavior that's not in the diff. Example: "This commit relies on the Redis cluster being upgraded to v7.0 first."

5. **BDR claims and diff mismatch** — Contract doesn't align with file changes. Example: Contract says "Add dark mode toggle" but the diff is only in `src/utils/color.js` with no UI changes.

6. **No BDR present** — Legacy commits without a Business/Decision/Rationale header. Treat as COMPLEX.

## Configuration

### Default Thresholds (baked-in)
- `max_lines_changed`: 300
- `max_files_touched`: 10

### Per-Project Override
Projects may create an **optional** file `.attacca/security-classifier.config.json`:

```json
{
  "max_lines_changed": 150,
  "max_files_touched": 5
}
```

If this file is absent, defaults apply. If present, the configured thresholds override the defaults.

**Note**: The thresholds are intentionally tight. Auto-land should feel conservative, not aggressive.

## Per-PR Security Audit → Classifier Input

The per-PR Security agent outputs a structured audit report to `.attacca/audits/<branch-id>.md` that includes:
- Branch name
- Diff summary (lines changed, files touched)
- OWASP findings (CRITICAL, HIGH, MEDIUM, LOW)
- BDR verification summary
- Recommendation: SIMPLE or COMPLEX

Whoever requested the audit routes the branch accordingly:
- **SIMPLE**: If auto-land is enabled, attempt local merge. Otherwise, add to `review_queue.auto_land_candidates` for quick human triage.
- **COMPLEX**: Add to `review_queue.human_review` with reason.

## Examples

### Example 1: SIMPLE (auto-landable)

```
PR: Add loading indicator to checkout button
Branch: feature/checkout-spinner
Commit: [BDR]
  Business: Users are confused by unresponsive checkout button
  Decision: Add spinner overlay during submission
  Rationale: UI feedback is standard practice; improves UX
  
  Contract: Add spinner component to checkout form
  Acceptance: Spinner appears during form submission; disappears after response

Diff:
  - src/components/CheckoutButton.jsx: +35 lines (added Spinner import, render logic)
  - Total: 1 file, 35 lines changed
  
Security Audit:
  - 0 CRITICAL, 0 HIGH findings
  - No auth / migration / secret / dependency / CI changes
  - No external state dependencies
  - BDR matches diff (Spinner code is in the file changed)
  
Classification: SIMPLE ✓
```

Why it's SIMPLE:
- No security issues ✓
- Only UI code changed ✓
- Diff is small (35 lines, 1 file) ✓
- BDR is concrete and verifiable ✓
- No external dependencies ✓

### Example 2: COMPLEX (human review required)

```
PR: Implement JWT refresh token rotation
Branch: feature/jwt-rotation
Commit: [BDR]
  Business: Stolen tokens remain valid forever; security risk
  Decision: Add refresh token rotation on every auth refresh
  Rationale: Industry standard; reduces attack window
  
  Contract: Implement refresh token rotation
  Acceptance: Tokens rotate on each refresh; old tokens become invalid

Diff:
  - src/auth/jwt.js: +120 lines (rotation logic)
  - src/db/migrations/: +1 file (schema to track token versions)
  - src/config/secrets.js: +10 lines (new secret key)
  - Total: 3 files, 130 lines changed

Security Audit:
  - 0 CRITICAL, 0 HIGH findings (audit passed)
  - BUT: Touches auth logic AND migrations AND secrets
  
Classification: COMPLEX (auth + migrations + secrets = escalate) ✓
```

Why it's COMPLEX:
- Involves authentication code ✓
- Involves schema migration ✓
- Involves secret handling ✓
- Human judgment needed on implementation details ✓

### Example 3: COMPLEX (mismatched BDR)

```
PR: Refactor button styles
Branch: feature/button-refactor
Commit: [BDR]
  Business: Button colors are hard-coded; hard to maintain
  Decision: Extract to CSS module
  Rationale: DRY principle; makes theming easier
  
  Contract: Move button styles to CSS module
  Acceptance: Buttons render identically; styles load from .css file

Diff:
  - src/components/Button.jsx: +5 lines (import statement)
  - src/styles/Button.css: +40 lines (new style rules)
  - src/auth/oauth.js: +20 lines (unrelated change??)  ← RED FLAG
  - Total: 3 files, 65 lines changed

Security Audit:
  - 0 CRITICAL, 0 HIGH findings
  - BUT: Diff touches oauth.js (auth code), but BDR makes no mention
  
Classification: COMPLEX (mismatch: BDR scope vs. actual changes) ✓
```

Why it's COMPLEX:
- BDR claims are about CSS refactoring ✓
- But diff changes auth code with no explanation ✓
- Scope creep or accidental change? Needs human clarification ✓

## Integration with Auto-Land (if enabled)

When a project enables auto-land via `.attacca/security-classifier.config.json` with `"auto_land_simple": true`:

1. Per-PR Security audit produces a SIMPLE classification
2. Verify the classification
3. If SIMPLE and auto-land enabled: run `git merge --no-ff <branch> -m "merge: ..."` and note it in CONTEXT.md
4. If COMPLEX or auto-land disabled: route to human review

Push always remains explicit and human-gated regardless of auto-land — local merges only.

## Future Enhancements (not implemented)

- **ML-based heuristics** — Train a simple classifier on historical PRs to improve the criteria
- **Per-project customization** — Allow projects to whitelist certain sensitive paths if they have special handling
- **Cross-PR dependency detection** — Detect when a SIMPLE PR depends on another PR not yet merged
- **Merge coordinator** — Schedule optimal landing order when multiple SIMPLE PRs are in flight 
