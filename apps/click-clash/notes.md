# Click Clash

1v1 multiplayer click-speed duel. Two players, ten seconds, highest CPS wins.

## log
- 2026-04-09: Fix — switched import from `/supabase-config-fixed.js` (which doesn't exist on the deployed host and was redirecting to the homepage HTML, killing the ES module load) to the root `/supabase-config.js` named export. Also added init promise dedupe + button disable until auth resolves, and channel subscribe error toasts. Root cause: silent ES module import failure → no event listeners attached → Create Room button did nothing.
- 2026-04-09: Initial build. No DB tables — pure Supabase Realtime channels (`clickclash:{code}`) with presence + broadcast. Lobby: create room (random 5-char code AZ-9 minus ambiguous chars) or join with code. Presence sync detects opponent join/leave, capped at 2 players. Both press READY (broadcast + presence track), host arbitrates start time (Date.now()+3200) and broadcasts `start` event with timestamp; both clients run shared countdown overlay anchored to that timestamp. Match: 10s timer, click events broadcast at ~20/sec throttle, opponent count shown live with CPS. Spacebar/Enter also count as clicks. End: `final` event syncs last value, then declareWinner() compares totals (VICTORY/DEFEAT/DRAW), gold winner highlight. Rematch by re-readying. Opponent leaves mid-match → abortMatch with toast. Bricolage… err, Big Shoulders Display + DM Mono typography, deep navy + hot pink + cyan + gold palette with diagonal hatch background.

## features
- Real 1v1 multiplayer via Supabase Realtime (no DB writes)
- Room codes for sharing (5 chars, ambiguous chars removed)
- Presence-based opponent detection + auto disconnect handling
- Host-arbitrated countdown so both clients sync within ms
- Throttled click broadcasts (~20/sec) with live CPS display
- Spacebar/Enter as alternate click input
- Rematch flow without leaving room
- Mobile pointer support
- Random anonymous handles (NeonFalcon, AtomicComet, etc.)

## issues
- Host-only start arbitration: if host disconnects before pressing ready, joiner can be stuck — they should leave + rejoin
- No leaderboard or match history persistence
- 3+ joiner case is rare but handled by self-eject; could be cleaner with a server-side guard
- No anti-cheat (held-key autorepeat is blocked by `keydown` not firing repeatedly for Space, but a scripted attacker could spoof)

## todos
- Supabase leaderboard for best CPS / longest streak
- Best-of-3 match mode
- Spectator mode (additional joiners watch instead of being ejected)
- Sound effects (click ticks, countdown beeps, victory horn)
- OG preview PNG
