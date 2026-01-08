# Neon Fluid

## log
- 2026-01-03: Initial creation - neon particle fluid simulation

## features
- 800 max particles with physics
- 4 interaction modes: swirl, attract, repel, orbit
- 6 color palettes: cyber, sunset, matrix, pink, ocean, fire
- Particles spawn on mouse movement
- Connected particles draw lines
- Fading trail effect
- Click to burst spawn particles
- Touch support for mobile
- Custom cursor

## design
- Pure black background with fading trails
- Glowing particles with bright cores
- Thin connection lines between nearby particles
- Minimalist UI controls
- Smooth cursor following

## modes
- Swirl: Particles spiral around cursor
- Attract: Particles pulled toward cursor
- Repel: Particles pushed away from cursor
- Orbit: Particles orbit the cursor

## palettes
- Cyber: cyan, magenta, green, yellow
- Sunset: red, orange, blue, pink
- Matrix: green shades
- Pink: magenta shades
- Ocean: blue/cyan shades
- Fire: yellow, orange, red

## technical
- Canvas 2D rendering
- Velocity-based physics
- Friction and decay
- Screen wrapping
- Proximity-based connections
- RequestAnimationFrame loop

## issues
- None yet

## todos
- Add audio reactivity option
- Add more physics modes
- Add particle size controls
- Add screenshot/record feature
