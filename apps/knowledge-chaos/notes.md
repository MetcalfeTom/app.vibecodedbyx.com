# Knowledge Chaos

## Log
- 2026-09-29: +[hide] on others' messages: hidden for you at once, for everyone at HIDE_AT=2 hides from non-authors; the author sees '// hidden from everyone else by readers'. knowledge_messages has NO id column (the create_table tool only adds user_id/created_at/updated_at), so a message is keyed '<user_id>@<created_at in ms>' (msgKey parses REST and realtime timestamp formats). New table knowledge_chaos_hides (id bigserial, message_id TEXT holding that key, default RLS); hides load with limit 5000 after the messages and have their own realtime channel, so if they fail everything stays visible. The chat is now a messages array + render() (only new messages slide in). Also: 1.5 s send gap, 500/20 char cuts in JS, a status line under SEND for cooldown/send/hide errors (they only went to the console), own messages show right away via insert().select(), the chat loads even if the session fails, newlines kept (pre-wrap). Tested with a stub client only.
- Initial creation: Minimal chaotic page with YouTube player and real-time chat
- Theme: Matrix-style green-on-black terminal aesthetic
- YouTube player with URL input and preset videos about deep knowledge
- Real-time chat using Supabase for knowledge seekers to discuss
- Preset videos: Alan Watts, Terence McKenna, Carl Sagan, Richard Feynman, Ram Dass, Jordan Peterson
- Glitch and flicker animations for chaotic feel
- Split-screen layout: video on left, chat on right

## Issues
- None yet

## Todos
- Could add video queue/playlist feature
- Could add ability to upvote/react to messages
- Could add user presence indicators
- Could add video timestamp sharing in chat
- Could add more preset videos organized by category
- Could add search functionality for videos

## Notes
- Color scheme: Pure black (#000), bright green (#0f0), dark green (#001100, #0a0), cyan (#0ff)
- Courier New monospace font for terminal feel
- Animations: glitch, flicker, blink, pulse, slideIn
- YouTube embed with autoplay enabled
- Can paste full YouTube URLs or just video IDs
- Enter key shortcuts: Enter in video input loads video, Enter in chat sends message
- Preset videos cover philosophy, consciousness, science, spirituality
- Real-time chat via Supabase subscriptions
- Message limit: 500 characters, username limit: 20 characters
- Chat scrolls to bottom on new messages
- System message welcomes users
- Mobile responsive: stacks video and chat vertically on small screens
- Exit button in top-right corner
- "LIVE" status indicator in header

- 2026-09-26: App script was dead on load — `import { supabase, supabaseSession }` from the root config, which has no named `supabase` export (SyntaxError kills the whole module). Now `import supabase, { supabaseSession } from '/supabase-config-fixed.js'`; verified loading with a stub db (no errors, db calls run).
