# Physics Balls - Neon Ball Chaos

## Log
- 2025-12-24: Slowed simulation 70%, added ball shatter into 20 shards on click, added ripple effects on collisions
- 2025-12-24: Added black hole feature (hold mouse to attract balls), slowed simulation speed
- 2025-12-24: Initial creation - 100 neon balls with physics, ball-to-ball collision, gravity shifting on click

## Features
- 100 colorful neon balls with glow effects and trails
- Realistic physics with mass-based collision response
- Gravity shifts direction on click (down → right → up → left → repeat)
- Wall bouncing with energy loss
- Mobile and keyboard (spacebar) support
- Fade trail effect for motion blur aesthetic

## Issues
- None yet

## Todos
- Could add mouse attraction/repulsion
- Could add spawn more balls on double-click
- Could add sound effects

## Tech Notes
- Uses canvas 2D for rendering
- O(n²) collision detection - works fine for 100 balls
- Radial gradients for glow effect
- Touch events for mobile support
