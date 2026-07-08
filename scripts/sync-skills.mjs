#!/usr/bin/env node
/**
 * sync-skills.mjs
 *
 * Boilerplate-development helper. Mirrors `.github/skills/` (source of truth)
 * to `.claude/skills/` so the Claude Code adapter stays in lockstep without
 * manual sync drift.
 *
 * `claude-plugin/skills/` is intentionally NOT synced — it ships with the
 * Claude plugin distribution and uses self-contained variants (different
 * cross-references to suit plugin packaging).
 *
 * Usage:
 *   node scripts/sync-skills.mjs              # add/update only (safe)
 *   node scripts/sync-skills.mjs --prune      # also remove skills in
 *                                             #   .claude/skills/ that no
 *                                             #   longer exist in .github/skills/
 *   node scripts/sync-skills.mjs --check      # exit non-zero if drift exists
 *                                             #   (for CI). No writes.
 *
 * Marketing skills live under `packs/marketing/skills/` and are NOT mirrored
 * to `.claude/skills/` by design — they are opt-in.
 */

import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, '.github', 'skills');
const DST = join(ROOT, '.claude', 'skills');

const args = new Set(process.argv.slice(2));
const PRUNE = args.has('--prune');
const CHECK = args.has('--check');

function walk(dir, base = dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = relative(base, full);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      out.push(...walk(full, base));
    } else {
      out.push(rel);
    }
  }
  return out;
}

function ensureDir(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
}

function readBytes(p) {
  return readFileSync(p);
}

function buffersEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.equals(b);
}

if (!existsSync(SRC)) {
  console.error(`No source dir at ${SRC} — nothing to sync.`);
  process.exit(1);
}

if (!existsSync(DST)) {
  if (CHECK) {
    console.error(`Drift: ${DST} does not exist.`);
    process.exit(1);
  }
  mkdirSync(DST, { recursive: true });
}

const srcFiles = walk(SRC);
const dstFilesBefore = existsSync(DST) ? walk(DST) : [];

let added = 0;
let updated = 0;
let removed = 0;
const drift = [];

for (const rel of srcFiles) {
  const srcPath = join(SRC, rel);
  const dstPath = join(DST, rel);
  const srcBytes = readBytes(srcPath);

  if (!existsSync(dstPath)) {
    drift.push(`MISSING in .claude/skills/: ${rel}`);
    if (!CHECK) {
      ensureDir(dstPath);
      writeFileSync(dstPath, srcBytes);
      added++;
    }
    continue;
  }

  const dstBytes = readBytes(dstPath);
  if (!buffersEqual(srcBytes, dstBytes)) {
    drift.push(`DIFFERENT: ${rel}`);
    if (!CHECK) {
      writeFileSync(dstPath, srcBytes);
      updated++;
    }
  }
}

const srcSet = new Set(srcFiles);
for (const rel of dstFilesBefore) {
  if (!srcSet.has(rel)) {
    drift.push(`EXTRA in .claude/skills/: ${rel}`);
    if (!CHECK && PRUNE) {
      rmSync(join(DST, rel), { force: true });
      removed++;
    }
  }
}

if (CHECK) {
  if (drift.length === 0) {
    console.log('✓ .claude/skills/ is in sync with .github/skills/');
    process.exit(0);
  }
  console.error(`✗ Drift detected (${drift.length} entries):`);
  for (const d of drift) console.error(`  ${d}`);
  console.error('\nRun: node scripts/sync-skills.mjs [--prune]');
  process.exit(1);
}

if (!PRUNE) {
  const extras = drift.filter(d => d.startsWith('EXTRA')).length;
  if (extras > 0) {
    console.log(`Note: ${extras} extra file(s) in .claude/skills/ not in source. Use --prune to remove.`);
  }
}

console.log(`Sync complete. Added: ${added}, Updated: ${updated}, Removed: ${removed}`);
