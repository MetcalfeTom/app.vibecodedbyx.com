# Cozy Lounge

## log
- 2026-04-07: Initial build — real-time chatroom with fireside aesthetic. Warm amber/cream palette on deep roasted-brown background, drifting ember particles, flickering fire glow at bottom, Fraunces serif + IBM Plex Mono. Join screen with cozy default name placeholders, then chat view with rounded speech-bubble messages (own messages glow amber on the right). Uses `simple_chat_messages` table (shared with simple-chat & system-health). Anonymous Supabase auth via supabaseSession(). Realtime via postgres_changes subscription + 4s poll fallback.

## features
- Fireside aesthetic: warm amber/cream/ember palette, drifting ember particles, flickering bottom glow
- Join screen with random cozy placeholder names (FiresideFox, EmberMoth, Hazelnut, …)
- Remembers username in localStorage
- Realtime chat via Supabase postgres_changes on `simple_chat_messages`
- 4s polling fallback if realtime is slow
- Own messages styled differently (amber glow, right-aligned, swapped bubble corners)
- Animated slide-in on new messages
- Mobile responsive (single-column layout under 600px)
- Footer backlink to sloppy.live
- OG tags + emoji favicon

## issues
- Shares `simple_chat_messages` table with simple-chat and system-health (cannot create new tables without MCP) — conversations bleed across all three apps. Accepting this as a feature ("one big stream chat").
- No profanity filter, no rate limiting beyond browser
- No delete/edit own messages (keeps UI simple)

## todos
- Real OG image PNG (currently references og-image.png which may not exist)
- Typing indicators via presence
- Reactions on messages
- Message timestamps grouped by minute
- Soft bell sound on new messages (opt-in)
