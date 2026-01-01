# DB Visualizer

## log
- 2025-01-01: Initial creation - Supabase database explorer

## features
- Browse all 46 tables in sidebar
- Search/filter tables
- View data (100 row limit)
- View schema (inferred from data)
- Row counts per table
- JSON modal for complex objects
- UUID shortening with tooltips
- Type-colored badges
- Refresh button
- Dark theme (GitHub-style)

## technical
- Hardcoded Supabase URL and anon key
- supabase-js v2 from CDN
- Type inference from sample data
- JetBrains Mono font

## tables
46 tables including: users, guestbook, chat_messages, leaderboard_scores, feedback, etc.

## issues
- Schema is inferred, not from actual DB schema
- Limited to 100 rows per table
- Some tables may have RLS restrictions

## todos
- Add pagination for large tables
- Add column sorting
- Add SQL query mode
- Add data export (CSV/JSON)
- Fetch actual schema from information_schema
