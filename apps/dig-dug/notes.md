# Neon Dig

80s style Dig Dug clone with pixel art and underground tunnels.

## log
- 2026-03-20: Initial build. 18x16 tile grid, 2-row sky, dig tunnels through layered dirt. Player digs by moving, space bar pumps enemies. Two enemy types: Pooka (round, goggles) and Fygar (green dragon, wings). Enemies pathfind through tunnels, occasionally go ghost mode through dirt. Pump inflates enemies until they pop. Rocks fall when dirt below is dug, crush enemies for bonus points. Depth-based scoring. Lives system, level progression with more enemies. Mobile d-pad + pump button. Press Start 2P typography. Pixelated rendering with depth-colored dirt layers.

## issues
- None yet

## todos
- Fygar fire breath attack
- High score board
- Bonus items (vegetables)
- Sound effects
- Enemy speed increase per level

## notes
- No database — pure frontend
- 16px tile grid, pixel-art rendering
- 5 dirt color layers by depth
- Enemies: Pooka (round red) and Fygar (green dragon)
- Ghost mode lets enemies pass through dirt temporarily
- Rocks fall when ground below is cleared, destroy on landing after falling
- Pump: space bar shoots beam up to 4 tiles, inflate enemies 0→1, pop at 1
- Scoring: depth * 100 per pump kill, 500 per rock crush
