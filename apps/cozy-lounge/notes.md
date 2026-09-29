# Cozy Lounge

## log
- 2026-09-29: the hearth. A canvas fire under the lounge (crossed logs + soft sprite flames) sized by how warm the room is: each message adds heat that fades over ~30 min (heat = 1 - exp(-sum/4)), 1-6 logs, the status line and the join screen say embers ticking / a low flame / crackling / roaring, and a new message tosses sparks up. The join screen peeks at the last 80 messages so you see the mood before sitting down. On screens wider than 600px the lounge sits higher (76vh) so the fire shows underneath; on phones it glows through the panel. Reduced motion paints a still fire.
- 2026-09-29: messages were thrown away: the chat keyed each one on an `id` column that simple_chat_messages does not have, so every message (history, live, your own) was dropped and the lounge looked empty. Now a message is known by user_id + created_at (both timestamp formats) + length; a failed send says so in the status line instead of an alert.
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
