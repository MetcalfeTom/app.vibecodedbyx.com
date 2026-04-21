# Neon Pong

Classic pong with neon glow effects. Play vs AI or local 2-player.

## log
- 2026-03-22: Initial build. 640x420 canvas, two paddles with glow (cyan P1, pink P2). Ball with trail effect, speed increases on each hit (caps at 10). AI opponent with 280px/s tracking. Mode toggle: vs AI / 2 Player. W/S for P1, Arrows for P2, touch drag on left/right halves. Brief pause after each score. First to 7 wins. Click to restart. Orbitron + Share Tech Mono typography, dark neon aesthetic.

- 2026-03-23: Added full-screen touch zones. Left/right halves of screen control P1/P2 paddles. Visual indicators: vertical guide line + "DRAG P1/P2" labels that appear on touch. Works anywhere on screen, not just canvas.

- 2026-03-23: Added Supabase leaderboard. neon_pong_scores table (username, score, mode). Submits P1 score when winning vs AI. Top 10 shown on win screen. Name cached in localStorage.
- 2026-04-20: Added particle effects. Paddle hits spray 14–22 colored particles in a ±π/2 arc biased toward the outgoing ball direction (cyan for P1, magenta for P2) plus 5 white ember sparkles, scaled by paddle-edge hit factor. Wall bounces fire a smaller 0.4-intensity blue burst. Score events spawn a 2.2-intensity winner-color burst at the goal edge. Particles use gentle gravity (+0.05 vy/frame) and 0.98 air drag, shrink with life, draw with shadowBlur glow. Added screen shake (shake amount accumulates on bursts, up to 10px, decays at 30px/s) and per-event flash overlay (paddle hit = 0.6 intensity, score = 1.0, 25% max opacity). Both rendered inside shake transform except flash which is drawn after restore.

## issues
- None yet

## todos
- Ball spin from paddle edge hits
- Power-ups (big paddle, multi-ball)
- Sound effects

## notes
- Supabase table: neon_pong_scores (username, score, mode, user_id)
- Paddle speed 360px/s, AI speed 280px/s
- Ball speed starts at 5, +0.3 per hit, max 10
- Bounce angle based on hit position on paddle (±1.1 rad)
- 20-point ball trail for motion blur effect
- Touch: left half controls P1, right half controls P2
- Canvas scales to fit viewport
