# Fast Pong

## log
- 2026-04-02: Created Fast Pong — ultra-minimal, ultra-fast neon pong game
  - Single-file HTML, canvas-based, Space Mono font
  - Swept/continuous collision detection to prevent tunneling at high speeds
  - Ball starts at 8px/frame, accelerates 1.05x per hit, caps at 25px/frame
  - Mouse, touch, and keyboard (W/S, arrows) input — raw position, zero smoothing
  - AI paddle with prediction, beatable at high speeds
  - Ball trail (5 positions), collision flash, screen shake on score
  - Live speed and rally counter display
  - First to 11 wins
  - Dark black + cyan only — deliberately minimal vs neon-pong's flashy style

## features
- Delta-time compensated physics (consistent across frame rates)
- Sub-step collision detection (ray-cast style, prevents tunneling)
- Zero-latency paddle input (raw mouse/touch position, no lerp)
- Touch + mouse + keyboard support
- Brief control hints that auto-hide after 3 seconds
- Serve mechanic (space/tap between points)
- Win screen with restart button

## issues
- None known yet

## todos
- Could add a Supabase leaderboard for highest rally count
- Could add difficulty selection (easy/medium/insane starting speed)
- Sound effects (beep on hit) could enhance feel but would need AudioContext + user gesture
