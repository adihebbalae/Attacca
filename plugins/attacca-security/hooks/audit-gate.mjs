#!/usr/bin/env node
// audit-gate hook — the v3 rule "NEVER push without a clean Security report", as deterministic
// verification instead of protocol prose. Blocks `git push` unless .attacca/audits/latest.md
// exists, contains "VERDICT: CLEAN", and is newer than the last commit (audit must have seen HEAD).
// The /security-audit skill (attacca-security) writes that report.
// Bypass for emergencies: ATTACCA_SKIP_AUDIT=1 git push (leaves no audit trail — use consciously).
// Exit 0 = allow. Exit 2 = block (stderr shown to Claude).
// Delete when: Claude Code ships a native enforced pre-push review gate.

import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

try {
  const input = JSON.parse(readFileSync(0, "utf8"));
  const command = input.tool_input?.command ?? "";
  if (!/\bgit\b[\s\S]*\bpush\b/.test(command)) process.exit(0);
  if (process.env.ATTACCA_SKIP_AUDIT === "1") process.exit(0);

  const cwd = input.cwd || process.cwd();
  let root;
  try {
    root = execSync("git rev-parse --show-toplevel", { cwd, stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    process.exit(0); // not a git repo — nothing to gate
  }

  const report = join(root, ".attacca", "audits", "latest.md");
  const fail = (why) => {
    console.error(
      `audit-gate: push blocked — ${why}\n` +
      `Run /security-audit to produce a fresh report at .attacca/audits/latest.md ` +
      `(must contain "VERDICT: CLEAN" and postdate the last commit).`
    );
    process.exit(2);
  };

  let stat;
  try { stat = statSync(report); } catch { fail("no security audit report found"); }

  const text = readFileSync(report, "utf8");
  if (!/VERDICT:\s*CLEAN/i.test(text)) fail("latest audit verdict is not CLEAN");

  let headTime = 0;
  try {
    headTime = parseInt(execSync("git log -1 --format=%ct", { cwd: root, stdio: ["ignore", "pipe", "ignore"] }).toString().trim(), 10) * 1000;
  } catch { /* empty repo — allow */ }
  if (stat.mtimeMs < headTime) fail("audit report is older than the last commit — re-audit HEAD");

  process.exit(0);
} catch {
  process.exit(0); // fail open on unexpected environment errors rather than bricking git
}
