# Scaredy Shapes

Puzzle pieces flee from your cursor — herd them into corners to catch them all.

## log
- 2026-04-10: Initial build. 6 shape types (circle/square/triangle/diamond/pentagon/star) with expressive eyes that track cursor, scared mouths, sweat drops. Flee physics with per-shape personality (speed/nervousness/zigzag). Corner catch mechanic with progress ring timer. 15 levels with escalating shape count and speed. Trails, catch particles, confetti. WebAudio catch/level-up SFX. Gaegu + Inconsolata typography, warm paper aesthetic with subtle grid.

## features
- 6 shape types with unique geometry
- Expressive faces — pupils track cursor, mouth opens when scared, sweat drops
- Per-shape personality (speed, nervousness, zigzag pattern)
- Corner catch mechanic with 0.6s progress ring
- 15 levels (3+1.5*level shapes, increasing speed)
- Velocity trails
- Catch + level-up particle effects
- Touch support
- Fear radius visualization

## issues
- No score persistence
- Shapes can cluster and block each other from corners

## todos
- Supabase time-based leaderboard
- Power-ups (freeze, shrink fear radius, wall traps)
- Shape-to-shape collision avoidance
- OG preview PNG
