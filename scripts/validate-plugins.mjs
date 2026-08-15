#!/usr/bin/env node
// validate-plugins.mjs — consistency checks for the Attacca marketplace.
// Exit 0 = all good; exit 1 = findings (printed to stderr).
// Checks: manifests parse, versions agree everywhere, marketplace sources exist,
// hooks files parse, no dead v3 references or dated model names in shipped content,
// plus the context-architecture guardrails (4.3): no dangling relative doc links,
// reference files stay under budget, generated artifacts stay under .attacca/,
// and no filename carries two competing schemas.

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

// 3. Context-architecture guardrails.
// Rationale in docs/DESIGN-DECISIONS.md ("What we took from ICM"). These encode as
// checks what would otherwise be prose discipline, which decays.

const shipped = [...walk("plugins"), ...walk("template")].filter(f => /\.(md|json|mjs)$/.test(f));
const readShipped = (f) => readFileSync(join(root, f), "utf8");

// 3a. No dangling relative markdown links. A skill pointing at a reference file that
// isn't there is a silent context gap: the model reads the pointer and moves on.
const LINK = /\[[^\]]*\]\((\.{1,2}\/[^)\s#]+|[A-Za-z0-9][^):\s#]*\.(?:md|mjs|json))(?:#[^)]*)?\)/g;
// Fenced blocks hold illustrative paths for the *user's* repo, not links into ours.
const stripFences = (t) => t.replace(/^```[\s\S]*?^```/gm, "");
for (const file of shipped.filter(f => f.endsWith(".md"))) {
  const dir = dirname(file);
  for (const [, target] of stripFences(readShipped(file)).matchAll(LINK)) {
    if (/^[a-z]+:/i.test(target)) continue;             // absolute URL
    const resolved = join(root, dir, target).replace(/\\/g, "/");
    if (!existsSync(resolved)) errors.push(`${file}: dangling link -> ${target}`);
  }
}

// 3b. Reference-material budget. ICM caps reference files at 200 lines; past that a
// stage loads more than it can use. SKILL.md files are exempt (they are contracts,
// not reference), but flagged over 200 so growth is at least visible.
const LINE_BUDGET = 200;
for (const file of shipped.filter(f => f.endsWith(".md") && !/(^|\/)SKILL\.md$/.test(f))) {
  const lines = readShipped(file).split(/\r?\n/).length;
  if (lines > LINE_BUDGET) errors.push(`${file}: ${lines} lines > ${LINE_BUDGET} — split it`);
}

// 3c. Generated artifacts live under .attacca/ — one convention, not one per skill.
// Also: never gitignore .attacca/ wholesale, which would drop the committed focus.md.
const strayArtifact = /(?<![.\w/`])(?:validation|audits|sbom)\/(?![*\w-]*\.(?:mjs|json)\b)/;
for (const file of shipped.filter(f => f.endsWith(".md"))) {
  const text = readShipped(file);
  for (const line of text.split(/\r?\n/)) {
    if (/\.attacca\//.test(line)) continue;
    if (strayArtifact.test(line) && !/legacy|pre-4\.3|GLOSSARY/i.test(line)) {
      errors.push(`${file}: artifact path outside .attacca/ — "${line.trim().slice(0, 70)}"`);
    }
  }
  if (/^\s*[`"']?\.attacca\/?[`"']?\s*$/m.test(text) && /gitignore/i.test(text)) {
    errors.push(`${file}: gitignores .attacca/ wholesale — would drop the committed focus.md`);
  }
}

// 3d. One filename, one schema. Two files each claiming to define the canonical
// layout of the same document is the failure this check exists to prevent — it is
// how CONTEXT.md ended up meaning both "project orientation" and "domain glossary".
const SECTION_OWNERS = {
  "CONTEXT.md": ["## Project", "## Stack", "## Key Decisions"],
  "focus.md": ["## Current Focus", "## Next Steps", "## Blockers"],
};
for (const [owner, sections] of Object.entries(SECTION_OWNERS)) {
  const other = owner === "CONTEXT.md" ? "focus.md" : "CONTEXT.md";
  const otherSections = SECTION_OWNERS[other];
  const templateFile = `template/${owner}`;
  check(existsSync(join(root, templateFile)), `template: missing ${owner}`);
  if (!existsSync(join(root, templateFile))) continue;
  const text = readShipped(templateFile);
  for (const s of sections) {
    if (!text.includes(s)) errors.push(`${templateFile}: missing required section "${s}"`);
  }
  for (const s of otherSections) {
    if (text.includes(s)) errors.push(`${templateFile}: owns "${s}", which belongs to ${other}`);
  }
}

if (errors.length) {
  console.error(`validate-plugins: ${errors.length} finding(s)\n` + errors.map(e => `  ✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log(`validate-plugins: OK — ${pluginDirs.length} plugins, version ${version}, ${shipped.length} shipped files`);
