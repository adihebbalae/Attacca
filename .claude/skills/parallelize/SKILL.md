---
name: parallelize
description: "Fan out 2+ isolated, non-dependent tasks to parallel Engineer subagents. Validates isolation, creates per-task handoff files, updates state.json, and spawns agents. Use when the task list contains work that can run simultaneously."
---

# Parallelize Skill

## When to Use
- Manager identifies 2+ tasks that are isolated and non-dependent
- User runs `/parallelize TASK-A TASK-B [TASK-C...]`
- After foundation task completes and parallel streams are ready

---

## Step 1: Validate Isolation

Before spawning anything, verify ALL of these pass for the task set:

- [ ] Each task operates on separate directory trees (no shared files)
- [ ] No task in the set depends on another task in the set
- [ ] All tasks depend on the same prior-completed task (or have no dependencies)
- [ ] Each task has a distinct handoff filename
- [ ] Manager can track all via `state.json` array form

**If any check fails**: Block parallelization. Explain which tasks overlap or have unresolved dependencies. Ask user to refactor the task split before proceeding.

---

## Step 2: Create Per-Task Handoff Files

For each task, write a dedicated handoff file:

- Primary task → `.agents/handoff.md`
- Each additional task → `.agents/handoff-TASK-X.md`

Each file contains: task ID, title, description, acceptance criteria, relevant workspace context, and instructions for the Engineer to delete only their own handoff file on completion.

---

## Step 3: Update `state.json`

Switch `handoff` to array form:

```json
"handoff": [
  { "task_id": "TASK-A", "status": "in_progress", "prompt_file": ".agents/handoff.md" },
  { "task_id": "TASK-B", "status": "in_progress", "prompt_file": ".agents/handoff-TASK-B.md" },
  { "task_id": "TASK-C", "status": "in_progress", "prompt_file": ".agents/handoff-TASK-C.md" }
]
```

---

## Step 4: Spawn Engineers

Use the Agent tool to spawn one Engineer subagent per task simultaneously (multiple Agent tool calls in a single response). Pass each agent its assigned handoff file as context.

Show the user the parallel dispatch summary:

```
Spawning [N] parallel Engineer subagents:

  🔧 Engineer A → TASK-A: [title]
  🔧 Engineer B → TASK-B: [title]
  🔧 Engineer C → TASK-C: [title]

All running simultaneously. Manager will aggregate results when complete.
```

---

## Step 5: Monitor and Aggregate

As each Engineer subagent completes:
1. Update `state.json` → mark their task `completed`
2. Update `.agents/state.md` dashboard
3. Check if any downstream tasks are now unblocked
4. Report to user: which tasks are done, which are still running, what's unblocked next

---

## Rules

- Never parallelize if isolation checklist has any failure
- If tasks share files with each other → block, ask user to refactor
- If a task in the set depends on another → block, explain the dependency chain
- Engineers delete only their own handoff file on completion — never touch parallel files
- For full isolation protocol, see `.agents/parallelization-protocol.md`
