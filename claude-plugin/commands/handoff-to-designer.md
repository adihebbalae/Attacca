---
description: "Hand off a UI/UX task to the Designer agent by TASK-ID. Reads task title and context automatically."
agent: "designer"
argument-hint: "Just the TASK-ID — e.g. TASK-004"
---

Your TASK-ID: $ARGUMENTS

**Step 1: Get the task title.**
Read `.agents/state.json`. Find the entry in `tasks` matching the TASK-ID above. Extract the `title` field.

If `$ARGUMENTS` is blank or the task is not found in state.json, read `.agents/handoff.md` and extract the title from the `# Handoff:` heading instead.

**Step 2: Output your rename line first — before anything else:**
```
💬 Rename this chat: "[TASK-ID]: [task title] → @designer"
```

**Step 3: Load context.**
Read `.agents/handoff.md` for the full design review brief (component/page, user goal, accessibility requirements).
Read `.agents/state.json` for project context.
Read any relevant component or template files referenced in the handoff.

**Step 4: Execute.**
Perform design review and produce component specs following your protocol. When done:
- Write your full review (accessibility, usability, component spec) to `.agents/handoff.md`
- Update `.agents/state.json` task status
- Report verdict: APPROVE / REQUEST CHANGES
