import * as vscode from 'vscode';
import { AgentPanelProvider } from './agentPanel';
import { AgentStateWatcher } from './stateWatcher';
import { AgentStatusBar } from './statusBar';
import { runScaffold } from './scaffold';
import { runSkillPicker } from './skillPicker';
import { checkForUpdates } from './updater';

export function activate(context: vscode.ExtensionContext): void {
  const { subscriptions } = context;

  // ── Core services ─────────────────────────────────────────────
  const stateWatcher = new AgentStateWatcher();
  const statusBar    = new AgentStatusBar();
  const panelProvider = new AgentPanelProvider(context.extensionUri);

  subscriptions.push(stateWatcher, statusBar);

  // Propagate state changes to all consumers
  stateWatcher.event(state => {
    statusBar.update(state);
    panelProvider.updateState(state);
  });

  // Start watching once workspace is available
  if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
    stateWatcher.start();
  }
  subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(() => stateWatcher.start())
  );

  // ── Sidebar panel ─────────────────────────────────────────────
  subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      AgentPanelProvider.viewType,
      panelProvider,
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  );

  // ── Commands ──────────────────────────────────────────────────

  subscriptions.push(
    vscode.commands.registerCommand('attacca.init', () => {
      runScaffold().catch(err => {
        vscode.window.showErrorMessage(`Attacca: Initialization failed — ${(err as Error).message}`);
      });
    })
  );

  subscriptions.push(
    vscode.commands.registerCommand('attacca.checkUpdates', () => {
      checkForUpdates(context.extension.packageJSON.version as string).catch(err => {
        vscode.window.showErrorMessage(`Attacca: Update check failed — ${(err as Error).message}`);
      });
    })
  );

  subscriptions.push(
    vscode.commands.registerCommand('attacca.openState', async () => {
      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        vscode.window.showErrorMessage('No workspace folder open.');
        return;
      }
      const uri = vscode.Uri.joinPath(folders[0].uri, '.agents', 'state.json');
      try {
        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc);
      } catch {
        vscode.window.showWarningMessage('.agents/state.json not found. Initialize a project first.', 'Initialize').then(a => {
          if (a === 'Initialize') { vscode.commands.executeCommand('attacca.init'); }
        });
      }
    })
  );

  subscriptions.push(
    vscode.commands.registerCommand('attacca.pickSkill', () => {
      runSkillPicker().catch(err => {
        vscode.window.showErrorMessage(`Attacca: Skill picker failed — ${(err as Error).message}`);
      });
    })
  );

  subscriptions.push(
    vscode.commands.registerCommand('attacca.switchAgent', async () => {
      const agents = [
        { label: '🗂  Manager',    description: 'Project orchestrator — plan, delegate, review progress' },
        { label: '⚙  Engineer',   description: 'Code implementation specialist' },
        { label: '🔒  Security',   description: 'Adversarial security auditor' },
        { label: '🎨  Designer',   description: 'UI/UX design consultant' },
        { label: '🔍  Researcher', description: 'Product and market intelligence' },
        { label: '🧠  Consultant', description: 'Deep architectural reasoning (use sparingly)' },
        { label: '🚑  Medic',      description: 'Emergency incident responder (SEV 1 only)' },
      ];

      const picked = await vscode.window.showQuickPick(agents, {
        placeHolder: 'Select an agent to switch to',
        title: 'Attacca — Switch Agent',
      });

      if (!picked) { return; }

      const agentName = picked.label.replace(/^.+\s+/, '').toLowerCase(); // strip emoji + space
      const prompts: Record<string, string> = {
        manager:    'You are the Manager agent. Read .agents/state.json and .agents/workspace-map.md. Report current status and ask the user what to do next.',
        engineer:   'You are the Engineer agent. Read .agents/handoff.md and implement the described task. Run tests, update .agents/state.json when done.',
        security:   'You are the Security agent. Read .agents/handoff.md for the audit scope. Audit files against OWASP Top 10. Do not read commit messages.',
        designer:   'You are the Designer agent. Read .agents/handoff.md for the design task. Review and write specs. Do not write code.',
        researcher: 'You are the Researcher agent. Read .agents/handoff.md for the brief. Gather intelligence and write to .agents/research/.',
        consultant: 'You are the Consultant agent. Read .agents/handoff.md and reason through the problem. Give a concrete recommendation.',
        medic:      'You are the Medic agent. Read .agents/handoff.md for the incident. Triage, fix, verify. Time budget: 20 minutes.',
      };

      const query = prompts[agentName] ?? `You are the ${agentName} agent. Read .agents/handoff.md and begin your session.`;

      vscode.commands.executeCommand('workbench.action.chat.open', { query })
        .then(undefined, () => {
          vscode.env.clipboard.writeText(query);
          vscode.window.showInformationMessage('Handoff prompt copied to clipboard — paste it in your AI assistant.');
        });
    })
  );

  subscriptions.push(
    vscode.commands.registerCommand('attacca.showPanel', () => {
      vscode.commands.executeCommand('attacca-container.focus');
    })
  );
}

export function deactivate(): void {
  // Subscriptions are disposed automatically via context.subscriptions
}
