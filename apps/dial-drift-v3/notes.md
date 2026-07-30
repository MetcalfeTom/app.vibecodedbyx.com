# dial-drift-v3 · notes

## log
- 2026-07-30: v1 — chat: "auto-wander mode, Perlin-like noise, settle on a new coordinate ~every 15s, deploy as v3". Built FROM v2 (19 targeted edits; v2 untouched). 🧭 DRIFT knob: per-axis value-noise walks — waypoints every 12–18s (jittered), bounded ±3-cell hops docked on integers, interpolated with PERLIN'S FADE 6t⁵−15t⁴+10t³ whose zero-derivative endpoints make the dial genuinely SETTLE at each destination (measured: fade(0.02)=0.00008). Coordinates run FRACTIONAL into the continuous field → between stations you hear the true in-between (bpm 58.00 at mid-glide, etc.); nearest-cell highlight + '≈ 94.7 FM' display + docking countdown. Manual tune/arrows GRAB THE WHEEL (drift auto-disengages); drift-off re-anchors at the nearest station; power-off kills drift. SUITE 10/10 effective (fade properties, 4 hops/60s, 12.1s segments, board bounds, fractional mid-target, lifecycle; 1 nominal fail was the harness reading a toast that tune() legitimately overwrites a line later — state was correct).

## todos
- Current-strength knob (waypoint distance ±1 vs ±3); shareable drift seeds.
