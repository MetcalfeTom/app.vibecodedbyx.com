# Neon Zen

## log
- 2025-12-29: Initial creation
  - Cyberpunk spa aesthetic
  - SVG robotic hand follows cursor with smooth easing
  - Hand tilts based on movement direction
  - Glowing steam particles from floor vents
  - Ambient floating particles
  - Click anywhere for massage effect
  - Expanding neon rings on massage
  - Particle burst on click
  - Soft chime sound effect
  - Relaxation meter that fills up
  - Grid background pattern
  - Custom cursor (hand replaces cursor)
  - Touch support for mobile

## issues
- None so far

## todos
- Could add ambient background music
- Could add different massage intensity modes
- Could add hand gesture animations
- Could add achievement system for relaxation

## notes
### Hand behavior:
- Follows mouse with 0.08 lerp factor (smooth lag)
- Tilts up to ±15 degrees based on velocity
- SVG with animated LED indicators
- Cyan and magenta color scheme

### Particles:
- Steam: rises from 5 floor vents, expands as it rises
- Ambient: slow floating particles throughout
- Massage: burst outward on click, fade quickly

### Audio:
- Sine wave chime (600-1000Hz to 300Hz)
- 0.4 second decay
- Triggered on each click
