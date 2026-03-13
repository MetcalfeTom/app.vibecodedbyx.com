# Fire Pong

Neon pong where the ball leaves a blazing fire trail.

## log
- 2026-03-13: Initial build. Canvas pong with fire trail system. Ball trail uses radial gradients (outer orange glow + inner core). Ball heats up with each paddle hit — trail grows longer/brighter, speed increases (capped at 12), fire particles intensify. Heat labels: HEATING -> BLAZING -> INFERNO -> SUPERNOVA. Neon paddles (P1 cyan, P2 red) with glow. Spark/ember particles on paddle hits and wall bounces. Goal explosions (40 particles). Screen shake on hits (scales with heat). CPU AI (85% speed, tracks ball). First to 7 wins. Mobile controls. Press Start 2P + Silkscreen typography, dark with fire palette.

## issues
- None yet

## todos
- Power-ups (paddle grow, slow ball, multi-ball)
- Ball spin based on paddle movement
- Sound effects (hit, score, ambient crackle)
- Online multiplayer via Supabase realtime

## notes
- No database — pure frontend
- Ball speed: base 4, +0.3 per hit, max 12
- Trail: up to 80 points, life 25 + hitCount*2 frames each
- Paddle angle: ±0.8 radians based on hit position
- AI tracks ball.y when ball moves toward it, centers otherwise
- Fire intensity scales with hitCount/8 (capped at 1.0)
- Goal at first to 7 points
