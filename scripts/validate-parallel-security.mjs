#!/usr/bin/env node

/**
 * validate-parallel-security.mjs
 *
 * Validates that the Parallel Per-PR Security feature (v3.11.0+) is properly installed.
 * Checks for required files, protocol references, and configuration.
 *
 * Exit codes:
 *   0 = All checks pass
 *   1 = One or more checks failed
 *
 * Usage: node scripts/validate-parallel-security.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const REQUIRED_FILES = [
  '.agents/security-classifier.md',
  '.agents/audits/.gitkeep',
  '.github/prompts/audit-prs.prompt.md',
];

const PROTOCOL_REFS = [
  {
    file: 'CLAUDE.md',
    pattern: 'Per-PR Review',
    description: 'Per-PR Review section in CLAUDE.md',
  },
  {
    file: '.github/copilot-instructions.md',
    pattern: 'Per-PR Review',
    description: 'Per-PR Review section in copilot-instructions.md',
  },
  {
    file: '.github/agents/manager.agent.md',
    pattern: 'Per-PR Review (Parallel Mode)',
    description: 'Per-PR Review section in manager.agent.md',
  },
  {
    file: '.claude/agents/security.md',
    pattern: 'Per-PR Mode',
    description: 'Per-PR Mode section in security.md (Claude Code)',
  },
  {
    file: '.github/agents/security.agent.md',
    pattern: 'Per-PR Mode',
    description: 'Per-PR Mode section in security.agent.md (Copilot)',
  },
  {
    file: '.cursor/rules/manager.mdc',
    pattern: 'Per-PR Review',
    description: 'Per-PR Review section in Cursor manager rules',
  },
  {
    file: '.clinerules/manager.md',
    pattern: 'Per-PR Review',
    description: 'Per-PR Review section in Cline manager rules',
  },
  {
    file: '.windsurfrules',
    pattern: 'Per-PR Review',
    description: 'Per-PR Review section in Windsurf rules',
  },
  {
    file: 'AGENTS.md',
    pattern: 'Per-PR Review',
    description: 'Per-PR Review section in AGENTS.md',
  },
  {
    file: 'GEMINI.md',
    pattern: 'Per-PR Review',
    description: 'Per-PR Review section in GEMINI.md',
  },
  {
    file: '.agents/rules/manager.md',
    pattern: 'Per-PR Review',
    description: 'Per-PR Review section in Antigravity manager rules',
  },
  {
    file: '.agents/workspace-map.md',
    pattern: 'security-classifier.md',
    description: 'security-classifier.md referenced in workspace-map',
  },
];

let failures = 0;

console.log('🔍 Validating Parallel Per-PR Security (v3.11.0+)...\n');

// Check 1: Required files exist
console.log('1️⃣  Checking required files:');
for (const filePath of REQUIRED_FILES) {
  const fullPath = path.join(projectRoot, filePath);
  if (fs.existsSync(fullPath)) {
    const stat = fs.statSync(fullPath);
    console.log(`   ✅ ${filePath} (${stat.size} bytes)`);
  } else {
    console.log(`   ❌ ${filePath} — MISSING`);
    failures++;
  }
}
console.log('');

// Check 2: Protocol references exist in key files
console.log('2️⃣  Checking protocol references:');
for (const ref of PROTOCOL_REFS) {
  const fullPath = path.join(projectRoot, ref.file);
  if (!fs.existsSync(fullPath)) {
    console.log(`   ❌ ${ref.file} — FILE NOT FOUND (can't check for "${ref.pattern}")`);
    failures++;
    continue;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  if (content.includes(ref.pattern)) {
    console.log(`   ✅ ${ref.file} — ${ref.description}`);
  } else {
    console.log(
      `   ❌ ${ref.file} — MISSING reference: "${ref.pattern}"`
    );
    failures++;
  }
}
console.log('');

// Check 3: state.json schema documentation
console.log('3️⃣  Checking state.json schema documentation:');
const statePath = path.join(projectRoot, '.agents/state.json');
if (!fs.existsSync(statePath)) {
  console.log(`   ❌ .agents/state.json — FILE NOT FOUND`);
  failures++;
} else {
  const stateContent = fs.readFileSync(statePath, 'utf-8');
  if (stateContent.includes('review_queue')) {
    console.log(`   ✅ .agents/state.json — review_queue documented in _schema_notes`);
  } else {
    console.log(`   ❌ .agents/state.json — MISSING review_queue in _schema_notes`);
    failures++;
  }
}
console.log('');

// Check 4: Classifier document quality
console.log('4️⃣  Checking classifier protocol document:');
const classifierPath = path.join(projectRoot, '.agents/security-classifier.md');
if (!fs.existsSync(classifierPath)) {
  console.log(`   ❌ .agents/security-classifier.md — FILE NOT FOUND`);
  failures++;
} else {
  const classifierContent = fs.readFileSync(classifierPath, 'utf-8');
  const requiredSections = [
    'SIMPLE',
    'COMPLEX',
    'Configuration',
    'Per-Project Override',
    'Examples',
  ];

  let missingSections = [];
  for (const section of requiredSections) {
    if (!classifierContent.includes(section)) {
      missingSections.push(section);
    }
  }

  if (missingSections.length === 0) {
    console.log(`   ✅ Classifier document includes all required sections`);
  } else {
    console.log(`   ❌ Classifier document — MISSING sections: ${missingSections.join(', ')}`);
    failures++;
  }
}
console.log('');

// Check 5: Security agent per-PR mode documentation
console.log('5️⃣  Checking Security agent per-PR mode sections:');
const securityClaude = path.join(projectRoot, '.claude/agents/security.md');
const securityGithub = path.join(projectRoot, '.github/agents/security.agent.md');

if (fs.existsSync(securityClaude)) {
  const content = fs.readFileSync(securityClaude, 'utf-8');
  if (content.includes('## Per-PR Mode')) {
    console.log(`   ✅ .claude/agents/security.md — Per-PR Mode section present`);
  } else {
    console.log(`   ❌ .claude/agents/security.md — MISSING Per-PR Mode section`);
    failures++;
  }
} else {
  console.log(`   ⚠️  .claude/agents/security.md — file not found (optional)`);
}

if (fs.existsSync(securityGithub)) {
  const content = fs.readFileSync(securityGithub, 'utf-8');
  if (content.includes('## Per-PR Mode')) {
    console.log(`   ✅ .github/agents/security.agent.md — Per-PR Mode section present`);
  } else {
    console.log(`   ❌ .github/agents/security.agent.md — MISSING Per-PR Mode section`);
    failures++;
  }
} else {
  console.log(`   ⚠️  .github/agents/security.agent.md — file not found (optional)`);
}
console.log('');

// Check 6: Audit-prs command exists
console.log('6️⃣  Checking /audit-prs slash command:');
const auditPrsPath = path.join(projectRoot, '.github/prompts/audit-prs.prompt.md');
if (fs.existsSync(auditPrsPath)) {
  const content = fs.readFileSync(auditPrsPath, 'utf-8');
  if (content.includes('/audit-prs')) {
    console.log(`   ✅ /audit-prs command documented in audit-prs.prompt.md`);
  } else {
    console.log(`   ❌ /audit-prs command — poorly formatted or incomplete`);
    failures++;
  }
} else {
  console.log(`   ❌ .github/prompts/audit-prs.prompt.md — MISSING`);
  failures++;
}
console.log('');

// Final report
console.log('═══════════════════════════════════════');
if (failures === 0) {
  console.log('✅ All validation checks passed!');
  console.log('\nParallel Per-PR Security (v3.11.0) is properly installed:');
  console.log('  • Classifier protocol documented');
  console.log('  • Per-PR Security audit mode defined in both agents');
  console.log('  • /audit-prs slash command available');
  console.log('  • All Manager protocols updated (8/8+ files)');
  console.log('  • State schema documents review_queue field');
  console.log('  • Security audit directory created');
  process.exit(0);
} else {
  console.log(`❌ ${failures} validation check(s) failed`);
  console.log('\nTo fix:');
  console.log('  1. Verify all required files exist in the paths listed above');
  console.log('  2. Ensure protocol sections are properly formatted');
  console.log('  3. Check that all Manager files reference "Per-PR Review"');
  console.log('  4. Confirm Security agents have Per-PR Mode sections');
  console.log('  5. Re-run this script to confirm all checks pass');
  process.exit(1);
}
