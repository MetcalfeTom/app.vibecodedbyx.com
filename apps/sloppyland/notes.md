# Sloppyland

## log
- 2026-04-18: Added local-only bot opponents for solo play. New `bots` Map (client-only, never written to DB). "🤖 Add Bot" button appears in the drawArea when the current user is the only human in the lobby; auto-hides when another human joins. Up to 3 bots, each auto-draws a card every 5.2s using the same resolveCard logic. Bots render on the SVG + player list (with "bot" badge) but never hit the DB (avoids RLS issues with synthetic user_ids). checkWinner/allPlayers now include bots so a bot can win. Reset also resets bots + restarts timer. Stops timer on game over.
- 2026-04-18: Created. Multiplayer chat board game — sugar/cake/candy themed. Single persistent game (GAME_ID=1). 56 tiles on a winding SVG path across 7 rows × 8 cols, cycling 5 colors. Specials at fixed indices: shortcuts (🍫), sticky toffee (🍯 skip next), castle (🎂 finish). Cards: 60% single-color advance, 22% double-color, 12% sticky, 6% sugar-rush (+5). Anyone can draw anytime (no turn order — async chat game). Realtime via supabase.channel. 16 piece emojis + 12 colors. Fredoka + Chewy + Space Mono typography, pink/grape/mint sugar palette. Confetti canvas on win.

## issues
- Anyone can draw at any time by design (chat-driven) — no enforced turn order. If chaos emerges, may need per-player cooldown.
- Reset button only resets own player row (RLS). Bots are client-only so they reset cleanly with the user's reset.
- Bots are local-only — other humans in the game don't see them. This is intentional (solo-play aid).
- `resetBtn` logs a "NEW ROUND" move so others see it, but they must reset themselves individually.
- Drag racing to FINISH: a lucky early sugar-rush can finish in ~4 draws. Consider padding more tiles if it feels too short.

## todos
- Maybe add chat-based draw trigger: listen to Twitch chat commands like `!draw <user>` so users can draw for themselves via chat rather than clicking.
- Per-player cooldown (e.g., 2s between draws) to prevent spamming.
- Bot difficulty levels (timid/aggressive — already uses same card probabilities; differing could add personality).
- Round history / ELO across rounds.
- Sound effects (draw whoosh, shortcut zoom, stuck splat, win fanfare).

## design
- Palette: bg #ffeaf2, hot #e3298a, pink #ff6fae, grape #8a4bff, mint #3ed6b0, lemon #ffd94a, vanilla #fff3d9, cocoa #6b3d2e, sticky #3c1f14
- Fonts: Fredoka (body), Chewy (display), Space Mono (labels)
- Board: 6 zones labeled on SVG (Gumdrop Hills → Frosting River → Sprinkle Plains → Licorice Swamp → Ganache Volcano → 👑 King Cake Castle)
- Bot UI: only visible when solo; hides automatically when another human joins realtime
