import * as vscode from 'vscode';
import { AgentState } from './types';

export class AgentStatusBar {
  private readonly mainItem: vscode.StatusBarItem;
  private readonly blockedItem: vscode.StatusBarItem;

  constructor() {
    this.mainItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    this.mainItem.command = 'attacca.showPanel';
    this.mainItem.tooltip = 'Attacca — click to open dashboard';

    this.blockedItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
    this.blockedItem.command = 'attacca.openState';
    this.blockedItem.tooltip = 'Agent is blocked — click to open state.json';
    this.blockedItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    this.blockedItem.color = new vscode.ThemeColor('statusBarItem.warningForeground');
  }

  update(state: AgentState | null): void {
    if (!state) {
      this.mainItem.text = '$(person) Attacca';
      this.mainItem.tooltip = 'Attacca — no state file found. Run Initialize Project to get started.';
      this.mainItem.show();
      this.blockedItem.hide();
      return;
    }

    const agent = state.last_updated_by || 'manager';
    const phase = state.phase || '0 — Not Started';
    const taskTitle = state.current_task?.title;
    const shortPhase = phase.split('—')[0].trim();

    this.mainItem.text = `$(person) ${capitalise(agent)} · Phase ${shortPhase}`;
    this.mainItem.tooltip = [
      `Agent: ${agent}`,
      `Phase: ${phase}`,
      taskTitle ? `Task: ${taskTitle}` : '',
      `Security cleared: ${state.security_status?.cleared_for_push ? 'yes' : 'no'}`,
    ].filter(Boolean).join('\n');
    this.mainItem.show();

    if (state.context?.blocked_on) {
      this.blockedItem.text = `$(warning) BLOCKED: ${truncate(state.context.blocked_on, 40)}`;
      this.blockedItem.show();
    } else {
      this.blockedItem.hide();
    }
  }

  dispose(): void {
    this.mainItem.dispose();
    this.blockedItem.dispose();
  }
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}
