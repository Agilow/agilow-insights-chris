# Agilow — Product Specification
**Version:** 1.1
**Date:** March 7, 2026
**Authors:** Shiv Panjwani, Antonio B
**Status:** Active

---

## Table of Contents
1. [Objective & Business Use Case](#1-objective--business-use-case)
2. [ROI & Success Metrics](#2-roi--success-metrics)
3. [Revenue Model](#3-revenue-model)
4. [Users & Personas](#4-users--personas)
5. [Scope](#5-scope)
6. [Product Requirements](#6-product-requirements)
7. [Core User Stories](#7-core-user-stories)
8. [System Architecture Overview](#8-system-architecture-overview)
9. [Data Model Summary](#9-data-model-summary)
10. [Milestones & Timeline](#10-milestones--timeline)
11. [Dependencies & Blockers](#11-dependencies--blockers)
12. [Acceptance Criteria & Product Tests](#12-acceptance-criteria--product-tests)
13. [Definition of Done](#13-definition-of-done)
14. [Open Questions](#14-open-questions)

---

## 1. Objective & Business Use Case

### What is Agilow?
Agilow is a project intelligence platform that aggregates signals from where engineering and product teams actually communicate — meeting transcripts and Slack — and synthesizes them into a live, source-backed picture of each project: what was decided, what is blocked, who owns what, and what changed.

It solves a specific, high-cost problem: **status gathering is manual, scattered, and slow.** PMs and engineering leads spend hours per week reconstructing project state from memory, digging through Slack threads, and re-reading meeting notes. That work produces low-confidence, often-stale outputs.

Agilow replaces that manual synthesis with an always-current intelligence layer that no single existing tool (Granola, Slack, Jira) can produce alone — because the insight lives in the *relationships between* those sources, not within any one of them.

### The Core Insight
> **Meeting transcripts capture intent. Slack reveals reality. The gap between them is where risk lives.**

When a team says in a Monday standup "Tom will finish the endpoint migration by Friday" and Slack shows no follow-up activity by Wednesday, that's a signal. No existing tool catches it. Agilow does.

### Business Use Case
**Target market:** Engineering teams and product organizations at growth-stage startups and mid-size companies (10–200 person teams) using Slack and meeting tools like Granola, Zoom, or similar.

**Problem cost:** A typical PM or engineering manager spends 3–5 hours per week on status gathering and reporting. Across a 10-person PM org, that is 30–50 hours/week of high-skill time spent on low-value synthesis. At a fully-loaded cost of $160/hr, that is $250K–$415K/year in pure overhead per PM org.

**How Agilow reduces it:** Auto-generates daily standup drafts, project snapshots, and weekly alignment reports from real data — reducing status-gathering time by an estimated 60–80%.

---

## 2. ROI & Success Metrics

### Quantitative ROI (per team, per month)
| Metric | Baseline | With Agilow | Delta |
|---|---|---|---|
| Hours/week on status gathering (per PM/EM) | 4 hrs | 1 hr | -3 hrs |
| Cost/week (at $160/hr fully loaded) | $640 | $160 | -$480/wk |
| Monthly savings per seat | $2,560 | $640 | -$1,920 |
| Proposed SaaS price | — | $50–$100/seat/mo | — |
| Customer ROI multiple | — | — | 19–38x |

### Qualitative ROI
- Fewer missed deadlines due to earlier risk visibility
- Reduced meeting load (status meetings become optional)
- Higher-quality leadership reporting (backed by evidence, not memory)
- Faster onboarding — new team members get instant project context

### Demo Success Metric (March 15)
Chris sees a live demo on real Agilow team data and chooses to invest/advance in the competition.

### MVP 1 Success Metrics (post-competition)
1. A PM or EM on the team says: "I used Agilow's draft instead of writing my standup from scratch."
2. A risk flagged by Agilow is confirmed real by a human reviewer (>70% precision target)
3. A project snapshot is accurate enough that a team member does not need to cross-check it against raw Slack

---

## 3. Revenue Model

### Primary: SaaS Per Seat
- **Price point:** $50–$100/seat/month (to be validated with design partners)
- **Why per seat works:** Value scales with team size; each seat = one PM/EM/founder who saves ~3 hrs/week
- **Billing:** Monthly, with annual discount option

### Alternative to Consider: Per Workspace + Seat Cap
- **Structure:** $200–$500/workspace/month, includes up to N seats (e.g., 5), then $30–$50/additional seat
- **Why it may work better early:** Removes friction for team adoption decisions; one invoice per company is easier for procurement; protects against low per-seat pricing with large teams
- **Recommendation:** Start with per-seat for simplicity. Evaluate workspace pricing when first enterprise customer appears.

### Out of Scope for Revenue (MVP 1)
- Billing/Stripe integration — not built in MVP 1
- Freemium tier — not built in MVP 1
- Annual contracts — not needed until post-demo validation

---

## 4. Users & Personas

### Primary User: The PM or Engineering Manager
- Runs 2–5 projects simultaneously
- Attends 8–15 meetings/week
- Manages Slack channels for each project
- Currently: manually writes standup reports, status updates, and risk assessments
- Pain: spends more time reporting than acting

### Secondary User: The Founder / Executive
- Needs portfolio visibility across multiple projects
- Does not have time to read every Slack thread or attend every meeting
- Needs to answer: "Which projects are at risk? What decisions were made this week? Who is blocking what?"

### MVP 1 User (Demo): The Agilow Founding Team
- Uses Granola for meeting transcription
- Uses Slack for async communication
- Has real project data available immediately
- Is both the builder and the first user — enables rapid feedback loop

---

## 5. Scope

### MVP 1 — In Scope

**Data Sources:**
- Granola meeting transcripts (via manual paste/upload in product; MCP-assisted retrieval for internal dev use)
- Slack workspace (OAuth, read-only, selected channels)

**Intelligence Layer:**
- Signal extraction from transcripts: decisions, blockers, action items, owners, deadlines
- Signal extraction from Slack: progress updates, escalations, execution drift, follow-up activity
- Cross-source comparison: meeting commitments vs. Slack follow-through
- Risk flagging: blocker not resolved, commitment with no Slack follow-up, ownership ambiguity
- Project snapshot generation: synthesized, living view per project

**Core Outputs:**
- Daily standup draft: auto-generated from last meeting + recent Slack activity
- Project snapshot view: decisions, blockers, commitments, timeline, confidence
- Weekly alignment report: what was decided, what moved, what is blocked, what needs attention
- Project-scoped chat: answer the 4 core questions with source citations

**The 4 Core Questions (must answer extremely well):**
1. What did we decide?
2. What is blocking us now?
3. Who owns what next?
4. What changed since the last meeting?

**UI (based on confirmed prototype):**

**1. Project Health Dashboard (`/dashboard`)**
- Greeting header ("Good morning, [Name]")
- "Project Health Overview" with filter bar: All | On Track | At Risk | Blocked | All Ownership | My Projects | My Team
- Project cards grid (2 columns): name, status badge (On Track / At Risk / Blocked), member count, due date, progress bar with %, source breakdown (N Slack · N meetings), risk count badge, last updated timestamp
- Click any card to drill into project detail

**2. Project Detail Page (`/projects/[id]`)**
- Header: project name, status badge, confidence badge, date range, phase label, last activity, team avatars
- Progress bar with % and "N steps remaining · Estimated completion: [date]"
- Tabs: Overview | Timeline & Decisions | Risks (N Open)
- Overview tab layout:
  - Left panel: Current Snapshot (text summary + numbered remaining steps with day estimates), Project Objective, Data Sources panel (Slack N items, Meetings N items)
  - Right sidebar: Top Risks (severity badge + description + recommended action), Milestones (with status icons + dates), Team (name, role, avatar)

**3. Plan Manager (`/plan`)**
- Header: "Plan Manager · X/Y done this week · N need attention"
- Weekly tab: day-by-day task list across all projects; each row shows day, task, project, owner, status badge (Done / Slipped / In Progress / At Risk / Upcoming)
- Daily tab: "Today's Focus" section (time-stamped items with project + blocked indicator) + "Prep For Tomorrow" section (upcoming meetings with documents needed, linked)

**4. Chat (`/chat`)**
- Header: "Ask Workspace — Query all project data in natural language"
- Chat interface with example questions sidebar, categorized by: Risks & Blockers | Timelines & Progress | Scope Changes | Ownership & Activity
- Workspace-scoped (not just one project) — can answer cross-project questions

**5. Source Ingest (`/settings/sources`)**
- Connect Slack (OAuth button + channel selector)
- Upload/paste transcript (file upload + text area)
- Sync status per source with last synced timestamp

**Authentication:**
- Single workspace, single user (internal use only for demo)
- Clerk auth added for MVP 1 proper

### MVP 1 — Out of Scope
- Jira integration (Phase 2)
- Email integration (Phase 3)
- Confluence / Notion integration (Phase 3)
- GitHub integration (Phase 3)
- Zoom direct API integration (Phase 3)
- Write-back to any source (no posting to Slack, Jira, Confluence)
- Multi-tenant / multi-workspace (Phase 4)
- Billing / Stripe (Phase 4)
- Mobile app
- Notifications / alerts (email, Slack push)
- Advanced forecasting / burndown / burnup charts
- PDF export of reports
- Automated historical data sync (manual ingestion only for transcripts in demo)
- Progress percentage calculations (requires Jira; not available until Phase 2)

### Demo Scope (March 15 — subset of MVP 1)
The demo is a working product on real Agilow team data. It does not need to be production-ready.

Demo must show:
- At least 2 projects visible on the dashboard with status and risk indicators
- One transcript ingested and signals extracted (decisions, blockers, commitments)
- Slack data synced for at least 2 channels
- Cross-source comparison working (at least 1 example of meeting vs Slack drift)
- Daily standup draft generated from real data
- Chat answering at least 2 of the 4 core questions with source citations
- Project detail page showing snapshot, decisions, blockers

Demo does not need:
- User login / Clerk auth
- Multi-project onboarding flow
- Production deployment (localhost is fine)
- Polished error handling
- Weekly report (nice to have, not required)

---

## 6. Product Requirements

### Must Have (P0 — Demo + MVP 1)
| # | Requirement |
|---|---|
| P0-1 | System ingests a Granola transcript (paste or file upload) and extracts structured signals |
| P0-2 | System connects to a Slack workspace and reads message history from selected channels |
| P0-3 | Extracted signals include: decision, blocker, action item, owner, deadline, confidence score, evidence reference |
| P0-4 | Every signal carries a source pointer (transcript timestamp or Slack message permalink) |
| P0-5 | System generates a project snapshot: decisions, blockers, commitments, what changed |
| P0-6 | System detects cross-source drift: commitment made in meeting with no Slack follow-up |
| P0-7 | System generates a daily standup draft from last meeting + Slack activity |
| P0-8 | Project-scoped chat answers the 4 core questions with cited evidence |
| P0-9 | Dashboard shows multiple projects with status, blocker count, last updated |
| P0-10 | Project detail page shows snapshot, decisions, blockers, commitments, evidence panel |

### Should Have (P1 — MVP 1 proper, post-demo)
| # | Requirement |
|---|---|
| P1-1 | User authentication via Clerk (single workspace to start) |
| P1-2 | Weekly alignment report generated per project |
| P1-3 | Human review controls: confirm/reject/edit extracted signals |
| P1-4 | Identity resolution: map "Tom" in transcript to @tom in Slack |
| P1-5 | Project creation UI with manual channel + meeting mapping |
| P1-6 | Risk register view: all flagged risks with status, owner, evidence |
| P1-7 | Timeline view: past decisions and upcoming commitments (from explicit dates in sources) |
| P1-8 | Confidence scoring visible on all extracted signals |

### Nice to Have (P2 — post-MVP 1)
| # | Requirement |
|---|---|
| P2-1 | Slack OAuth for end-user workspace connection (vs hardcoded dev credentials) |
| P2-2 | Granola MCP productized sync (vs manual paste) |
| P2-3 | Report export to Slack (post to channel) |
| P2-4 | Multi-workspace support |
| P2-5 | Model selector per workspace (Claude / GPT-4o / Gemini) |

---

## 7. Core User Stories

### US-1: Daily Standup (Primary value prop for demo)
> As a PM, I want Agilow to draft my daily standup update so that I don't start from a blank page.

**Flow:** User opens Agilow → selects project → clicks "Generate Standup Draft" → sees pre-filled: what was completed (from Slack), what is planned today (from last meeting commitments), what is blocked (from risk signals) → edits and copies out.

**Acceptance:** Draft is accurate enough that the user makes only minor edits before using it. User does not have to re-read Slack or the meeting transcript to validate it.

---

### US-2: Project Status on Demand
> As a founder, I want to see the current state of any project in under 30 seconds without attending every meeting or reading every Slack thread.

**Flow:** User opens project → sees snapshot: health summary, recent decisions, open blockers, next steps with owners, what changed since last meeting → optionally drills into evidence panel to see source quotes.

**Acceptance:** Snapshot accurately reflects real project state. Evidence panel links to actual Slack messages and transcript segments.

---

### US-3: Chat Q&A
> As an EM, I want to ask "what is blocking Project X?" and get a sourced answer.

**Flow:** User opens chat panel → types question → Agilow returns answer with inline citations (Slack thread link, meeting date + quote).

**Acceptance:** Answer is correct. Citation points to a real source that supports the answer. System does not hallucinate blockers that were not mentioned in any source.

---

### US-4: Risk Detection
> As a PM, I want to be alerted when a commitment made in a meeting has had no Slack follow-up within 3 days.

**Flow:** System runs cross-source comparison daily → flags commitment with no corroborating Slack activity → surfaces as risk in project detail page with evidence: "Tom committed to finishing X on [date]. No Slack activity found on this topic since."

**Acceptance:** Risk is real (true positive). Evidence correctly identifies the meeting where commitment was made.

---

### US-5: Transcript Ingestion
> As a user, I want to paste a Granola transcript and immediately see extracted decisions, blockers, and action items.

**Flow:** User navigates to ingest page → pastes transcript text → clicks process → within 60 seconds sees: extracted decisions, blockers, commitments mapped to this project.

**Acceptance:** Extraction completes within 60 seconds. At least 80% of real decisions and blockers in the transcript are captured. No major false positives (things that are not decisions flagged as decisions).

---

## 8. System Architecture Overview

### Layers
```
[Data Sources]          [Ingestion Layer]        [Intelligence Layer]      [Output Layer]
Granola transcripts --> Transcript parser     --> Signal extraction     --> Project snapshot
Slack messages      --> Slack sync            --> Cross-source compare  --> Standup draft
                                              --> Risk engine           --> Weekly report
                                                                        --> Chat Q&A
```

### Tech Stack
| Layer | Choice | Notes |
|---|---|---|
| Frontend | Next.js 15, TypeScript, App Router | Server-side rendering, API routes |
| Styling | Tailwind CSS + shadcn/ui | Component library, fast iteration |
| Auth | Clerk | Handles OAuth complexity; add in MVP 1 proper |
| Database | PostgreSQL via Prisma ORM | Relational model; hosted on Neon (dev) |
| AI | Claude (Anthropic) | Signal extraction, chat, report generation |
| Deployment (demo) | Localhost / Vercel | No Docker needed for demo |
| Deployment (MVP 1) | Vercel + Neon | Simple, no infrastructure management |
| Storage | Local file system (demo) / S3 (MVP 1) | Transcript files |

### Agent Structure (Claude Code)
Each major build area has a corresponding Claude Code command skill:
- `/build-api` — API routes, database logic, extraction jobs
- `/build-ui` — React components and pages
- `/build-integration` — External connectors (Slack, Granola)
- `/qa` — Build verification, test runs
- `/snapshot` — Debug: regenerate project snapshots

---

## 9. Data Model Summary

The full schema is defined in `prisma/schema.prisma`. Summary of core entities:

| Entity | Purpose |
|---|---|
| `Workspace` | Top-level org container |
| `User` | Person with access to a workspace |
| `Project` | A tracked initiative with aliases and owner |
| `Meeting` | A Granola transcript with attendees and extracted content |
| `SlackMessage` | A message or thread from a Slack channel |
| `Signal` | Normalized fact extracted from any source: type (decision/blocker/action/risk/etc), summary, confidence, evidence refs |
| `Decision` | Confirmed decision with source reference |
| `Blocker` | Active blocker with severity, owner, status |
| `Commitment` | Action item with owner, due date, status |
| `Snapshot` | Latest synthesized state of a project |
| `Person` | Identity record with Slack ID, name aliases |
| `Report` | Generated report (standup draft, weekly alignment) |
| `ChatMessage` | Chat history with sources |

**Key constraint:** Every `Signal`, `Decision`, `Blocker`, and `Commitment` must have at least one `evidence_ref` — a pointer to the source. This is non-negotiable.

---

## 10. Milestones & Timeline

### Horizon 1: Demo (March 7–15, 9 days)

| Milestone | Description | Days | Target Date |
|---|---|---|---|
| D-1: Scaffold | Next.js project, Prisma schema, basic layout, env setup | 1 | Mar 8 |
| D-2: Transcript Ingestion | Paste UI → transcript stored → Claude extraction → signals in DB | 2 | Mar 10 |
| D-3: Project View (Static) | Project detail page rendering extracted signals from DB | 1 | Mar 11 |
| D-4: Slack Ingestion | Slack API connection, channel sync, message storage | 2 | Mar 13 |
| D-5: Cross-Source + Snapshot | Snapshot generation, drift detection, risk flagging | 1 | Mar 14 |
| D-6: Standup Draft + Chat | Standup generator, basic chat with 4-question answering | 1 | Mar 15 |
| D-7: Demo Polish | Dashboard with 2+ projects, visual risk indicators, evidence panel | 0.5 | Mar 15 |

**Critical path:** D-1 → D-2 → D-3 → D-4 → D-5 → D-6. All sequential. No parallel tracks given single builder.

**Buffer:** Almost none. D-2 (extraction) carries the highest risk. If Claude extraction quality is poor, everything downstream is affected. Must validate extraction on real data by end of Mar 10.

---

### Horizon 2: MVP 1 (Post-Competition, ~4–6 weeks)

| Milestone | Description | Complexity | Est. Duration |
|---|---|---|---|
| M-1: Foundation | Clerk auth, production Postgres (Neon), Vercel deploy, CI/CD | Medium | 1 week |
| M-2: Ingestion (Production) | Slack OAuth for end-user workspaces, transcript upload (file + paste) | Medium | 1 week |
| M-3: Signal Quality | Identity resolution, human review controls (confirm/reject), evaluation logging | High | 1.5 weeks |
| M-4: Full UI | All 5 pages complete, evidence panel, timeline view, risk register | High | 1.5 weeks |
| M-5: Reports + Chat | Weekly alignment report, polished chat with confidence display | Medium | 1 week |
| M-6: Design Partner Onboarding | Onboarding flow, project setup UI, first external user | Medium | 0.5 weeks |

**Complexity guide:**
- Low: well-understood, < 1 day of work
- Medium: requires design decisions, 2–4 days
- High: significant unknowns, 5+ days, likely requires iteration

---

## 11. Dependencies & Blockers

### External Dependencies
| Dependency | Needed For | Risk Level | Mitigation |
|---|---|---|---|
| Granola transcript access | D-2 (demo) | Low | Manual paste — no API needed for demo |
| Slack API credentials | D-4 (demo) | Medium | Create Slack app now; approval can take 1–2 days |
| Anthropic API key | D-2 (demo) | Low | Already available |
| Neon / Supabase account | D-1 (scaffold) | Low | Free tier, instant signup |
| Vercel account | M-1 (MVP 1) | Low | Free tier, instant deploy |

### Internal Dependencies (Build Order)
```
D-1 Scaffold
    └── D-2 Transcript Ingestion
            └── D-3 Project View
                    ├── D-4 Slack Ingestion
                    │       └── D-5 Cross-Source + Snapshot
                    │               └── D-6 Standup + Chat
                    └── D-7 Demo Polish (parallel with D-6)
```

### Known Risks
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Claude extraction quality is poor on real transcripts | Medium | High | Test extraction on 3 real transcripts by end of D-2. Iterate prompt before building UI. |
| Slack API approval delayed | Low | High | Create Slack app on Day 1. Use test data if blocked. |
| Granola MCP not stable enough for demo | Medium | Low | Fall back to manual paste — product path is already manual paste |
| Cross-source matching produces too many false positives | Medium | Medium | Start with rule-based heuristics, not pure LLM inference |
| 9 days is insufficient for all demo milestones | Medium | High | D-6 (Standup + Chat) is the most droppable. Prioritize D-1 through D-5 if time runs short. |

---

## 12. Acceptance Criteria & Product Tests

These are tests a human runs on the product — not automated unit tests. Unit tests are written during feature building.

### Product Test PT-1: Transcript Extraction Quality
**Setup:** Paste a real Granola transcript from a recent Agilow standup
**Test:** Review extracted decisions, blockers, and commitments against your own memory of the meeting
**Pass criteria:**
- 8 out of 10 real decisions captured (80% recall)
- Fewer than 2 false positives per 10 extracted items (80% precision)
- Every extracted item has a source quote

---

### Product Test PT-2: Standup Draft Usefulness
**Setup:** Generate a standup draft for a real project after syncing last meeting + Slack
**Test:** Would you use this draft as a starting point, or would you delete it and start over?
**Pass criteria:**
- At least 2 of 3 sections (completed, today, blocked) are accurate
- User makes edits but does not rewrite from scratch
- No hallucinated items (things not in Slack or transcript)

---

### Product Test PT-3: Chat Q&A Accuracy
**Setup:** Ask "What is blocking [project name]?" via chat
**Test:** Verify answer against your own knowledge
**Pass criteria:**
- Answer identifies real blockers (not fabricated)
- At least one citation links to a real source (Slack message or transcript)
- No confident wrong answers (hallucinations are a fail)

---

### Product Test PT-4: Cross-Source Drift Detection
**Setup:** Find a commitment made in a meeting that you know was not followed up in Slack
**Test:** Does Agilow flag it as a risk?
**Pass criteria:**
- Risk is flagged with correct owner and action
- Evidence cites the meeting where commitment was made
- System does not flag it as "resolved" when it was not

---

### Product Test PT-5: Demo Run-Through
**Setup:** Full demo scenario on real data. No prepared fake data.
**Flow:**
1. Open dashboard — see 2+ projects with status indicators
2. Open project detail — see snapshot, decisions, blockers
3. Ask chat: "What changed since the last meeting?"
4. Generate standup draft
5. Show evidence panel: click a blocker, see the source quote

**Pass criteria:**
- Full flow completes without errors
- All data shown is real (not hardcoded)
- Evidence links resolve correctly
- No loading states lasting >10 seconds

---

## 13. Definition of Done

### Demo (March 15)
- [ ] Dashboard shows 2+ real projects from Agilow team data
- [ ] At least 1 transcript ingested and signals visible
- [ ] Slack synced for at least 2 channels
- [ ] Standup draft generated and readable
- [ ] Chat answers "what is blocking X?" with a citation
- [ ] No crashes during demo flow
- [ ] Runs on localhost (no production deployment required)

### MVP 1 (Post-Competition)
- [ ] All P0 requirements implemented and passing product tests
- [ ] All P1 requirements implemented
- [ ] Clerk auth working (login / workspace)
- [ ] Deployed to Vercel with production Postgres
- [ ] At least one design partner has used it on their own data
- [ ] PT-1 through PT-4 passing on design partner data (not just internal data)
- [ ] No hallucinated evidence (all citations resolve to real sources)

---

## 14. Competitive Context: Granola Recipes

Granola has a "Recipes" feature that extracts todos, in-flight project overviews, weekly recaps, and blind spots from meeting notes. This is partial overlap with Agilow's intelligence layer.

**Key distinction:** Granola Recipes operate on a single source — meeting notes only. They cannot cross-reference Slack, detect execution drift between meeting commitments and async follow-through, or produce a multi-source portfolio view. Agilow's moat is the synthesis across sources, not the extraction within one source.

**Relevant Granola spaces available for demo data:**
- Agilow Demo Calls
- Agilow Power Hour
- Agilow StandUp
- Agilow Unplanned

Do not ingest non-Agilow meetings (Sitewiz, TalktoMe Goose, WebVizio, CD interviews, etc.) for the demo — they belong to separate companies and projects.

**Slack channels available for demo:**
- `#daily-standup` — primary cross-source comparison target (standup posts vs meeting commitments)
- `#all-agilow` — general project discussion and decisions
- `#background-research-progress` — project execution signals
- `#customer-discovery-leads` 
 `#vc-accelerators`

---

## 15. Linear Tickets

### Cycle 1 — Demo Sprint (Mar 7–15)

| Ticket | Title | Labels | Est. | Priority | Due | Dependencies |
|---|---|---|---|---|---|---|
| D-1 | Project Scaffold | `demo` `infra` `backend` | 1d | Urgent | Mar 8 | None |
| D-2 | Transcript Ingestion + Signal Extraction | `demo` `backend` `ai` `integration` | 2d | Urgent | Mar 10 | D-1 |
| D-3 | Project Detail Page (Static) | `demo` `frontend` | 1d | Urgent | Mar 11 | D-2 |
| D-4 | Slack Ingestion | `demo` `backend` `integration` | 2d | Urgent | Mar 13 | D-2 |
| D-5 | Cross-Source Comparison + Snapshot Generator | `demo` `backend` `ai` | 1d | Urgent | Mar 14 | D-4 |
| D-6 | Standup Draft + Chat | `demo` `backend` `frontend` `ai` | 1d | High | Mar 15 | D-5 |
| D-7 | Dashboard + Demo Polish | `demo` `frontend` | 0.5d | High | Mar 15 | D-6 |

### Cycle 2 — MVP 1 (Mar 16 – Apr 30)

| Ticket | Title | Labels | Est. | Priority |
|---|---|---|---|---|
| M-1a | Clerk auth + single workspace setup | `mvp1` `infra` | 3d | High |
| M-1b | Vercel + Neon production deployment + CI/CD | `mvp1` `infra` | 2d | High |
| M-2a | Slack OAuth flow for end-user workspace connection | `mvp1` `integration` `backend` | 3d | High |
| M-2b | Transcript file upload (PDF/txt) + paste UI | `mvp1` `frontend` `backend` | 2d | Medium |
| M-3a | Identity resolution: map transcript names to Slack users | `mvp1` `backend` `ai` | 3d | High |
| M-3b | Human review controls: confirm/reject/edit signals | `mvp1` `frontend` `backend` | 3d | High |
| M-3c | Evaluation logging: track extraction accuracy over time | `mvp1` `backend` | 2d | Medium |
| M-4a | Project creation UI + manual channel/meeting mapping | `mvp1` `frontend` `backend` | 3d | High |
| M-4b | Timeline & Decisions tab on project detail | `mvp1` `frontend` | 2d | Medium |
| M-4c | Risk register view (all risks across projects) | `mvp1` `frontend` | 2d | Medium |
| M-5a | Weekly alignment report generator | `mvp1` `ai` `backend` | 3d | Medium |
| M-5b | Polish chat: confidence display, multi-project queries | `mvp1` `frontend` `ai` | 2d | Medium |
| M-6a | Onboarding flow for first external user | `mvp1` `frontend` | 3d | High |

---


