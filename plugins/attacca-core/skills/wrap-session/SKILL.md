---
name: wrap-session
description: "Session bookmark. Triggers when user says 'wrap up', 'done for today', /wrap-session, or when closing a work session on a CONTEXT.md-bearing project. Updates project context for seamless continuation in next session."
---

<!-- Design razor: VERIFICATION only. Checking current state and updating existing artifact. Not a process or discovery. Delete when: CONTEXT.md is current and git history is clean. -->

# Wrap Session Skill

## When to Use

Run this skill when:
- User says "wrap up" or "done for today"
- User runs `/wrap-session`
- End of a work session on a project with CONTEXT.md
- Handing off to a teammate or a cloud agent

---

## Steps

### 1. Check for CONTEXT.md
If the project has a CONTEXT.md at repo root, proceed. If not, this skill doesn't apply; suggest creating one with `/interrogate` if starting a new project.

### 2. Update CONTEXT.md Sections

Only update sections if they changed this session. Keep entries concise:

**Current Focus**:
- Replace with what was actually worked on today (3–5 bullet points max)
- Remove completed items
- If nothing changed, leave as-is

**Next Steps**:
- Prune completed steps
- Add new steps discovered this session (max 3–5 items)
- Keep them actionable, not vague

**Key Decisions**:
- Only add NEW decisions made this session
- For each: state the decision, list rejected alternatives + why, mark if deferred
- Do NOT re-list decisions already in the file

**Blockers**:
- Add new blockers (waiting for external input, unclear spec, etc.)
- Remove resolved blockers
- Empty if none

**Last updated**: Update timestamp to today's date

### 3. Check for Uncommitted Work

Run `git status`. If uncommitted changes exist:
- Offer to create a BDR commit (reference `/bdr-commit`)
- If user declines, remind them uncommitted work will be lost on repo switch
- Do NOT force a commit

### 4. Verify File Size

Keep CONTEXT.md under ~100 lines. If it's grown:
- Prune old Next Steps that are no longer relevant
- Move detailed specs to `docs/spec.md` and link from CONTEXT.md
- Archive completed Key Decisions to git history (they're in commit messages now)

---

## What NOT to Do

- **Don't duplicate git history**: Don't list every file changed. Git log already has that.
- **Don't create a journal**: Wrap-session is a bookmark, not a daily log. One entry per session max.
- **Don't edit completed work**: If something shipped this session, remove it from Next Steps and let the BDR commit document it.

---

## Example

**Before** (stale CONTEXT.md):
```markdown
Current Focus
- Build authentication flow
- Set up database
- Design dashboard

Next Steps
1. Implement OAuth with Google
2. Create users table
3. Build dashboard UI
4. Add payment processing
5. Set up monitoring
...
```

**After** (updated):
```markdown
Current Focus
- Completed database schema (users, invoices, payments)
- Implemented basic OAuth flow (Google only, GitHub deferred to v1.1)
- Started dashboard scaffolding (needs invoice filtering logic)

Next Steps
1. Add invoice filtering to dashboard
2. Implement Stripe webhook handler
3. Write tests for payment flow

Blockers
- Waiting on Stripe API key from client (blocking webhook testing)

Last updated: 2026-07-08 by [session end]
```

---

## Outcome

Next session (or teammate, or cloud agent) opens CONTEXT.md and immediately knows:
- What's done this session
- What's next
- What's blocking
- No need to dig through Slack, commit history, or code

The project is instantly ready to continue.
