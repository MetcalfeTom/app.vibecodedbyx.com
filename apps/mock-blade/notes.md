# Mock Blade

## log
- 2026-04-03: Initial build — pixel art dungeon crawler with a talking sword that mocks every action. Procedural dungeon gen (BSP rooms + corridors), 5 enemy types scaling with floor depth, items (gold + potions), stairs to descend. 100+ sword quips across 8 categories. Press Start 2P + Silkscreen fonts, dark dungeon palette, CRT scanline overlay. WASD/arrows + swipe + mobile buttons.

## features
- Procedural dungeon: 6 rooms connected by corridors, regenerated each floor
- 5 enemy types: rat, bat, slime, skeleton, demon — scale with floor depth
- Turn-based movement and combat with simple damage rolls
- Talking sword with 100+ unique quips in 8 categories (move, kill, hurt, gold, potion, wall, stairs, idle, death, start)
- Items: gold coins and healing potions
- Stairs to descend — each floor increases stats and difficulty
- Pixel art characters drawn procedurally on canvas
- HP bars on damaged enemies
- CRT scanline + vignette overlay
- Keyboard (WASD/arrows), swipe, and mobile button controls
- Game over screen with stats and restart

## issues
- No fog of war — entire dungeon visible
- AI pathfinding is very basic (move one step toward player)
- No inventory system
- Enemies can sometimes cluster in doorways

## todos
- Add fog of war / line of sight
- Add Supabase leaderboard (deepest floor reached)
- Add OG image
- More item types (armor, scrolls, better swords that get jealous)
- Sound effects (sword clangs, footsteps)
- Minimap for larger dungeons
