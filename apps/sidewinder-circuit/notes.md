# Sidewinder Circuit — notes

## log
- 2026-08-28 v1.0: initial release. Grid snake (36×22 cells) racing 3 laps around a hand-laid desert loop (8 waypoints in `PATH`, corridor ±1 cell). Four gates in order S/F → CP1 → CP2 → CP3 → S/F; a gate counts when the head crosses its line moving with the gate direction (entry OR exit edge, `visitCounted` guard so a lateral sidestep in the gate column can't skip it). Out-of-order gates → "missed CPx" toast, reverse crossing → "wrong way". Snake grows +1 every 20 ticks (cap 40); water pickups shrink it by 3 and refill boost. Boost: hold space/shift, 9 → 15 cells/s, meter drains 38/s refills 11/s. Hazards: 14 fixed cacti/rocks (none on gate columns or the column right before one), 2 tumbleweeds oscillating across the corridor every 4 ticks, dunes, own tail. Crash = 900 ms burst + 3 s penalty + respawn (length 4) at the last passed gate's `spawn`. Finish card: total, per-lap splits with best highlighted, crashes/penalty, best time in `localStorage['sidewinder-circuit-best-v1']`. Rye + Chivo Mono, dusk-sky page with mesa silhouettes; static track pre-rendered to an offscreen layer (rebuilt on resize). Touch: swipe on canvas + d-pad/boost bar below the stage (`body.touch` via `(pointer:coarse)` or `?touch=1`). Probed desktop 61/61, mobile 13/13 (headless Chromium, `window.__X` seam: `freeze`, `start(seed)`, `step(n)`, `bot(n)` corridor-following auto-driver, `turn`, `setBoost`).

## issues
- The bot (`botDir`) sidesteps one cell before an obstacle, so keep gate columns ≥2 cells away from any obstacle column — otherwise the bot can enter a gate laterally and the tests get flaky.
- `interval()` depends on boost state, so race time is the sum of tick intervals plus penalties — keep it that way (don't switch to wall-clock) or the freeze-seam tests drift.
- Programmatic `canvas.focus()` after Start shows a `:focus-visible` ring in some browsers; kept it deliberately subtle (inset, 55% alpha).

## todos
- Ghost replay of your best lap (store head positions per tick).
- A second track layout / mirror mode; chat may want a track editor.
- Optional Supabase leaderboard (best total time) if chat asks.
