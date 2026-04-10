# Pixel Hunt

Digital petri dish where neon pixels hunt and eat each other to survive.

## log
- 2026-04-10: Initial build. Canvas-based ecosystem sim with 5 species: Predator (red), Grazer (green), Drifter (blue), Scavenger (yellow), Apex (purple). Food chain mechanics, energy/metabolism, reproduction with mutation, fleeing behavior, corpse scavenging, extinction rescue. Glow/trail effects per creature, hover tooltips with stats. Controls: pause, speed (1x/2x/4x), reset, spawn food, mutate. Petri dish border, subtle grid. Silkscreen + IBM Plex Mono typography, dark bioluminescent aesthetic.

## features
- 5 species with distinct food chain roles
- Energy-based metabolism (eating, moving, dying)
- Reproduction with speed/range mutations
- Flee behavior (prey runs from predators)
- Corpse system (scavengers eat dead creatures)
- Creature trails and glow effects
- Hover tooltips showing individual stats
- Speed control (1x/2x/4x)
- Mutate button for random evolution events
- Extinction rescue (species respawn if wiped out)
- Wrapping world (toroidal grid)

## issues
- Performance may dip with 500+ creatures
- No zoom/pan controls
- Species balance may need tuning

## todos
- Add click-to-spawn specific species
- Population graph over time
- Sound effects for kills/births
- OG preview PNG
