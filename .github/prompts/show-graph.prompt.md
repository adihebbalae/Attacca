---
description: "Show the dependency graph of project modules as ASCII art with build order and critical path."
agent: "manager"
---

Read `.agents/MODULES.md` and generate:

1. **ASCII dependency graph** showing which modules depend on which
2. **Parallel build groups** — modules with no dependency between them (can be built simultaneously)
3. **Critical path** — the longest sequential chain from start to completion
4. **Status overlay** — mark each module with its current status icon

Example output format:
```
PROJECT DEPENDENCY GRAPH
─────────────────────────
✅ core
  ├── 🔄 auth
  │     └── ⏸ api
  │           └── ⏳ frontend
  └── 🔄 database
              └── ⏸ api (shared)

⏳ infra (depends on: all modules)
─────────────────────────
BUILD ORDER
  Group 1 (now):        ✅ core
  Group 2 (parallel):   🔄 auth, 🔄 database
  Group 3 (after 2):    ⏸ api
  Group 4 (after 3):    ⏳ frontend
  Group 5 (last):       ⏳ infra

CRITICAL PATH: core → auth → api → frontend (4 steps)
ESTIMATED PARALLEL SAVINGS: build database alongside auth to save 1 step
```

Icons: ✅ complete | 🔄 in-progress | ⏸ blocked | ⏳ design

After the graph, recommend which group to tackle next given current statuses.
