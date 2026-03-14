---
name: linear-ticketing
description: Pick up a Linear ticket, plan the implementation, build, create PR, and close the ticket with full audit trail
allowed-tools:
  - mcp__claude_ai_Linear__get_issue
  - mcp__claude_ai_Linear__save_issue
  - mcp__claude_ai_Linear__save_comment
  - mcp__claude_ai_Linear__list_issues
  - mcp__claude_ai_Linear__list_issue_statuses
  - Bash(gh *)
  - Bash(git *)
  - Bash(npm run build)
  - Read
  - Edit
  - Write
  - Glob
  - Grep
---

## Goal
Automate the full lifecycle of a Linear ticket: read the ticket and product spec, plan the work, get approval, build, create a PR, and close the ticket — with comments at every stage so Linear becomes the audit trail.

## Inputs
- **ticket**: Linear ticket identifier (e.g. AGI-91)
- **product_spec**: PRODUCT_SPEC.md in repo root (always read alongside the ticket)

## Scripts
No hardcoded scripts yet — this skill uses cloud Linear MCP tools for all Linear operations and `gh` CLI for GitHub operations. Post-demo, replace MCP calls with direct API scripts in `scripts/` folder per .claude/rules/integrations.md "MCP strategy".

## Process

### Phase 1: Understand
1. Read the ticket — `mcp__claude_ai_Linear__get_issue` with the ticket identifier
2. Read PRODUCT_SPEC.md for full context on what the ticket is part of
3. Move ticket to In Progress — `mcp__claude_ai_Linear__save_issue` with `state: "In Progress"`
4. Create feature branch — `git checkout -b feat/<ticket-id>-<short-desc>` from main
   - **Never work directly on main**

### Phase 2: Plan
5. Draft implementation plan based on ticket description + product spec + acceptance criteria:
   - What will be built (summary)
   - Key files to create or modify
   - Architecture decisions and trade-offs
   - Open questions or assumptions
6. Present plan to user — **get explicit approval before writing any code**
7. Post approved plan to Linear — `mcp__claude_ai_Linear__save_comment`

### Phase 3: Build
8. Build the feature (use build-api, build-ui, or build-integration skills as needed)
9. Run build check — `npm run build` must pass with zero errors
10. Commit — stage relevant files, message: `feat: <what changed>` (ticket ID in body)

### Phase 4: Ship
11. Push branch — `git push -u origin <branch-name>`
12. Create PR — `gh pr create` with title (under 70 chars), summary bullets, test plan, Linear ticket link
13. Post PR link to Linear — `mcp__claude_ai_Linear__save_comment` with PR URL

### Phase 5: Close
14. Wait for merge approval — **user must explicitly confirm**
15. Merge PR — `gh pr merge <number> --squash`
16. Post completion comment to Linear — `mcp__claude_ai_Linear__save_comment` with:
    - What was built (final summary)
    - PR link (now merged)
    - Gotchas, edge cases, or known limitations
    - Scope creep noticed (work not in original ticket)
    - Follow-up items or tech debt introduced
17. Move ticket to Done — `mcp__claude_ai_Linear__save_issue` with `state: "Done"`

## Status transitions
```
Todo → In Progress  (Phase 1, step 3)
In Progress         (Phases 2–4)
In Progress → Done  (Phase 5, step 17 — only after merge)
```

## Guardrails
- Never work directly on main — always create a feature branch first
- Never build before the plan is approved by the user
- Never move to Done without user confirming the merge
- Never force-push or push directly to main
- If build fails, fix errors before proceeding to Phase 4
- If the ticket description is unclear, ask the user before planning

## Linear workspace reference
- Team: Agilow-tech (key: AGI)
- Project: Agilow Platform
- Statuses: Backlog → Todo → In Progress → In Review → Done
