# Glow Terrarium

## log
- 2026-04-05: Initial build — digital terrarium with glowing floating plants, geometric orbs, fireflies. 5 plant types (fern, bulb, spiral, crystal, jellyfish), 8 geometric orbs with polygon wireframes. Click spawns spores + ripples, pushes orbs, pulses plants, 30% chance to grow a new plant. Trail-based rendering with alpha fade. Green/purple/cyan/pink palettes.

## features
- 5 procedural plant types: fern fronds, glowing bulb, spiral tendril, crystal cluster, jellyfish tendrils
- 12-18 floating plants with sine-wave bobbing, per-plant glow intensity
- 8 geometric orbs: triangle through heptagon, inner wireframe, center dot, slow rotation
- Click/tap interaction: spores burst, expanding ripples, orbs repelled, plants pulse
- Clicking can grow new plants at cursor (30% chance, up to 25 max)
- New plants start tiny and grow over time
- 40+ fireflies with blinking, drift, lifecycle
- 4 color palettes: greens, purples, cyans, pinks
- Trail rendering (alpha fade) for dreamy atmosphere
- Radial glow under each plant and orb
- Touch support

## issues
- Many radialGradient calls per frame — can lag on low-end devices
- No audio (ambient sound would enhance mood)
- Plants can overlap heavily in center

## todos
- Add ambient generative audio (soft drones, nature sounds)
- Day/night cycle with color shifts
- More plant types (mushroom, coral, lotus)
- Plant growth over time (stems extend, new leaves)
- OG image
- Save/screenshot button
