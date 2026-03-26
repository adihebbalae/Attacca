---
description: "Hand off current task to the Security agent for adversarial audit."
agent: "security"
argument-hint: "TASK-ID and brief description — e.g. TASK-003: audit auth flow"
---

Task: $ARGUMENTS

First, read `.agents/handoff.md` and extract the Task ID and title from the `# Handoff:` heading. Output this as your very first line:

```
💬 Rename this chat: "[TASK-ID]: [task title] → @security"
```

Then proceed: read `.agents/state.json` to understand what changed, perform a full adversarial security audit following your protocol, and write your report back to `.agents/handoff.md`.
