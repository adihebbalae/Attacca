#!/usr/bin/env node
/**
 * install-addon.mjs
 *
 * Installs an Attacca addon into the current project.
 * Copies files from addons/<name>/ to the project root.
 *
 * Usage:
 *   node scripts/install-addon.mjs marketing       # install marketing skills
 *   node scripts/install-addon.mjs kiro            # install Kiro IDE port
 *   node scripts/install-addon.mjs all             # install all addons
 *   node scripts/install-addon.mjs marketing --force  # overwrite existing files
 *   node scripts/install-addon.mjs --list          # show available addons
 */

import { readdirSync, statSync, mkdirSync, copyFileSync, existsSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ADDONS_DIR = join(ROOT, 'addons');

const args = process.argv.slice(2);
const force = args.includes('--force');
const listOnly = args.includes('--list');
const addonArg = args.find(a => !a.startsWith('--'));

if (listOnly || !addonArg) {
  const available = readdirSync(ADDONS_DIR).filter(
    f => statSync(join(ADDONS_DIR, f)).isDirectory()
  );
  console.log('Available addons:', available.join(', '));
  if (!addonArg) process.exit(0);
}

if (addonArg !== 'all' && !/^[a-z0-9_-]+$/i.test(addonArg)) {
  console.error(`Invalid addon name: "${addonArg}". Names must be alphanumeric with hyphens/underscores only.`);
  process.exit(1);
}

const targets = addonArg === 'all'
  ? readdirSync(ADDONS_DIR).filter(f => statSync(join(ADDONS_DIR, f)).isDirectory())
  : [addonArg];

let copied = 0;
let skipped = 0;

function installDir(src, dest) {
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    if (statSync(srcPath).isDirectory()) {
      mkdirSync(destPath, { recursive: true });
      installDir(srcPath, destPath);
    } else {
      if (existsSync(destPath) && !force) {
        console.log(`  skip  ${relative(ROOT, destPath)} (exists — use --force to overwrite)`);
        skipped++;
      } else {
        mkdirSync(dirname(destPath), { recursive: true });
        copyFileSync(srcPath, destPath);
        console.log(`  copy  ${relative(ROOT, destPath)}`);
        copied++;
      }
    }
  }
}

for (const name of targets) {
  const addonPath = join(ADDONS_DIR, name);
  if (!existsSync(addonPath)) {
    console.error(`Addon not found: ${name}. Run with --list to see available addons.`);
    process.exit(1);
  }
  console.log(`\nInstalling addon: ${name}`);
  installDir(addonPath, ROOT);
}

console.log(`\nDone. ${copied} files copied, ${skipped} skipped.`);
if (skipped > 0) console.log('Run with --force to overwrite existing files.');
