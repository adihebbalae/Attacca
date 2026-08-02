# Decomposing an idea into load-bearing assumptions

## The move

An idea is a conjunction, not a thing. "A tool that helps freelancers chase late invoices" is really:

1. Freelancers have unpaid invoices often enough to notice
2. Chasing them is painful enough to want it solved
3. Current workarounds (email templates, accounting software, giving up) are inadequate
4. They'd pay money rather than tolerate it
5. I can reach freelancers at a cost below what they'd pay
6. I can build it
7. Someone bigger won't bundle it away

Every one must hold. The idea dies at the weakest. Your job is to find that one *before* the user builds anything.

## Taxonomy

Cover these seven. Not every idea has all seven as risks, but check each.

| Class | The question | Typical fatal version |
|---|---|---|
| **Demand** | Does anyone have this problem? | They don't. You inferred it from your own experience of a niche of one. |
| **Severity** | Do they care enough to act? | Real but mild. Annoyance, not pain. Nobody changes behaviour for annoyance. |
| **Willingness to pay** | Will money change hands? | Real pain, but the budget lives with someone who doesn't feel it. |
| **Reachability** | Can you find them affordably? | They exist, they'd pay, and there is no channel that reaches them for less than they're worth. |
| **Feasibility** | Can you actually build it? | Needs data/licences/integrations you can't get. |
| **Defensibility** | Does it survive contact with an incumbent? | It's a feature. Someone bundles it in a quarter. |
| **Founder fit** | Are *you* the one to do this? | No domain access, no distribution edge, no reason it's you. |

**Reachability is the most under-weighted class.** Founders obsess over demand and skip distribution, and distribution is what actually kills cheap-to-build products in 2026. Weight it accordingly.

## Phrasing rule

An assumption must be stated so that some observation would prove it false. If nothing could disprove it, it's not an assumption, it's a mood.

| ❌ Not falsifiable | ✅ Falsifiable |
|---|---|
| "There's a real need here" | "≥30% of freelancers with >5 clients have chased an invoice >30 days late in the last quarter" |
| "People will pay" | "≥5 of 20 interviewed freelancers will put down a $20 deposit today" |
| "We can reach them" | "A subreddit or newsletter exists with >20k of these people and permits promotion" |
| "It's differentiated" | "Existing tools' reviews contain a recurring complaint that this feature would resolve" |

Numbers now, not later. A vague assumption cannot be pre-registered, and an assumption that cannot be pre-registered cannot protect you from yourself.

## Ranking

For each assumption:

- **load** (1–5) — how much of the idea collapses if this is false? 5 = total.
- **fragility** (1–5) — how likely is it false given what's known right now? 5 = probably false.
- **cost** — realistic time/money to get a real answer. Use 1 (minutes), 2 (an hour), 3 (a day), 5 (a week+).

```
priority = (load × fragility) / cost
```

Test in descending priority order. This is the whole scheduling principle: **the cheapest thing that could kill the idea goes first**, regardless of where it sits in any conventional "phase."

A worked stack:

| # | Assumption | Load | Frag | Cost | Priority |
|---|---|---|---|---|---|
| A3 | Incumbent accounting tools don't already do this | 5 | 4 | 1 | **20.0** |
| A4 | Freelancers will pay ≥$10/mo | 5 | 4 | 3 | 6.7 |
| A5 | A reachable channel exists under $30 CAC | 4 | 3 | 2 | 6.0 |
| A2 | The pain is severe, not mild | 4 | 3 | 3 | 4.0 |
| A6 | Buildable solo in <6 weeks | 3 | 2 | 2 | 3.0 |

A3 is a fifteen-minute search that could end the entire project. It goes first. Always.

## Sanity checks

- If every assumption scores fragility 1–2, you haven't been honest. Re-score adversarially.
- If load is 5 everywhere, the idea is over-coupled — worth telling the user, it means no partial win is possible.
- Ask the user which one *they* fear most. Founders are bad at judging their idea and good at knowing where the body is buried.
