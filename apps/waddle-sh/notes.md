# waddle.sh

## log
- 2026-07-31 v1: chat asked (twice) for "Club Penguin in a terminal — green phosphor on black, ASCII penguins, igloos as folders/directories, blinking cursor". Delivered as a CRT tty world: 72×20 char grid rendered ~9fps into a <pre> (per-char HTML-escaped; peers wrapped per-char in dim spans, self bright). **Igloos are directories**: rooms /plaza (spawn, 3 igloos with door tiles + folder labels dojo/ pizza_parlor/ iceberg/), /dojo (ASCII sensei), /pizza_parlor, /iceberg. Walk into an igloo door OR `cd dojo` / `cd ..`; prompt is a real-looking `name@south-pole:/room$` with a blinking block cursor (CSS steps animation, input caret hidden). **Commands**: help, ls (igloos + who's here), cd, say, dance/wave/sit (animated emote frames), who, name (sanitized, persisted), pwd, clear — and bare text is chat, Club Penguin style, shown as a [bubble] above your penguin for 4.5s. **Multiplayer**: Supabase Realtime channel `waddle-sh-v1`, presence for position/room/face/emote (clamped + sanitized on receipt), broadcast for chat; no DB writes. Presence sends are throttled to 250ms with a **trailing-edge timer** — without it the final position/room/rename never lands (caught by test, fixed). **Aunt_Arctic_bot** wanders rooms, occasionally chats, replies to greetings — the pole never feels empty offline (status line shows ● online / ○ waddling solo). Mobile: coarse-pointer d-pad + dance button. VT323, scanlines, vignette, phosphor glow. 9/9 checks green (boot render, trailing send, cd/prompt, rename, emote, broadcast say, sanitized peer bubbles, dim peer render).

## issues
- Test gotcha: peer glyphs are per-char `<span class="dim">` wrapped, so string-matching names against raw innerHTML fails — strip tags first.
- Realtime channel is shared by everyone globally (one channel, room filtering client-side). If population explodes, shard channels per room.
- Chat sanitization strips <>& and control chars at BOTH send and receive; names [a-zA-Z0-9_-] only, 14 chars.
- Movement keys are ignored while the command input has focus and a printable key is typed; arrows always waddle. Clicking anywhere refocuses the input (real tty feel).

## todos
- Snowball throw command (broadcast arc animation).
- More rooms (night_club/ with ASCII disco floor) if chat wants.
- Penguin color themes (amber/cyan phosphor) via `theme` command.
