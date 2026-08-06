# Iron Math

## log
- 2026-08-06 v1.2: desk/fray/binding pass per chat — body = cast-iron plate (concentric repeating-radial rings + chalk radials + 2 coffee rings) + 1 ring soaked into paper; **frayed edges** = 43-pt seeded clip-path polygon (seed 531, left edge straight) — box-shadow swapped to filter:drop-shadow so the torn silhouette shadows correctly; **spiral moved to .book wrapper ::before** protruding left (children of a clipped element get clipped — binding could not stay inside main). Mobile: .book adjustments.
- 2026-08-06 v1.1: **vintage notebook redesign** per chat (visual only, logic untouched — 17 checks unchanged). Caveat + Patrick Hand; yellowed paper w/ blue rules (repeating-linear 1.85rem) + red margin (main::before) + **spiral binding** (main::after: two repeat-y radial-gradients = holes + wire rings, 2.2rem pitch); hand-drawn wobbly borders (border-radius 255px 15px… trick); exercise cards alternate ±0.3° tilt; **kg/lb toggle moved to header** as pen-circled buttons (unitKg/unitLb replace unitSel — setUnit() shared). Notes textarea restyled via !important overrides (inline styles from v1.0 markup — refactor to classes if touched again).
- 2026-08-06 v1.0: new app for marcipopsis (spec assembled from 3 chat messages) — percentage strength log.
  - **① Training maxes**: per-movement 1RM/TM table with name/max editing, **exercise library dropdown** (16 barbell lifts + custom… prompt; already-added lifts filtered out), **overload scheme** select per movement (none / +1.25 / +2.5 / +5 per session), Epley e1RM estimator (w×(1+reps/30)).
  - **② Session**: one **table per exercise** (movement dropdown header) — columns SET# / TYPE / REP TARGET / %1RM / auto-LOAD / done ✓. **+set** copies last row, **+drop** adds a drop set at −10% (red tag), **+cluster** adds "3+3+3" at +5% (green tag) — rep targets parse "+"-separated clusters (`parseReps`, garbage tokens ignored). Load = `prescribe(max, pct, round)` (double-rounded for float hygiene); tap any load → **per-side plate math** (greedy over kg [25..1.25] / lb [45..2.5] sets, bar configurable, flags below-bar and unloadable remainders). Per-exercise + session volume (Σ load × reps).
  - **Session notes** textarea saved with each logged session (italic quote in history).
  - **Finish & log** → history entry (date · summary · volume · notes) + **applyOverload** (pure): movements with ≥1 done set AND scheme>0 get TM bumped, changes shown as 📈 in history. Done flags reset, notes cleared.
  - Units kg↔lb converts maxes/bar (nearest 0.5) + halves/doubles schemes; rounding default 2.5kg/5lb.
  - localStorage `iron-math-v2`. Bricolage Grotesque + Spline Sans Mono, chalk-paper + safety orange.
  - Tests: iron-test.js — 17 checks (Epley, prescription rounding incl. midpoints, plate math kg+lb, unit round-trip, cluster parsing, overload purity + gating, library).

## issues
- Harness stub note: createElement stubs need non-empty querySelectorAll arrays or destructured input handlers crash the boot render.
- prompt() for custom movement is a blocking API — fine here, replace with inline input if chat complains.

## todos
- 5/3/1 wave scheme (needs cycle counter per movement).
- Per-set actual-reps logging (AMRAP) feeding auto e1RM updates.
- Export history as CSV.
