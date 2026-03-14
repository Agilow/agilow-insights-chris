# Security Rules

## Data access restrictions
- NEVER ingest Slack channels: #customer-discovery-leads or #vc-accelerators (sensitive business data)
- NEVER ingest Granola spaces outside: Agilow Demo Calls, Agilow Power Hour, Agilow StandUp, Agilow Unplanned
- NEVER ingest non-Agilow meeting spaces (Sitewiz, TalktoMe Goose, WebVizio, Drawit, CD interviews)

## API / secrets
- NEVER call Anthropic SDK directly in route handlers — always use lib/ai/claude.ts
- NEVER hardcode API keys, tokens, or credentials in any file
- All secrets via process.env — reference .env.example for required variables
- NEVER commit .env or .env.local files

## Input handling
- Validate all user inputs at the API route level before passing to lib functions
- Transcript text: strip before processing, enforce max length of 50,000 characters
- Channel IDs: whitelist against allowed channels before fetching
