---
description: "Hand off current decision to the Consultant agent for deep architectural reasoning."
agent: "consultant"
argument-hint: "TASK-ID and brief description — e.g. TASK-005: evaluate DB sharding strategy"
---

Task: $ARGUMENTS

First, read `.agents/handoff.md` and extract the Task ID and title from the `# Handoff:` heading. Output this as your very first line:

```
💬 Rename this chat: "[TASK-ID]: [task title] → @consultant"
```

Then proceed: read `.agents/state.json` for full project context, read ALL referenced files, provide deep structured analysis following your protocol, and write your recommendation back to `.agents/handoff.md`.
