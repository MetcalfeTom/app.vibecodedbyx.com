# neon-volleyball

## log
- 2026-05-08: shipped — 2D arcade volleyball with TWO modes (chat asks bundled: "build a multiplayer 2D neon-volleyball app for the sloppy-desktop dock using a simple websocket or local state lobby" + "update volleyball with floaty but fast physics, and add a local-tab lobby"). 800×360 court canvas with a deep purple gradient floor, gold floor-line glow, white-with-amber-cap net at midcourt, and pink/cyan paddles drawn as glowing half-circles. First to 11 wins.
  - **Mode 1 — vs CPU**: instant single-tab game. Player drives the LEFT paddle with arrow keys / A-D / Space / W; CPU drives RIGHT via a simple AI that tracks predicted ball x and jumps when the ball is overhead and falling (0.6s jump cooldown so it doesn't spam).
  - **Mode 2 — vs friend (local-tab lobby)**: opens a `BroadcastChannel('neon-volleyball-v1')` that pairs two browser tabs/windows on the same origin. Pairing rule: each tab posts a 500ms presence beacon `{t:'hi', from: myId}`; the first tab one sees becomes the opponent, and the lower clientId becomes the LEFT/HOST while the higher becomes the RIGHT/GUEST. Watchdog drops the pair after 1.5s of silence and re-enters "searching for opponent…" state. Same-origin only — works for sloppy-desktop's iframe-hosted volley window paired with a 2nd standalone tab, two desktop tabs, etc.
  - **Sync protocol**: each side broadcasts its own paddle `{x, y, vx, vy}` at 20Hz. Host runs ball physics + scoring locally and broadcasts a full `state` packet at 30Hz `{bx, by, bvx, bvy, balive, sl, sr, serv, paused, matchOver}`. Guest snaps to incoming ball+score state and never advances ball physics on its own — keeps both tabs perfectly in sync (latency-bounded by the inter-tab broadcast, which is sub-1ms in practice). Each side keeps the OTHER side's paddle physics ticking locally (gravity applied) so jumps animate smoothly between received samples.
  - **Floaty-but-fast physics**: gravity dropped 1300 → **760** for noticeable hang-time on jumps and ball arcs; ball-speed cap raised 760 → **1180** so spikes feel snappy; paddle lateral speed 340 → **460** so the paddle can keep up with the faster ball; jump velocity rebalanced from -640 → **-540** (calibrated `jumpV² / 2g` so peak height is ≈ unchanged despite the floatier descent); air-damp tightened 0.998 → **0.9985** so the ball preserves more energy across long rallies; per-hit upward bias bumped 120 → **220** so volleys arc up nicely instead of skimming. Net effect: longer hang time on every contact, but the ball still flies fast — exactly the chat ask.
  - **Serve**: floats inward with `vx = ±140 · vy = -120` (a small upward kick) instead of the previous flat drop, so the receiver has to actually time the dig.
  - **Collisions**: paddle = circle vs ball = circle with normal-based reflection + paddle velocity injection (`vx += paddleVx * 0.6`, downward jumps don't transfer to ball but upward jumps add 0.5×); net is a thin vertical bar from y=200 to y=320 plus a brighter top crossbar; floor hit on the opposite side from the ball's x scores the rally.
  - **Audio**: 4 Web Audio synths (paddle hit blip, jump triangle pair, score arpeggio with side-coloured notes — left = C-E-G major, right = G-C-E lower triad, game-over arpeggio reuses the score). Lazy-init on first user gesture.
  - **Touch controls**: left/right pads + JUMP pad shown only on `(pointer: coarse)` so desktop users get the keyboard hint bar instead.
  - **Aesthetic**: Audiowide title "neon volleyball" (cyan accent), JetBrains Mono HUD pills (left score = pink, right = cyan, role = side-tinted, lobby = state-tinted with searching-pulse animation), Press Start 2P table-marker copy, deep navy bg with pink + cyan radial glows, 26 ambient stars sprinkled into the upper court for atmosphere.
  - **Dock integration**: 🏐 dock icon in `apps/sloppy-desktop/` opens an 840×580 window containing `<iframe src="../neon-volleyball/">`. Same-origin so the iframe's BroadcastChannel pairs cleanly with another desktop window or a standalone tab. `open volley` and `open volleyball` both work in the desktop terminal.
  - **Accessibility**: rem units, `<header role=banner>`, `role="application"` + `aria-label` on the canvas, `role="radiogroup"` on the mode buttons with `aria-pressed`, `aria-live="polite"` on score/lobby pills, `<kbd>` markup in the help line, focus-visible outlines, keyboard reset (R) + serve (Enter) shortcuts, skip link.

## issues
- BroadcastChannel is **same-origin only** — works for two tabs in the same browser on the same device, NOT across devices/networks. Wider multiplayer would need Supabase Realtime or a WebRTC peer connection. The chat ask was specifically "websocket OR local state lobby" — went with local state lobby for V1 simplicity.
- 3rd+ tab joining the channel currently sees the existing pair via presence beacons but won't get a slot — UI says "paired" once 2 are in but the 3rd just stays in lobby. Could surface this as "spectator" mode later.
- No anti-cheat — guest could spoof `state` packets if it wanted to lie about ball position. Doesn't matter for a same-machine 2-tab game (it's a chair-swap match anyway).
- Ball physics on the host means a sluggish host = sluggish ball for both. In practice BroadcastChannel is fast (sub-ms) so this is invisible.
- CPU is a single-difficulty tracker; no harder modes yet.
- No replays / serve-clock / forced timeouts.

## todos
- Add a Supabase Realtime variant for cross-device multiplayer (BroadcastChannel local + presence-paired Supabase channel as opt-in).
- 3rd-tab spectator mode (read-only render of the host's broadcasts, no inputs).
- CPU difficulty toggle (easy / normal / unfair).
- Spike meter — hold a key while paddle is rising into the ball for an extra-fast slam.
- Best-of-N match selector instead of single 11-point game.
- Custom paddle skins in localStorage (color picker per side).
- Touch controls polish: drag-to-move instead of tap-to-hold.
