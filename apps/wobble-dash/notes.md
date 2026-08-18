# Wobble Dash — notes

## log
- 2026-08-18 v1.0: QWOP-style 100m. Q = left leg, P = right leg (plus big touch buttons
  with `.due` highlight). Rhythm-based momentum: alternating in the 0.22–0.5s sweet spot
  gives the strongest push (`v += 0.55 + 1.35*q`, cap 9.5 m/s) and recentres lean;
  same leg twice = "diplomatic incident" (lean spike + speed cut + stumble wobble).
  Inverted-pendulum balance (`lean += lean*1.7*dt`), idle >0.85s tips you, |lean|>0.62 = fall
  with faceplant rotation + dust, 1.5s respawn at last checkpoint flag (25/50/75m).
  Finish grades your run with playful lines; best time in localStorage `wobble-best`.
  Web Audio blips per stride/stumble/fall/finish. Titan One + Sniglet, track-and-sky palette.
  Probe seam `window.__WD = {G, press, step, reset, CHECKPOINTS, COURSE, fall}`.
  13/13 probe checks ×3 stable runs + mid-race screenshot review.

## issues
- **Unified game clock (the big lesson)**: press() originally timed strides with
  `performance.now()` while step() ran simulated dt — mixed clocks made the probe flaky
  (12/13, then 10/13: under fast headless execution wall-clock deltas between presses were
  ~1ms → every stride graded "too fast" → constant stumbles). Fix: `G.clock += dt` at the
  top of step() (before the !running early-return) and press()/idle/respawn all read
  G.clock. Same feel live (rAF dt ≈ wall time), fully deterministic under test.
- say() still uses performance.now() for message hold timing — display-only, fine.

## todos
- The queued "surprising playful update" (my choice) — next task.
- Possible: photo-finish freeze-frame, ghost replay of your best run.
