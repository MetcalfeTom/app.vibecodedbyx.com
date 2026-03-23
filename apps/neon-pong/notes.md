# Neon Pong

Classic pong with neon glow effects. Play vs AI or local 2-player.

## log
- 2026-03-22: Initial build. 640x420 canvas, two paddles with glow (cyan P1, pink P2). Ball with trail effect, speed increases on each hit (caps at 10). AI opponent with 280px/s tracking. Mode toggle: vs AI / 2 Player. W/S for P1, Arrows for P2, touch drag on left/right halves. Brief pause after each score. First to 7 wins. Click to restart. Orbitron + Share Tech Mono typography, dark neon aesthetic.

- 2026-03-23: Added full-screen touch zones. Left/right halves of screen control P1/P2 paddles. Visual indicators: vertical guide line + "DRAG P1/P2" labels that appear on touch. Works anywhere on screen, not just canvas.

## issues
- None yet

## todos
- Ball spin from paddle edge hits
- Power-ups (big paddle, multi-ball)
- Online multiplayer via Supabase realtime
- Sound effects

## notes
- No database — pure frontend
- Paddle speed 360px/s, AI speed 280px/s
- Ball speed starts at 5, +0.3 per hit, max 10
- Bounce angle based on hit position on paddle (±1.1 rad)
- 20-point ball trail for motion blur effect
- Touch: left half controls P1, right half controls P2
- Canvas scales to fit viewport
