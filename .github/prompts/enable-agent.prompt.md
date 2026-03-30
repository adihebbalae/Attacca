---
description: "Enable an agent—make it visible in the GitHub Copilot picker. The agent will appear in the @agent dropdown."
agent: "manager"
argument-hint: "(Optional) agent name to enable, or leave blank to pick from list"
---

# Enable Agent Command

You are enabling an agent to appear in the GitHub Copilot picker under the **@agent** dropdown.

## Current Agent Status

Read all `.agent.md` files in `.github/agents/` and show the user a table like this:

```
| Agent | Current Status | UIInvocable? |
|-------|---|---|
| manager | 🟢 Visible | true (always) |
| researcher | 🟢 Visible | true |
| engineer | 🔴 Hidden | false |
| security | 🔴 Hidden | false |
| designer | 🔴 Hidden | false |
| consultant | 🔴 Hidden | false |
| medic | 🔴 Hidden | false |
```

## Which Agent to Enable?

If the user provided an agent name as `$ARGUMENTS`, verify it exists and is not already visible.

If `$ARGUMENTS` is empty, ask: **"Which agent would you like to make visible in the picker?"** and list only the currently hidden ones.

## Enable It

For the selected agent file (e.g., `.github/agents/engineer.agent.md`):

**If the file has `user-invocable: false` in the YAML frontmatter:**
- Remove that line entirely
- Keep all other YAML fields
- Example transformation:
  ```yaml
  ---
  description: "..."
  tools: [...]
  user-invocable: false  ← REMOVE THIS LINE
  ---
  ```

**If the file does NOT have `user-invocable: false`:**
- It's already visible — no change needed

## Confirm

Show the user:
```
✅ Updated: .github/agents/[agent-name].agent.md
   Status: Now visible in @agent picker
   Next: Reload VS Code to see the change in the dropdown
```

## Constraints

- **Manager can never be disabled** — if user tries to disable manager, reject with: "Manager must always be user-invocable. It's your primary entry point."
- All agent names are: `manager`, `researcher`, `engineer`, `security`, `designer`, `consultant`, `medic`
- Only modify `.github/agents/` agents (not `.claude/agents/`)
