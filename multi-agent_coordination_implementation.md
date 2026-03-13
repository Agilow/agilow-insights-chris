# Plan: Multi-Agent Coordination System

## Context

Currently, Claude Code works in a single-agent mode: the main agent plans, builds, and ships features sequentially. There is no structured handoff between worker agents, no automated Linear ticket lifecycle during agent-driven builds, and no formal QA loop with a clear pass/fail/return path.

The goal is to implement a multi-agent team orchestrated by the main agent (me), where:
- Specialized worker agents (backend, frontend, integrations) execute the build
- A new Scrum Master agent manages Linear tickets at every stage
- A new Coordinate skill sequences the full workflow end-to-end
- QA either passes and submits a rich PR, or routes failures back to the right worker
- PRs carry structured documentation for human + main agent review
- New Linear tickets are surfaced at session start via backlog scan

This changes `.claude/` config files only — no app code is touched.

---

## Files to Create (2 new)

### 1. `.claude/agents/scrum-master.md`

New agent with 5 invocation modes (commands callers pass in):

- **CREATE_TICKET** — Creates a Linear ticket in "In Progress" state; posts plan excerpt as comment; returns new ticket ID
- **UPDATE_STATUS** — Moves ticket to a given status (`In Progress | In Review | Done`) and posts a comment
- **POST_COMMENT** — Adds a progress note without changing status
- **SCAN_BACKLOG** — Lists all AGI tickets in Backlog or Todo state; returns structured list to caller (no decisions made)
- **QA_FAILED** — Posts structured failure note and reverts ticket from "In Review" → "In Progress"

Linear workspace reference must be included: Team Agilow-tech (key: AGI), same MCP tool set as `linear-ticketing` skill:
```
mcp__claude_ai_Linear__get_issue / save_issue / save_comment / list_issues / list_issue_statuses
```

Rules: never set Done without explicit UPDATE_STATUS Done command, never operate outside team AGI, no priority decisions.

---

### 2. `.claude/skills/coordinate/skill.md`

New skill (frontmatter format matching `linear-ticketing`) that orchestrates the full multi-agent build.

**Inputs:** Approved plan from main agent containing:
- `plan_summary`, list of `tasks` (each with `agent`, `title`, `description`, `depends_on`), `branch_name`, optional `parent_ticket`

**5 phases:**

1. **Setup** — Create feature branch; for each task call scrum-master CREATE_TICKET and store returned ticket IDs
2. **Execute Workers** — Launch build-api / build-ui / build-integration in dependency order; each worker must confirm completion before dependent tasks start; if worker reports build failure → halt and escalate to main agent
3. **QA Loop** — First invoke review agent; if MUST FIX items found → send back to worker + scrum-master POST_COMMENT; then invoke QA agent; if fails → scrum-master QA_FAILED, return to worker; max 3 iterations before escalating; if passes → scrum-master UPDATE_STATUS all tickets → "In Review"
4. **PR** — QA agent creates PR using rich template; coordinate collects PR URL; scrum-master POST_COMMENT with PR URL on all tickets; report PR URL to main agent
5. **Merge and Close** — Wait for explicit human merge confirmation; scrum-master UPDATE_STATUS all tickets → "Done"

**Bonus mode: SCAN_BACKLOG** — When invoked with this command instead of a plan, call scrum-master SCAN_BACKLOG and present results to main agent

**Allowed tools:** same as linear-ticketing plus Read/Edit/Write/Glob/Grep

---

## Files to Modify (5 existing)

### 3. `.claude/skills/build-api/skill.md`

Add a new section **"When invoked by coordinate skill (multi-agent mode)"** between the existing Rules and When done sections:

```markdown
## When invoked by coordinate skill (multi-agent mode)

You will receive a `ticket_id` alongside the task description.

**At start:** Invoke scrum-master agent with UPDATE_STATUS:
- ticket_id: <provided ticket_id>, status: "In Progress"
- comment: "Backend agent starting: <one-line summary>"

**At end (success):** Invoke scrum-master agent with UPDATE_STATUS:
- ticket_id: <provided ticket_id>, status: "In Review"
- comment: "Backend complete. Build passes. Schema changes: <list or 'none'>."

**At end (build failure):** Invoke scrum-master agent with POST_COMMENT:
- ticket_id: <provided ticket_id>
- comment: "Build failed. Errors: <list>. Halting."
Then report failure to coordinate skill — do not self-retry more than once.
```

### 4. `.claude/skills/build-ui/skill.md`

Same section added (identical hook pattern, adjusted wording for frontend):

