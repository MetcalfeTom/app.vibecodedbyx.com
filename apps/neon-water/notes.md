# NEON WATER

## log
- 2026-01-10: Initial creation
  - Spring-based water column physics
  - Click and drag to splash
  - Droplet particles
  - Caustic light patterns
  - Multiple water colors
  - Adjustable physics parameters

## features
- Realistic spring-based water simulation
- Click to create splashes
- Drag to make waves
- Water droplet particles with gravity
- Droplets splash back into water
- Surface glow with neon effect
- Wave highlights on rising edges
- Caustic underwater light patterns
- Ripple ellipses on active areas
- Adjustable tension, dampening, spread
- Adjustable splash force
- 5 neon color themes
- Preset effects: Ripple, Wave, Storm, Calm

## physics
- Column-based height field
- Spring tension pulls toward rest
- Dampening reduces velocity over time
- Wave spread propagates to neighbors
- Multiple passes for smooth spreading
- Droplets have gravity and splash back

## parameters
- Tension: Spring force (0.01-0.1)
- Dampening: Energy loss (0.9-0.999)
- Spread: Wave propagation (0.1-0.5)
- Splash Force: Impact strength (50-500)

## effects
- Ripple: Single center splash
- Wave: Sine wave across surface
- Storm: 20 random splashes
- Calm: Reset to flat water

## design
- Dark background
- Neon glowing surface line
- Gradient water body (surface to deep)
- White wave highlights
- Caustic light rays underwater
- Floating droplet particles
- Ripple ellipses on disturbance

## controls
- Click: Splash at position
- Drag: Continuous splashing
- Sliders: Adjust physics
- Buttons: Trigger effects
- Color buttons: Change water color

## colors
- Cyan (default)
- Magenta
- Green
- Orange
- Purple

## todos
- Add floating objects
- Add rain mode
- Add sound effects
- Add reflection of sky elements
- Add fish swimming
- Add boat that floats on waves
