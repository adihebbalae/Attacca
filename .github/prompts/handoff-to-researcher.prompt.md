---
description: "Hand off a research task to the Researcher agent by TASK-ID. Reads task title and context automatically."
agent: "researcher"
argument-hint: "Just the TASK-ID — e.g. TASK-002"
---

Your TASK-ID: $ARGUMENTS

**Step 1: Get the task title.**
Read `.agents/state.json`. Find the entry in `tasks` matching the TASK-ID above. Extract the `title` field.

If `$ARGUMENTS` is blank or the task is not found in state.json, read `.agents/handoff.md` and extract the title from the `# Handoff:` heading instead.

**Step 2: Output your rename line first — before anything else:**
```
💬 Rename this chat: "[TASK-ID]: [task title] → @researcher"
```

**Step 3: Load context.**
Read `.agents/handoff.md` for the full research brief.
Read `.agents/state.json` for project context.
Check `.vscode/mcp.json` for available MCP servers (especially web search tools).
Check `.agents/research/` for any prior research to build on.

**Step 4: Load research skill.**
Read `.github/skills/product-research/SKILL.md` for research frameworks and epistemic standards.

**Step 5: Execute.**
Perform the research following your protocol in `researcher.agent.md`. Write findings to `.agents/research/[topic-slug].md` and a summary to `.agents/handoff.md`.
