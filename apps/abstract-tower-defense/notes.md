# Abstract Tower Defense

## log
- 2025-12-28: Initial creation
  - Minimalist tower defense with abstract shapes
  - 3 tower types: Basic (cyan), Rapid (green), Sniper (magenta)
  - Enemies are neon circles that follow a path
  - Towers are triangles that rotate and shoot
  - Wave system with increasing difficulty
  - Simple economy (credits for kills, bonus per wave)
  - Neon glow aesthetic on dark background
  - Orbitron font for sci-fi feel
  - Particle effects on hit/death

## issues
- None so far

## todos
- Could add tower upgrades
- Could add more enemy types (different speeds, health)
- Could add special abilities
- Sound effects would be nice

## notes
- Path is S-shaped, responsive to canvas size
- Towers cannot be placed on path or too close together
- Enemy health and count scales with wave number
- Credits: Kill reward scales with wave, 25 bonus per wave complete
- Tower costs: Basic 50, Rapid 100, Sniper 150
