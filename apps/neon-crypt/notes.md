# Neon Crypt

Descend into neon-lit crypts. Fight glowing skeletons. Die in 8-bit.

## log
- 2026-03-15: Initial build. Top-down 8-bit dungeon crawler with 16px tile grid, 15-tile viewport, pixel-scaled canvas (crisp-edges). Procedural dungeon generation: up to 12 non-overlapping rooms connected by corridors on a 32x32 grid. 7 enemy types: Skeleton, Bat, Slime, Ghost, Skeleton Mage, Skeleton Knight, Skeleton Lord — each with hand-drawn 8x8 pixel sprites, unique neon colors, and scaling stats. Player sprite is a cyan warrior. FOV system (radius 7, distance-based brightness). Tile rendering: checker floor with subtle neon grid, wall edge highlights. Combat: space to attack adjacent enemies, damage particles, hit flash (white frames), HP bars on damaged enemies. Attack slash visual effect. Items: health potions and gold chests. Stairs to descend (E key). Level-up system: +3 HP, +1 ATK, exponential XP curve (1.6x). Enemy AI: chase within 8 tiles, Manhattan distance pathfinding. Player invulnerability frames on hit (20 ticks). Screen shake on damage. Minimap showing explored tiles, player (cyan), enemies (colored), stairs (yellow). 8 Web Audio SFX: hit, kill, hurt, step, pickup, stairs, death. Title screen with blink animation. Death screen with floor/level/kills stats. Mobile d-pad touch controls. Press Start 2P typography, pure black + neon palette.

## issues
- None yet

## todos
- Boss enemies every 5 floors
- Equipment/weapon drops
- Multiple dungeon themes (cave, temple, void)
- Ranged enemies (skeleton archers)
- Save progress to localStorage

## notes
- No database — pure frontend
- Map: 32x32 Uint8Array, 0=wall 1=floor 2=corridor
- Room gen: 12 attempts, 4-8 wide x 4-7 tall, overlap rejection
- Corridors: L-shaped connection between consecutive room centers
- FOV: simple circle r=7, distance-based brightness multiplier (0.15-1.0)
- Sprites: 8x8 char arrays, 2px per sprite pixel = 16px tile, color map lookup
- Enemy scaling: HP * (1 + floor*0.15), ATK + floor/3
- Enemy pool unlocks: maxType = min(6, floor/2)
- Player: starts 10HP/2ATK, +3HP/+1ATK per level, XP curve *1.6
- Tick rate: 20 TPS via requestAnimationFrame with dt gate
- Move cooldown: 6 ticks (~300ms), attack cooldown: 12 ticks
- Particles: position + velocity + life, drawn as colored pixels
- Minimap: 2px per tile, top-right corner, fog-of-war (only explored tiles)
