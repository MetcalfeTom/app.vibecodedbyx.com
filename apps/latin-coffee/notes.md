# Machina Coffea (Latin Coffee)

An ancient Roman coffee machine with mysterious Latin buttons and chaotic liquid physics.

## log
- 2026-03-15: Initial build. Canvas 2D coffee machine with 8 Latin-named drinks. Each button triggers a brewing sequence: grind shake, pressure build, liquid pour with splash particles, steam, and random chaos events (60% chance of 1st, 40% of 2nd). Chaos spawns splatter particles everywhere, sparks, drip stains, screen shake. Pressure gauge with animated needle and danger zone. Pour physics: gravity, splash sub-particles on cup contact, particle glow. Steam particles with sine drift. 12 idle Latin phrases cycle every 6s. 6 Latin warnings after brew. 8 chaos event messages. Web Audio: grind (band-pass noise), pour (filtered noise), hiss (high-pass noise), chaos (sawtooth sweep), ding (sine bell). Cinzel Decorative + Cinzel + IM Fell English SC typography, dark wood/bronze/gold Roman aesthetic.

## issues
- None yet

## todos
- Cup fill level visualization
- Drink history / collection
- Secret drink combinations (press two buttons)
- More elaborate chaos sequences
- Smoke/fog effect overlay

## notes
- No database — pure frontend
- 8 drinks: Aqua Nigra, Lacteum Dulce, Sanguis Rubrum, Viridis Morbus, Aurum Liquidum, Purpura Mysticum, Ignis Infernus, Caelum Glaciale
- Brew timeline: 0ms grind+shake, 800ms hiss+pressure, 1800ms pour, chaos at 1200/2500ms, 3500ms done
- Pour: 80 waves × 3 particles each, 20ms apart
- Steam: 40 particles starting at 1200ms into pour
- Chaos: 30 splatter + 15 sparks + 8 drip stains
- Pressure gauge: arc from 0.75π to 2.25π, needle follows val with 0.05 lerp + jitter when brewing
- Shake: intensity 3-14 based on event, decays by 0.016/frame
