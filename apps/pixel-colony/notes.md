# Pixel Colony

Zero-player digital ant farm — 4 colorful colonies dig tunnels, harvest sugar, and fight over resources in a shared underground world.

## log
- 2026-04-11: Initial build. 4 colonies (Crimson, Azure, Emerald, Amber) with 25 ants each. Grid world with dirt, tunnels, surface, sugar, nests. Pheromone system (positive=food trail, negative=home trail) per colony with decay. Ant AI: explore (wander + follow food pheromones), returnHome (navigate to nest + follow home pheromones), fight (engage nearby enemy ants). Combat: random winner, loser drops sugar and loses life. Sugar harvesting: +1 colony sugar on deliver, bonus ant every 5 sugar. Ants dig tunnels through dirt (12% chance). Sugar spawns periodically on surface. Click anywhere to drop sugar. Battle spark effects. ImageData rendering with CELL=3px scaling. Silkscreen + DM Mono typography, earthy brown aesthetic.

## features
- 4 competing ant colonies with unique colors
- Pheromone trail system (food + home per colony)
- Ant AI: explore, harvest, return home, fight
- Colony combat with random winner
- Tunnel digging through dirt
- Sugar crystal spawning and collection
- Colony growth: bonus ants from harvested sugar
- Click/tap to drop sugar anywhere
- Speed control (1x/2x/4x)
- Pheromone trail visibility toggle
- Battle spark animations
- Per-colony stats (ant count + sugar collected)

## issues
- None known

## todos
- Queen ant per colony (larger, produces ants)
- Territory marking / claimed tunnels
- Different sugar values (rare gold sugar)
- Colony death when ant count reaches 0
- Predators (spiders that eat ants)
- Day/night cycle
- Sound effects
- OG preview PNG
