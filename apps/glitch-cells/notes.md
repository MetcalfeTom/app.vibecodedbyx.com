# Glitch Cells

Neon geometric agar.io clone — eat, grow, glitch. Consume smaller shapes in a digital petri dish.

## log
- 2026-03-13: Initial build. Canvas agar.io with neon geometric shapes. 6 shape types (triangle, square, pentagon, hexagon, diamond, star) with wireframe rendering and glow. 8 neon color palette. Glitch effects on eating: RGB split, scanline overlays, block artifacts, screen-wide glitch pulses. 4000x4000 world with grid. Camera follows player with zoom-out as mass grows. 300 food pellets (auto-respawn), 12 named AI bots (VIRUS, N0DE, PROXY, etc.) with chase/flee behavior. Bots eat food and each other. Cell-vs-cell eating (must be 15% bigger). Leaderboard top 6. Mass decay above 25. Touch support. Orbitron + Share Tech Mono typography, deep dark with multi-hue neon.

## issues
- None yet

## todos
- Split mechanic (press space to split cell)
- Virus obstacles that pop large cells
- Online multiplayer via Supabase presence
- Skins/shape selection

## notes
- No database — pure frontend with AI bots
- World: 4000x4000, grid 100px
- Mass to radius: sqrt(mass) * 3
- Player speed: max(1.5, 5 - mass*0.01)
- Bot AI: chase food/smaller cells within 400/300px, flee from bigger within 250px
- Eating threshold: 15% bigger mass, absorb 80% of victim's mass
- Food gives 50% of its mass
- Camera zoom: max(0.3, 1 - mass*0.002)
- Mass decay: 0.5% every 120 frames above mass 25
- Bots respawn at 0.5% chance per frame when dead
