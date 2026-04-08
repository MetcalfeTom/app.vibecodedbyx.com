# PolyWar

## log
- 2026-04-08: Initial build. Geometric ecosystem with three species — triangles (predators, red, hunt squares), squares (prey, yellow, graze and flee triangles), circles (cyan, evade everything and multiply slowly). Agent loop with wander/hunt/flee steering + soft velocity clamp + screen wrap. Energy system: each species loses energy per tick, reproduces above a threshold. Extinction rescue: if any species hits zero, sprinkles a few back in every N ticks so the sim never fully collapses. Click/tap spawns 3 of the selected species at the cursor. Seed/reset/pause controls. Major Mono Display + Space Mono typography, neon red/yellow/cyan on dark grid-overlay background with glow shadows.

## features
- 3 species with distinct behaviors (hunt, graze+flee, evade everything)
- Energy-based reproduction — populations oscillate like Lotka-Volterra
- Extinction rescue so the sim is always alive
- Click/tap to spawn selected species at cursor
- Reset, pause, species-select buttons
- Live HUD with counts per species + tick counter
- Screen wrap on all edges

## issues
- Large populations (~400+) may drop FPS on low-end mobile; O(n^2) nearest-neighbor search
- No quadtree/grid acceleration yet

## todos
- Spatial hash / grid for nearest-neighbor queries
- Mutation: small chance of variants with different speed/size
- Circles get an "escape burst" cooldown ability
- Trails / heatmap of death locations
- Scoreboard: longest-surviving individual, biggest extinction event
