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

## What we took from ICM, and what we left (4.3)

Van Clief & McDermott's *Interpretable Context Methodology* (arXiv:2603.16021, Mar 2026) argues that filesystem structure can replace framework orchestration: numbered stage folders, a five-layer context hierarchy (L0 identity → L1 routing → L2 stage contract → L3 reference material → L4 working artifacts), and plain-text handoffs through `output/` directories that double as human edit surfaces.

**Adopted — the L3/L4 seam.** Reference material that is stable across runs belongs in different files from per-run working artifacts, because they ask different things of the model: *internalise these as constraints* versus *transform this input*. Attacca had both in one `CONTEXT.md`, which is why the append-only decision trail kept losing the ~100-line budget fight to a task list that goes stale in a week. Split into `CONTEXT.md` (L3) and `.attacca/focus.md` (L4). This is context, not process — it survives the razor.

**Adopted — Inputs tables.** ICM's stage contracts declare which files load and *which sections of them*. Attacca's skills said "read `references/honesty.md`" in prose: whole-file, unauditable, and impossible to lint. A declared Inputs table is checkable, and section-scoping is prevention rather than compression ([Liu et al. 2024](https://arxiv.org/abs/2307.03172)).

**Adopted — the guardrails, as validator checks.** ICM's conventions (line budgets, one canonical source per fact, no cyclic cross-references) are stated as prose discipline. Prose discipline decays; `scripts/validate-plugins.mjs` doesn't. Moving them into the validator turns them from process into verification, which is the razor's preferred form. The first thing the check caught was ours: `grill-with-docs` defined `CONTEXT.md` as "a glossary and nothing else" while `CONTEXT-SCHEMA.md` defined it as Project/Stack/Decisions — two authoritative schemas for one filename. The glossary moved to `docs/GLOSSARY.md`.

**Rejected — numbered stage folders.** `stages/01-research/`, `stages/02-script/` with numbered Process steps inside each is *process*: exactly what the razor deletes, and exactly what each model generation gets better at without us. The paper agrees by omission — §5.2 scopes ICM out of "workflows that require complex branching logic," and software development is that case. A build is not a pipeline with review gates between fixed passes; it branches on what the tests say. Scaffolding stage folders into every project would ship a control surface for a shape the work doesn't have.

**Rejected — the workspace-builder.** A skill whose output is a scaffold of skills is a process generator. Attacca's equivalent is `/interrogate`, which produces context (a spec) rather than a folder structure, and adapts its questions instead of walking a fixed questionnaire.

**Already ahead — verification.** ICM's §6.2 proposes cross-stage audit sections and "breakpoints in markdown" as future work, and its §4 audit file is described as a proto-debugger the *agent* runs. Attacca ships that as deterministic hooks — `audit-gate.mjs` blocks `git push` on a stale audit, `read-once.mjs` blocks redundant reads — because a check the model can decline to run is not a gate. Corollary 2 of the razor: verification scales with compute, so it must be code, not prose.

**Adopted, and named — score and performance.** ICM calls its two content layers "Layer 3" and "Layer 4," with the recipe/ingredients analogy carrying the meaning. Numbered layers are a decoder ring: nothing about "Layer 3" tells you what goes in it, so the mapping has to be memorised and re-taught. Attacca uses *the score* (`CONTEXT.md`) and *a performance* (`.attacca/focus.md`) instead.

The test for whether branded vocabulary earns its place is whether it **generates** the rule or merely labels it. This one generates three:

1. A performance never edits the score → `/wrap-session` appends, never rewrites.
2. You can lose a performance, not the score → append-only decisions, and never gitignore `.attacca/` wholesale.
3. When performances keep failing the same way, fix the score → repeated corrections get proposed as amendments.

Someone who knows only the metaphor derives all three; someone who knows only "Layer 3 vs Layer 4" derives none. It also makes the product name load-bearing rather than ornamental — *attacca* is the instruction to proceed without pause, and these two files are the mechanism that lets a session do it.

Rule 3 is ICM's own §6.3 "edit the source, not the output" principle, which the paper describes as desirable and unimplemented. It's cheap to implement within a session (no new state: recurring corrections are visible in the transcript), and it's the only part of this change that makes a project get *better* with use rather than merely stay organised.

The branding stops there, deliberately. Filenames stay boring — `CONTEXT.md` is a recognised convention and `AGENTS.md` is a cross-tool standard, so renaming them to `SCORE.md`/`PERFORMANCE.md` would force every other agent to learn Attacca's private vocabulary for zero comprehension gain. No acronym, no musicalised skill names, no themed validator checks. Vocabulary that has to be looked up is process wearing a costume.

**Worth knowing before leaning further on it:** the paper's §4.6 states plainly that no controlled comparison against monolithic prompting was ever run. The context-scoping quality claim rests on Liu et al. by analogy plus 33 self-reported practitioner conversations from an invite-only, self-selected community. The interaction claims (observability, editability, review gates) stand on their own; the performance claim is a hypothesis. We adopted the parts that are defensible as plain information architecture regardless of whether the effect size holds.

## Distribution: plugins over cloning
Clone-and-cherry-pick meant every project forked the boilerplate and drifted. Plugins version centrally, update in place, and make "take what I need" a per-project install choice (core / security / init). The `template/` directory is the entire per-project footprint: 4 small files.
