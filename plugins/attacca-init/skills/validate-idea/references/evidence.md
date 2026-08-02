# Evidence and the ledger

## Why a ledger instead of a score

A score is a lossy compression. "73/100" cannot be checked, argued with, or updated when one input turns out to be wrong. It also hides its own weakness — a 73 built from six guesses looks identical to a 73 built from six sourced findings.

The ledger keeps provenance attached to every claim, which buys three things a score cannot:

1. You can see how much of the verdict rests on unsourced assumption.
2. When one row is disproven later, you can recompute rather than restart.
3. The tool becomes able to say **"insufficient evidence"** — the most useful output it has, and one no scoring system can express.

## Ledger row format

`LEDGER.md` is append-only. Never delete rows; supersede them with a new row that references the old id.

```
| id | claim | basis | source | tier | conf | assumption | status |
```

- **id** — `E1`, `E2`, … sequential. `C1`… for cheap-kill checks.
- **claim** — one sentence, with the number in it
- **basis** — `[Primary]` `[Data]` `[Estimate]` `[Assumption]` `[Opinion]`
- **source** — URL, or the interview id, or `DATA GAP: <queries tried>`
- **tier** — T1 / T2 / T3 (below)
- **conf** — High / Med / Low
- **assumption** — which assumption id this bears on (`A3`)
- **status** — `supports` / `refutes` / `neutral`

## Source tiers are dimension-dependent

This is where most tooling gets it wrong. The usual hierarchy puts analyst reports at the top universally. That is right for market size and **wrong for whether the pain is real**.

Five conversations with actual target users outrank Gartner on the question "does anyone have this problem." Gartner outranks five conversations on "how big is this market." Judge the source against the *question*.

**For demand, severity, willingness-to-pay** — does anyone care, will they pay:

| Tier | Source |
|---|---|
| **T1** | People paying today. Your own sales, competitor revenue, a funded budget line. |
| **T2** | Behavioural traces: workarounds people built, complaint threads, feature requests with vote counts, search volume with commercial intent, job postings for the role that owns this pain. |
| **T3** | Stated preference: surveys, "would you use this," analyst commentary on sentiment. |

**For market size, growth, industry structure**:

| Tier | Source |
|---|---|
| **T1** | Government data, SEC filings, academic work, established research houses |
| **T2** | Reputable trade press, company disclosures, investor decks |
| **T3** | Blogs, content-marketing "market size" pages, AI-generated listicles |

Beware the T3 market-size loop: SEO pages cite each other for the same fabricated figure until it looks corroborated. If three sources give the identical number with no primary attribution, that is **one** source, not three. Say so.

## Research posture

Give each research agent **one assumption and an instruction to disconfirm it.**

> ❌ "Research the market for invoice-chasing tools."
> ✅ "Find evidence that freelancers do NOT pay to automate invoice chasing. Look for dead products in this space, free tools that already suffice, forum threads where people say they just email manually, and accounting suites that bundle it. Report what you found even if it's nothing."

The first prompt returns an encyclopedia. The second returns a decision. The framing matters more than the model.

Each agent: 5–8 searches minimum, in rounds — broad → drill into what round 1 surfaced → cross-check the important numbers.

## Cross-referencing

For any load-bearing number, find 2–3 independent sources.

- Agree → note convergence, cite all.
- Disagree → record both, explain the discrepancy, state which you trust and why.
- Trace to one origin → it's a single source. Downgrade confidence and say it.

## Dating

Note publication date on every T1/T2 finding. Flag anything older than 18 months, and anything predating a relevant platform shift. A 2023 market analysis of an AI-adjacent category is describing a different world.

## Data gaps

When 3+ query variations fail:

```
| E12 | DATA GAP — no reliable figure for solo-freelancer segment size in UK | [Assumption] | tried: "uk freelancer count", "ons self-employed 2025", "ipse freelancer statistics" | — | Low | A1 | neutral |
```

Then: name the closest proxy and show the arithmetic if you extrapolate, and tell the user where they could get the real number.

A gap honestly declared is a finding. A number quietly invented to fill the row is the worst thing this skill can do — it will end up in a pitch deck and nobody will remember it was a guess.

## Primary evidence beats all of it

If the user has already talked to real users, that is `[Primary]` and it outranks everything else in the file. Ask early whether they have:

- conversations already had (how many, recruited how)
- a waitlist, and its source
- anyone who has paid them for anything adjacent
- their own logged experience of the problem — `[Primary]`, n=1, and label it n=1

If the ledger ends up with zero `[Primary]` rows, that fact alone should push the verdict toward **INSUFFICIENT** or **TEST**. Desk research is a way to arrive at the right conversations faster. It is not a substitute for having them.
