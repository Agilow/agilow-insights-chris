# React / Next.js Rules

## Server vs client components
- Default to server components — no 'use client' unless required
- Add 'use client' only when the component uses: useState, useEffect, event handlers, browser APIs
- Never fetch() your own API routes from server components — call lib/ functions directly

## Data fetching
- Server components: call lib/ or prisma directly (no useEffect, no fetch)
- Client components: use fetch() to app/api/ routes with proper loading/error states
- No data fetching in layout.tsx files

## Loading and error states
- Every page that fetches data must have loading.tsx and error.tsx siblings
- Use Suspense boundaries around async server components
- Empty states: always show a meaningful message, never a blank screen

## Component structure
- Keep components under 100 lines — split into sub-components if larger
- Props: define explicit TypeScript types for all props, no inline type literals on complex objects
- No inline styles — Tailwind classes only
- Check shadcn/ui primitives before building any UI element from scratch

## File locations
- Pages: app/(pages)/<route>/page.tsx
- Shared components: components/<ComponentName>.tsx
- Page-specific components: app/(pages)/<route>/_components/<ComponentName>.tsx
