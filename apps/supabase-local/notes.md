# Supabase Local Dashboard

## log
- 2026-01-02: Added table filtering, column sorting, pagination, and data search with highlighting
- 2025-01-02: Initial creation - secure local-only Supabase manager

## features
- User inputs their own Supabase URL and anon key
- Credentials stored ONLY in localStorage (never sent to any server)
- Auto-reconnects on page reload if credentials saved
- Lists all public tables
- View table data with column headers
- Add new rows with form modal
- Edit existing rows
- Delete rows with confirmation
- Table filtering in sidebar (search by table name)
- Column sorting (click headers, asc/desc toggle)
- Pagination with page size selector (10/25/50/100)
- Data search with match highlighting
- Disconnect and clear credentials button
- Security notice explaining local-only storage

## security
- NO server-side storage of credentials
- Credentials only leave browser to user's own Supabase instance
- Clear security messaging to users
- "Disconnect" clears all stored data
- Uses official Supabase JS client

## technical
- Supabase JS client v2 from CDN
- REST API introspection for table discovery
- localStorage for credential persistence
- Modal forms for CRUD operations
- Automatic type inference for values (null, bool, number)

## ui
- Dark theme matching Supabase dashboard
- JetBrains Mono for code/data
- Inter for UI text
- Sidebar table list
- Data table with actions column
- Loading spinners
- Error banners

## issues
- RLS policies may hide some data from anon key

## todos
- Add column type detection
- Add SQL query interface
- Add table creation UI
- Add export to CSV/JSON
