# Cybernetic Garden

Generative art — glowing circuit flowers bloom from data streams.

## log
- 2026-03-20: Initial build. Click to plant circuit flowers (max 20, oldest removed). 6 color palettes. Flowers grow with animated stems (circuit traces) with traveling data dots, branching circuit paths with glowing nodes and capacitor leaves, diamond-shaped petals with glow, pulsing core, inner rings. Data streams (falling hex/digit characters). Ambient floating particles, mouse interaction particles with repulsion physics. Circuit board ground with grid lines and nodes. Motion trail via transparent fill. Megrim + Share Tech Mono typography, green-on-dark biotech aesthetic.

## issues
- None yet

## todos
- Flower-to-flower connections (circuit paths between nearby flowers)
- Click flower to trigger bloom burst
- Ambient sound (data hum)
- Seasonal color shifts over time

## notes
- No database — pure frontend
- Max 20 flowers, oldest removed on overflow
- Growth 0→1 over ~3s, bloom phase starts at 70% growth
- Branches generated procedurally with random segment count/direction
- Transparent fill (0.15 alpha) creates motion trail/afterimage effect
- Flowers sorted by baseY for depth overlap
