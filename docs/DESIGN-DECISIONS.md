# Attacca 4.0 — Design Decisions

Recorded 2026-07-08, after a full repo review and market research through 2026-07-07.

## Why the rewrite
v3 existed to make 2025 GitHub Copilot behave like Claude Code: persona agents (Manager/Engineer/Security…) coordinated through state files, ported to 8 tools. By mid-2026, Claude Code natively shipped subagents, agent teams, dynamic workflows, session memory, hooks, and plugin distribution; the community documented persona hierarchies, state machines, and clone-a-boilerplate as anti-patterns; and 5 of the 8 ported tools died or faded (Gemini CLI sunset June 2026, Windsurf→Devin, Roo archived, Kiro niche, Codex-manual-mode obsolete). The valuable 20% — skills, hooks, security gating, intake interrogation — became three plugins.

## The razor (Bitter Lesson, applied)
Sutton's Bitter Lesson: general methods that leverage computation beat human-encoded knowledge as scale grows. Applied here — **process knowledge gets eaten by every model generation; context and verification don't.** So every artifact Attacca ships must be one of:

- **Context** — facts the model cannot know: project decisions, domain constraints, question frameworks, preferences.
- **Verification** — checks the model cannot skip: hooks, gates, tests, audits.

Never **process** — step-by-step workflow the model already knows. When in doubt, delete: a missing instruction costs one clarifying question; a stale instruction silently degrades every session.

Corollaries:
1. **Design for subtraction.** Every skill carries a `Delete when:` condition naming the native capability that will obsolete it. The scaffold should shrink as models improve.
2. **Verification scales with compute.** A push gate gets *more* valuable as agents get faster and ship more. Gates are hooks (deterministic), never protocol prose (probabilistic).
3. **Prefer native primitives.** Subagents, plan mode, memory, plugins — they improve with the platform for free; custom machinery only decays.
4. **Model tiers, not pins** (`model: sonnet`, never a dated model string). Reading/judging subagents run on mid-tier models; only the main loop needs frontier reasoning.

## Why personas died but the anti-bias rule survived
Personas told the model *how to act* — process, and worse than the native harness at its own job. But v3's rule that Security receives **file paths only** was never persona engineering — it was **context isolation**: an auditor who can't see the commit message can't be biased by it. That's context engineering, and it survives as the `security-auditor` subagent's contract. Same logic keeps `critic` (fresh eyes = no attachment to the implementation) and `researcher` (disposable context for bulk reading).

## Why CONTEXT.md and not state.json
Native auto-memory is machine-local and personal; git history records *what* changed but not *what was decided and why not the alternative*. A thin committed CONTEXT.md is the only artifact that gives a fresh clone, a teammate, or a cloud agent instant orientation. It's prose because its readers include humans; it's capped at ~100 lines because past that nobody — human or model — actually reads it.

## Why interrogate is the flagship
"Build a webstore with stripe and auth, db, backend, live prices" naively produces a generic site. The model *can* ask good questions but won't reliably choose to; a question framework (which domains must be resolved before building — auth, payments, data, integrations, hosting, budget, non-goals) is context the model won't consistently apply unprompted. The skill's output is itself context: the CONTEXT.md spec that makes every later session better.

## Distribution: plugins over cloning
Clone-and-cherry-pick meant every project forked the boilerplate and drifted. Plugins version centrally, update in place, and make "take what I need" a per-project install choice (core / security / init). The `template/` directory is the entire per-project footprint: 4 small files.
