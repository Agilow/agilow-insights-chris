# Multi-Agent Coordination: How It Works

This document describes how the Agilow agent team operates day-to-day — who the agents are, what they do, and how work flows from an idea to a merged PR with a full Linear audit trail.

---

## The Team

| Agent | Role | Invoked by |
|---|---|---|
| **Main Agent** (you're talking to it now) | Plans with the human, commands the team, reviews PRs | Human |
| **Backend Agent** | Builds API routes, DB logic, lib/ functions | Coordinate skill |
| **Frontend Agent** | Builds React pages and components | Coordinate skill |
| **Integrations Agent** | Builds external source connectors (Slack, Granola, etc.) | Coordinate skill |
| **Scrum Master Agent** | Creates and updates Linear tickets throughout the workflow | Coordinate skill + all workers |
| **QA Agent** | Runs build/lint/test, routes failures, submits PRs | Coordinate skill |
| **Review Agent** | Checks code quality and correctness before QA | Coordinate skill |
| **Coordinate Skill** | Orchestrates the full execution from plan to merged PR | Main Agent |

---

## The Workflow

### Step 1 — Plan

The human and the main agent work together to design what needs to be built.

- The human describes the goal (new feature, bug fix, integration, etc.)
- The main agent explores the codebase, asks clarifying questions, and drafts an implementation plan
- The plan specifies: what to build, which agents are needed (backend / frontend / integrations), task dependencies, and the branch name
- **The human must explicitly approve the plan before any work starts**

Nothing is built, no tickets are created, no branches are cut until the human says yes.

---

### Step 2 — Execute

Once the plan is approved, the main agent invokes the **Coordinate skill**, which drives everything from here.

**Coordinate does the following in order:**

1. **Creates the feature branch** — e.g. `feat/AGI-42-add-granola-connector`

2. **Creates Linear tickets** via the Scrum Master agent — one ticket per task in the plan, each placed immediately in "In Progress" state with the implementation plan posted as a comment

3. **Launches worker agents** in dependency order:
   - Tasks with no dependencies start immediately
   - Tasks that depend on others wait for their predecessors to finish
   - Workers run: **Backend Agent**, **Frontend Agent**, **Integrations Agent** — whichever the plan requires

**Each worker agent**, when it starts, calls the Scrum Master to confirm it is working on the ticket. When it finishes, it calls the Scrum Master again to move the ticket to "In Review" and post a completion summary.

If a worker hits a build failure it cannot resolve, it halts and escalates to Coordinate — which escalates to the main agent. The ticket stays in "In Progress" until the issue is resolved.

---

### Step 3 — QA Loop

Once all workers have finished, Coordinate runs the quality gate sequence.

**First: Review Agent**
- Checks code quality, correctness, and security (evidence_refs, no raw SQL, no `any` types, API response shapes, etc.)
- Returns a verdict: **MUST FIX**, **SUGGESTION**, or **LOOKS GOOD**
- If MUST FIX items are found, Coordinate sends the work back to the responsible worker and the Scrum Master posts a note on the ticket explaining what must be fixed. The loop restarts after the fix.

**Then: QA Agent**
- Runs `npm run build`, `npm run lint`, `npm run test`
- If any check fails:
  - QA identifies which agent owns the failing files
  - Scrum Master is called with **QA_FAILED**: posts a structured failure note on the ticket and reverts it from "In Review" back to "In Progress"
  - The responsible worker agent fixes the issue
  - The QA loop restarts from the top (Review → QA)
  - **Maximum 3 iterations** — if still failing after 3 attempts, Coordinate escalates to the main agent
- If all checks pass: Scrum Master moves all tickets to **"In Review"** and the workflow continues to PR

---

### Step 4 — Pull Request

The QA agent creates the PR using a structured template.

**The PR body always includes:**
- What the PR does (user-facing description)
- Implementation notes (key decisions, non-obvious patterns)
- Files changed with one-line descriptions
- Schema changes (or "None")
- Linear ticket links (`Closes AGI-XX`)
- Test plan checklist
- Known limitations or follow-up items

The Scrum Master posts the PR URL as a comment on every related Linear ticket.

Coordinate reports the PR URL to the main agent, which presents it to the human.

**This is the second human gate.** The human and main agent review the PR together — reading the description, checking the diff, and deciding:
- **Approve** → proceed to merge
- **Return** → main agent instructs Coordinate which agents need to fix what, and the QA loop restarts

---

### Step 5 — Merge and Close

Once the human explicitly approves the PR, the main agent confirms the merge.

- The PR is merged (squash merge)
- Scrum Master moves all related tickets to **"Done"** with a final comment summarising what was built, the PR link, any gotchas, and any follow-up items noted
- The feature branch is complete

The cycle is now ready to repeat for the next feature.

---

### Step 6 — Picking Up New Linear Tickets

At the start of each working session, the main agent runs a **backlog scan**.

- The Coordinate skill invokes the Scrum Master with the `SCAN_BACKLOG` command
- Scrum Master queries Linear for all AGI tickets in **Backlog** or **Todo** state
- The list is presented to the main agent, which shares it with the human
- The human decides what to pick up next
- The main agent plans the selected work → human approves → Coordinate executes

This ensures that any ticket created directly in Linear (by a team member, by a previous session, or by the human) is surfaced and acted on in the next iteration.

---

## Flow Diagram

```
Human
  │
  │  "Build X"
  ▼
Main Agent ──── explores codebase, drafts plan
  │
  │  Human approves plan
  ▼
Coordinate Skill
  │
  ├── cut branch
  ├── Scrum Master: CREATE_TICKET (per task) ──► Linear: tickets → In Progress
  │
  ├── Backend Agent ──► Scrum Master: UPDATE_STATUS In Progress
  │        │             (builds API / DB / lib)
  │        └──────────── Scrum Master: UPDATE_STATUS In Review
  │
  ├── Frontend Agent ─► Scrum Master: UPDATE_STATUS In Progress
  │        │             (builds pages / components)
  │        └──────────── Scrum Master: UPDATE_STATUS In Review
  │
  ├── Integrations Agent ► Scrum Master: UPDATE_STATUS In Progress
  │        │                (builds connectors)
  │        └──────────────── Scrum Master: UPDATE_STATUS In Review
  │
  ├── Review Agent
  │        │  MUST FIX? ── back to worker ── Scrum Master: POST_COMMENT
  │        └── LOOKS GOOD ►
  │
  ├── QA Agent
  │        │  FAIL? ─── Scrum Master: QA_FAILED ──► Linear: tickets → In Progress
  │        │             back to worker (max 3x)
  │        └── PASS ──► Scrum Master: UPDATE_STATUS In Review
  │
  ├── QA Agent: creates PR (structured template)
  │        └── Scrum Master: POST_COMMENT (PR URL) ──► Linear: PR link on tickets
  │
  │  Human reviews PR
  │  Return? ── back to workers
  │  Approve?
  ▼
Merge
  └── Scrum Master: UPDATE_STATUS Done ──► Linear: tickets → Done

  ────────────────────────────
  Next session:
  Coordinate SCAN_BACKLOG ──► Scrum Master queries Linear ──► presents to Human
```

---

## Human Approval Gates

There are exactly two points where the human must explicitly approve before work continues:

1. **Plan approval** — before any code is written or tickets created
2. **PR approval** — before the PR is merged and tickets are closed

At every other point, the agent team operates autonomously and keeps Linear updated as the source of truth.

---

## Linear as the Audit Trail

Every significant event in the workflow is recorded in Linear:

| Event | Linear action |
|---|---|
| Work starts on a task | Ticket created → In Progress, plan posted as comment |
| Worker finishes | Ticket → In Review, completion summary posted |
| Review finds issues | Comment posted with what must be fixed |
| QA fails | Ticket → In Progress, failure details posted |
| QA passes | Ticket → In Review |
| PR created | PR URL posted as comment |
| PR merged | Ticket → Done, final summary posted |

If you ever want to know what happened with a piece of work, the Linear ticket has the full story.
