# Neon Guestbook

## log
- 2025-01-01: Initial creation - neon guestbook with Supabase backend

## features
- Sign with name and message
- 8 neon glow colors to choose from
- Real-time updates via Supabase subscriptions
- Anonymous auth for posting
- Brick wall background aesthetic
- Flickering neon title effect
- Time-relative timestamps (just now, 5m ago, etc.)
- Entry counter
- Mobile responsive

## technical
- Supabase backend with RLS policies
- Anonymous auth for user_id tracking
- Real-time postgres changes subscription
- CSS neon glow effects
- Permanent Marker + Space Mono fonts

## database
- Table: guestbook
- Columns: name (text), message (text), color (text), user_id, created_at, updated_at
- RLS: read all, insert/update/delete own

## issues
- None yet

## todos
- Add emoji reactions to entries
- Add profanity filter
- Add entry deletion for own posts
- Add pagination for older entries
