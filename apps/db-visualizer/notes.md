# DB Visualizer

## log
- 2025-01-01: Added full CRUD - add/edit/delete rows, table creation/deletion UI
- 2025-01-01: Initial creation - Supabase database explorer

## features
- Browse all 46 tables in sidebar
- Search/filter tables
- View data (100 row limit)
- View schema (inferred from data)
- **CRUD Operations:**
  - Add new rows with auto user_id
  - Edit existing rows (own rows only via RLS)
  - Delete rows (own rows only via RLS)
  - Create table modal (needs MCP backend)
  - Delete table modal with confirmation (needs MCP backend)
- Row counts per table
- JSON modal for complex objects
- UUID shortening with tooltips
- Type-colored badges
- Toast notifications
- Dark theme (GitHub-style)

## technical
- Hardcoded Supabase URL and anon key
- supabase-js v2 from CDN
- Anonymous auth for user_id tracking
- Type inference from sample data
- Modal-based forms
- JetBrains Mono font

## tables
46 tables including: users, guestbook, chat_messages, leaderboard_scores, feedback, etc.

## issues
- Schema is inferred, not from actual DB schema
- Limited to 100 rows per table
- RLS restricts edit/delete to own rows only
- Table creation/deletion requires MCP tools (Claude)

## todos
- Add pagination for large tables
- Add column sorting
- Add SQL query mode
- Add data export (CSV/JSON)
