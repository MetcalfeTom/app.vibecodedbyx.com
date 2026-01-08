# Neon Life

## log
- 2026-01-03: Initial creation - neon Conway's Game of Life

## features
- Conway's Game of Life simulation
- Adjustable speed (1-60 FPS)
- 5 color schemes: Cyan, Magenta, Matrix, Rainbow, Fire
- Draw cells with mouse/touch
- Pre-made patterns: Glider, Blinker, Pulsar, Gosper Gun, Spaceship
- Toroidal grid (wraps around edges)
- Generation and population counters
- Play/pause, step, clear, random controls
- Keyboard shortcuts

## patterns
- Glider: Classic moving pattern
- Blinker: Simple oscillator
- Pulsar: Period-3 oscillator
- Gosper Gun: Creates infinite gliders
- Spaceship: Lightweight spaceship

## controls
- Click/drag: Draw or erase cells
- Play/Pause: Start/stop simulation
- Step: Advance one generation
- Clear: Reset grid
- Random: Fill with random cells
- Speed slider: Adjust FPS

## keyboard shortcuts
- Space: Play/Pause
- C: Clear
- R: Random
- Right Arrow: Step

## design
- Dark background
- Glowing neon cells
- Subtle grid lines
- Orbitron font
- Responsive layout

## technical
- Canvas-based rendering
- Toroidal boundary conditions
- Double-buffered grid updates
- RequestAnimationFrame loop
- Variable FPS control

## issues
- None yet

## todos
- Add zoom controls
- Add pan/scroll
- Add save/load patterns
- Add more preset patterns
- Add cell age coloring
