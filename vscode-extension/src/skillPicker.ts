import * as vscode from 'vscode';

export async function runSkillPicker(): Promise<void> {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    vscode.window.showErrorMessage('Attacca: No workspace folder open.');
    return;
  }

  const skillsRoot = vscode.Uri.joinPath(folders[0].uri, '.github', 'skills');

  // Enumerate skill directories
  let skillDirs: [string, vscode.FileType][];
  try {
    skillDirs = await vscode.workspace.fs.readDirectory(skillsRoot);
  } catch {
    vscode.window.showWarningMessage(
      'Attacca: No skills directory found (.github/skills/). Initialize a project first.',
      'Initialize'
    ).then(action => {
      if (action === 'Initialize') {
        vscode.commands.executeCommand('attacca.init');
      }
    });
    return;
  }

  const skills = skillDirs
    .filter(([, type]) => type === vscode.FileType.Directory)
    .map(([name]) => name)
    .sort();

  if (skills.length === 0) {
    vscode.window.showInformationMessage('No skills found in .github/skills/.');
    return;
  }

  // Build quick-pick items with descriptions from the first line of SKILL.md
  const items = await Promise.all(
    skills.map(async (skill) => {
      const skillMdUri = vscode.Uri.joinPath(skillsRoot, skill, 'SKILL.md');
      let description = '';
      try {
        const bytes = await vscode.workspace.fs.readFile(skillMdUri);
        const text = Buffer.from(bytes).toString('utf8');
        // Extract first non-empty, non-header line as description
        const lines = text.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---')) {
            description = trimmed.length > 80 ? trimmed.slice(0, 79) + '…' : trimmed;
            break;
          }
        }
      } catch {
        description = 'No description available';
      }
      return { label: skill, description, skillUri: skillMdUri } as vscode.QuickPickItem & { skillUri: vscode.Uri };
    })
  );

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Search and select a skill to open',
    matchOnDescription: true,
    title: 'Attacca — Pick a Skill',
  });

  if (!selected) { return; }

  const item = selected as typeof items[0];
  try {
    const doc = await vscode.workspace.openTextDocument(item.skillUri);
    await vscode.window.showTextDocument(doc);
  } catch {
    vscode.window.showWarningMessage(`Could not open SKILL.md for "${item.label}".`);
  }
}
