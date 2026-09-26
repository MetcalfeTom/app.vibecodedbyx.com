# Chatter - Discord Clone

## Log
- Initial creation: Discord-like chat application
- Features:
  - Server sidebar with icons
  - Channel list (text channels)
  - Real-time messaging with Supabase
  - User authentication integration
  - Multiple channels (general, random, memes, coding)
  - Discord-like UI with dark theme
  - Message timestamps
  - User avatars
  - Scrollable message history
- Supabase database integration for persistent chat

## Issues
- Need to create chat_messages table in Supabase

## Todos
- Create chat_messages table with columns: id, channel, author, content, user_id, created_at
- Could add reactions/emojis
- Could add file uploads
- Could add user roles/permissions
- Could add voice channels (WebRTC)

## Notes
- Uses Supabase realtime subscriptions for live updates
- Messages persist across sessions
- Anonymous users can chat as guests
- Authenticated users show their profile name

- 2026-09-26: App script was dead on load — `import { supabase, supabaseSession }` from the root config, which has no named `supabase` export (SyntaxError kills the whole module). Now `import supabase, { supabaseSession } from '/supabase-config-fixed.js'`; verified loading with a stub db (no errors, db calls run).
