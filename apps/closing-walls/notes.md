# Closing Walls

## log
- 2026-04-25: Created. Neon maze escape — player navigates from top-left (0,0) to bottom-right (rows-1, cols-1) before concentric rings of the maze get sealed inward every `crushEvery` seconds. **Maze gen** = recursive backtracker (stack-based DFS) with FNV-1a seed → mulberry32 PRNG so `?seed=foo` URL param produces deterministic mazes. **Cells** stored as `{walls, layer}` where walls is bitfield N=1/S=2/W=4/E=8 with `OPP` map for tearing both sides; carved by visiting random unvisited neighbors and tearing shared wall. **Ring-sealing crush** = `ringOf(r,c) = min(r, c, rows-1-r, cols-1-c)`; every `crushEvery` seconds `sealRing(idx)` marks ring as `layer=1` (red pulsing + 45° hatching), re-adds walls between sealed and open cells (so a sealed ring becomes a one-way barrier), and ends game with `crushed` if player happens to be on it. Ring index advances inward until it would seal the player's ring → player has to be deep enough by then. **Levels**: Drift (17×13, 7s/ring, 5s grace), Standard (23×17, 5s, 3.5s), Crush (31×21, 3.4s, 2.5s), Compactor (39×27, 2.4s, 1.5s) — picked from 4-pill control row. **Render**: bg neon grid → sealed cells (red `#ff3a5e` radial fill + dashed hatching + alpha pulse) → walls (cyan glow 18px shadowBlur, 3px stroke) → exit (green pulsing pad with rotating chevrons) → player (yellow halo 22px shadow + 2 inner ring pulses) → flash overlay on win/loss. **Input**: keyboard (arrows + WASD + R reset + Esc to title), touch d-pad (4 buttons coarse-pointer), swipe on canvas (≥24px deadzone, prefer-axis lock). **Status HUD**: timer, ring index, cells remaining, best time per level (localStorage `closing-walls-best-v1`). Win pop "Escaped in X.Xs · NEW BEST" / loss pop "Crushed at ring N · ↻ retry".
- 2026-04-25: **Aesthetic** — synthwave grid: bg `#050018→#15003a` radial vignette, walls cyan `#26e8ff`, sealed pink/red `#ff3a5e`, exit lime `#7cff5b`, player gold `#ffe14d`. Title in Major Mono Display 56px tri-color gradient (pink → violet → cyan), subtitle Silkscreen 11px 0.4em-tracked, body Audiowide for buttons + VT323 for stats. Each ring-seal triggers a 0.4s screen flash + 6 red-orange particles per sealed cell drifting inward. Pollinations OG, no `referrer=` per current API rule. Favicon 🧱.

## issues
- Brutal level 39×27 may slow on low-end mobile due to per-frame canvas redraw of every cell. Could clip to viewport ring bounds, but mazes are small enough that it's not currently a bottleneck (~200µs/frame on mid-tier).
- Swipe gesture conflicts slightly with browser pull-to-refresh on mobile Safari; mitigated with `touch-action: none` on canvas + d-pad container, but swipe still needs ≥24px move to fire.
- Ring sealing assumes rectangular grids; if I ever add irregular maze shapes the `ringOf` formula breaks.

## todos
- "Phantom" pickups inside the maze: collect ≥3 to teleport across one ring boundary.
- Trail particles behind the player matched to last 8 cells.
- Daily-seed mode (date as seed) with global leaderboard (Supabase).
- Sound: synth crush rumble per ring-seal + breath on close calls, win chime, hurt thud.
- Timer "danger" red pulse when next-seal countdown < 1.5s.
- Keyboard hold-to-move (currently 1 cell per keydown).

## design
- Palette: bg `#050018→#15003a`, ink `#f6e7ff`, dim `#8a76b8`, cyan `#26e8ff`, pink `#ff2e88`, red `#ff3a5e`, lime `#7cff5b`, gold `#ffe14d`, violet `#9d5bff`.
- Fonts: Major Mono Display (title), Audiowide (small caps subheads + buttons), Silkscreen (HUD pips), VT323 (numerals).
- Layout: full-viewport canvas centered; floating glassy panel for HUD top, level pills bottom (rgba(10,1,36,0.78) + 8px backdrop blur + violet 1px border).

## code-shape
- Single-file index.html, ~700 lines.
- `genMaze(cols, rows, rngSeed)`: returns flat `cells` array of `{walls, layer:0}`.
- `ringOf(r, c)`: cheap min-of-4-distances → defines crush order.
- `sealRing(idx)`: mark + wall-fix + crush-check; called from tick when crushTimer ≥ crushEvery.
- `tick(now)`: dt-clamped → countdown → seal → render. Win check on player==exit.
- `moveDir(d)`: wall + sealed-layer + bounds check; increments steps, fires win pop on exit.
- Input: keydown listeners, d-pad pointerdown, swipe via pointerdown/move/up on canvas.
- Persistence: `localStorage['closing-walls-best-v1']` = `{easy, normal, hard, brutal}` keyed by level slug.
