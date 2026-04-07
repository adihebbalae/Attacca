#!/usr/bin/env node

/**
 * create-agent-boilerplate
 *
 * Interactive CLI to scaffold a multi-agent AI coding boilerplate.
 * Supports: GitHub Copilot, Cursor, Cline, Windsurf, Claude Code,
 * Codex CLI, Gemini CLI, and Google Antigravity.
 *
 * Usage: npx create-agent-boilerplate [directory]
 */

import { createInterface } from 'node:readline';
import { resolve, join, dirname } from 'node:path';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { getAdapterFiles } from '../src/adapters.js';
import { getSharedFiles } from '../src/shared.js';

// ─── Input handling (works both interactive and piped) ──────────────
let lineBuffer = [];
let lineIndex = 0;
let stdinDone = false;
let lineWaiters = [];

function initInput() {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) {
      // Interactive mode — use readline
      resolve('tty');
      return;
    }
    // Piped mode — buffer all lines upfront
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => {
      lineBuffer = data.split(/\r?\n/).filter(l => l.length > 0);
      stdinDone = true;
      resolve('piped');
      // Flush any waiting resolvers
      for (const waiter of lineWaiters) waiter();
      lineWaiters = [];
    });
  });
}

function getNextLine() {
  if (lineIndex < lineBuffer.length) {
    return Promise.resolve(lineBuffer[lineIndex++]);
  }
  if (stdinDone) return Promise.resolve('');
  return new Promise((resolve) => {
    lineWaiters.push(() => resolve(lineBuffer[lineIndex++] || ''));
  });
}

let rl;

function ask(question, options) {
  if (options) {
    console.log(`\n${question}`);
    options.forEach((opt, i) => console.log(`  ${i + 1}. ${opt}`));
  }

  if (rl) {
    // Interactive mode
    return new Promise((resolve) => {
      const prompt = options ? 'Choose (comma-separated for multiple): ' : `\n${question} `;
      rl.question(prompt, (answer) => {
        if (options) {
          const indices = answer.split(',').map(s => parseInt(s.trim(), 10) - 1);
          resolve(indices.filter(i => i >= 0 && i < options.length).map(i => options[i]));
        } else {
          resolve(answer);
        }
      });
    });
  }

  // Piped mode
  return getNextLine().then((answer) => {
    console.log(`> ${answer}`);
    if (options) {
      const indices = answer.split(',').map(s => parseInt(s.trim(), 10) - 1);
      return indices.filter(i => i >= 0 && i < options.length).map(i => options[i]);
    }
    return answer;
  });
}

function askYesNo(question) {
  if (rl) {
    return new Promise((resolve) => {
      rl.question(`\n${question} (y/n): `, (answer) => {
        resolve(answer.trim().toLowerCase().startsWith('y'));
      });
    });
  }
  console.log(`\n${question} (y/n):`);
  return getNextLine().then((answer) => {
    console.log(`> ${answer}`);
    return answer.trim().toLowerCase().startsWith('y');
  });
}

// ─── Tool definitions ───────────────────────────────────────────────
const TOOLS = [
  { name: 'copilot',      label: 'GitHub Copilot (VS Code)',      adapter: 'copilot' },
  { name: 'cursor',       label: 'Cursor',                        adapter: 'cursor' },
  { name: 'cline',        label: 'Cline (VS Code extension)',     adapter: 'cline' },
  { name: 'windsurf',     label: 'Windsurf',                      adapter: 'windsurf' },
  { name: 'claude',       label: 'Claude Code CLI',               adapter: 'claude' },
  { name: 'codex',        label: 'Codex CLI (OpenAI)',            adapter: 'codex' },
  { name: 'gemini',       label: 'Gemini CLI (Google)',           adapter: 'gemini' },
  { name: 'antigravity',  label: 'Google Antigravity',            adapter: 'antigravity' },
];

const SKILL_PACKS = {
  engineering: [
    'code-review', 'security-audit', 'tdd', 'quality-gate',
    'update-workspace-map', 'supply-chain', 'sbom', 'incident-response', 'auto-run',
  ],
  marketing: [
    'ab-test-setup', 'ad-creative', 'ai-seo', 'analytics-tracking',
    'churn-prevention', 'cold-email', 'competitor-alternatives', 'content-strategy',
    'copy-editing', 'copywriting', 'email-sequence', 'form-cro', 'free-tool-strategy',
    'launch-strategy', 'marketing-ideas', 'marketing-psychology', 'onboarding-cro',
    'page-cro', 'paid-ads', 'paywall-upgrade-cro', 'popup-cro', 'pricing-strategy',
    'product-marketing-context', 'product-research', 'programmatic-seo',
    'referral-program', 'revops', 'sales-enablement', 'schema-markup',
    'seo-audit', 'signup-flow-cro', 'site-architecture', 'social-content',
  ],
};

