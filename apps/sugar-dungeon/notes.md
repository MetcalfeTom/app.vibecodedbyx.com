# Sugar Dungeon

A candy roguelike with marshmallow bosses and peppermint fire. How deep can you go?

## log
- 2026-03-14: Initial build. Turn-based roguelike with candy theme. Procedural dungeon generation (random rooms + corridors, 24x20 grid). Player is a pink candy warrior with directional weapon indicator. 4 enemy types: gummy bears (pink, basic), jellybeans (cyan, moderate), licorice blocks (dark, tanky), caramel blobs (gold, strong). Marshmallow boss every 5 floors — big squishy ellipse with HP bar, high stats. Items: candy (score), lollipops (heal +8), peppermint fire traps (damage). Stairs descend to next floor. Level-up system: +5 maxHP, full heal, +ATK scaling. FOV system (visibility radius 8, fade with distance). Camera follows player. Wafer-pattern walls, checkerboard floors. Mobile d-pad + attack button. Sound effects for all actions. Bubblegum Sans + DotGothic16 typography, pink/purple candy palette.

## issues
- None yet

## todos
- Item drops from enemies (candy weapons, sugar shields)
- More enemy types (cotton candy, jawbreaker)
- Minimap
- Inventory system
- Score leaderboard via Supabase

## notes
- No database — pure frontend
- Map: 24x20 tiles, 28px per tile
- Turn-based: player moves/attacks, then all enemies act
- Input repeat rate: 130ms
- Enemy scaling: HP and ATK grow with floor number
- Boss floors: every 5th floor
- Level-up: XP thresholds scale by 1.6x
- FOV: linear falloff, max radius 8 tiles
- Enemy AI: move toward player, attack if adjacent
- Peppermint fire: 2 + floor/2 damage
