# Convergent design

*What happened when we read a paper that had independently arrived at our architecture.*

2026-08-14 — shipped in Attacca [4.3.0](../../CHANGELOG.md)

---

In August we sat down to read Van Clief & McDermott's *Interpretable Context Methodology* ([arXiv:2603.16021](https://arxiv.org/abs/2603.16021)) with the straightforward intention of stealing from it. ICM argues that filesystem structure can replace framework orchestration for sequential AI workflows: a five-layer context hierarchy, stage folders with declared contracts, and plain-text handoffs through directories that double as human edit surfaces.

Most of it was already in the repo under different names.

## The mapping

Neither project knew about the other. Here is what the overlap looked like once we lined them up:

| ICM | Attacca | Arrived at |
|---|---|---|
| L0 — identity, "where am I" | `CLAUDE.md` + `AGENTS.md` | independently, 4.0 |
| L1 — routing, not content | `CLAUDE.md` session protocol | independently, 4.0 |
| L2 — stage contract | `SKILL.md` frontmatter + steps | independently, 4.0 |
| L3 — reference material | `skills/*/references/` | independently, 4.0 |
| L4 — working artifacts | `validate-idea`'s working directory | independently, 4.1 |
| Setup questionnaire | `/interrogate` | independently, 4.0 |
| Review gates between stages | `validate-idea` Gates 0–5 | independently, 4.1 |
| One canonical source per fact | the razor's "when in doubt, delete" | independently, 4.0 |

Roughly seventy percent of the methodology, built by a different team, for a different tool, under a different name, in the same year.

## Why that isn't a coincidence

The temptation is to read convergence as vindication. It's weaker than that, and more useful.

Both projects were solving the same problem under the same constraints. A language model has a finite attention window, and it degrades in a specific, well-documented way: material in the middle of a long context gets used less reliably than material at either end ([Liu et al. 2024](https://arxiv.org/abs/2307.03172)). A coding session is stateless — every new one starts from nothing and has to be re-oriented. And the only substrate that both a model and a human can read, edit, diff, and review is a directory of text files.

Fix those three constraints and the design space collapses. You will end up separating stable facts from volatile ones, because they have different lifecycles. You will end up declaring what loads when, because you can't load everything. You will end up writing to files rather than to memory, because a human has to be able to correct it. There aren't many other places to land.

This is [Parnas (1972)](https://dl.acm.org/doi/10.1145/361598.361623) with a new substrate. Decompose by what changes at the same rate, hide the rest. That principle has been rediscovered every decade since; two teams rediscovering it for context windows in 2026 is the expected outcome, not a surprising one.

So the honest claim is not *our architecture is proven*. It's *this architecture is not arbitrary taste*. When two efforts under matched constraints land on the same shape without talking, the odds go down that either one is just a personal preference dressed up as a method. That's the entire epistemic payload — and it's worth more than a compliment, because it tells you which parts to keep when you're tempted to redesign.

## Where we were wrong

Convergence is most useful at the points where it fails, and there were two.

**ICM had the seam and we didn't.** ICM separates L3 (reference material, stable across runs) from L4 (working artifacts, per-run). Attacca had both in a single `CONTEXT.md` — project facts and decisions living alongside current focus, next steps, and blockers. They have opposite lifecycles and they were sharing one ~100-line budget, so the append-only decision trail kept losing space to a task list that goes stale in a week. That's exactly the wrong trade: git history can reconstruct what changed, but nothing reconstructs what was rejected and why.

We hadn't seen it because both halves were "context" to us. The paper's numbering made it impossible not to see. That's shipped in 4.3.0 as a two-file split.

**ICM declared its inputs and we described ours.** Every ICM stage names which files load and which *sections* of them. Attacca's skills said "read `references/honesty.md`" in prose: whole-file, unauditable, impossible to lint. Section-scoping is prevention rather than compression — you never put the irrelevant 300 lines in the window in the first place. Also shipped in 4.3.0.

## Where they were wrong

**Verification.** ICM's §6.2 proposes cross-stage audit sections and "breakpoints in markdown" as future work, and its audit file is described as something the *agent* runs. Attacca ships that as deterministic hooks: `audit-gate.mjs` blocks `git push` on a stale security audit, `read-once.mjs` blocks redundant reads. A check the model can decline to run is not a gate — it's a suggestion with good posture. As agents get faster and ship more, the value of a gate goes up, so it has to be code.

**Numbered stage folders.** `stages/01-research/`, `stages/02-script/`, with numbered process steps inside each. We rejected this outright: it's step-by-step workflow the model already knows, which is precisely what gets absorbed by every model generation for free. The paper agrees by omission — §5.2 scopes ICM out of "workflows that require complex branching logic," and software development is that case. A build is not a pipeline with review gates between fixed passes; it branches on what the tests say.

## The part we couldn't have gotten alone

ICM calls its two content layers "Layer 3" and "Layer 4." Numbered layers are a decoder ring: nothing about "Layer 3" tells you what belongs in it, so the mapping has to be memorised and re-taught every time.

Having been forced to articulate the seam, we named it. `CONTEXT.md` is **the score**: authoritative over every session, amended deliberately, never rewritten in passing. `.attacca/focus.md` is **a performance**: one session's rendering of the work, disposable by design.

The test for whether branded vocabulary earns its place is whether it *generates* the rule or merely labels it. This one generates three:

1. A performance never edits the score.
2. You can lose a performance; you can't lose the score.
3. When performances keep going wrong the same way, fix the score.

Someone who knows only the metaphor derives all three. Someone who knows only "Layer 3 vs Layer 4" derives none.

And rule 3 turned out to be ICM's own §6.3 — "edit the source, not the output" — which the paper describes as desirable and lists as unimplemented. It's cheap to implement inside a session, because recurring corrections are already visible in the transcript and need no new state. So `/wrap-session` now surfaces any correction you gave twice or more and proposes the amendment at the right level: `AGENTS.md` for a convention, `CONTEXT.md` for a settled fact, a hook for anything that should block rather than remind.

Two is the threshold; one correction is a preference. If you were corrected three times, it says so, because the last two sessions paid for a fix nobody made.

That's the only part of the change that makes a project get *better* with use rather than merely stay organised — and we got there by reading someone else's numbering scheme closely enough to be annoyed by it.

## The caveat, stated plainly

ICM's §4.6 says outright that no controlled comparison against monolithic prompting was ever run. The quality claim rests on Liu et al. by analogy, plus 33 self-reported practitioner conversations from an invite-only, self-selected community. We adopted the parts that are defensible as plain information architecture regardless of whether the effect size holds, and we're saying the same thing about our own split: it's a lifecycle argument, not a measured win.

Convergent evolution is evidence about a design space, not proof about a design. Two teams can independently arrive at the same mistake — that's most of the history of software methodology. What convergence does buy you is a shorter list of things worth arguing about.

## If you take one thing

Sort your context files by **lifecycle**, not by topic.

The instinct is to group by subject: everything about the project here, everything about the API there. The useful cut is how often a fact changes and who is allowed to change it. Facts that outlive the session go in one file that only ever grows. Facts that die with the session go in another that gets thrown away. Once they're separated, most of the hard questions about what to load, what to commit, and what to trust answer themselves.

---

**Full rationale, including everything we rejected:** [`docs/DESIGN-DECISIONS.md`](../DESIGN-DECISIONS.md) · **The two-file schema:** [`docs/CONTEXT-SCHEMA.md`](../CONTEXT-SCHEMA.md) · **Attacca:** [github.com/adihebbalae/Attacca](https://github.com/adihebbalae/Attacca)
