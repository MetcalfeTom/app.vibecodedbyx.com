# cyto-ca

## log
- 2026-05-08: shipped — cellular-automata immune-vs-mutation sandbox (chat ask: "create a cellular-automata sandbox where users can simulate immune cells hunting down rogue mutations"). 200×120 cell grid at 5px/cell rendered into a 1000×600 canvas. Three cell states: empty / mutation / immune. Two parallel `Uint8Array` HP grids track per-cell durability so kills require multiple hits and immune cells can be overwhelmed.
  - **Mutations** (crimson, glowing core + outer halo + tiny white pip when fresh): probabilistically replicate into a random empty Moore-neighbor each tick. Replication probability = `repRate` slider (1-40%, default 7%). Spawn HP = `mutHpInit` (1-10, default 3). Lose 1 HP per attack from an adjacent immune cell. At HP=0, removed.
  - **Immune cells** (cyan, pulsing halo + dark core + bright pip + amber damage marks when hp < 40%): each tick (1) attack a random adjacent mutation if any exist; (2) else scan within `senseR` Manhattan radius (0-15, default 5) for the nearest mutation and step one cell toward it (diagonal preferred, then axis fallback); (3) else random walk with 60% probability. Take damage when surrounded by ≥`overwhelm` mutations (3-8, default 4). Damage = `surplus_mutations - threshold + 1`. Spawn HP = `immHpInit` (1-20, default 5).
  - **Tools**: paint Immune, paint Mutation, Erase, Inspect (no-op for hover only). Round brush (4 sizes: 1/2/3/5). Pointer-down + drag paints continuously across the slide. Number-key shortcuts: 1/2/3/4 cycle tools.
  - **Sliders**: speed (1-60 ticks/sec), mutation replication % (0-40), mutation HP, immune sense radius, immune HP, overwhelm threshold. All update live mid-simulation; rule changes apply on the next tick.
  - **Run controls**: Play/Pause toggle, Step (advance 1 tick — useful for inspecting causation), Clear (full slide reset including history). `space` toggles play/pause, `s` steps, `c` clears.
  - **Presets**: Outbreak (single cluster + sparse immune), Front-Line (two armies on opposite walls), Petri Dish (random scatter), Late Stage (mutation has won, hail-mary immune scattered), Weak Host (80 mutation vs 20 immune), Ringfence (cluster surrounded by tight immune perimeter — best winnable scenario).
  - **History chart**: 240-frame rolling line graph at the bottom plotting immune (cyan) vs mutation (crimson) population. Max-y autoscales to current max so trends are visible regardless of total population.
  - **Stats overlay** on the canvas: Immune count, Mutation count, Kills, Generation. `aria-live="polite"` so screen readers announce major changes.
  - **Render approach**: tissue background pre-painted to an offscreen canvas via `putImageData` once at boot (mottled dim cells with subtle hue noise + 1px borders) — main loop just blits this once per frame, then draws live entities on top. Avoids re-painting 24,000 background cells every frame.
  - **Tick processing**: shuffle entity lists each tick to prevent bias toward upper-left cells. Process mutations first (replicate into freshly-emptied cells from prior immune kills), then immune (attack/seek/wander). In-place state mutation with grid lookup so no two cells can ever overlap.
  - **Aesthetic**: microscope-slide vibe — dark navy `#06080d` slide, fluorescent stained cells (cyan immune, crimson mutation), pulsing alpha on cell halos, subtle glow on bright pips. Audiowide title "Cyto · Sandbox" + Press Start 2P "CA" tag in crimson. JetBrains Mono for stat labels. IBM Plex Sans for tool labels. Sliders use accent-color CSS for native cyan track.
  - **Accessibility**: `role="application"` + descriptive `aria-label` on the canvas explaining controls, `aria-pressed` on every tool/brush toggle, `aria-live="polite"` on the stats strip, semantic `<main>`/`<header>`/`<section>`/`<aside>`/`<button type=button>`, `:focus-visible` outlines, 2.75rem (44px) min-height interactive targets, skip link at top. `prefers-reduced-motion` removes toast transitions.
  - **No audio** — felt out of place for a microscope sandbox; mute button is reserved for future biological click/squelch SFX if chat wants them.

## issues
- Performance: at very high mutation counts (>3000) the per-tick `findIndex` on the `mutations` array starts to dominate. Could swap to `Map<idx, entity>` for O(1) removals but the simple array approach kept the code readable and is fine up to ~2000 entities.
- Immune cells don't have a "memory" — they always re-scan from scratch. Adding a destination/target field would smooth their pathing but introduce more state to manage.
- Overwhelm rule only counts adjacent mutations, not the broader local density. A more interesting model would diffuse a "stress" field; for v1 the simple count is sufficient and intuitive.
- No cytokine/chemoattractant trail mechanic yet. Killed mutations could leave a fading trail other immune cells follow — interesting next-gen feature.
- The outbreak preset puts the spawn cluster mid-grid — the stationary mutations don't move so the slide can deadlock if no immune are within sense range. Solved by placing the immune cells on a 30-50 unit ring around the cluster, which gives them line-of-sight as long as `senseR ≥ 4`.

## todos
- Cytokine field: a third Float32Array storing per-cell concentration that immune cells follow uphill. Mutations could secrete a "decoy" that masks them.
- Genealogy: each mutation gets a generation counter; later generations could mutate to higher HP or faster replication.
- Mutation types: melanoma vs leukemia vs lymphoma with different rule profiles, color-coded.
- Drug overlay: paint a region to apply chemotherapy (kills both cells but damages immune less).
- Save/load slide as a string (run-length encoded grid) so chat can share interesting scenarios.
- Heatmap mode: replace cells with population-density color so chat can study aggregate dynamics.
- Time-lapse capture: record N seconds of frames as an animated GIF or WebM for sharing.
