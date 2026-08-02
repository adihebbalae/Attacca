# Pre-registration

## The idea

Borrowed from clinical trials. Researchers publish their hypothesis, method, and success threshold *before* collecting data — because a threshold chosen afterwards will always land conveniently close to whatever was found.

Founders do the same thing without noticing. Run a landing page, get 1.2% conversion, and the conclusion becomes "well, the copy wasn't optimised" rather than "nobody wants this." The number didn't decide anything, because no number had been agreed to in advance.

So: **write the threshold down before you look.**

This costs nothing, takes ten minutes, and is the single strongest available correction for motivated reasoning. No other tool in this category does it.

## Rules

1. Written **before** Gate 2 and Gate 3. If any evidence has been gathered, it's too late for that assumption — note the contamination in the file.
2. Committed to disk. Git if available.
3. **Never edited.** If the user wants a different threshold after seeing results, that is an *override*, recorded as such in `DECISION.md` with their stated reason. Overrides are allowed — silent edits are not.
4. Every threshold is a number with a unit and a sample size.

## Per assumption, record five things

```
ASSUMPTION   The belief, stated so it can be false
FALSIFIER    The specific observation that would disprove it
THRESHOLD    The number. Now, not later.
SAMPLE       How many, over what period — a threshold with no n is not a threshold
IF IT FAILS  kill / pivot-to-<what> / proceed-anyway-because-<reason>
```

That last line matters. Making the user write "kill" in advance is the commitment device. Making them write "proceed anyway" forces them to notice they've decided to ignore evidence, which is at least an honest position.

## Choosing thresholds

Anchor on behaviour, never on opinion. The evidence hierarchy, weakest to strongest:

```
compliments  →  "I'd use that"  →  verbal commitment  →  written commitment
             →  time spent      →  a deposit          →  full payment
```

Everything left of "written commitment" is free to give and therefore worthless. Set thresholds as far right as the stage allows.

Reference points for common thresholds — adjust to context, don't copy blindly:

| Test | Weak | Reasonable | Strong |
|---|---|---|---|
| Landing page email capture (targeted traffic) | <2% | 5–10% | >15% |
| Pre-order / paid deposit conversion | <1% | 2–5% | >8% |
| Problem interviews confirming *unprompted* pain | <3 of 20 | 8 of 20 | >12 of 20 |
| Interviewees who already built a workaround | <2 of 20 | 5 of 20 | >10 of 20 |
| Cold outreach reply rate to a relevant ask | <5% | 10–20% | >25% |

The workaround row is the most diagnostic thing on this table. People who have hacked together a spreadsheet to solve a problem have *demonstrated* the pain. People who say it sounds useful have demonstrated politeness.

## Worked example

```
A4 — Willingness to pay

ASSUMPTION   Freelancers with >5 clients will pay ≥$10/mo to automate invoice chasing
FALSIFIER    Fewer than 5 of 20 interviewed will place a refundable $20 deposit
THRESHOLD    ≥5 / 20 (25%) place a deposit
SAMPLE       20 freelancers, >5 clients each, recruited from 2+ channels, within 3 weeks
IF IT FAILS  pivot — test agencies (budget holder feels the pain) before killing
```

Note it does not say "positive feedback from most people." It names a behaviour, a number, a denominator, a recruiting constraint, and a pre-decided response.

## Anti-gaming

Watch for these when helping the user set thresholds:

- **Threshold so low it can't fail.** "At least one person says it's interesting." Push back.
- **No denominator.** "10 signups" — out of how many visitors, from where?
- **Convenience sample.** Twenty friends is not twenty freelancers. Require 2+ independent recruiting channels.
- **Vague timebox.** "Eventually" means never. Put a date on it.
- **Moving the goalposts mid-flight.** Point at the file.

If the user resists setting a real number, that resistance is itself information: they already suspect the answer.
