// Shared TypeScript type definitions for the Attacca extension.

export interface AgentState {
  project: string;
  description: string;
  phase: string;
  last_updated: string;
  last_updated_by: string;
  current_task: {
    id: string;
    title: string;
    assigned_to: string;
    status: string;
    priority: string;
  };
  handoff: {
    from: string;
    to: string;
    model: string;
    prompt_file: string;
    approved_by_user: boolean;
    created_at: string;
  };
  context: {
    current_file_focus: string;
    recent_decisions: string[];
    blocked_on: string | null;
  };
  security_status: {
    last_scan: string;
    open_findings: number;
    cleared_for_push: boolean;
  };
  tasks: Record<string, unknown>;
  decisions: unknown[];
  changelog: unknown[];
}

export type AdapterName =
  | 'copilot'
  | 'cursor'
  | 'cline'
  | 'windsurf'
  | 'claude'
  | 'codex'
  | 'gemini'
  | 'antigravity';

export interface TemplateOptions {
  fullAgents: boolean;
  llmMode: 'cloud' | 'local' | 'hybrid';
}

export interface ScaffoldConfig {
  version: string;
  tools: AdapterName[];
  llmMode: 'cloud' | 'local' | 'hybrid';
  agents: 'full' | 'simplified';
  skills: string[];
  unusedTemplates: AdapterName[];
  createdAt: string;
}

// Webview message types
export type WebviewMessage =
  | { type: 'switchAgent'; agent: string }
  | { type: 'openState' }
  | { type: 'openHandoff' }
  | { type: 'pickSkill' }
  | { type: 'init' }
  | { type: 'checkUpdates' };
