# Verdict and the one experiment

## Rules

Mechanical. Apply against `redteam.md`'s adjudication table. Check in order; first match wins.

| # | Condition | Verdict |
|---|---|---|
| 1 | A load-bearing assumption is `FAILED` and cannot be swapped without collapsing the others | **KILL** |
| 2 | A load-bearing assumption is `FAILED` but a specific, evidenced substitution exists | **PIVOT** |
| 3 | More than half the load-bearing assumptions are `NOT TESTED`, and the ledger has zero `[Primary]` rows | **INSUFFICIENT** |
| 4 | All top-3 assumptions are `MET`, at least one on `[Primary]` evidence | **BUILD** |
| 5 | Anything else | **TEST** |

Most honest validations land on **TEST**. That is the correct and expected outcome — it means the idea is not obviously dead and the next move is a cheap experiment rather than a build.

**BUILD requires primary evidence.** Desk research alone never earns a BUILD. If rule 4 is tempting but every row is `[Data]` from the web, it's a TEST.

### On INSUFFICIENT

This verdict is the point of the whole design. When the ledger is mostly assumptions, "I don't know yet — go talk to eight people, here are the questions" is the true answer and the most valuable one available.

Every competing tool in this category will emit a confident score from the same thin evidence. Do not.

### On PIVOT

Only when the substitution is *specific and evidenced*, e.g. "the budget holder is the agency owner, not the freelancer — E9 shows agencies already pay for adjacent tooling." Never "consider pivoting to a different market," which is not advice.

## Designing the one experiment

For TEST and INSUFFICIENT, design exactly **one** experiment: the riskiest untested assumption, testable in **≤2 weeks for ≤$100**.

One. Not three. Three options is how a decision becomes a reading list.

Specify all six:

```
ASSUMPTION   which one, by id
METHOD       exactly what you do
RECRUITING   where the people come from, 2+ channels
SAMPLE       n, and over what period
THRESHOLD    the pass number — from PREREG.md if it's there
COST         time and money
```

Prefer behavioural over stated. Ranked by strength:

1. **Pre-sale / paid deposit** — strongest. Money is the only unambiguous signal.
2. **Concierge** — deliver the outcome manually for 3–5 people. Reveals whether the outcome is even wanted, before any code.
3. **Fake door with a real ask** — landing page where the CTA requests something costly (a card, a booked call), not just an email.
4. **Problem interviews** — see `interviews.md`. Cheapest, and the right first move when the ledger has no `[Primary]` rows.
5. **Email-capture landing page** — weakest. An email is nearly free to give.

If the user has done zero customer conversations, the experiment is almost always #4. Everything else is premature.

## Kill criteria

State the condition under which the user stops. It should already be in `PREREG.md` — restate it verbatim.

If they now want a different number, that is an **override**: record it in `DECISION.md` with the original threshold, the new one, and their stated reason. Overrides are legitimate; unlogged ones are not.

## The memo

Use `templates/DECISION.md`. Constraints:

- **400–600 words.** Longer means you're hedging.
- **Risks get more space than strengths.** People overweight strengths by default; the memo corrects for it rather than mirroring it.
- **Every strength and risk cites a ledger id.** No id, no claim.
- **One next action**, with a date.
- Scannable in two minutes.

A good decision memo makes the reader slightly uncomfortable. If it reads pleasantly, it is probably wrong.

## Closing the session

Tell the user three things and stop:

1. The verdict, in one sentence.
2. The single thing to do this week.
3. What result would change the verdict.

Then update `PROGRESS.md` and note that re-running `validate-idea` after the experiment will pick up from the ledger with the new evidence.
