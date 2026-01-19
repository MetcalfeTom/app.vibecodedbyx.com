# Evo Sandbox

## log
- 2026-01-19: Initial creation - evolutionary simulation with DNA inheritance

## features
- 50 initial creatures with random DNA
- Food particles spawn continuously
- Creatures hunt food using sense range
- DNA traits: speed, size, sense range, efficiency
- Reproduction when energy > 80% (with mutation)
- Creatures die when energy depletes
- Generation tracking
- Real-time average DNA stats display
- Population auto-recovers from near-extinction
- Food burst button for intervention
- Reset simulation button

## DNA system
- Speed: Movement velocity (costs more energy)
- Size: Body radius and max energy (costs more to move)
- Sense Range: Detection radius for food
- Efficiency: Lower metabolism rate
- Hue: Color inherited with slight variation
- 15% mutation rate per gene
- Genes clamped between 0.1 and 1.0

## design
- GitHub dark theme colors
- Space Mono + Syne fonts
- Gradient title with DNA colors
- Gene bars show population averages
- Faint sense radius visualization
- Direction indicators on creatures
- Glowing food particles

## balance
- Max 150 creatures
- Min 5 creatures (auto-spawn on near-extinction)
- Food spawn rate ~10% per frame
- Energy costs scale with speed and size
- Reproduction costs 50% energy

## todos
- Add predator creatures
- Add environmental hazards
- Add creature clicking for individual stats
- Add time controls (pause/speed)
- Add graph of DNA traits over time
- Add sexual reproduction (crossover)

## issues
- None yet
