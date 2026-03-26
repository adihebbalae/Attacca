---
description: "Hand off current task to the Designer agent for UX/design review."
agent: "designer"
argument-hint: "TASK-ID and brief description — e.g. TASK-004: review checkout flow"
---

Task: $ARGUMENTS

First, read `.agents/handoff.md` and extract the Task ID and title from the `# Handoff:` heading. Output this as your very first line:

```
💬 Rename this chat: "[TASK-ID]: [task title] → @designer"
```

Then proceed: read `.agents/state.json` for project context, provide design guidance, feedback, or specs following your protocol, and write your output back to `.agents/handoff.md`.
