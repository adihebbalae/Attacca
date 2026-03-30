---
description: "Disable an agent—hide it from the GitHub Copilot picker. The agent will only be accessible as a subagent."
agent: "manager"
argument-hint: "(Optional) agent name to disable, or leave blank to pick from list"
---

# Disable Agent Command

You are disabling an agent so it does NOT appear in the GitHub Copilot picker under the **@agent** dropdown. The agent will still be accessible as a subagent (called internally by other agents).

## Current Agent Status

Read all `.agent.md` files in `.github/agents/` and show the user a table like this:

```
| Agent | Current Status | UserInvocable? |
|-------|---|---|
| manager | 🟢 Visible | true (always) |
| researcher | 🟢 Visible | true |
| engineer | 🔴 Hidden | false |
| security | 🔴 Hidden | false |
| designer | 🔴 Hidden | false |
| consultant | 🔴 Hidden | false |
| medic | 🔴 Hidden | false |
```

## Which Agent to Disable?

**NEVER allow disabling the manager agent** — if user tries, reject with:
> Manager must always be user-invocable. It's your primary entry point and cannot be hidden.

If the user provided an agent name as `$ARGUMENTS`, verify it exists and is not `manager`.

If `$ARGUMENTS` is empty, ask: **"Which agent would you like to hide from the picker?"** and list only the currently visible ones (excluding manager).

## Disable It

For the selected agent file (e.g., `.github/agents/engineer.agent.md`):

**If the file does NOT have `user-invocable: false` in the YAML frontmatter:**
- Add a new line: `user-invocable: false` in the YAML header
- Place it after the `model:` field (or at the end of the frontmatter)
- Example transformation:
  ```yaml
  ---
  description: "..."
  tools: [...]
  model: Claude Sonnet 4.5 (copilot)
  user-invocable: false  ← ADD THIS LINE
  ---
  ```

**If the file already has `user-invocable: false`:**
- It's already hidden — no change needed

## Confirm

Show the user:
```
✅ Updated: .github/agents/[agent-name].agent.md
   Status: Now hidden from @agent picker (still accessible as subagent)
   Next: Reload VS Code to see the agent removed from the dropdown
```

## Constraints

- **Manager CANNOT be disabled** — enforce this unconditionally
- All agent names are: `manager`, `researcher`, `engineer`, `security`, `designer`, `consultant`, `medic`
- Only modify `.github/agents/` agents (not `.claude/agents/`)
- Disabling an agent does NOT remove it from the subagent pool — other agents can still call it internally
