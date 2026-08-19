# Mirror Maze — neon laser puzzles

## log
- 2026-08-19: v1.0 — built per chat. 6 hand-designed levels (5x5→7x7): emitter (>^v<), walls (#), rotatable mirrors (/\ toggle), targets (T, beam passes through and lights them). Pure tracer traceOn(grid) — '/'  right→up, '\' right→down, 500-step loop cap — shared by game AND probe. **Solvability is proven, not hoped**: the probe enumerates all 2^k mirror orientations per level and asserts ≥1 solution AND start-unsolved (result: 6/6 solvable, min flips 1,2,2,1,2,3 — nice ramp; L4 has an unintended 1-flip solution, accepted). Inputs: tap/click cell (geometry from stored _geom + getBoundingClientRect scale), arrows+Space cursor, R reset, N next; solved level locks mirrors. Progress + current level in localStorage. Neon canvas: glowing cyan beam (green when solved), magenta mirrors, amber emitter triangles, target rings that fill when lit, dashed cursor. ZERO external assets (grep-probed, data-URI favicon, system mono). Probe 12/12; screenshot reviewed.

## issues
- none yet. If adding levels: ALWAYS rerun the enumeration probe — a level that ships unsolvable is the one sin this game can't survive.

## todos
- beam splitters (both paths must land) + locked mirrors for a second six-pack, if chat wants more.
