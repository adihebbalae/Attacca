---
description: "Ask a quick question or provide steering to the current agent without derailing their task. The agent will answer briefly and continue where they left off."
---

# /btw — Context-Free Question or Steering

**Purpose**: Ask a quick question, provide context, or steer an agent without interrupting their current task.

## How This Works

When you call `/btw`, the agent will:
1. **Parse your input** as a brief interruption
2. **Answer concisely** (1-3 sentences max unless you ask for detail)
3. **Resume their previous task automatically** where they left off

## Use Cases

| Use Case | Example |
|----------|---------|
| Quick clarification | `/btw what does SBOM mean again?` |
| Steering without derailing | `/btw when you get to the auth module, use Supabase instead of custom JWT` |
| Status check | `/btw how many files left to process?` |
| Context injection | `/btw the user prefers TypeScript over JavaScript` |
| Mid-task pivot | `/btw skip the tests for now, we'll add them later` |

## Format

```
/btw [your question or instruction]
```

## Agent Response Format

The agent should respond like this:

```
💬 **BTW Response:** [concise answer]

↩️ **Resuming:** [brief reminder of what task they're continuing]
```

Then immediately continue the previous task without asking permission.

## Examples

### Example 1: Quick Question

**User**: 
```
[Engineer is implementing auth module...]

/btw what's the difference between RS256 and HS256?
```

**Engineer**:
```
💬 **BTW Response:** RS256 uses public/private key pairs (asymmetric), HS256 uses a shared secret (symmetric). RS256 is better for distributed systems where multiple services verify tokens but don't issue them.

↩️ **Resuming:** Implementing JWT verification middleware with RS256...

[continues implementation]
```

---

### Example 2: Mid-Task Steering

**User**:
```
[Manager is scaffolding project with PostgreSQL...]

/btw use SQLite instead of PostgreSQL for now
```

**Manager**:
```
💬 **BTW Response:** Noted — switching to SQLite for local dev.

↩️ **Resuming:** Updating database config to SQLite...

[continues scaffolding with SQLite]
```

---

### Example 3: Status Check

**User**:
```
[Security is auditing files...]

/btw how many files have you audited so far?
```

**Security**:
```
💬 **BTW Response:** 12/23 files audited. 3 findings so far (all LOW severity).

↩️ **Resuming:** Auditing src/api/payments.ts for injection risks...

[continues audit]
```

---

### Example 4: Context Injection

**User**:
```
[Designer is reviewing UI...]

/btw the target audience is enterprise users, not consumers
```

**Designer**:
```
💬 **BTW Response:** Got it — shifting tone to enterprise (more data-dense, professional).

↩️ **Resuming:** Reviewing dashboard layout with enterprise lens...

[continues review]
```

---

## Do NOT Use `/btw` For:

| Instead Use | Why |
|-------------|-----|
| Starting a new task | Just say "Now do [task]" |
| Complex multi-turn discussions | `/btw` is for quick hits only |
| Debugging or troubleshooting | Use normal conversation — this needs context |
| Questions that change the entire task | That's a pivot, not a BTW |

---

## Agent Implementation Notes

**When you receive `/btw`**:
1. Detect the `/btw` prefix
2. Answer **in ≤3 sentences** unless the question requires detail
3. Use the format above (💬 BTW Response + ↩️ Resuming)
4. **Do NOT ask follow-up questions** unless critically blocked
5. **Do NOT stop working** — resume immediately after answering

**Edge case — /btw changes the task significantly**:
If the BTW input fundamentally changes the task (e.g., "use a different database"), acknowledge it and adjust course. But still resume work immediately — don't ask for permission.

**Example of bad response** (never do this):
```
💬 **BTW Response:** SQLite instead of PostgreSQL — got it.

Should I also change the migrations? And what about the connection pooling?
```

**Good response**:
```
💬 **BTW Response:** Switching to SQLite. I'll update migrations and remove connection pooling (not needed for SQLite).

↩️ **Resuming:** Updating database config...

[continues]
```

---

## Why This Exists

Without `/btw`, asking a quick question forces the agent to:
- Stop their current task
- Context-switch to your question
- Lose momentum
- Require you to say "okay continue" to resume

With `/btw`, the agent handles it inline and keeps moving.
