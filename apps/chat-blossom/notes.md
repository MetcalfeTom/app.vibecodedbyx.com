# chat-blossom (Chat Blossom)

## log
- 2026-07-04: shipped (chat ask: "small interactive flower that opens one petal per chat message, each petal a different pastel shade, with a gentle spring animation").
  - **One petal per Twitch message**: anon IRC (`wss://irc-ws.chat.twitch.tv`, justinfan + JOIN #sloppy_ai, PING/PONG, 4s reconnect) — every PRIVMSG opens the next petal; caption reads "a petal for <user>". Status pill: connecting/live/reconnecting. Tapping the flower also opens one ("a petal for you") for quiet moments.
  - **Flower**: SVG — stem + two leaves (7s sway, killed under reduced-motion), golden center, teardrop petals injected into a rotated group. **16 petals per bloom**, each a DIFFERENT pastel from a 16-shade palette (rose/sky/lilac/butter/mint/peach/…), angle = i/16·360°.
  - **Gentle spring**: WAAPI keyframes scale 0 → 1.12 → 0.96 → 1 over 900ms with an overshoot bezier — soft, not bouncy-cartoonish. Reduced-motion: petals appear instantly.
  - **Full bloom** (16/16): 5-note pentatonic shimmer, "full bloom · thank you, chat 🌸", 4s linger, then petals drift off one-by-one (randomized fall+spin+fade), new bud resets. Bloom count persists (localStorage).
  - **Audio**: per-petal sine chime walking a pentatonic scale w/ octave shimmer — SILENT until first tap (autoplay policy; honest unlock).
  - Aesthetic: morning-sky→meadow gradient, Cormorant italic + Sometype Mono, frosted HUD.
  - WCAG: role=img labelled SVG, role=status aria-live caption, reduced-motion paths.
  - Verified: JS syntax OK, ids present.

## issues
- Petal chimes only after the user has tapped once (browser autoplay policy) — petals still open silently before that.
- If chat is VERY fast, petals queue visually fine (each message = one petal) but a bloom lasts ~4s + drift; messages during reset are dropped (resetting flag), not banked. Could bank them if chat complains.

## todos
- Bank messages during reset so no petal is lost.
- Petal tooltip with the chatter's name on hover.
- Special golden petal for first-time chatters.
- Different flower species every N blooms.
