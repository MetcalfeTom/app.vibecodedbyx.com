# dijkstra-wave · notes

## log
- 2026-07-11: v1 (chat ask + szymcioooo: Dijkstra grid viz, clickable walls/maze editor, random maze generator, animated green wave, green path pulse — single HTML page). **Real Dijkstra** (binary heap), not BFS-in-disguise: mud brush (cost ×5) makes weights matter — wave visibly bends around mud, tests prove cheaper detours win. Grid sized to viewport (min 15×11, cell 16–30px), Uint8Array {0 empty,1 wall,2 mud}. **Wave anim**: dijkstra() precomputes pop `order[]`; reveal advances `speed²·0.5+1` cells/frame; cell lightness maps dist/maxD (deeper = brighter), last-14 cells get recency alpha ramp + last-8 a bright frontier stroke → reads as a flooding green wavefront. Then amber path strokes cell-by-cell (glow shadow). **Green pulse** (szymcioooo): after path completes, a glowing mint orb + 5-dot fading tail rides start→goal at 8 cells/s on loop (`performance.now`-driven, killed by reduced-motion). **Editor**: paint wall/mud/erase with drag (first-cell toggle decides stroke = add or erase), drag ⬤ start / ⚑ goal (blocked cells refused); **live re-flood** — after first run, any edit re-runs instantly (no anim) so it feels reactive. **Maze**: recursive division (depth ≤6, gap per wall) + 3×3 carve around start/goal; "no path" toast + aria alert if drowned. Keys: space run, C clear, G maze, W/M/E tools. **Node-verified (9 checks)**: syntax, ids, manhattan cost on open grid, forced wall detour cost, mud-avoidance (6 vs 16), unreachable → ∞, pop-order monotonic in dist (Dijkstra invariant), 100/100 generated mazes solvable, path 4-connected; draw() exercised with wave+path+pulse branches under stubs. Handjet + Space Mono, phosphor green/amber/pink on near-black. Hook `__dw {size,set,setStart,setGoal,clearGrid,run,maze,anim,draw,reveal}`.

## issues
- Resize rebuilds the grid (keeps overlapping wall region) — heavy edits get partially cropped on rotate.
- Maze recursive division depth cap 6 keeps corridors wide on big screens; raise if chat wants denser mazes.

## todos
- A* toggle (heuristic on/off) to visually compare visited-cell counts vs Dijkstra.
- Diagonal movement option.
- Share board via URL hash (grid RLE).
