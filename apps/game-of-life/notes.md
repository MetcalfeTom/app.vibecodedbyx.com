# Game of Life

Conway's Game of Life with draw, pause, and pattern presets.

## log
- 2026-03-20: Initial build. Full-screen grid with 8px cells, wrapping edges. Draw cells by clicking/dragging (toggle on/off). Play/Pause, Step, Clear controls. Speed slider (1-30 gen/sec). 6 pattern presets: Glider, Blinker, Pulsar, LWSS, R-pentomino, Random. Cell color varies by neighbor count (green→cyan→blue, red for overcrowded). Subtle glow pass. Generation and population counters. Typed arrays for performance. Responsive resize preserves cells. iOS safe area support. Space Grotesk + JetBrains Mono typography, green-on-dark terminal aesthetic.

- 2026-03-20: Added custom rules + multi-state cells. 8 rule presets (Conway, HighLife, Seeds, Day&Night, Diamoeba, Replicator, 2x2, Morley) plus custom birth/survive input. 4 alive cell states with distinct colors (green, cyan, pink, orange). Born cells inherit dominant neighbor color. Color picker swatches to choose draw state. Rules panel toggled from toolbar.

## issues
- None yet

## todos
- Zoom in/out
- Pan around
- Save/load patterns
- More presets (Gosper gun, etc.)
- Share pattern as URL

## notes
- No database — pure frontend
- Uint8Array grids, double-buffered swap
- Wrapping toroidal grid
- 8px cell size, responsive column/row count
- Draw mode: first click toggles cell, drag continues with same value
- Color coding: 0-1 neighbors=green, 2=teal, 3=cyan, 4+=red (dying) [classic mode]
- Multi-state: 4 alive colors, born cells get dominantNeighborState()
- Rule presets stored as {b:'3',s:'23'} strings, parsed to arrays
