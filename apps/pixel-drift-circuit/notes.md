# Pixel Drift Circuit

## log
- 2026-04-17: Top speed bumped to 1100 (enginePower 820, brake 900, drag 0.007). Added physics sub-stepping (up to 6 substeps per frame based on speed*dt) so wall clamping holds at 1100 without tunneling. Leaderboard times now display ms precision (3-decimal seconds) to distinguish insane runs.
- 2026-04-17: Added Supabase global leaderboard. New table `pixel_drift_scores` (username, best_lap_ms, total_time_ms, drift_score, laps, track_seed). Finish modal shows stats + submit with handle (defaults from sloppyBarGetContext or localStorage, else random). Leaderboard modal with 3 tabs (Best Lap / Total / Drift), dedup to best-per-user, highlights self + top 3. Anonymous auth fallback. Min-lap sanity check 200ms rejects impossible times.
- 2026-04-17: Bumped top speed (maxSpeed 380→560, enginePower 300→440) and replaced soft off-track nudge with hard wall-clamp at TRACK_W - car.width/2. Collision reflects outward-normal velocity component (restitution 0.25) so cars can't pass through walls at any speed. Removed the +24 unit dead-zone and off-track drag since walls are now at the neon edge.
- 2026-04-17: Created. Top-down chunky pixel racer with bicycle-style physics, separate longitudinal/lateral grip, e-brake reduces lateral grip for drifting. Procedural closed-loop neon track (sin-blended radial samples), pink/cyan glowing edges with acid-yellow centerline dashes. Drift detection rewards sustained slip with combo multiplier. Spark + skid particles. 3-lap timed race. VT323 + Major Mono Display typography.

## issues
- Lap detection only fires when crossing seg N-1 → seg 0 in order; if a player drives backwards across the line they skip a lap. Fine for now.
- No leaderboard yet (intentional — kept self-contained).
- Steering integration uses both interpolation paths (one is zeroed); harmless but trim later.
- Mobile touch buttons added but only show on coarse pointers.

## todos
- Optional: Supabase leaderboard for best lap & best drift score.
- Ghost car / replay.
- Pickups (boost pads, jump ramps).
- Multiple track presets / random seed selector.
- Real OG PNG (currently relies on path that might 404).

## design
- Palette CSS vars: --hot #ff2d95, --ice #19f6ff, --acid #c8ff00, --bg #08020e
- TRACK_W=90 half-width. Walls at +24 over edge.
- PHYS.gripLat 11 → drops to 2.6 with e-brake = drift.
