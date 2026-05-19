# chat-uno-vibe · notes

## log
- 2026-05-19: v1.2 — **+20% UI scale for stream visibility** per chat asks "increase the overall scale of the chat-uno-vibe interface by twenty percent to improve visibility on stream" + "scale up the chat-uno-vibe UI by twenty percent for better stream visibility". One-line change in spirit but the right one: `html { font-size: 120% }`. Because the whole stylesheet is rem-based (cards, fonts, paddings, gaps, button heights, even radii), every measurement multiplies cleanly without any layout distortion. Used `%` not `px` so a viewer who's bumped their browser default for accessibility still gets a proportional 20% multiplier on top of their preference (e.g. 18px base → 21.6px).
  - **Breakpoint bumped 900 → 1080px** to match. At html=120% the side panel (22rem ≈ 422px) + table area need ~1080px to stay comfortable in two-column mode; narrower viewports now drop to the stacked mobile layout sooner so cards don't squish.
  - No other CSS or HTML changes — same overlay modes, same chat commands, same game logic — just visibly bigger on stream.
- 2026-05-19: v1.1 — **overlay modes for OBS** per chat ask "make the chat-uno-vibe background transparent and add a chroma-key green toggle for stream overlays". Three modes, persisted to localStorage, hot-cycled with `O`.
  - **normal** · the default purple-gradient + scanline look · for standalone play.
  - **transparent** · `body { background: transparent }` + scanline overlay hidden. Header + side panel + player cards get `rgba(31,14,58,0.55)` + `backdrop-filter: blur(6px)` so they stay readable when dropped over a webcam or gameplay capture in OBS BrowserSource (alpha channel preserved automatically).
  - **chroma green** · `body { background: #00ff00 }` for capture tools that don't support alpha (Streamlabs window capture, Zoom screen share, Discord). Panels go more opaque so cards stay crisp against the green; the centre table area keeps a faint radial dark vignette so the discard pile pops.
  - **Settings UI** · new segmented control in the settings modal with three buttons (`normal` / `transparent` / `chroma green`). Active state of the chroma button literally turns green; transparent shows a cyan diagonal-stripe pattern so chat can preview each mode at a glance. Saved with the rest of the settings.
  - **Keyboard** · `O` cycles modes mid-stream (skips when typing in an input). Each cycle logs a hint into the side panel reminding the streamer of the right OBS source type.
  - Applied on boot via `applyOverlay(settings.overlay)` so a saved overlay-mode page reloads straight into the streamer's chosen look.
- 2026-05-19: v1 — **chat-driven Uno table** per stacked chat asks "create a new app called chat-uno-vibe that lets viewers play via chat commands" + "make the Twitch channel name configurable in a settings menu". Single ~45KB file, zero deps.
  - **Twitch IRC** · anonymous WebSocket connection (`wss://irc-ws.chat.twitch.tv:443`, `PASS SCHMOOPIIE` + `NICK justinfan{rand}` + `JOIN #channel`). Auto-reconnects in 4s on close. Connection pill in the header shows offline / connecting / live (#channel) / error.
  - **Configurable channel via settings modal** · ⚙ button opens a native `<dialog>` with: channel input (with `#` prefix tag), min-bot players (0-6), lobby-seconds. Persisted to `localStorage['chat-uno-vibe-v1']`. Save & reconnect immediately. Channel input sanitised to lowercase a-z0-9_ only.
  - **Chat commands** parsed from PRIVMSG: `!join` (lobby only · adds chatter as a player), `!start` (begins game if ≥1 human joined), `!play <card>` (e.g. `!play r5`, `!play wild`, `!play +4 red`), `!draw`, `!color r/y/g/b` (after wild), `!uno`, `!hand` (echoes the player's hand into the log so chat can see what they hold). Card-key matcher tolerates `r5`, `5r`, `red 5`, `red5`, `wild red`, `+2y`, `skip`, `reverse`, `draw 2`, `+4`, etc.
  - **Game engine** · standard 108-card Uno deck (4 colours × {0, 2×1-9, 2×skip, 2×reverse, 2×+2} + 4 wild + 4 wild+4). Shuffled at game start. Real rules: first card re-drawn if wild; +2/+4 stack draw onto next player + skip them; skip skips next; reverse flips direction (acts as skip in 2-player); wilds let player pick the colour. Refills the deck by reshuffling the discard pile (minus top card) when draw runs out.
  - **Bot players** · settings `bots` slider auto-fills empty seats to keep games rolling. Bot brain: prefers matching-colour non-wild cards, plays wilds as last resort, picks the most-held colour after a wild. 1.1-2.5s think delay per move so play feels human.
  - **Public hands** · all hands face-up on the table (it's a spectator game, hiding hands defeats the point). Sorted by colour+value for readability. Card counts shown next to each player name; pulsing yellow when down to 1 ("UNO!").
  - **Visuals** · big discard pile card + face-down draw pile in the centre, current player highlighted with pink border + glow, direction chip (→ CW / ← CCW), active-colour chip. Cards are CSS-only — gradient backgrounds matching Uno colours, value glyphs (`⊘` for skip, `⟲` for reverse, `+2`, `W`, `+4`), face-down cards show "UNO" rotated.
  - **Aesthetic** · deep purple `#1a0a2e` bg with multi-color title (Bungee font with red/yellow/green/blue gradient text-clip), Fredoka for body, JetBrains Mono for chat/log. Scanline overlay for retro arcade feel.
  - **Game log** · right-side panel shows all actions (system events in italic dim, chat plays in pink, errors in red, wins in yellow). 120-entry cap, auto-scroll.
  - **Color picker** · bottom-center popup with 4 color buttons appears when a non-bot needs to pick after a wild (rare since chat picks via `!color r`, but acts as a fallback for solo testing with bots).
  - **Host controls** · `+ add bot` + `start game` buttons in the lobby cta strip. Reset (↺) clears the table back to lobby.
  - **OG image** via Pollinations flux (no `referrer` per project notes).

## issues
- v1 doesn't enforce the "called UNO before playing" penalty — `!uno` is just a vanity callout in the log.
- +2 / +4 stacking (one player drops +2, next player plays another +2 to chain) is not implemented; per the basic rules the affected player just draws and is skipped.
- Single-game mode only — no multi-round accumulating scoring yet.
- Chat-side hand visibility is intentional (it's a stream spectator game), but a "private hand" alternative could work if anyone asks.
- No lobby countdown timer wired yet; settings has a `lobbySec` field for a future auto-start feature.
- Bot brain is greedy/simple. No strategic +2 hoarding, no card counting.

## todos
- Auto-start lobby after `lobbySec` countdown with visible timer.
- Multi-round scoring (sum of opponents' card values on win, first to N points takes the match).
- Per-player avatars (deterministic colour from username hash).
- Multiplayer via Supabase Realtime so a host can run the table while viewers play from other devices (currently it's a single-tab simulation).
- Mod commands (`!kick`, `!skip` to skip stalled players).
- "Stacking" toggle in settings for +2/+4 chain mode.
- Sound effects on play / draw / win / uno.
- Chat-feed mirror so non-command messages also show up in the log (currently filtered to commands only).
