# Cosmic Chat - The Wormhole Garden

## Log
- 2026-09-29: +hide on others' messages: gone for you at once, for everyone at HIDE_AT=2 hides from non-authors; the author sees 'hidden from everyone else by readers'. cosmic_messages has NO id column (the create_table tool only adds user_id/created_at/updated_at), so a message is keyed '<user_id>@<created_at in ms>' (msgKey parses REST and realtime timestamp formats). New table cosmic_chat_hides (id bigserial, message_id TEXT holding that key, default RLS); hides load with limit 5000 after the messages and have their own realtime channel, so if they fail everything stays visible. The DOM stays append-only (a hidden message's node is removed) and each message's corruption is decided once (looks map), so glitches don't reshuffle. Also: cooldown 1.5 s with a note under TRANSMIT instead of alert(), 500/20 char cuts in JS instead of alerts, TRANSMISSIONS/CORRUPTED now count what's on screen (own messages were counted twice), own messages show right away via insert().select(), send errors shown. Tested with a stub client only. Known: the page's CSP meta blocks the Google Fonts stylesheet, so Space Mono never loads (falls back to monospace).
- Initial creation: Surreal cosmic chat community with dark twist
- Theme: Wormhole (🌀) + Apple (🍎) + Star (⭐) lovechild
- Features: Real-time chat using Supabase, message corruption system, animated wormhole background
- Dark twist: Random messages get "corrupted" with glitch characters (20% chance)
- Stats tracker: Total transmissions, corrupted messages, fluctuating "void strength"
- Cosmic aesthetic: Purple/magenta/green color scheme, space theme, spinning wormholes
- Real-time updates via Supabase subscriptions

## Issues
- None yet

## Todos
- Could add ability to "uncorrupt" messages with special actions
- Could add different corruption levels based on void strength
- Could add cosmic events that affect all users
- Could add private wormhole channels
- Could add user avatars/cosmic identities

## Notes
- Uses Supabase for real-time chat functionality
- Messages have 15-20% chance of being corrupted on send/display
- Corruption replaces characters with glitch symbols: █▓▒░◆◇◈✦✧⚠☠⚡
- Animated elements: spinning wormhole, pulsing stars, drifting messages, glitching corrupted messages
- Color scheme: Black bg, purple (#8a2be2), magenta (#ff00ff), green (#0f0), red (#8b0000)
- Space Mono font for that retro-futuristic terminal feel
- Mobile responsive design

- 2026-09-26: App script was dead on load — `import { supabase, supabaseSession }` from the root config, which has no named `supabase` export (SyntaxError kills the whole module). Now `import supabase, { supabaseSession } from '/supabase-config-fixed.js'`; verified loading with a stub db (no errors, db calls run).
