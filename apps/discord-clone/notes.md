# Chatter - Discord Clone

## Log
- 2026-09-29: +own tables. The app read and wrote 'chat_messages', which is the STREAM's chat table (username/text/sent_to_model columns): its channel/author/content inserts never matched, so nothing ever saved. Now discord_clone_messages (id bigserial, channel, author, content; index channel+created_at) and discord_clone_hides (message_id bigint). Hide: a message not yours has a hide button; hidden for you at once, for everyone at HIDE_AT=2 hides from non-authors; the author sees a note. Display name from user_metadata (preferred_username/nickname/name), else Guest-NNNN: it used to show the email prefix of logged-in users. 1.5 s send gap, 2000-char cut in JS, send errors shown under the input (it used to fake-add failed messages), load errors shown with Try again. Live inserts are checked against the current channel (the old filter stayed on #general after switching). Demo-message seeding removed (user_id 'system' failed RLS anyway).
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
