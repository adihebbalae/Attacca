import * as vscode from 'vscode';
import * as path from 'node:path';
import { AdapterName, TemplateOptions, ScaffoldConfig } from './types';
import { getSharedFiles, getAdapterFiles, SKILL_PACKS, ALL_ADAPTERS } from './templates';

interface AdapterOption {
  label: string;
  name: AdapterName;
  picked: boolean;
}

export async function runScaffold(): Promise<void> {
  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) {
    vscode.window.showErrorMessage('Attacca: No workspace folder open. Please open a folder first.');
    return;
  }

  // ── Safety check ───────────────────────────────────────────────
  const existingConfig = await tryReadJson<ScaffoldConfig>(
    vscode.Uri.joinPath(workspaceRoot, 'attacca.config.json')
  );
  if (existingConfig) {
    const overwrite = await vscode.window.showWarningMessage(
      `Attacca is already initialized (v${existingConfig.version}, tools: ${existingConfig.tools.join(', ')}).`,
      { modal: true },
      'Re-initialize (overwrites config files)',
      'Cancel'
    );
    if (overwrite !== 'Re-initialize (overwrites config files)') {
      return;
    }
  }

  // ── Step 1: Tool selection ──────────────────────────────────────
  const toolOptions: AdapterOption[] = [
    { label: '$(copilot) GitHub Copilot (VS Code)', name: 'copilot', picked: true },
    { label: '$(terminal) Cursor', name: 'cursor', picked: false },
    { label: '$(extensions) Cline (VS Code extension)', name: 'cline', picked: false },
    { label: '$(zap) Windsurf', name: 'windsurf', picked: false },
    { label: '$(robot) Claude Code CLI', name: 'claude', picked: false },
    { label: '$(cloud) Codex CLI (OpenAI)', name: 'codex', picked: false },
    { label: '$(sparkle) Gemini CLI (Google)', name: 'gemini', picked: false },
    { label: '$(beaker) Google Antigravity', name: 'antigravity', picked: false },
  ];

  const selectedTools = await vscode.window.showQuickPick(
    toolOptions.map(t => ({ ...t, description: '' })),
    {
      placeHolder: 'Which AI coding tools do you use? (space to toggle, enter to confirm)',
      canPickMany: true,
      ignoreFocusOut: true,
      title: 'Attacca — Step 1/4: Select Tools',
    }
  );

  if (!selectedTools || selectedTools.length === 0) {
    vscode.window.showInformationMessage('Attacca: Setup cancelled.');
    return;
  }
  const selectedAdapters = selectedTools.map(t => (t as AdapterOption).name);

  // ── Step 2: LLM backend ────────────────────────────────────────
  const llmChoice = await vscode.window.showQuickPick(
    [
      { label: '$(cloud) Cloud only (default)', value: 'cloud' as const, description: 'GPT-4o, Claude, Gemini — recommended' },
      { label: '$(server-process) Local LLMs (Ollama, LM Studio)', value: 'local' as const, description: 'Qwen 2.5 Coder 32B, DeepSeek Coder V2 33B+' },
      { label: '$(plug) Hybrid (cloud + local)', value: 'hybrid' as const, description: 'Use both based on task' },
    ],
    {
      placeHolder: 'What LLM backend will you use?',
      ignoreFocusOut: true,
      title: 'Attacca — Step 2/4: LLM Backend',
    }
  );

  if (!llmChoice) { return; }

  // ── Step 3: Agent complexity ───────────────────────────────────
  const complexityChoice = await vscode.window.showQuickPick(
    [
      {
        label: '$(organization) Full multi-agent',
        value: true,
        description: 'Manager + Engineer + Security + Designer + Researcher + Medic + Consultant',
      },
      {
        label: '$(person) Simplified',
        value: false,
        description: 'Manager + Engineer + Security only — good for solo projects',
      },
    ],
    {
      placeHolder: 'Agent complexity?',
      ignoreFocusOut: true,
      title: 'Attacca — Step 3/4: Agent Complexity',
    }
  );

  if (!complexityChoice) { return; }

  // ── Step 4: Skill packs ────────────────────────────────────────
  const skillChoice = await vscode.window.showQuickPick(
    [
      {
        label: '$(tools) Engineering skills',
        value: 'engineering',
        description: 'code-review, security-audit, tdd, quality-gate, supply-chain, sbom, incident-response…',
      },
      {
        label: '$(megaphone) Marketing skills',
        value: 'marketing',
        description: 'copywriting, seo-audit, email-sequence, page-cro, pricing-strategy, content-strategy…',
      },
      {
        label: '$(library) All skills (engineering + marketing)',
        value: 'all',
        description: `${SKILL_PACKS.engineering.length + SKILL_PACKS.marketing.length} skills total`,
      },
      {
        label: '$(circle-slash) None',
        value: 'none',
        description: 'Skip skill files — add later with Check for Updates',
      },
    ],
    {
      placeHolder: 'Which skill packs to include?',
      ignoreFocusOut: true,
      title: 'Attacca — Step 4/4: Skill Packs',
    }
  );

  if (!skillChoice) { return; }

  const includeSkills: string[] =
    skillChoice.value === 'engineering' ? SKILL_PACKS.engineering :
    skillChoice.value === 'marketing' ? SKILL_PACKS.marketing :
    skillChoice.value === 'all' ? [...SKILL_PACKS.engineering, ...SKILL_PACKS.marketing] :
    [];

  // ── Summary confirmation ───────────────────────────────────────
  const opts: TemplateOptions = {
    fullAgents: complexityChoice.value as boolean,
    llmMode: llmChoice.value,
  };

  const summary = [
    `Tools: ${selectedAdapters.join(', ')}`,
    `LLM: ${llmChoice.value}`,
    `Agents: ${opts.fullAgents ? 'full (7 agents)' : 'simplified (3 agents)'}`,
    `Skills: ${includeSkills.length > 0 ? `${includeSkills.length} skill stubs` : 'none'}`,
  ].join('\n');

  const confirm = await vscode.window.showInformationMessage(
    `Attacca — Ready to scaffold:\n\n${summary}`,
    { modal: true },
    'Initialize',
    'Cancel'
  );

  if (confirm !== 'Initialize') {
    return;
  }

  // ── Write files ────────────────────────────────────────────────
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Attacca: Initializing project…',
      cancellable: false,
    },
    async (progress) => {
      const unusedAdapters = ALL_ADAPTERS.filter(a => !selectedAdapters.includes(a));
      let filesWritten = 0;

      // Shared files
      progress.report({ message: 'Writing state files…', increment: 10 });
      const sharedFiles = getSharedFiles(opts);
      for (const [relPath, content] of Object.entries(sharedFiles)) {
        await writeWorkspaceFile(workspaceRoot, relPath, content);
        filesWritten++;
      }

      // Selected adapter files
      progress.report({ message: 'Writing adapter config files…', increment: 30 });
      for (const adapter of selectedAdapters) {
        const files = getAdapterFiles(adapter, opts);
        for (const [relPath, content] of Object.entries(files)) {
          await writeWorkspaceFile(workspaceRoot, relPath, content);
          filesWritten++;
        }
      }

      // Unused adapter templates (saved to .boilerplate/templates/)
      progress.report({ message: 'Saving unused adapter templates…', increment: 20 });
      for (const adapter of unusedAdapters) {
        const files = getAdapterFiles(adapter, opts);
        for (const [relPath, content] of Object.entries(files)) {
          await writeWorkspaceFile(workspaceRoot, `.boilerplate/templates/${adapter}/${relPath}`, content);
          filesWritten++;
        }
      }

      // Skill stubs
      if (includeSkills.length > 0) {
        progress.report({ message: `Writing ${includeSkills.length} skill stubs…`, increment: 20 });
        for (const skill of includeSkills) {
          const skillPath = `.github/skills/${skill}/SKILL.md`;
          const skillUri = vscode.Uri.joinPath(workspaceRoot, skillPath);
          try {
            await vscode.workspace.fs.stat(skillUri);
            // File exists — skip
          } catch {
            await writeWorkspaceFile(workspaceRoot, skillPath, `# ${skill}\n\nSkill placeholder — run "Attacca: Check for Updates" to pull full content from GitHub.\n`);
            filesWritten++;
          }
        }
      }

      // Config file
      progress.report({ message: 'Writing config…', increment: 10 });
      const config: ScaffoldConfig = {
        version: '3.0.0',
        tools: selectedAdapters,
        llmMode: llmChoice.value,
        agents: opts.fullAgents ? 'full' : 'simplified',
        skills: includeSkills,
        unusedTemplates: unusedAdapters,
        createdAt: new Date().toISOString(),
      };
      await writeWorkspaceFile(workspaceRoot, 'attacca.config.json', JSON.stringify(config, null, 2) + '\n');

      // BOILERPLATE_VERSION file
      await writeWorkspaceFile(workspaceRoot, '.github/BOILERPLATE_VERSION', `v3.0.0\n# Template: adihebbalae/Attacca\n# Do not edit manually — updated by Attacca extension\n`);

      progress.report({ message: 'Done!', increment: 10 });

      const localWarning = (llmChoice.value === 'local' || llmChoice.value === 'hybrid')
        ? '\n\nLocal LLM note: Multi-agent orchestration requires a strong instruction-following model. Recommended: Qwen 2.5 Coder 32B, DeepSeek Coder V2 33B, or Codestral 22B.'
        : '';

      vscode.window.showInformationMessage(
        `✓ Attacca initialized (${filesWritten} files). Open the Manager agent and run /init-project to begin.${localWarning}`,
        'Open Manager Chat'
      ).then(action => {
        if (action === 'Open Manager Chat') {
          vscode.commands.executeCommand('workbench.action.chat.open', {
            query: 'You are the Manager agent. Read .agents/state.json and .agents/workspace-map.md. Then greet the user and ask them to run /init-project or share their PRD.',
          });
        }
      });
    }
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────

export function getWorkspaceRoot(): vscode.Uri | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri;
}

async function writeWorkspaceFile(rootUri: vscode.Uri, relativePath: string, content: string): Promise<void> {
  const fileUri = vscode.Uri.joinPath(rootUri, relativePath);
  const dir = path.dirname(relativePath);
  if (dir && dir !== '.') {
    await vscode.workspace.fs.createDirectory(vscode.Uri.joinPath(rootUri, dir));
  }
  await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content, 'utf8'));
}

async function tryReadJson<T>(uri: vscode.Uri): Promise<T | null> {
  try {
    const bytes = await vscode.workspace.fs.readFile(uri);
    return JSON.parse(Buffer.from(bytes).toString('utf8')) as T;
  } catch {
    return null;
  }
}
