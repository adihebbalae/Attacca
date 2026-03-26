---
description: "Hand off current task to the Engineer agent."
agent: "engineer"
argument-hint: "TASK-ID and brief description — e.g. TASK-001: build auth flow"
---

Task: $ARGUMENTS

First, read `.agents/handoff.md` and extract the Task ID and title from the `# Handoff:` heading. Output this as your very first line:

```
💬 Rename this chat: "[TASK-ID]: [task title] → @engineer"
```

Then proceed: read `.agents/state.json` for project context, `.agents/workspace-map.md` to find files, and execute the task following your protocol.
