#!/usr/bin/env node
// statusLine command: shows context-window usage + rate limits, and tees a
// per-session snapshot to the OS temp dir so the context-watch hook
// (plugins/attacca-core/hooks/context-watch.mjs) can read it back — a hook
// has no direct access to context/rate-limit data, only statusLine does.
// Wire it up in .claude/settings.json:
//   "statusLine": { "type": "command", "command": "node \"${CLAUDE_PROJECT_DIR}/statusline.mjs\"" }
// Delete when: Claude Code surfaces context/rate-limit usage to hooks directly.

import { writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

let data = "";
process.stdin.on("data", (c) => (data += c));
process.stdin.on("end", () => {
  try {
    const parsed = JSON.parse(data);
    const cw = parsed.context_window || {};
    const rl = parsed.rate_limits || {};

    const parts = [];

    const used = cw.used_percentage;
    if (used != null) {
      const left = cw.remaining_percentage ?? 100 - used;
      parts.push(`ctx: ${Math.round(used)}% used  ${Math.round(left)}% left`);
    } else {
      parts.push("ctx: --");
    }

    if (rl.five_hour?.used_percentage != null) {
      parts.push(`5h: ${Math.round(rl.five_hour.used_percentage)}%`);
    }
    if (rl.seven_day?.used_percentage != null) {
      parts.push(`7d: ${Math.round(rl.seven_day.used_percentage)}%`);
    }

    // Tee a minimal per-session snapshot for context-watch.mjs. Keyed by
    // session_id so concurrent sessions never cross-read each other's usage.
    // Percentages, not absolute tokens — portable across 200k and 1M windows.
    try {
      const sid = String(parsed.session_id || "default").replace(/[^A-Za-z0-9._-]/g, "_");
      const dir = join(tmpdir(), ".attacca_ctx_watch");
      mkdirSync(dir, { recursive: true });
      writeFileSync(
        join(dir, `${sid}.json`),
        JSON.stringify({
          ts: Math.floor(Date.now() / 1000),
          ctx_pct: used ?? null,
          h5_pct: rl.five_hour?.used_percentage ?? null,
          h5_reset: rl.five_hour?.resets_at ?? null,
          d7_pct: rl.seven_day?.used_percentage ?? null,
        })
      );
    } catch {}

    process.stdout.write(parts.join("  "));
  } catch {
    process.stdout.write("ctx: --");
  }
});
