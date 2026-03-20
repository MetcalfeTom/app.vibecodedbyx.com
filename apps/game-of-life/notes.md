# Game of Life

N-state cellular automata with clickable transition matrix editor.

## log
- 2026-03-20: Initial build. Full-screen grid with 8px cells, wrapping edges. Draw cells by clicking/dragging (toggle on/off). Play/Pause, Step, Clear controls. Speed slider (1-30 gen/sec). 6 pattern presets: Glider, Blinker, Pulsar, LWSS, R-pentomino, Random. Subtle glow pass. Generation and population counters. Typed arrays for performance. Responsive resize preserves cells. iOS safe area support. Space Grotesk + JetBrains Mono typography, green-on-dark terminal aesthetic.

- 2026-03-20: Added custom rules + multi-state cells with birth/survive inputs and 8 rule presets.

- 2026-03-20: Refactored to N-state transition matrix engine. Replaced birth/survive rules with full transition matrix: transMatrix[currentState][neighborCount] = nextState. 2-8 states supported. Clickable matrix UI — each cell is a colored square, click to cycle next state. 7 presets: Conway, HighLife, Seeds, Brian's Brain (3-state), Star Wars (4-state), Banquet (5-state), Caterpillar (6-state). States count adjustable, matrix resizes preserving values. Grid values clamped on state reduction.

- 2026-03-20: Fixed neighbor counting bug. countNeighbors was counting ALL non-zero states as alive, breaking Brian's Brain (refractory cells wrongly counted) and Star Wars (dying cells wrongly counted). Added per-state aliveStates[] boolean array with "N" checkbox in color editor. Presets now specify which states count. Also persisted aliveStates to localStorage.

## issues
- None yet

## todos
- Zoom in/out
- Pan around
- Save/load patterns
- Share pattern as URL

## notes
- No database — pure frontend
- Uint8Array grids, double-buffered swap
- Wrapping toroidal grid
- 8px cell size, responsive column/row count
- Draw mode: first click toggles cell, drag continues with same value
- Outer totalistic with aliveStates filter: only states with aliveStates[s]=true count as neighbors
- "N" checkbox per state in color editor controls this
- transMatrix is array of arrays: transMatrix[state][0..8] = nextState
- Presets are functions that return {n: numStates, m: matrix, a: aliveStates}
- Up to 8 states, colors defined in ALL_COLORS array (9 entries: dead + 8 alive)
- Brian's Brain: firing→refractory→dead, dead+2 neighbors→firing
- Star Wars: alive survives on 3-5, else decays through 2 dying states
