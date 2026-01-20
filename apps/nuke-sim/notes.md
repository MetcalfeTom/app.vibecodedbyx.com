# Nuke Simulator

## log
- 2026-01-20: Added automated missile launches with flight paths and detonations
- 2026-01-20: Initial creation - nuclear blast radius visualizer

## features
- World map with simplified continents
- Click to place detonation point
- Yield slider from 1kt to 100mt (logarithmic scale)
- Preset warheads:
  - Little Boy (15kt) - Hiroshima
  - Fat Man (21kt) - Nagasaki
  - B83 (1.2mt) - US largest active
  - Tsar Bomba (50mt) - Largest ever tested
  - W88 (475kt) - US submarine warhead
  - Topol-M (800kt) - Russian ICBM
- Airburst toggle for optimized blast
- Five blast radius zones:
  - Fireball
  - Heavy blast (20 psi)
  - Moderate blast (5 psi)
  - Thermal radiation (3rd degree burns)
  - Light blast (1 psi)
- Real-time statistics display
- Pulsing detonation animation
- **Auto Launch mode**:
  - Missiles launch from 11 global sites
  - Animated flight paths with trails
  - Ballistic arc trajectory
  - Target markers
  - Multiple simultaneous explosions
  - Random yields for each missile

## blast physics
- Radius scales with yield^(1/3) for pressure effects
- Radius scales with yield^0.4 for fireball/thermal
- Airburst multiplier: 1.4x effectiveness
- Exaggerated pixel scale for visibility

## design
- Military/command center aesthetic
- Orbitron + Share Tech Mono fonts
- Dark theme with red/orange accents
- Green terminal-style text
- Grid overlay on map

## todos
- Add city markers
- Add population density overlay
- Add fallout simulation
- Add multiple detonation support
- Add mushroom cloud animation

## issues
- None yet
