# Genetic Life — notes

## log
- v1.0 (2026-09-11): Built from three rapid chat messages (base ask: editable genomes, ancestry colors, interactive grid, controls, small + rare-large mutations; follow-up 1: blended-trait inheritance + reproducible seeds; follow-up 2: bind hue to genome parameters predictably while preserving lineage identity). All merged into one build.
- Engine (pure `<script id="eng">`, dual export, fully seeded): 96×60 toroidal grid, 8 genes 0–15 = 8 hex chars (SPD SEN EFF FER AGG PHO LON WAN), food drizzle + photosynthesis/eat/attack/split/death economy. **Reproduction**: if a neighbour exists the child genome is `blend()` (per-gene parent average w/ random tie-rounding — proven between-parents in tests) else a clone; then `mutate()` — per-gene ±1 at pSmall, and at pLarge a LARGE mutation rerolls 3 genes and founds a NEW lineage with a 50–210° hue jump. **Color model**: displayed hue = lineage base hue (inherited ±2°/birth) + `geneHueOffset(g)` (weighted Σ(gᵢ−8), one AGG step = exactly 2°) — lineage identity anchors the family while every mutation/edit shifts color predictably. World.hash() for determinism tests; seed recorded and shown in UI.
- UI: canvas dish (click creature = select; brush paints food or drops life — life brush copies the selected genome), GENOME LAB (hex field w/ junk-flagging + 8 labelled sliders, edits apply live; clone ×3 / cull), run/pause/step, 1×/2×/4×, food + small-mutation + large-mutation sliders, seed field + reseed (same typed seed = same untouched run; painting/editing forks history — said in the hint), census (pop/families/births/big leaps) + pop sparkline. Timer-driven loop (80ms), no rAF.
- Doto + Sono, lab-bench cream vs dark-field dish. WCAG: role=application canvas w/ instruction label, aria-live census, aria-pressed toggles, 44px, reduced-motion.
- **Bugs the suites caught before ship**: (1) `this.seed = ...` property SHADOWED `World.prototype.seed()` — the app would have thrown at boot; method renamed `populate()` (lesson: never give a state property the same name as a prototype method). (2) `dish.setPointerCapture(ev.pointerId)` throws on unknown pointerIds and killed the whole pointerdown handler — now try/catch'd (sister of the elementFromPoint lesson: synthetic clicks bypass what real pointers hit).
- Verified: engine node suite 35/35 (codec, mutation stats ≈ dial values, ±1-only smalls, clamps, blend between-parents ×500, hue-offset weights, same-seed hash equality over 300 ticks, 900-tick balance w/ births + big leaps + families, grid↔map consistency, lineage drift ≤2°/birth vs big-jump ≥50° + new lin id, world-level blended child, applyGenome, death drops food, wrap); browser probe 25/25 at 1200/390/320 (canvas ink, pause/step exact, click-select via real pointer path, hex + slider edits live w/ junk flagged, hue shift == gene weight, clone/cull, both brushes, sliders → params, typed-seed reproducibility via hash, keyboard, no overflow); screenshots both widths.

## issues
- Reproducibility is honest only for untouched runs — any paint/edit/clone consumes PRNG draws and forks history (the hint says so).
- Dish saturates to the 600 cap on food-rich settings after ~900 ticks; the cap is the guard, lower the drizzle for sparser ecology.

## todos
- Lineage inspector: click a family in census → highlight its members.
- Export/import dish state as JSON.
- Optional walls brush for maze ecology.
