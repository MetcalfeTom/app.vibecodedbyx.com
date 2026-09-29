# Mouse Lab

Tatum's idea (2026-09-29): a page that only listens to the mouse, to tell apart the mouse, the browser and the game when a 3D view creeps upward on sideways moves (the Lava Zap mouse saga, see apps/lava-zap/notes.md).

## log
- v1 (2026-09-29): three modes (free cursor via clientX/Y deltas with coalesced events, pointer lock movementX/Y, pointer lock with unadjustedMovement, falling back to plain lock on NotSupportedError). 10 s wiggle test from the first move. Measures events/s, sideways travel, net vertical drift (% of sideways), the lean split by moving right vs left, spikes (a report over max(40, 8x the running median), after the first 12), stalls (a 60 ms+ gap with movement on both sides), and in lock modes the mouse-event stream beside the pointer-event stream as a cross-check. Verdicts: Level / Slight lean / Creeps up/down / Jumpy. Slow machine toggle burns 45 ms per frame. Copy results for chat. The bench draws the view's height against the level line over the last 6 s, spikes as red dots. __ML hook (report, start, finish, runs, judge) for headless sims.

## issues
- Pointer lock can't be tested headless (needs a real click); sims feed __ML.report directly.

## todos
- If Tatum's runs show lock-only drift, port the finding to Lava Zap (e.g. prefer the mouse-event stream, or offer "no pointer lock" drag-to-look).
- A "rate over time" chart to show polling hiccups.
