# Database Rules

## ORM
- Always use Prisma client — never write raw SQL
- Import from: `import { prisma } from '@/lib/prisma'`
- Use `prisma.$transaction([...])` for any operation writing to more than one table

## Evidence requirement (non-negotiable)
Every row written to Signal, Decision, Blocker, or Commitment MUST include:
- `evidence_refs: String[]` with at least one entry
- For Slack sources: the message permalink
- For transcript sources: the verbatim quote from the transcript
- No evidence = the row is invalid and must not be written

## API response shape
All app/api/ routes return:
```ts
{ data: T | null, error: string | null }
```
Never return raw Prisma objects directly — shape the response explicitly.

## Confirmed schema decisions
- Next.js 15 App Router — all DB calls happen server-side (server components or API routes)
- Extraction jobs run synchronously for demo — no job queue yet
- Snapshot table stores one row per project (latest state only — overwrite on update)
