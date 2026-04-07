import * as vscode from 'vscode';
import { AgentState } from './types';

export class AgentStateWatcher extends vscode.EventEmitter<AgentState | null> {
  private watcher?: vscode.FileSystemWatcher;
  private _lastState: AgentState | null = null;

  get lastState(): AgentState | null {
    return this._lastState;
  }

  start(): void {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) { return; }

    const pattern = new vscode.RelativePattern(folders[0], '.agents/state.json');
    this.watcher = vscode.workspace.createFileSystemWatcher(pattern);

    this.watcher.onDidChange(() => this.refresh());
    this.watcher.onDidCreate(() => this.refresh());
    this.watcher.onDidDelete(() => {
      this._lastState = null;
      this.fire(null);
    });

    // Initial read
    this.refresh();
  }

  async readState(): Promise<AgentState | null> {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) { return null; }

    const uri = vscode.Uri.joinPath(folders[0].uri, '.agents', 'state.json');
    try {
      const bytes = await vscode.workspace.fs.readFile(uri);
      const raw = JSON.parse(Buffer.from(bytes).toString('utf8')) as AgentState;
      return raw;
    } catch {
      return null;
    }
  }

  private async refresh(): Promise<void> {
    const state = await this.readState();
    this._lastState = state;
    this.fire(state);
  }

  override dispose(): void {
    this.watcher?.dispose();
    super.dispose();
  }
}
