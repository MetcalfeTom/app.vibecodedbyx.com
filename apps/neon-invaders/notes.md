# Neon Invaders

Blast waves of neon pixel invaders in this retro arcade shooter.

## log
- 2026-01-10: Original build — emoji-based invaders, rainbow gradient lasers, CSS screen shake, Orbitron font.
- 2026-03-15: Complete rebuild as retro pixel art version. 240x320 native resolution with crisp pixel scaling. 3 invader types with hand-drawn 8x8 sprites (crab/squid/octopus), 2 animation frames each. Player ship pixel sprite with engine glow. Classic formation march with edge-drop and speed ramp. Enemy aimed shots at wave 3+. 4 destructible shield barriers (3HP per block). 4 powerup types (rapid, shield, triple, bomb). Scrolling starfield. Hi-score localStorage. Title screen with animated demo. Mobile touch controls. Full Web Audio (shoot/hit/explosion/death/wave chime/powerup). Press Start 2P typography, pure black + neon palette.

## issues
- None yet

## todos
- UFO bonus (flies across top)
- Boss invaders every 5 waves
- Leaderboard via Supabase
- Screen-clear bomb animation

## notes
- No database — localStorage for hi-score key: neon-invaders-hi
- Native resolution: 240x320 with pixel scaling (up to 3x)
- Sprites: 8x8 string arrays, drawn as 2px filled squares
- 3 invader types: crab 10pts, squid 20pts, octopus 30pts (score * wave)
- Invader speed: max(0.3, 1.2-wave*0.06)s base, scales inversely with alive count
- Enemy shoot: 0.3+wave*0.05 chance per step, 10% aimed at wave 3+
- Shields: 4 barriers, 5x4 pixel blocks, 3HP each
- Powerup drop: 5% per kill (rapid/shield/triple/bomb)
- Rows: min(5, 3+wave/3), Cols: min(10, 7+wave/4)
- Player speed: 120px/s, bullet: 200px/s up, shoot cooldown: 0.25s
