import * as vscode from 'vscode';
import { AgentState, WebviewMessage } from './types';

const AGENTS = ['manager', 'engineer', 'security', 'designer', 'researcher', 'consultant', 'medic'];

export class AgentPanelProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'attacca.agentPanel';

  private view?: vscode.WebviewView;
  private state: AgentState | null = null;

  constructor(private readonly extensionUri: vscode.Uri) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    webviewView.webview.html = this.buildHtml(webviewView.webview, this.state);

    webviewView.webview.onDidReceiveMessage((msg: WebviewMessage) => {
      this.handleMessage(msg);
    });
  }

  updateState(state: AgentState | null): void {
    this.state = state;
    if (this.view) {
      this.view.webview.html = this.buildHtml(this.view.webview, state);
    }
  }

  private handleMessage(msg: WebviewMessage): void {
    switch (msg.type) {
      case 'switchAgent':
        this.switchToAgent(msg.agent);
        break;
      case 'openState':
        vscode.commands.executeCommand('attacca.openState');
        break;
      case 'openHandoff':
        openFileInEditor('.agents/handoff.md');
        break;
      case 'pickSkill':
        vscode.commands.executeCommand('attacca.pickSkill');
        break;
      case 'init':
        vscode.commands.executeCommand('attacca.init');
        break;
      case 'checkUpdates':
        vscode.commands.executeCommand('attacca.checkUpdates');
        break;
    }
  }

  private switchToAgent(agent: string): void {
    const handoffPrompts: Record<string, string> = {
      manager:    'You are the Manager agent. Read .agents/state.json and .agents/workspace-map.md. Report current status and ask the user what to do next.',
      engineer:   'You are the Engineer agent. Read .agents/handoff.md for your task, then implement it. Run tests and update .agents/state.json when done.',
      security:   'You are the Security agent. Read .agents/handoff.md for the list of files to audit. Audit them against OWASP Top 10. Do NOT read commit messages. Report findings.',
      designer:   'You are the Designer agent. Read .agents/handoff.md for the design task. Review the interface and write specs. Do not write code.',
      researcher: 'You are the Researcher agent. Read .agents/handoff.md for the research brief. Gather intelligence and write findings to .agents/research/.',
      consultant: 'You are the Consultant agent. Read .agents/handoff.md. Reason through the problem deeply and give a concrete recommendation.',
      medic:      'You are the Medic agent. Read .agents/handoff.md for the incident description. Triage, diagnose, fix, verify. Time budget: 20 minutes.',
    };

    const prompt = handoffPrompts[agent] ?? `You are the ${agent} agent. Read .agents/handoff.md and begin your session.`;

    vscode.commands.executeCommand('workbench.action.chat.open', { query: prompt })
      .then(undefined, () => {
        // Fallback: copy to clipboard
        vscode.env.clipboard.writeText(prompt);
        vscode.window.showInformationMessage(`Copilot Chat not available — handoff prompt copied to clipboard. Paste it in your AI chat session.`);
      });
  }

  private buildHtml(webview: vscode.Webview, state: AgentState | null): string {
    const nonce = getNonce();
    const csp = `default-src 'none'; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}';`;

    const phase = state?.phase ?? '0 — Not Started';
    const agent = state?.last_updated_by ?? '—';
    const taskTitle = state?.current_task?.title ?? 'None';
    const taskAgent = state?.current_task?.assigned_to ?? '';
    const blockedOn = state?.context?.blocked_on ?? null;
    const securityCleared = state?.security_status?.cleared_for_push ?? false;
    const openFindings = state?.security_status?.open_findings ?? 0;
    const lastUpdated = state?.last_updated ? formatDate(state.last_updated) : '—';
    const projectName = state?.project || 'No project initialized';
    const handoffPending = state?.handoff?.to && !state?.handoff?.approved_by_user;

    const blockedBanner = blockedOn ? `
      <div class="alert alert-warning">
        <span class="icon">⚠</span>
        <span><strong>Blocked:</strong> ${escHtml(blockedOn)}</span>
      </div>` : '';

    const handoffBanner = handoffPending ? `
      <div class="alert alert-info">
        <span class="icon">🔀</span>
        <span>Pending handoff to <strong>${escHtml(state!.handoff.to)}</strong> — awaiting approval</span>
        <button class="btn-small" onclick="post('openHandoff')">View</button>
      </div>` : '';

    const securityRow = securityCleared
      ? `<div class="stat-row stat-ok"><span>✓</span><span>Security cleared for push</span></div>`
      : `<div class="stat-row ${openFindings > 0 ? 'stat-warn' : 'stat-neutral'}">
           <span>${openFindings > 0 ? '✗' : '○'}</span>
           <span>Security: ${openFindings > 0 ? `${openFindings} open finding(s)` : 'not scanned'}</span>
         </div>`;

    const agentButtons = AGENTS.map(a => `
      <button class="agent-btn ${a === agent.toLowerCase() ? 'active' : ''}"
              onclick="post('switchAgent', '${a}')"
              title="Open Copilot Chat as ${capitalise(a)}">
        <span class="agent-icon">${agentIcon(a)}</span>
        ${capitalise(a)}
      </button>`).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Agent Dashboard</title>
<style nonce="${nonce}">
  :root {
    --gap: 8px;
    --radius: 6px;
  }
  body {
    font-family: var(--vscode-font-family);
    font-size: var(--vscode-font-size);
    color: var(--vscode-foreground);
    background: transparent;
    padding: 0 12px 16px;
    margin: 0;
    line-height: 1.4;
  }
  h2 {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--vscode-descriptionForeground);
    margin: 16px 0 6px;
    padding-bottom: 4px;
    border-bottom: 1px solid var(--vscode-widget-border, #333);
  }
  .project-name {
    font-size: 13px;
    font-weight: 600;
    margin: 12px 0 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .phase-badge {
    display: inline-block;
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 10px;
    background: var(--vscode-badge-background);
    color: var(--vscode-badge-foreground);
    margin-bottom: 8px;
  }
  .stat-row {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 3px 0;
    font-size: 12px;
  }
  .stat-row span:first-child { min-width: 14px; text-align: center; }
  .stat-ok   { color: var(--vscode-terminal-ansiGreen,  #4ec94e); }
  .stat-warn { color: var(--vscode-terminal-ansiYellow, #e5c07b); }
  .stat-neutral { color: var(--vscode-descriptionForeground); }
  .task-box {
    background: var(--vscode-editor-inactiveSelectionBackground, rgba(255,255,255,0.04));
    border-radius: var(--radius);
    padding: 8px 10px;
    margin-top: 4px;
  }
  .task-title {
    font-size: 12px;
    font-weight: 500;
    margin: 0 0 2px;
  }
  .task-meta { font-size: 11px; color: var(--vscode-descriptionForeground); margin: 0; }
  .alert {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    padding: 7px 10px;
    border-radius: var(--radius);
    font-size: 12px;
    margin-top: 8px;
  }
  .alert-warning {
    background: rgba(229,192,123,0.12);
    border-left: 3px solid #e5c07b;
  }
  .alert-info {
    background: rgba(97,175,239,0.10);
    border-left: 3px solid #61afef;
  }
  .alert .icon { font-size: 13px; flex-shrink: 0; margin-top: 1px; }
  .agent-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
    margin-top: 4px;
  }
  .agent-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 8px;
    border: 1px solid var(--vscode-button-border, var(--vscode-widget-border, transparent));
    border-radius: var(--radius);
    background: var(--vscode-button-secondaryBackground);
    color: var(--vscode-button-secondaryForeground);
    font-size: 12px;
    cursor: pointer;
    transition: background 0.1s;
    white-space: nowrap;
  }
  .agent-btn:hover { background: var(--vscode-button-secondaryHoverBackground); }
  .agent-btn.active {
    background: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    border-color: var(--vscode-button-background);
  }
  .agent-icon { font-size: 13px; }
  .action-row {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-top: 4px;
  }
  .btn-action {
    padding: 6px 10px;
    border: 1px solid var(--vscode-button-border, var(--vscode-widget-border, transparent));
    border-radius: var(--radius);
    background: var(--vscode-button-secondaryBackground);
    color: var(--vscode-button-secondaryForeground);
    font-size: 12px;
    cursor: pointer;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .btn-action:hover { background: var(--vscode-button-secondaryHoverBackground); }
  .btn-init {
    width: 100%;
    padding: 8px 10px;
    margin-top: 16px;
    border: none;
    border-radius: var(--radius);
    background: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }
  .btn-init:hover { background: var(--vscode-button-hoverBackground); }
  .btn-small {
    padding: 1px 6px;
    border: 1px solid currentColor;
    border-radius: 3px;
    background: none;
    color: inherit;
    font-size: 11px;
    cursor: pointer;
    margin-left: auto;
  }
  .last-updated {
    font-size: 10px;
    color: var(--vscode-descriptionForeground);
    margin-top: 14px;
    text-align: center;
  }
</style>
</head>
<body>
<div class="project-name" title="${escHtml(projectName)}">${escHtml(projectName)}</div>
<div class="phase-badge">${escHtml(phase)}</div>

${blockedBanner}
${handoffBanner}

<h2>Status</h2>
<div class="stat-row">
  <span>⏱</span>
  <span>Last agent: <strong>${escHtml(capitalise(agent))}</strong></span>
</div>
${securityRow}

<h2>Current Task</h2>
<div class="task-box">
  <p class="task-title">${escHtml(taskTitle)}</p>
  ${taskAgent ? `<p class="task-meta">Assigned to ${escHtml(capitalise(taskAgent))}</p>` : ''}
</div>

<h2>Switch Agent</h2>
<div class="agent-grid">
  ${agentButtons}
</div>

<h2>Actions</h2>
<div class="action-row">
  <button class="btn-action" onclick="post('openState')">
    <span>📄</span> Open state.json
  </button>
  <button class="btn-action" onclick="post('openHandoff')">
    <span>🔀</span> View handoff.md
  </button>
  <button class="btn-action" onclick="post('pickSkill')">
    <span>🔧</span> Pick a skill
  </button>
  <button class="btn-action" onclick="post('checkUpdates')">
    <span>🔄</span> Check for updates
  </button>
</div>

<button class="btn-init" onclick="post('init')">+ Initialize / Re-initialize Project</button>

<p class="last-updated">Last updated: ${escHtml(lastUpdated)}</p>

<script nonce="${nonce}">
  const vscode = acquireVsCodeApi();
  function post(type, agent) {
    if (agent !== undefined) {
      vscode.postMessage({ type, agent });
    } else {
      vscode.postMessage({ type });
    }
  }
</script>
</body>
</html>`;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────

function getNonce(): string {
  let text = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

function agentIcon(agent: string): string {
  const icons: Record<string, string> = {
    manager:    '🗂',
    engineer:   '⚙',
    security:   '🔒',
    designer:   '🎨',
    researcher: '🔍',
    consultant: '🧠',
    medic:      '🚑',
  };
  return icons[agent] ?? '🤖';
}

async function openFileInEditor(relativePath: string): Promise<void> {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) { return; }
  const uri = vscode.Uri.joinPath(folders[0].uri, relativePath);
  try {
    const doc = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(doc);
  } catch {
    vscode.window.showWarningMessage(`Could not open ${relativePath} — file may not exist yet.`);
  }
}
