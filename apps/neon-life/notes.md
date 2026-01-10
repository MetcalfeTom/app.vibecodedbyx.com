# Neon Life - Conway's Game of Life

## log
- 2026-01-09: Initial creation
  - Neon glowing cells
  - Click/drag to draw cells
  - Play/Pause/Step controls
  - Speed slider
  - Multiple color themes
  - Rainbow mode
  - Classic patterns library
  - Generation and population stats

## features
- Conway's Game of Life rules
- Neon glow effects on cells
- Click to toggle cells
- Click and drag to draw
- Touch support for mobile
- Toroidal grid (wraps around edges)
- Speed control (1-60 fps)
- 5 color themes: Cyan, Magenta, Green, Orange, Rainbow
- Pre-built patterns: Glider, Blinker, Pulsar, Spaceship, Glider Gun
- Generation counter
- Live population count
- Subtle trail effect on cells

## controls
- Click: Toggle cell
- Click + Drag: Draw cells
- Play/Pause: Start/stop simulation
- Step: Advance one generation
- Random: Randomize grid
- Clear: Clear all cells
- Speed slider: Adjust simulation speed
- Color buttons: Change cell color
- Pattern buttons: Insert classic patterns

## patterns
- Glider: Moving 5-cell pattern
- Blinker: 3-cell oscillator
- Pulsar: Large period-3 oscillator
- Spaceship: Lightweight spaceship
- Glider Gun: Gosper's glider gun

## design
- Dark background (#0a0a0f)
- Neon glow via shadowBlur
- Orbitron font
- Grid overlay
- Trail effect for motion blur
- Responsive layout

## game rules (B3/S23)
- Birth: Dead cell with exactly 3 neighbors becomes alive
- Survival: Live cell with 2-3 neighbors stays alive
- Death: All other live cells die

## todos
- Add more patterns (LWSS, MWSS, HWSS)
- Add pattern rotation
- Add save/load functionality
- Add zoom controls
- Add grid size options
- Add step back feature