```markdown
## When invoked by coordinate skill (multi-agent mode)

**At start:** scrum-master UPDATE_STATUS → "In Progress" + "Frontend agent starting: <summary>"
**At end (success):** scrum-master UPDATE_STATUS → "In Review" + "Frontend complete. Pages built: <list>."
**At end (failure):** scrum-master POST_COMMENT with errors, halt, report to coordinate skill.
```

### 5. `.claude/skills/build-integration/skill.md`

Same section added (connector-specific wording):

```markdown
## When invoked by coordinate skill (multi-agent mode)

**At start:** scrum-master UPDATE_STATUS → "In Progress" + "Integration agent starting: <connector name>"
**At end (success):** scrum-master UPDATE_STATUS → "In Review" + "Connector: <name>. Tested against real data: yes/no. Auth: <method>."
**At end (failure):** scrum-master POST_COMMENT with errors, halt, report to coordinate skill.
```

### 6. `.claude/agents/qa.md`

Add two new sections after the existing "What you do NOT do":

**"When invoked by coordinate skill (multi-agent mode)":**
- On failure: identify which agent owns failing files; call scrum-master QA_FAILED for each ticket; report to coordinate skill which agents need fixes
- On pass: create PR using rich template below; call scrum-master POST_COMMENT with PR URL on each ticket; report PR URL to coordinate skill

**PR description template** (for `gh pr create` body):
```markdown
## What this PR does
- <user-facing change>

## Implementation notes
- <architectural decisions, non-obvious patterns>

## Files changed
- `path/to/file.ts` — <what it does>

## Schema changes
None (or list changes)

## Linear tickets
Closes AGI-XX

## Test plan
- [ ] npm run build passes
- [ ] npm run lint passes
- [ ] npm run test passes
- [ ] <feature-specific manual check>

## Known limitations / follow-up
- <anything out of scope or tech debt>

🤖 Built by Agilow agent team (backend / frontend / integrations / QA)
```

### 7. `.claude/CLAUDE.md`

Replace the "Agents and skills" bullet list (lines 62–70) with an expanded version:

```markdown
## Agents and skills

### Standalone agents
- agents/research.md  → searches web for API docs before building connectors
- agents/qa.md        → runs build/lint/test; creates PRs and routes failures in multi-agent mode
- agents/review.md    → checks code quality before QA

### Worker skills
- skills/build-api/         → builds API routes and DB logic
- skills/build-ui/          → builds React pages and components
- skills/build-integration/ → builds source connectors
- skills/snapshot/          → regenerates project snapshots (debug)

### Orchestration
- skills/coordinate/        → orchestrates full build from approved plan; sequences workers, QA loop, PR, Linear
- agents/scrum-master.md    → manages Linear tickets during agent-driven workflows (invoked by coordinate and workers, not users directly)

### User-initiated ticket flows
- skills/linear-ticketing/  → pick up a single Linear ticket → build → PR → close

## Multi-agent workflow

When a plan is approved:
1. Invoke `/coordinate` with the plan — it creates Linear tickets, launches workers in dependency order
2. Workers (backend/frontend/integrations) call scrum-master at start and end of their work
3. Coordinate runs review agent, then QA in a loop (max 3 attempts)
4. QA submits PR with rich template; scrum-master posts PR URL to all tickets
5. Present PR to user — wait for explicit merge approval
6. On merge, scrum-master marks all tickets Done

At session start, run `/coordinate SCAN_BACKLOG` to surface pending Linear tickets.
```

---

## Verification

1. **Scrum master smoke test** — Invoke scrum-master manually with CREATE_TICKET; confirm a new AGI ticket appears in Linear In Progress state with a plan comment
2. **Coordinate end-to-end** — Run `/coordinate` with a simple single-task plan (e.g. "add a log statement to an API route"); verify: ticket created → worker runs → review agent passes → QA passes → PR created with correct template → scrum-master marks ticket In Review
3. **QA failure routing** — Introduce a deliberate TypeScript error; verify QA_FAILED is called on scrum-master and ticket reverts to In Progress in Linear; verify coordinate sends fix back to correct agent
4. **Backlog scan** — Run `/coordinate SCAN_BACKLOG`; verify it returns any Backlog/Todo AGI tickets without making changes
5. **Build passes** — `npm run build` still passes after all `.claude/` changes (no app code touched, so this is purely a sanity check)

---

## What is NOT changing

- `skills/linear-ticketing/skill.md` — untouched; remains for user-initiated "pick up a ticket" flows
- All app code (`app/`, `lib/`, `prisma/`) — no changes
- `.claude/rules/` — no changes
- `agents/research.md`, `agents/review.md` — no changes (they are already correct as supporting agents)
