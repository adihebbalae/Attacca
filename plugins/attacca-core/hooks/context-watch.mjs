#!/usr/bin/env node
// UserPromptSubmit hook: reads the per-session usage snapshot teed by
// template/statusline.mjs and, when context or rate-limit usage crosses a
// threshold, injects a short advisory into the model's context so it can
// proactively flag/suggest trimming. It NEVER runs /clear or /compact itself
// — a UserPromptSubmit hook has no context/rate-limit data of its own
// (confirmed: hooks.md JSON input schema carries no context_window/rate_limits
// fields), so this is silent no-op until the project has statusLine wired to
// template/statusline.mjs. Fails open on any error — it must never block a prompt.
//
// ADAPTIVE CADENCE (not every-turn) — fires on meaningful escalation only,
// tracked per session in <session_id>.json next to the snapshot:
//   ctx  50% used : fire ONCE on crossing (gentle FYI)
//   ctx  75% used : re-fire only after climbing another +10 points (periodic nudge)
//   ctx  90% used : fire EVERY turn (urgent)
//   on drop (after /clear or /compact): re-arm so the next climb warns fresh
//   5h >=80% / 7d >=85% : fire on crossing, re-warn after +10 / +5 points, re-arm on reset
//
// Percentage-based (not absolute tokens) so the same thresholds are meaningful
// whether the project is on a 200k or a 1M context window.
//
// ADVICE PHILOSOPHY: /compact is itself a billed multi-token-window rebuild and
// does not cure context rot, so the default advice is: finish the scoped task,
// persist state (memory/CONTEXT.md via /wrap-session), /clear at the boundary.
// /compact is reserved for genuinely history-dependent long hauls.
// See: anthropics/claude-code#50998.
//
// Delete when: Claude Code natively surfaces context-budget awareness to the model.
import { readFileSync, writeFileSync, readdirSync, statSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DIR = join(tmpdir(), ".attacca_ctx_watch");
const tier = (p) => (p >= 90 ? 3 : p >= 75 ? 2 : p >= 50 ? 1 : 0);

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let sid = "default";
  try {
    sid = JSON.parse(raw).session_id || "default";
  } catch {}
  sid = String(sid).replace(/[^A-Za-z0-9._-]/g, "_");

  let s;
  try {
    s = JSON.parse(readFileSync(join(DIR, `${sid}.json`), "utf8"));
  } catch {
    pruneStale();
    process.exit(0); // no snapshot yet (statusLine not wired, or first turn) — stay silent
  }

  const statePath = join(DIR, `${sid}.thresholds.json`);
  let st = { ctx: 0, h5: 0, d7: 0 };
  try {
    st = { ...st, ...JSON.parse(readFileSync(statePath, "utf8")) };
  } catch {}

  const now = Math.floor(Date.now() / 1000);
  const mins = (e) => (e ? Math.max(0, Math.round((e - now) / 60)) : null);
  const m = [];

  // --- Context (rot + cost) axis: escalating cadence -----------------------
  if (s.ctx_pct != null) {
    const cur = tier(s.ctx_pct);
    const prev = tier(st.ctx || 0);
    let fire = false;
    if (cur === 3) fire = true; // top tier: every turn
    else if (cur > prev) fire = true; // escalated into a higher tier
    else if (cur === 2 && s.ctx_pct - (st.ctx || 0) >= 10) fire = true; // climbing inside 75-90%

    if (fire) {
      const pct = Math.round(s.ctx_pct);
      if (cur === 3) {
        m.push(`Context ${pct}% used — deep in context-rot territory. Strongly suggest /clear or a fresh session at the first viable stopping point (persist state to memory/CONTEXT.md first); /compact only if this history is truly irreplaceable mid-task.`);
      } else if (cur === 2) {
        m.push(`Context ${pct}% used — recall degrades from here. Don't reflex-compact: /compact is a billed rebuild that keeps the rot. Prefer finishing the current scoped task, saving state, then /clear at that boundary. Offload heavy reads to subagents either way.`);
      } else {
        m.push(`Context ${pct}% used — getting heavy. Offload big file/search reads to subagents; plan to /clear at the next natural task boundary (after saving state) rather than compacting mid-task.`);
      }
      st.ctx = s.ctx_pct;
    } else if (s.ctx_pct < (st.ctx || 0)) {
      st.ctx = s.ctx_pct; // re-arm after a drop (/clear or /compact)
    }
  }

  // --- 5-hour rate-limit axis ----------------------------------------------
  if (s.h5_pct != null && s.h5_pct >= 80) {
    if ((st.h5 || 0) < 80 || s.h5_pct - st.h5 >= 10) {
      const r = mins(s.h5_reset);
      m.push(`5-hour usage ${Math.round(s.h5_pct)}%${r != null ? `, resets in ~${r} min` : ""} — flag this before starting any large task; suggest deferring or trimming scope.`);
      st.h5 = s.h5_pct;
    }
  } else if (s.h5_pct != null) {
    st.h5 = 0; // dropped below 80 (window reset) → re-arm
  }

  // --- 7-day rate-limit axis -----------------------------------------------
  if (s.d7_pct != null && s.d7_pct >= 85) {
    if ((st.d7 || 0) < 85 || s.d7_pct - st.d7 >= 5) {
      m.push(`7-day usage ${Math.round(s.d7_pct)}% — weekly budget nearly spent; be selective about what to take on.`);
      st.d7 = s.d7_pct;
    }
  } else if (s.d7_pct != null) {
    st.d7 = 0; // dropped below 85 (window reset) → re-arm
  }

  try {
    writeFileSync(statePath, JSON.stringify(st));
  } catch {}

  if (m.length) {
    const stale = now - (s.ts || now) > 180 ? " (usage snapshot is stale; numbers may lag)" : "";
    console.log(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "UserPromptSubmit",
          additionalContext: `[context-watch] ${m.join(" ")}${stale} — Only flag and suggest these to the user; NEVER run /clear or /compact yourself.`,
        },
      })
    );
  }

  pruneStale();
  process.exit(0);
});

// Drop snapshot/state files untouched for >24h so per-session files don't accumulate.
function pruneStale() {
  try {
    const cutoff = Date.now() - 24 * 3600 * 1000;
    for (const f of readdirSync(DIR)) {
      const p = join(DIR, f);
      try {
        if (statSync(p).mtimeMs < cutoff) unlinkSync(p);
      } catch {}
    }
  } catch {}
}
