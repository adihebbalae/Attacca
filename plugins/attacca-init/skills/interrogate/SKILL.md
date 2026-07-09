---
name: interrogate
description: "Disambiguate vague build requests through structured questioning. Triggers when user says 'build me X' implying 2+ unresolved dimensions (auth/payments/data/integrations), has new-project or major-feature scope with unresolved decisions, or user says /interrogate. Simple single-page or script requests pass through unchanged."
---

<!-- Design razor: CONTEXT only. Question framework for surfacing unstated assumptions. Not a step-by-step process. User already knows how to implement; they need to know what to build. Delete when: feature is fully scoped and written to CONTEXT.md with zero silent assumptions. -->

# Interrogate Skill

## When This Applies

Run this skill when:
- User says "build me X" and X implies multiple unresolved domains (e.g., "webstore" = auth + payments + inventory + integrations)
- Major feature request has 2+ decision points without clear answers
- User runs `/interrogate`

**Skip this skill for**: single-page apps ("landing page"), simple scripts ("parse CSV"), obviously-scoped requests ("add a button to do X").

---

## Flow

Ask in batches of 2–3 questions per round. Wait for answers before advancing. For each question, suggest a reasonable default (make your recommendation explicit). If the user defers a domain, accept the deferral and name the default assumption.

Walk domains in order. Stop when all domains are either **answered**, **explicitly deferred with a named default**, or **marked out-of-scope**.

---

## Domains

### 1. Problem & Users
- Who has the problem? (Not "people" — be specific: "solo DevOps engineers shipping Kubernetes," "small e-commerce shops with <$10k/month revenue")
- Who pays? (End user, business, admin?)
- What's the core loop — the thing done every session?
- How painful is the problem today? (Nice-to-have or blocking their work?)

### 2. Identity & Auth
- Do users need to log in?
- If yes: Single user, shared team accounts, role-based permissions?
- Auth method: Social login (Google/GitHub), email/password, SAML, other?
- Session timeout or "remember me" behavior?

### 3. Payments (if relevant)
- Monetization model: One-time fee, subscription, freemium, free-forever?
- If payments: Stripe, other processor? What currencies?
- Subscription: Monthly, yearly, per-usage? Can users downgrade?
- Webhooks for payment events (invoice, refund, churn)?
- Tax handling: US only, EU VAT, other regions?

### 4. Data Model
- Core entities: What are the main objects? (e.g., Products, Orders, Users, Invoices)
- Relationships: Does a Product belong to a User? Can a User have many Teams?
- Retention: Keep data forever, archive after 90 days, delete on request?
- Sensitive data: Passwords, credit cards, PII, health data, other?

### 5. External Integrations
- APIs: Which external services must this integrate with? (Stripe, Slack, GitHub, Shopify, etc.)
- Data feeds: Live pricing, inventory, exchange rates? Polling (every N minutes) or webhooks or websockets?
- Rate limits and fallback behavior if integration is down?

### 6. Hosting & Scale
- Free tier (Heroku free, Vercel free, Netlify free) or paid services OK?
- Expected scale: Dozen users, hundreds, thousands? Traffic patterns?
- Regions: US only or global?
- Infrastructure preference: Serverless, containers, VPS, other?
- Budget for services (database, hosting, APIs)?

### 7. Compliance & Privacy
- GDPR, CCPA, or similar regulations apply?
- Data deletion on user request?
- Audit logs for sensitive operations?
- SOC 2 or other certifications required?

### 8. Design & Brand
- Existing visual identity to match, or start from scratch?
- Mobile-first, desktop-first, or responsive?
- Any design system constraints (your company's component library, etc.)?

### 9. Non-Goals
- What does v1 explicitly NOT do? (Clarifying scope boundaries prevents scope creep)
- Example: "Not supporting offline mode," "Not handling international shipping," "Not integrating with accounting software"

---

## Output: CONTEXT.md

Once all domains are resolved (or deferred with named defaults), write or update **CONTEXT.md** at repo root:

```markdown
# Project Context

## Project
**What**: [One sentence: what the product does]
**Why**: [The problem and who has it]
**Who pays**: [User, business, subscription model, etc.]

## Stack
**Language/Framework**: [Your recommendation or their preference]
**Database**: [Postgres, MongoDB, etc. — or "defer, use starter default"]
**Hosting**: [Vercel, Heroku, AWS, etc.]
**Auth Provider**: [Firebase, Auth0, custom, etc.]
**Payments**: [Stripe, none, other]

## Key Decisions
**Decision 1**: [What was decided] | Rejected: [alternatives and why not] | Deferred: [if applicable]
**Decision 2**: [What was decided] | Rejected: [alternatives and why not]
...

## Current Focus
[The v1 feature set. 3–5 must-haves. Reference the 9 domains above to confirm nothing is missing.]

## Next Steps
1. [First action for implementation]
2. [Second action]
3. [...]

## Blockers
[Anything unclear or waiting for external input? Leave empty if none.]

Last updated: [Today's date] by [user name or session identifier]
```

Keep CONTEXT.md under ~100 lines. It's a reference, not a journal. If the spec is large, link to `docs/spec.md` but don't duplicate it.

---

## Zero-Ambiguity Checklist

Before writing CONTEXT.md, verify:
- [ ] Problem & Users: Who has it, why, how painful, current workaround
- [ ] Identity & Auth: Log in? If yes, how? Roles?
- [ ] Payments: Monetization model and provider (or "free forever")
- [ ] Data Model: Core entities and retention policy
- [ ] Integrations: External APIs or none, polling vs webhooks, fallback behavior
- [ ] Hosting & Scale: Budget, expected users, region, infrastructure
- [ ] Compliance: Regulations, data deletion, audit logs
- [ ] Design & Brand: Existing brand or from scratch, mobile/desktop/responsive
- [ ] Non-Goals: What v1 does NOT do

Every item is either **answered with a concrete choice**, **explicitly deferred to a named default** (e.g., "use Postgres as default"), or **marked out-of-scope** (e.g., "mobile is v2").

No silent assumptions. Everything surfaced.

---

## Example

**User**: "Build me a tool for freelance designers to invoice clients."

**Your questions** (batch 1):
1. Who's the user — solo designers or agencies?
2. How do they invoice today? (Manual spreadsheet, PDF template, existing SaaS?)

**User answer**: Mostly solo designers using Google Sheets or email PDF.

**Your questions** (batch 2):
1. Do they need to log in each time or is this a one-off tool?
2. Do they need to track payments or just create invoices?

**User answer**: They'd log in. Yes, track paid/unpaid status.

*[Continue until all 9 domains are answered or deferred]*

**Output**: Write CONTEXT.md with all decisions, then recommend: "Next: run `/plan` to scope the implementation, or start coding if you're confident in this spec."

---

*Adapted from prd-builder. Focuses on disambiguation only; implementation planning is separate.*
