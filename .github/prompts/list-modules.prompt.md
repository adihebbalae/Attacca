---
description: "Show current status of all project modules. Use during complex projects to track what's done, in-progress, and blocked."
agent: "manager"
---

Read `.agents/MODULES.md` and produce a formatted status table using these icons:
- ✅ `complete` — all acceptance criteria met, committed
- 🔄 `in-progress` — actively being built
- ⏸ `blocked` — waiting on a dependency or external blocker
- ⏳ `design` — not yet started

Output format:
```
MODULE STATUS — [project name]
──────────────────────────────────────────────────────────
Module         Status           Depends On       Updated
──────────────────────────────────────────────────────────
core           ✅ complete        none             2026-03-28
auth           🔄 in-progress     core             2026-03-29
database       🔄 in-progress     core             2026-03-29
api            ⏸ blocked         auth, database   —
frontend       ⏳ design          api              —
infra          ⏳ design          all              —
──────────────────────────────────────────────────────────
UNBLOCKED NEXT: [modules whose dependencies are all complete]
BLOCKED:        [modules still waiting on in-progress dependencies]
```

After the table, suggest the next task based on UNBLOCKED NEXT and the current phase in `.agents/state.json`.
