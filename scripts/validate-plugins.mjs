#!/usr/bin/env node
// validate-plugins.mjs — consistency checks for the Attacca marketplace.
// Exit 0 = all good; exit 1 = findings (printed to stderr).
// Checks: manifests parse, versions agree everywhere, marketplace sources exist,
// hooks files parse, no dead v3 references or dated model names in shipped content.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const check = (cond, msg) => { if (!cond) errors.push(msg); };
const readJson = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

// 1. Version consistency
const version = readFileSync(join(root, ".github/BOILERPLATE_VERSION"), "utf8").split("\n")[0].trim().replace(/^v/, "");
const marketplace = readJson(".claude-plugin/marketplace.json");
check(marketplace.metadata?.version === version, `marketplace.json metadata.version (${marketplace.metadata?.version}) != BOILERPLATE_VERSION (${version})`);

const pluginDirs = readdirSync(join(root, "plugins")).filter(d => statSync(join(root, "plugins", d)).isDirectory());
for (const dir of pluginDirs) {
  const manifestPath = `plugins/${dir}/.claude-plugin/plugin.json`;
  check(existsSync(join(root, manifestPath)), `${dir}: missing ${manifestPath}`);
  if (!existsSync(join(root, manifestPath))) continue;
  const manifest = readJson(manifestPath);
  check(manifest.name === dir, `${dir}: plugin.json name '${manifest.name}' != directory name`);
  check(manifest.version === version, `${dir}: version ${manifest.version} != ${version}`);
  const entry = marketplace.plugins.find(p => p.name === manifest.name);
  check(!!entry, `${dir}: not listed in marketplace.json`);
  if (entry) {
    check(entry.version === version, `${dir}: marketplace entry version ${entry.version} != ${version}`);
    check(entry.source === `./plugins/${dir}`, `${dir}: marketplace source '${entry.source}' != ./plugins/${dir}`);
  }
  // Skills must have frontmatter with name + description
  const skillsDir = join(root, "plugins", dir, "skills");
  if (existsSync(skillsDir)) {
    for (const skill of readdirSync(skillsDir)) {
      const sk = join(skillsDir, skill, "SKILL.md");
      check(existsSync(sk), `${dir}/${skill}: missing SKILL.md`);
      if (!existsSync(sk)) continue;
      const text = readFileSync(sk, "utf8");
      check(/^---\r?\n[\s\S]*?\bname:/m.test(text) && /\bdescription:/m.test(text), `${dir}/${skill}: SKILL.md missing name/description frontmatter`);
      check(/Delete when:/i.test(text), `${dir}/${skill}: SKILL.md missing 'Delete when:' condition`);
    }
  }
  // hooks.json must parse
  const hooks = join(root, "plugins", dir, "hooks", "hooks.json");
  if (existsSync(hooks)) {
    try { JSON.parse(readFileSync(hooks, "utf8")); } catch (e) { errors.push(`${dir}: hooks.json invalid JSON — ${e.message}`); }
  }
}

// 2. Dead v3 references and dated model names in shipped content
const deadRef = /\.agents\/(state|handoff|workspace-map|MODULES|audits|rules|workflows|templates)|state\.json|handoff\.md|workspace-map/i;
const datedModel = /\b(claude-)?(sonnet|opus|haiku)[- ]?[34](\.\d)?\b/i;
const walk = (dir) => readdirSync(join(root, dir)).flatMap(f => {
  const rel = `${dir}/${f}`;
  return statSync(join(root, rel)).isDirectory() ? walk(rel) : [rel];
});
for (const file of [...walk("plugins"), ...walk("template")]) {
  if (!/\.(md|json|mjs)$/.test(file)) continue;
  const text = readFileSync(join(root, file), "utf8");
  if (deadRef.test(text)) errors.push(`${file}: contains dead v3 reference (${text.match(deadRef)[0]})`);
  if (datedModel.test(text)) errors.push(`${file}: contains dated model name (${text.match(datedModel)[0]}) — use tiers`);
}

if (errors.length) {
  console.error(`validate-plugins: ${errors.length} finding(s)\n` + errors.map(e => `  ✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log(`validate-plugins: OK — ${pluginDirs.length} plugins, version ${version}`);
