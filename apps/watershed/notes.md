# Watershed — notes

## log
- 2026-08-18 v1.0: deep watershed climate simulator. 24×12 paintable grid (forest/
  wetland/farm/city/bare, pointer-capture drag painting), water routed down each column
  to the river. Hydrology per day-tick: seasonal rain (120d sine) × MOISTURE-RECYCLING
  feedback (forest fraction ±, clamped 0.85–1.2) + deterministic seeded storm bursts +
  century-storm button (3d ×120mm); forest CANOPY INTERCEPTION (28% ≤13mm);
  PROPORTIONAL infiltration (runoff-coefficient style: forest .80 / wet .50 / farm .45 /
  bare .22 / city .06 × soil × saturation throttle) — THE big modeling lesson, see
  issues; wetland sponge (absorb 65% to 260mm store, 8%/d release) + 60% pollution
  filter; ET; percolation → groundwater (cap 60k) → baseflow 2.2%/d; EROSION feedback
  (hard runoff on farm/bare degrades soil→infiltration, forests slowly heal it);
  pollution by land type. Outputs: river strip breathing with Q + flood/drought tint,
  240-day hydrograph with flood/drought lines + grey BASELINE ghost overlay (mark
  button; experiments auto-mark), water-balance panel, flood/drought day counters.
  Narration: state-triggered explanation lines (flood-impervious, drought-baseflow,
  wetland-save, dirty-river, erosion-compounds; 60d dedupe). 4 experiments with printed
  hypotheses (pave/clearcut/rewet/reforest). Brush hydrology cards. Honesty card names
  SWAT/HEC-HMS (no links) — "trust the shapes, not the numbers". Faustina + Sometype
  Mono field-guide aesthetic. 19/19 deterministic probe (city peak >2× forest, forest
  baseflow-share >4× city, GW contrast, recycling, wetland cleans+buffers, erosion,
  century storm, painting/controls/experiments/narration) + screenshot review.

## issues
- **THE modeling lesson**: daily hard-capped infiltration (mm/day) made all land types
  converge under big storms (forest peak 13.6k vs city 17.5k — only 1.3×) because any
  storm >> capacity swamps the cap. Debug-printed real stats instead of guessing, then
  switched to PROPORTIONAL infiltration (classic runoff coefficients) with a saturation
  throttle — contrast became 3×, saturation-excess flooding still emerges in long wet
  spells. Also: peak/mean "flashiness" is a misleading metric when baseflow dominates
  the forest mean; baseflow-share is the honest claim ("forests fund dry-season rivers").
- stepDay() is fully deterministic (seeded storm schedule, no Math.random in core) —
  probes drive it directly; 4 ticks/s via rAF accumulator when playing.

## todos
- Possible: climate-change dial (hotter → more ET + heavier storm bursts); save/share maps.
