# Neon Pac

## log
- 2026-03-28: V1 — Neon Pac-Man clone. 21x27 maze, 4 ghosts with classic AI personalities (Blinky=chase, Pinky=ambush, Inky=flanker, Clyde=shy). Power pellets, ghost eating with combo scoring. Neon glow rendering on pac, ghosts, pellets. Swipe controls + visible D-pad buttons for mobile. Arrow keys for desktop. Level progression with increasing ghost speed. Aggressive ghost behavior: short scatter phases, fast exit from house, higher base speed.

## features
- 21x27 classic maze layout with tunnels
- 4 ghosts with distinct AI: Blinky (direct chase), Pinky (ambush 4 tiles ahead), Inky (flanking using Blinky's position), Clyde (chase if far, scatter if close)
- Ghost modes: scatter (short 3s) vs chase (long 8s) — heavily chase-biased
- Power pellets: 4 corners, makes ghosts scared + eatable
- Ghost combo scoring: 200, 400, 800, 1600 for consecutive eats
- Neon glow on pac-man, ghosts, power pellets
- D-pad buttons shown on touch devices, swipe also works, arrow keys on desktop
- Level progression: ghosts get faster each level, power duration decreases
- 3 lives, score tracking

## issues
- None currently

## todos
- Fruit bonus spawns
- Sound effects (waka waka, ghost eat, death)
- High score leaderboard (Supabase)
- Ghost AI improvements (cornering behavior)
- Intermission screens between levels

## notes
- Maze is string-template based: 1=wall, 2=dot, 3=power pellet, 4=empty
- Ghost house at rows 12-14, door at row 11
- Tunnel wraps at left/right edges (rows 10-16 have 0s for open sides)
- Ghost speed: 0.07 + level*0.005, scared speed is 60% of normal
- Pac speed: 0.08 constant
- Power timer: 360 - level*20 frames (min 120)