// ─── Main ───────────────────────────────────────────────────────────
async function main() {
  const inputMode = await initInput();
  if (inputMode === 'tty') {
    rl = createInterface({ input: process.stdin, output: process.stdout });
  }

  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║   create-agent-boilerplate                                  ║');
  console.log('║   Multi-agent AI coding scaffold for any IDE                ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');

  // Target directory
  const dirArg = process.argv[2];
  const targetDir = resolve(dirArg || '.');
  if (dirArg && !existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }
  console.log(`\nTarget: ${targetDir}`);

  // 1. Tool selection
  const toolLabels = TOOLS.map(t => t.label);
  const selectedLabels = await ask('Which AI coding tools do you use?', toolLabels);
  const selectedTools = TOOLS.filter(t => selectedLabels.includes(t.label));

  if (selectedTools.length === 0) {
    console.log('\nNo tools selected. Exiting.');
    if (rl) rl.close();
    process.exit(0);
  }

  // 2. LLM backend
  const llmOptions = ['Cloud only (default)', 'Local LLMs (Ollama, LM Studio, etc.)', 'Hybrid (cloud + local)'];
  const llmChoice = (await ask('What LLM backend will you use?', llmOptions))[0] || llmOptions[0];
  const llmMode = llmChoice.startsWith('Cloud') ? 'cloud' : llmChoice.startsWith('Local') ? 'local' : 'hybrid';

  // 3. Agent complexity
  const complexityOptions = ['Full multi-agent (Manager, Engineer, Security, Designer, Researcher, Medic, Consultant)', 'Simplified (Manager + Engineer + Security only)'];
  const complexityChoice = (await ask('Agent complexity?', complexityOptions))[0] || complexityOptions[0];
  const fullAgents = complexityChoice.startsWith('Full');

  // 4. Skill packs
  const skillOptions = ['Engineering only', 'Marketing only', 'All skills', 'None'];
  const skillChoice = (await ask('Which skill packs to include?', skillOptions))[0] || skillOptions[0];
  let includeSkills = [];
  if (skillChoice.startsWith('Engineering')) includeSkills = SKILL_PACKS.engineering;
  else if (skillChoice.startsWith('Marketing')) includeSkills = SKILL_PACKS.marketing;
  else if (skillChoice.startsWith('All')) includeSkills = [...SKILL_PACKS.engineering, ...SKILL_PACKS.marketing];

  // Summary
  console.log('\n── Configuration ──────────────────────────────────────────');
  console.log(`  Tools:      ${selectedTools.map(t => t.name).join(', ')}`);
  console.log(`  LLM mode:   ${llmMode}`);
  console.log(`  Agents:     ${fullAgents ? 'full' : 'simplified'}`);
  console.log(`  Skills:     ${includeSkills.length > 0 ? includeSkills.length + ' skills' : 'none'}`);
  console.log('───────────────────────────────────────────────────────────');

  const proceed = await askYesNo('Proceed?');
  if (!proceed) {
    console.log('Aborted.');
    if (rl) rl.close();
    process.exit(0);
  }

  // ─── Generate files ─────────────────────────────────────────────
  const selectedAdapters = selectedTools.map(t => t.adapter);
  const allAdapters = TOOLS.map(t => t.adapter);
  const unusedAdapters = allAdapters.filter(a => !selectedAdapters.includes(a));

  // Shared files (state, workspace-map, etc.)
  const sharedFiles = getSharedFiles({ fullAgents, llmMode });
  writeAll(targetDir, sharedFiles);

  // Selected adapter files
  for (const adapter of selectedAdapters) {
    const files = getAdapterFiles(adapter, { fullAgents, llmMode });
    writeAll(targetDir, files);
  }

  // Move unused adapter templates to .boilerplate/templates/
  for (const adapter of unusedAdapters) {
    const files = getAdapterFiles(adapter, { fullAgents, llmMode });
    const templateFiles = {};
    for (const [path, content] of Object.entries(files)) {
      templateFiles[`.boilerplate/templates/${adapter}/${path}`] = content;
    }
    writeAll(targetDir, templateFiles);
  }

  // Skill stubs (SKILL.md placeholder — full content added by /init-project)
  if (includeSkills.length > 0) {
    for (const skill of includeSkills) {
      const skillPath = `.github/skills/${skill}/SKILL.md`;
      const dest = join(targetDir, skillPath);
      if (!existsSync(dest)) {
        ensureDir(dest);
        writeFileSync(dest, `# ${skill}\n\nSkill placeholder — full content loaded by the boilerplate template.\n`);
      }
    }
  }

  // Write boilerplate.config.json
  const config = {
    version: '3.0.0',
    tools: selectedAdapters,
    llmMode,
    agents: fullAgents ? 'full' : 'simplified',
    skills: includeSkills,
    unusedTemplates: unusedAdapters,
    createdAt: new Date().toISOString(),
  };
  writeFileSync(join(targetDir, 'boilerplate.config.json'), JSON.stringify(config, null, 2) + '\n');

  // Local LLM warning
  if (llmMode === 'local' || llmMode === 'hybrid') {
    console.log('\n⚠  Local LLM note:');
    console.log('   Multi-agent orchestration requires strong instruction-following.');
    console.log('   Recommended local models: Qwen 2.5 Coder 32B, DeepSeek Coder V2 33B,');
    console.log('   Codestral 22B, or Llama 3.1 70B. Models under 13B may struggle with');
    console.log('   complex handoff protocols and state management.');
  }

  // Summary
  const fileCount = Object.keys(sharedFiles).length +
    selectedAdapters.reduce((n, a) => n + Object.keys(getAdapterFiles(a, { fullAgents, llmMode })).length, 0);

  console.log(`\n✓ Scaffolded ${fileCount} files for: ${selectedAdapters.join(', ')}`);
  console.log(`  ${unusedAdapters.length} unused adapters saved to .boilerplate/templates/`);
  console.log(`  Config saved to boilerplate.config.json`);
  console.log('\nNext steps:');
  console.log('  1. Open the project in your IDE');
  console.log('  2. Select the Manager agent');
  console.log('  3. Run /init-project with your PRD');

  if (rl) rl.close();
}

function writeAll(baseDir, files) {
  for (const [relPath, content] of Object.entries(files)) {
    const dest = join(baseDir, relPath);
    ensureDir(dest);
    writeFileSync(dest, content);
  }
}

function ensureDir(filePath) {
  const dir = dirname(filePath);
  if (dir) mkdirSync(dir, { recursive: true });
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
