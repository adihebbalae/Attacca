# Cheap kills

Fifteen minutes of searching that can end the project before three hours of research begins.

Run in this order — ascending cost, descending kill probability. **Stop at the first one that fires.**

Each check gets at least 3 query variations before you call it clear. "I didn't find it" after one search is not evidence.

---

## 1. Dominant incumbent (≈3 min)

*Does a well-funded, widely-adopted solution to this exact problem already exist?*

```
"<problem> software"
"<problem> tool" site:producthunt.com
"best <problem> tools 2026"
"<problem>" site:reddit.com  → what do people say they already use?
```

**Fires when:** a clear leader with meaningful adoption owns the exact use case *and* the user has no articulated wedge.

**Not a kill by itself.** Incumbents are usually beatable on a segment or a workflow. It becomes a kill when combined with: no complaint cluster in their reviews, and no segment they underserve. Check that before firing.

---

## 2. Precedent failure (≈3 min)

*Has someone already tried this and died?*

```
"<idea> startup failed"
"<idea> shutting down"
"why <category> startups fail"
"<category>" post-mortem OR "lessons learned"
site:news.ycombinator.com "<category>" failed
```

**Fires when:** multiple independent attempts failed for the *same structural reason*, and that reason still applies.

**Not a kill by itself** — a single failure is often timing or team. But an unknown prior failure is a landmine, and a repeated structural failure is close to dispositive. Name the structural reason explicitly and check whether anything has changed since.

---

## 3. Legal / regulatory wall (≈3 min)

*Is there a rule that makes this illegal, licensed, or economically impossible?*

Check: licensing requirements (finance, health, legal, insurance), data protection in the target geography, platform terms of service if it depends on someone's API, age/consent constraints.

```
"<industry> licence required"
"<data type>" GDPR OR HIPAA compliance requirement
"<platform> API terms of service" commercial use
```

**Fires when:** a licence the user cannot realistically obtain is required, or the whole product depends on an API whose terms forbid the use.

This one *is* frequently dispositive for solo builders. Platform-dependency in particular: if the product is a thin layer over an API that explicitly forbids resale, that's a kill, not a risk.

---

## 4. Distribution wall (≈4 min)

*Is there any affordable channel to the customer?*

The most-skipped check and the most common quiet killer. Cheap to build no longer implies cheap to reach.

Look for a place these people already gather in numbers: a subreddit, a Discord, a newsletter, a conference, a trade association, a directory. Then check whether that place tolerates promotion at all.

```
"<audience>" subreddit
"<audience> newsletter" OR "<audience> community"
"<audience> conference 2026"
```

**Fires when:** the audience is real but atomised with no gathering point, no searchable intent, and an economic value per customer too low to justify paid acquisition. That combination is fatal and it is very common.

Rough test: if annual revenue per customer is under ~$100 and there is no organic channel, paid acquisition will not close. Say so.

---

## 5. Feature-not-a-product (≈2 min)

*Would this be one menu item inside something the customer already runs?*

**Fires when:** the natural home for this capability is an existing product the customer already pays for, that product's roadmap plausibly includes it, and there's no reason a standalone tool wins.

Check the changelogs and roadmaps of the two most likely bundlers. If it's already shipped, that's a hard kill and worth finding in minute four rather than month four.

---

## Recording results

Every check produces a ledger row whether it fires or not. Negative results are evidence:

```
| C1 | No dominant incumbent for <exact use case>; 4 adjacent tools found, none covering X | [Data] | producthunt, G2, reddit | T2 | Med | clear |
| C4 | Audience atomised — no subreddit >2k, no newsletter found in 5 queries | [Data] | DATA GAP: searched R,N,C | T3 | Med | 🔴 fired |
```

## When one fires

Stop the process. Do not proceed to Gate 3 out of politeness.

Write `DECISION.md` with the verdict, the one-sentence finding, and the source. Tell the user plainly what you found and that they just avoided months of work. Offer the pivot only if a specific one is genuinely indicated by what you found — not as a consolation prize.
