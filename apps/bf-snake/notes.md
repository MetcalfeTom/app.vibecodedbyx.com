# BF Snake

Snake game where food is brainfuck characters. Eat code, build a program, watch it execute on a live memory tape.

## log
- 2026-03-20: Initial build. Grid-based snake with BF-themed food (+,-,>,<,[,],.). Eating a character appends to program and re-runs BF interpreter from scratch on the collected program. Live memory tape at bottom shows 30 cells with pointer highlight, auto-scrolling. Program row shows collected chars with execution cursor. BF output displayed. Stepped interpreter (3 ops/tick) with 500-step safety limit per frame. Speed ramps from 0.12s to 0.06s. Wall and self collision = death ("SEGFAULT"). WASD/arrows/swipe/d-pad controls. Fira Code typography, green pointer / amber food aesthetic.

## issues
- None yet

## todos
- High score localStorage
- Special food types (rare BF programs that do something cool)
- Sound effects on eat
- Different food weights by character rarity

## notes
- No database — pure frontend
- BF interpreter re-runs entire program from scratch on each new char eaten
- findMatchingBracket handles nested [] with depth counting
- Memory wraps at 255 (unsigned byte)
- BF_CHARS array weighted toward +/- and > (more useful chars appear more)
- Grid size 20px, responsive cols/rows
- D-pad shows on touch devices via (pointer:coarse)
