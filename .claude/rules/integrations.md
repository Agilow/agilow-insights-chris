# Integration Notes

## Slack
- API: Slack Web API (https://api.slack.com/web)
- Auth: Bot token stored in env SLACK_BOT_TOKEN
- Key methods: conversations.history (messages), conversations.replies (threads)
- Rate limit: Tier 3 = 50 req/min for conversations.history
- Pagination: use cursor from response.response_metadata.next_cursor
- Demo channels: #daily-standup, #all-agilow, #background-research-progress
- NEVER ingest: #customer-discovery-leads, #vc-accelerators

## Granola
- Demo path: manual transcript paste (text input in UI)
- MCP path: Granola exposes MCP server for internal dev use — not productized yet
- Demo spaces: Agilow Demo Calls, Agilow Power Hour, Agilow StandUp, Agilow Unplanned
- NEVER ingest: Sitewiz, TalktoMe Goose, WebVizio, CD interviews, Drawit, Sitewiz Daily Standup

## MCP strategy (important — read before adding any MCP)
MCPs are convenient but expensive on context. A single MCP can consume up to 20% of the context window on every prompt, even when not actively used.

Rule: **Use MCP to prototype, then replace with a custom Skill.**
1. Use an MCP to verify an integration works (auth, data shape, key endpoints)
2. Once proven, write a custom connector in lib/integrations/<name>/ and a Skill in skills/<name>/
3. Remove the MCP from .mcp.json — the Skill replaces it for all ongoing use

This applies to Granola MCP, any future Jira MCP, GitHub MCP, etc. The .mcp.json file should stay lean.
