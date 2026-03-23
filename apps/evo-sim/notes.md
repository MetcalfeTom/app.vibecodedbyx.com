# Evo Sim

Watch creatures evolve through natural selection. Tune mutation, food, and predators.

## log
- 2026-03-23: Initial build. Canvas ecosystem sim with 4-gene creatures (Speed, Size, Sense, Efficiency). Creatures seek food within sense range, flee predators, eat to gain energy, reproduce with mutation when energy>120 and eaten>=2. Energy cost scales with speed+size, reduced by efficiency. Predators (red triangles) chase nearest creature, bigger creatures harder to kill (size*0.4 survival chance). Gene visualization: color=speed (blue→red), radius=size, faint ring=sense range, energy bar above. Controls: play/pause, 1x/2x/4x speed, mutation rate (1-20%), food density (10-80), predator count (0-8). Fittest creature stats panel. Population capped at 200, extinction recovery spawns 10 new creatures. Wrapping toroidal world. IBM Plex Mono + Newsreader typography, dark bio-lab aesthetic.

## issues
- None yet

## todos
- Click to inspect individual creature stats
- Lineage tree visualization
- Environmental hazards (zones)
- Graph of gene averages over time

## notes
- No database — pure frontend
- 4 genes: speed (0.1-1), size (0.1-1), sense (0.1-1), efficiency (0.1-1)
- Energy cost: 0.08 + spd*0.12 + size*0.06 - eff*0.06 per tick
- Reproduction: energy>120, eaten>=2, energy halved, child mutated
- Mutation: gene ± random*rate*2, clamped to 0.1-1
- Predators: speed 2.2, chase within 150px, kill check vs size
- Old age decay starts at 3000 + eff*2000 ticks
- Population cap 200, culls lowest energy
- Extinction: auto-respawn 10 new random creatures
