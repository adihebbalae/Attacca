#!/usr/bin/env node
// read-once hook — blocks re-reading files already loaded this session (~40-90% Read-token savings).
// Node port of the v3 bash hook: cross-platform (Windows/Git Bash safe), per-session cache keyed by
// the session_id in the hook payload (the v3 CLAUDE_SESSION_ID env var is no longer set, which made
// all sessions share one cache and block files read in *previous* sessions), and invalidates on mtime
// change so edited files can be re-read.
// Exit 0 = allow. Exit 2 = block (message on stderr is shown to Claude).
// Delete when: Claude Code natively deduplicates repeated file reads.

import { readFileSync, statSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

try {
  const input = JSON.parse(readFileSync(0, "utf8"));
  const tool = input.tool_input ?? {};
  const file = tool.file_path;
  if (!file) process.exit(0);
  // Partial reads (offset/limit) are intentional re-visits — never block them.
  if (tool.offset !== undefined || tool.limit !== undefined) process.exit(0);

  const session = input.session_id || process.env.CLAUDE_SESSION_ID || "default";
  const cache = join(tmpdir(), `.attacca_read_once_${session}`);

  let mtime = "0";
  try { mtime = String(statSync(file).mtimeMs); } catch { process.exit(0); }

  let entries = "";
  try { entries = readFileSync(cache, "utf8"); } catch { /* first read this session */ }

  if (entries.split("\n").includes(`${file}|${mtime}`)) {
    console.error(`read-once: already read '${file}' this session and it hasn't changed — use what you have instead of re-reading`);
    process.exit(2);
  }

  appendFileSync(cache, `${file}|${mtime}\n`);
  process.exit(0);
} catch {
  process.exit(0); // fail open — never break Reads over a cache problem
}
