# Code Style

## TypeScript
- Strict mode enabled — no `any` types, ever
- Prefer explicit return types on all exported functions
- Use `type` for object shapes, `interface` only when extending
- No `// @ts-ignore` or `// @ts-expect-error`

## Naming
- Files: kebab-case (e.g. `transcript-parser.ts`, `slack-sync.ts`)
- React components: PascalCase (e.g. `ProjectCard.tsx`)
- Functions and variables: camelCase
- Constants: UPPER_SNAKE_CASE only for true constants (not config objects)

## Exports
- lib/ functions: named exports only — no default exports
- React components: default export (Next.js convention for page files), named for shared components

## Function size
- Keep functions under 50 lines
- If a function needs more, split into smaller named helpers
- No deeply nested callbacks — extract to named functions

## Comments
- No comments on self-explanatory code
- Add a comment only when the logic is non-obvious or works around a known bug/quirk
- Never leave TODO comments in committed code — use Linear tickets instead

## Imports
- Absolute imports using @/ alias (e.g. `import { prisma } from '@/lib/prisma'`)
- No relative imports that go more than one level up (`../../`)
- Group imports: external packages first, then internal @/ imports
