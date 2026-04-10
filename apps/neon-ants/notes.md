# Neon Ants

Glowing ants. Pheromone trails. Click to cause chaos.

## log
- 2026-04-10: Initial build. Canvas-based ant colony simulation with pheromone trail visualization. 60 ants, dual pheromone grids (home=cyan, food=magenta), food foraging with carry-back behavior, nest at center. 4 click tools (Distract, Drop Food, Wall, Erase). Distract creates radius that diverts nearby ants for ~2 seconds. Ant rendering: 3-segment body with antennae, animated legs, per-ant hue variation, green glow when carrying. Pheromone grid at half resolution for performance, pixel-level ImageData rendering. Walls as circular obstacles. Chakra Petch + Fira Code typography, deep black/cyan neon aesthetic.

## features
- 60 ants with individual movement + pheromone following
- Dual pheromone system (home trail = cyan, food trail = magenta)
- Food foraging: ants find food, carry it back to nest
- 4 click tools: Distract, Drop Food, Wall, Erase
- Click-to-distract: ants in radius get diverted, flash chaotically
- Pheromone trail visualization (toggleable)
- Wall building and erasing
- Add ants button (+10)
- Animated ant bodies with leg movement
- Food clusters scattered randomly
- Nest with pulsing cyan glow
- FPS counter
- Mobile touch support
- Drag to paint walls/food/erase

## issues
- Performance may degrade with very high ant counts (200+)
- Pheromone rendering creates temporary canvas each frame (cached now)
- No food respawn — must manually drop more

## todos
- Auto food respawn option
- Ant queen that spawns new ants
- Multiple nests/colonies with different colors
- Supabase leaderboard (collected food count)
- OG preview PNG
