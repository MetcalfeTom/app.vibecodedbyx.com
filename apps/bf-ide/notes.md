# Brainfuck IDE

Web-based brainfuck interpreter with live memory tape visualization and pixel grid renderer.

## log
- 2026-03-20: Initial build. Full IDE with code editor, stdin input, run/step/pause/reset controls, speed slider (1 to 100K ops/frame). Live memory tape showing cells around pointer with auto-scroll. ASCII output panel. Pre-computed bracket map for O(1) jumps. 8 preset programs: Hello World, Fibonacci, Sierpinski Triangle, Squares, 99 Bottles, ROT13, Cat, Collatz Sequence, Snake Pattern. Pixel grid mode renders memory cells 1-475 as 25x19 colored pixels (9 color palette). Ctrl+Enter to run/pause. Fira Code + IBM Plex Sans typography, dark IDE aesthetic.

## issues
- None yet

## todos
- Breakpoints
- Program counter highlight in editor
- Export/share programs via URL hash
- More grid presets

## notes
- No database — pure frontend
- BF interpreter strips non-BF chars before execution
- Bracket map pre-computed at init for O(1) [ ] jumps
- 30000-cell memory, auto-expands if > goes beyond
- Speed tiers: 1, 10, 100, 1K, 10K, 100K ops per animation frame
- Grid mode: cell[0] unused, cells 1-475 map to 25x19 pixel grid, value=color index
- Grid colors: 0=bg, 1=black, 2=gray, 3=white, 4=red, 5=green, 6=blue, 7=orange, 8=purple
