# Architecture Decisions

## Confirmed decisions
- Next.js 15 App Router (not Pages Router) — all routes use app/ directory
- Prisma + Neon Postgres — no raw SQL anywhere
- Claude claude-sonnet-4-6 for all AI tasks — single model for demo, no routing
- Manual transcript paste for demo (March 15) — no automated Granola sync yet
- Slack bot token (not OAuth) for demo — OAuth comes in MVP 1

## API route conventions
- All routes return: { data: T | null, error: string | null }
- Validation happens in route handler, not in lib functions
- Extraction jobs are triggered synchronously for demo (no job queue yet)

## Key lib files
- lib/ai/claude.ts — single entry point for all Claude API calls
- lib/integrations/slack/ — Slack connector
- lib/integrations/granola/ — Granola connector (manual paste path)
- lib/snapshot.ts — project snapshot generation logic
- lib/extraction.ts — signal extraction from raw text

## Schema key constraint
Every Signal, Decision, Blocker, Commitment must have evidence_refs: String[]
Minimum 1 evidence ref. This is enforced at the application layer.
