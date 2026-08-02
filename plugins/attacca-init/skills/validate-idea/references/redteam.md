# Red team — separation of powers

## Why this is mechanical

By Gate 4 you have spent three gates with this idea and you like it more than you did at the start. Everyone does. Sunk context behaves like sunk cost.

Telling yourself to be objective does not undo that. An honesty *instruction* shares a context window with the advocacy it's supposed to check. An honesty *mechanism* puts them in different contexts.

So the red team runs in a **subagent that never sees the pitch**.

## What the red team receives

- `LEDGER.md`
- `PREREG.md`
- Nothing else.

Explicitly withheld: the user's framing, the user's enthusiasm, your summary of why this is promising, the product name if it's evocative, any of your prior reasoning.

The red team sees claims and evidence. Not a story.

If subagents are unavailable, run it in the most hostile fresh framing you can manage, and state in the output that separation was partial. Do not claim independence you did not achieve.

## Three passes, in order

### Pass 1 — Prosecution

Brief: *build the strongest possible case that this fails.* Not balanced. Not fair. Prosecution.

Required output:

1. **The kill shot** — the single most likely cause of death, in one sentence.
2. **Weakest load-bearing row** — which ledger row, if wrong, breaks the most, and why it might be wrong.
3. **The unfalsifiable ones** — assumptions in `PREREG.md` whose thresholds are set so low they cannot fail. Name them.
4. **Pre-mortem** — it's 12 months later, the thing failed, nobody is surprised. Write the three most probable causes, in past tense. Past tense matters: "we couldn't find a channel that converted under $80 CAC" surfaces failure modes that "there is a risk around acquisition" hides.
5. **What's missing** — which of the seven assumption classes has no evidence at all? Absence of evidence is the finding here, not a gap to paper over.
6. **Base rate check** — what usually happens to products in this category? Argue that this one is the usual case, not the exception.

### Pass 2 — Steelman

Same evidence, opposite brief: *the strongest honest case this works.*

Constrained to the ledger — it may not invent supporting facts. If the best case requires evidence that isn't there, **that is the finding**, and it must be stated: "the optimistic case depends on a willingness-to-pay figure nobody has measured."

This pass exists so the prosecution isn't rubber-stamped. A red team that always convicts is as useless as a grader that always approves.

### Pass 3 — Adjudication

Against `PREREG.md`, and nothing else.

For each pre-registered assumption:

```
A4 — WTP ≥$10/mo
  Threshold:  ≥5/20 place a $20 deposit
  Evidence:   E7, E11 — no primary data; two competitor price points at $12 and $15 [Data, T2]
  Verdict:    NOT TESTED
```

Each lands in exactly one of: **MET** / **FAILED** / **NOT TESTED** / **PARTIAL**.

`NOT TESTED` is the honest answer far more often than tools in this space admit, and it must not be quietly upgraded to `PARTIAL` because some adjacent evidence exists. Competitor pricing is not evidence that *your* customers will pay.

## Calibration

The red team is checked too. If prosecution returns nothing serious, that's suspicious — either the idea is unusually strong or the pass was lazy. Have it state which, explicitly.

Reject red-team output that:
- lists only generic startup risks ("execution risk," "competition may increase") — those apply to everything and inform nothing
- cites no ledger row ids
- concludes "further research needed" without naming which specific question and which cheapest method answers it

## Output

Write to `redteam.md`: kill shot, pre-mortem, per-assumption adjudication table, and the honest steelman. Gate 5 reads from this file and may not overrule the adjudication — only apply the verdict rules to it.
