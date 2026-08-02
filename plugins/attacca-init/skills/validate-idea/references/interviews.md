# Customer interviews

The highest-value mode in this skill. Desk research narrows the question; only people answer it.

Built on Rob Fitzpatrick's *The Mom Test*. If the user hasn't read it, the summary is: **your mother will tell you your idea is great, so don't ask her about your idea.** Ask about her life instead.

## The three rules

1. **Talk about their life, not your idea.** The moment you describe the product, the conversation becomes a politeness ritual.
2. **Ask about the past, not the future.** "Would you use this?" is a prediction, and people are bad at predicting their own behaviour. "When did this last happen?" is a memory, and memories are checkable.
3. **Ask for specifics, not opinions.** "What did you do about it?" beats "what do you think?"

## Question set

Generate these against the top unresolved assumption. Never mention the product until the end.

**Establish the problem happened at all**
- Walk me through the last time <situation> came up.
- How often does that happen?
- When was the most recent one?

**Measure severity — this is where ideas die quietly**
- What did you do about it?
- How long did that take?
- What did it cost you — time, money, or a client?
- What happened *after* — did anything break downstream?

**Find the workaround (the single most diagnostic question)**
- What are you using now to handle this?
- Have you built anything yourself? A spreadsheet, a script, a template?
- Have you paid for anything to help with this? What happened to it?
- Have you tried to solve this before and given up? Why?

**Willingness to pay, without asking about price**
- Who would sign off on spending money on this — you, or someone else?
- What's the budget line it would come out of?
- What have you paid for that's adjacent to this?

**Close**
- Who else has this problem worse than you?
- Can you introduce me?

## Reading the answers

| Signal | Weight |
|---|---|
| Built their own workaround | **Strongest.** They've already paid in time. |
| Currently paying for something inadequate | **Very strong.** Budget exists, incumbent is beatable. |
| Can name a specific recent instance with a cost attached | Strong |
| Tried to solve it and gave up | Strong — find out why; it may be your kill. |
| Offers an introduction unprompted | Strong |
| "That sounds useful" / "I'd definitely use that" | **Zero.** Free to say. Record as noise, not evidence. |
| "You should add feature X" | Near zero, and a distraction. Ask why they want it, then discard the feature. |
| Enthusiasm with no example | Negative — probing found nothing real. |

**Compliments are the failure state of an interview.** If a conversation produced only warm feelings, it produced no data. Log it as such.

## Recruiting

Twenty friends is not twenty freelancers. Require **2+ independent channels** or the sample is worthless.

Where to look: the subreddit/Discord/forum found during the distribution check, LinkedIn search on the exact job title, people publicly complaining about the problem (search the complaint, DM the complainer — highest-converting cold outreach there is), trade associations, existing customers of an adjacent tool.

Cold outreach that works: reference the specific thing they posted, ask for 15 minutes about their experience, say explicitly you're not selling anything, and then don't sell anything.

## How many

- **5** — enough to know if the problem exists at all
- **10** — patterns become visible
- **20** — enough to pre-register a threshold against
- **>30** — diminishing; go run a behavioural test instead

## Logging

One `[Primary]` ledger row per interview. Include: who (role, not name), how recruited, the concrete instance they described, whether a workaround exists, and which assumption it bears on.

```
| E21 | Freelance designer, 8 clients: chased a 47-day invoice last month, built a Notion reminder board for it | [Primary] | INT-03, r/freelance | T1 | High | A2 | supports |
```

After every 5 interviews, re-read `PREREG.md` and check the running count against the threshold. Do not wait until the end to notice the idea failed.

## The honest caveat

If the user wants a verdict without talking to anyone, tell them the truth: desk research can kill an idea but it cannot validate one. A tool that lets someone feel validated without human contact has done them harm. Ten conversations is two afternoons.
