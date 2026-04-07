---
description: "Hand off an architectural decision to the Consultant agent by TASK-ID. Use when Engineer is blocked after 3 attempts, or for complex tradeoff decisions."
agent: "consultant"
argument-hint: "Just the TASK-ID — e.g. TASK-005"
---

Your TASK-ID: $ARGUMENTS

**Step 1: Get the task title.**
Read `.agents/state.json`. Find the entry in `tasks` matching the TASK-ID above. Extract the `title` field.

If `$ARGUMENTS` is blank or the task is not found in state.json, read `.agents/handoff.md` and extract the title from the `# Handoff:` heading instead.

**Step 2: Output your rename line first — before anything else:**
```
💬 Rename this chat: "[TASK-ID]: [task title] → @consultant"
```

**Step 3: Load context.**
Read `.agents/handoff.md` for the architectural question or decision brief.
Read `.agents/state.json` for full project context.
Read ALL files referenced in the handoff — never make assumptions about code you haven't seen.

**Step 4: Execute.**
Provide deep structured analysis following your protocol. When done:
- Write your recommendation (options, tradeoffs, decision, implementation path) to `.agents/handoff.md`
- Update `.agents/state.json` with decision summary and rationale
- Report to Manager: your recommendation and confidence level
