# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is
- Agilow: AI project intelligence platform — synthesizes Granola meeting transcripts + Slack into live project snapshots, risk signals, and standup drafts
- Phase 1 (demo March 15 2026): Slack + Granola only — no Jira, no write-back to any source
- Full product spec: PRODUCT_SPEC.md (in repo root)

## Commands
```bash
npm run dev          # Dev server at http://localhost:3000
npm run build        # Production build — catches all TypeScript errors
npm run lint         # ESLint
npx prisma generate  # Regenerate client after schema changes
npx prisma db push   # Push schema to Neon (no migration files for demo)
npx prisma studio    # Visual DB browser
```

## Stack
- Next.js 15 (App Router, TypeScript), Tailwind CSS v4, shadcn/ui
- Prisma ORM + PostgreSQL (Neon) — `prisma-client-js` generator, datasource URL configured in `prisma.config.ts` (not in schema.prisma)
- Claude claude-sonnet-4-6 — all calls via lib/ai/claude.ts only
- Clerk auth — post-demo only, skip for March 15

## Architecture

### Data pipeline (core flow across multiple files)
```
Ingest (transcript paste or Slack sync)
  → lib/extraction.ts (call Claude to extract structured signals)
  → prisma write: Signal[], Decision[], Blocker[], Commitment[] (each with evidence_refs[])
  → lib/snapshot.ts (synthesize latest project state from all signals)
  → prisma write: Snapshot (one row per project, overwrite on update)
```

### Key singletons
- `lib/prisma.ts` — PrismaClient singleton. Import: `import { prisma } from '@/lib/prisma'`
- `lib/ai/claude.ts` — single entry point for Anthropic SDK. Never import the SDK elsewhere.
- `lib/utils.ts` — `cn()` helper for Tailwind class merging
- `lib/queries/project.ts` — Prisma read queries for dashboard + detail page. All DateTime fields serialized to ISO strings here.
- `lib/status-colors.ts` — Badge color helpers: statusBadgeClass, severityBadgeClass, commitmentStatusBadgeClass

### Server → client prop rule
Never pass functions as props from server components to client components — React cannot serialize them. Pass plain data (strings, arrays, objects) only. Use a variant string prop to select rendering logic inside the client component.

### Layout
- `app/layout.tsx` — root layout with fixed 240px navy (#0B1F3A) sidebar + white main area
- `app/page.tsx` — redirects to /dashboard
- Pages live under `app/(pages)/` — page-specific components go in `_components/` subdirs

### Integration connectors (lib/integrations/<name>/)
Each connector follows the contract: `auth.ts`, `sync.ts`, `parser.ts`
- parser.ts always outputs Signal[] with evidence_refs[]

## Non-negotiable rules
1. Every Signal/Decision/Blocker/Commitment MUST have evidence_refs[] (min 1 entry) — see rules/database.md
2. Never call Anthropic SDK directly in routes — use lib/ai/claude.ts
3. Never ingest restricted Slack channels or Granola spaces — see rules/security.md
4. Never raw SQL — Prisma only, use `prisma.$transaction()` for multi-table writes

## Agents and skills
- agents/research.md  → searches web for API docs before building connectors
- agents/qa.md        → runs build/lint/test, fixes failures
- agents/review.md    → checks code quality before QA
- skills/build-api/   → builds API routes and DB logic
- skills/build-ui/    → builds React pages and components
- skills/build-integration/ → builds source connectors
- skills/snapshot/    → regenerates project snapshots (debug)
- skills/linear-ticketing/ → pick up Linear ticket → build → PR → close (uses cloud MCP)

## Conventions
See .claude/rules/ for all detailed coding standards:
- rules/database.md, rules/security.md, rules/code-style.md
- rules/architecture.md, rules/integrations.md
- rules/frontend/react.md, rules/frontend/styles.md

## Git
- Branch per ticket: feat/<ticket-id>-short-desc
- Commit: "<type>: <what changed>"
- PR required before merging to main

## Session setup
- After any new scaffold or major file additions: run /init so Claude reads the codebase and auto-updates context
- CLAUDE.md only grows when Claude makes a recurring mistake — do not add rules preemptively
