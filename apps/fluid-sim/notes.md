# NEON FLUID

## log
- 2026-01-10: Added draggable neon obstacles
  - Circular obstacles with pulsing glow
  - Click + OBSTACLE button to place new obstacles
  - Drag existing obstacles to reposition them
  - Particles bounce off obstacles realistically
  - 5 random neon colors for obstacles
  - Clear obstacles button
- 2026-01-10: Initial creation
  - Particle-based fluid simulation
  - Gravity slider (-1 to 1, includes reverse gravity)
  - Viscosity slider for damping
  - 6 color options including rainbow mode
  - Metaball-style glow rendering
  - Particle interaction (push apart)
  - Wall bouncing with friction
  - Touch support for mobile

## features
- Click and drag to splash glowing fluid
- Draggable circular neon obstacles
- Adjustable gravity (-100% to 100%)
- Adjustable viscosity
- 6 color modes: Cyan, Magenta, Purple, Green, Orange, Rainbow
- Up to 3000 particles
- Neon glow effects with additive blending
- Particle collision/separation
- Wall and obstacle bouncing physics
- Trail fade effect
- Clear fluid / Clear obstacles buttons

## physics
- Gravity applied each frame
- Viscosity as velocity damping
- Particle separation force when overlapping
- Bounce off walls with energy loss
- Bounce off circular obstacles with reflection
- Ground friction

## design
- Rajdhani font
- Cyan/magenta gradient title
- Dark background with glow trails
- Frosted glass control panel
- Color picker with active state
- Particle count display
- Pulsing obstacle glow effect
- Cursor changes for drag/place modes

## todos
- Add surface tension for more blobby effect
- Add wind/blow mode
- Add obstacle size control
- Add preset scenes
- Add fullscreen mode
