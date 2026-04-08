# Ant Farm

## log
- 2026-04-08: Beauty pass. Rewrote rendering with: twilight sky gradient above the surface (indigo→amber with horizon glow + twinkling stars baked into imgData), pre-baked sine-layered noise for warm earth texture, depth darkening on dirt/tunnels (fades from surface to bottom), wavy animated grass tufts on surface edges, pulsing bright-yellow food grains (not green), golden pulsing nest with radial glow halo overlay, animated shimmer on water tiles. Pheromones recolored: home = cyan, food = amber (replacing blue/green wash). Ants redrawn as proper 3-segment insects (abdomen+thorax+head) with antennae, 6 wiggling legs, drop shadows, and a glowing grain sprite when carrying food. New header with 'ANT FARM / pheromone colony sim' Silkscreen title and soft vignette overlay.
- 2026-03-29: V1 — Digital ant farm with digging physics and pheromone trails. Pixel grid world (4px cells) with dirt, sand, tunnels, surface, food, water, nest. 40 ants with state machine (explore/returnHome). Pheromone system: home trail (blue-ish) and food trail (green-ish) with decay. Ants dig through dirt randomly, follow food pheromones, carry food back to nest. Sand falls when tunnels are dug beneath it. Water flows down and sideways. 4 tools: dig, fill, food, water. Speed control (1x/2x/4x). Pheromone trail visibility toggle. Food spawns on surface periodically. Dirt has sine-wave color variation. Grass tint on surface tiles. Silkscreen + DM Mono typography, earthy brown aesthetic.

## features
- Pixel grid world with 7 cell types (empty, dirt, sand, food, tunnel, surface, water, nest)
- 40 ants with explore/return AI
- Pheromone trail system (home + food, with decay)
- Ants follow pheromone gradients to find food and return home
- Autonomous digging — ants carve tunnels through dirt
- Sand falling physics (falls into tunnels)
- Water flow physics (down + sideways)
- 4 tools: Dig, Fill, Food, Water (paint with mouse/touch)
- Carrying ants glow yellow, exploring ants are red-orange
- Direction indicators on each ant
- Pheromone visibility toggle
- Speed control: 1x, 2x, 4x
- Periodic food spawning on surface
- Grass-tinted surface tiles
- Ant respawning at nest when life expires
- Food counter and tunnel counter in HUD
- Reset button

## issues
- None currently

## todos
- Queen ant (larger, stays in nest)
- Multiple food types with different values
- Ant colonies with territory
- Day/night cycle affecting activity
- Predators (spiders)
- Sound effects for digging

## notes
- Cell size: 4px, grid scales to viewport
- Pheromone decay: home 0.997/frame, food 0.995/frame
- Ant speed capped at 1.2, damping 0.92
- Dig probability: 8% when facing dirt
- Sand physics runs every 3 frames for performance
- Pheromone decay runs every 5 frames
- Food spawns with 0.2% chance per frame on random surface tile
- ImageData rendered at grid resolution, then scaled up to canvas
- Ants rendered as 3px squares with 0.5px direction lines
