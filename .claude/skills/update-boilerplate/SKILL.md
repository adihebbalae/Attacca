---
name: update-boilerplate
description: "Safely upgrade this project's Attacca boilerplate files to the latest version. Shows a changelog diff of what's new, then applies non-destructive updates to agent/skill/prompt files without touching source code or project state."
---

# Update Boilerplate Skill

## When to Use
- User runs `/update-boilerplate`
- User asks "am I on the latest Attacca?" or "update the boilerplate"

---

## Step 1: Read Current Version

Read `.github/BOILERPLATE_VERSION`. Extract the version string from line 1 (e.g. `v3.12.1`).

Tell the user: "Current boilerplate version: [version]. Checking for updates..."

---

## Step 2: Fetch Latest Boilerplate

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/adihebbalae/Attacca.git /tmp/attacca-latest
cd /tmp/attacca-latest
git sparse-checkout set .github .agents .claude CHANGELOG.md
```

If the clone fails (auth or network), tell the user: "Clone failed — download https://github.com/adihebbalae/Attacca/archive/refs/heads/master.zip, extract to `/tmp/attacca-latest/`, then say 'continue'."

---

## Step 3: Version Check + Changelog Summary

Read line 1 of `/tmp/attacca-latest/.github/BOILERPLATE_VERSION` to get the latest version.

- If current == latest: say "You're already on [version] — the latest." Clean up (`rm -rf /tmp/attacca-latest`) and stop.
- If current < latest: continue.

Read `CHANGELOG.md` from `/tmp/attacca-latest/`. Extract every `## [x.y.z]` section that is newer than the current version (i.e. between current exclusive and latest inclusive). Display them verbatim:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  What's new: [current] → [latest]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[extracted changelog sections]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If the changelog range can't be determined: link to https://github.com/adihebbalae/Attacca/blob/master/CHANGELOG.md and continue.

---

## Step 4: Identify Changed Files

Compare these boilerplate-owned files between `/tmp/attacca-latest/` and the current project:

**AUTO-UPDATE (safe to overwrite — no project customization expected):**
- `.github/agents/*.agent.md`
- `.github/skills/*/SKILL.md`
- `.github/prompts/*.prompt.md`
- `.claude/skills/*/SKILL.md`
- `.github/copilot/hooks.json`
- `.github/BOILERPLATE_VERSION`

**MANUAL REVIEW REQUIRED (user may have customized these):**
- `.github/copilot-instructions.md`
- `CLAUDE.md`
- `.agents/workspace-map.md` — show diff but never auto-overwrite

**NEVER TOUCH:**
- `.agents/state.json`
- `.agents/state.md`
- `.agents/handoff.md`
- Any file outside `.github/`, `.agents/`, or `.claude/`

For each file, show a compact status:
```
[CHANGED] .github/agents/manager.agent.md — 12 lines changed
[NEW]     .claude/skills/update-boilerplate/SKILL.md — new file
[SAME]    .github/agents/engineer.agent.md — no changes
```

If no files changed: say "All boilerplate files are already up to date." and stop.

---

## Step 5: Preview Manual Review Files

For any MANUAL REVIEW file that changed, show the diff inline and ask:

**"This file may contain your project-specific customizations. Do you want to: (A) overwrite with latest, (B) skip, or (C) merge manually?"**

Wait for user response before continuing.

---

## Step 6: Apply Updates

For each AUTO-UPDATE file that is new or changed:
- Copy from `/tmp/attacca-latest/` to the project path, creating directories as needed
- Report: `✅ Updated: .github/agents/manager.agent.md`

Apply MANUAL REVIEW files only if the user chose (A) in Step 5.

---

## Step 7: Update Version File

Write the latest version string (and template comment) to `.github/BOILERPLATE_VERSION`.

Tell the user: "Updated to [new version]."

---

## Step 8: Clean Up

```bash
rm -rf /tmp/attacca-latest
```

---

## Step 9: Final Report

```
╔══════════════════════════════════════════════════════════════╗
║  ✅ Boilerplate Update Complete                              ║
╚══════════════════════════════════════════════════════════════╝

Updated:  [N] files
Skipped:  [N] files (no changes)
Manual:   [list any files user was asked about]

No project source code was modified.
```

---

## Safety Rules

- **Never overwrite `.agents/state.json`** — live project state
- **Never modify any file outside `.github/`, `.agents/`, or `.claude/`** — source code is off-limits
- **Never auto-merge `CLAUDE.md` or `copilot-instructions.md`** — always ask
- If any step fails, stop and report clearly — do NOT partially apply updates
