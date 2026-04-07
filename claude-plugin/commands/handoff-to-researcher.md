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
Check `.agents/research/` for any prior research to build on.

**Step 4: Execute.**
Perform the research following your protocol. When done:
- Write full report to `.agents/research/[topic-slug].md`
- Write Executive Summary (3-5 bullets) to `.agents/handoff.md` for Manager
- Update `.agents/state.json` task status
