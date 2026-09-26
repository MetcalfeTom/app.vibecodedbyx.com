# Neon Life - Conway's Game of Life

## log
- 2026-09-26: 🖐 STAMP MODE — a pattern button no longer dumps the pattern in the centre: it picks it up as a glowing ghost (white cells + dashed box) that follows the mouse; click drops a copy (OR-ed in, wraps around the torus), keep clicking for more. Touch: finger aims, lifting drops. Bar under RANDOM SEED: ⟳ ROTATE (or R, 90° clockwise), ◎ CENTER (drop in the middle, keyboard-friendly), ✕ DONE (or Escape, or press the same pattern again). Pattern buttons get aria-pressed. Phones: patterns are a swipeable row under the seed button (they used to hide under the controls), stamp bar below it. `placePattern()` kept but unused.
- 2026-09-26: 🔗 SHARE — the live cells go into the URL as standard Life RLE (#r=<rule>&p=<rle>; lifeEncode/lifeDecode, node round-trip tested incl. the Gosper gun text from the wiki). Copies the link (clipboard, else a selectable link box in the toast) and puts it in the address bar. Opening a shared link loads the pattern centred, with its rule, PAUSED, toast 'press ▶ PLAY'; a broken link falls back to the random seed. Toast sits above the controls on desktop, under the seed button on phones; tap to dismiss. og.png replaces the pollinations og:image.
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
- (done: stamp + rotate) maybe mirror/flip too
- Add save/load functionality
- Add zoom controls
- Add grid size options
- Add step back feature
- 2026-09-26: phones — RANDOM SEED pill wrapped onto two lines and sat on the pattern row (fixed wrap at left:50% only gets half the viewport as shrink-to-fit width) → white-space:nowrap; pattern row gets a right-edge fade so it reads as scrollable.
