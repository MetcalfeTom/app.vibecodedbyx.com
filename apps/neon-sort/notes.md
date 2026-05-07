# neon-sort

## log
- 2026-05-07: shipped — neon sorting visualizer with bubble sort, quicksort, and insertion sort as a bonus. Bars dance idle and pulse on every operation.
  - **Algorithms as generators**: each algo is a JS generator (`function*`) that yields step events `{kind: 'compare'|'swap'|'sorted'|'pivot'|'unpivot', i, j?}`. Renderer drives `state.speed` events per frame (1–60 slider). This means runtime is *visualised*, not faked — bubble sort actually does O(n²) comparisons while quicksort partitions and recurses.
  - **Dancing bars**: each bar carries `{value, phase, jitter, comparePulse, swapPulse, sorted, pivot}`. Idle wobble = `sin(t * 2.4 + phase) * 2px * jitter` so each bar has its own personality (random phase + random jitter 0.8–1.2 baked at `makeBars` and preserved across reshuffles). On compare/swap events, the bar's `*Pulse` field bumps to 1.0 and decays at 14%/12% per frame respectively, adding height + glow + top-cap colour while above 0.05.
  - **Beat sync**: every event also nudges a global `beatPulse` (capped 1.0, decays 5% per frame) which adds a small height bump to ALL bars — so the whole field breathes with the algorithm's pace. Makes a fast-running quicksort feel like a drum solo.
  - **Colour**: hue is value-derived (`(value/N) * 320 + 220`), so a fully sorted array reads as a clean rainbow gradient blue → cyan → green → yellow → pink. Lightness boosts when sorted (62%) vs unsorted (55%). Each bar is a vertical 2-stop linear gradient (lighter on top, darker at base) with `shadowBlur` glow scaled by the active state.
  - **State highlights**: cyan top-cap + cyan glow on compare, gold cap + gold glow on swap, violet 4-sided frame + cap on pivot, lime cap + lime glow on sorted. Pivot frame uses `strokeRect` so it reads as a clear "this is the chosen element" — important because quicksort's pivots last for a whole partition pass.
  - **Floor reflections**: short downward gradient strip below each bar's baseline at `0.32` alpha for synthwave depth without compromising readability.
  - **Synth tones**: Web Audio per-event tones, lazy-init on first user gesture (audio policy compliance). Pitch = `220 + (value/N) * 660` Hz (220–880 range). Compares = triangle, swaps = sawtooth with a +40% chirp ramp over 60 ms, pivots = square. Win chord on completion = C major arpeggio (C4→E4→G4→C5) staggered 60 ms apart. Mute toggle persists per session.
  - **Quicksort details**: Lomuto partition with the rightmost element as pivot. Yields `pivot` event when entering the partition, `unpivot` after the swap-into-position. Recursion goes left subarray first, then right. Final array always fully sorted.
  - **Bubble details**: classic n²/2 pair-sweeps. Tracks `didSwap` — if a full pass yields no swaps, bails early and marks remaining indices as sorted (the "early-termination" optimisation, which makes bubble sort visibly faster on near-sorted arrays).
  - **Insertion details**: shifts each new element left through swaps until the predecessor is smaller. Marks index 0 as sorted before the outer loop kicks in.
  - **Sizes**: 24 / 40 (default) / 64 / 96. The 96 bars at full speed (60 events/frame) is roughly 3600 events/sec — bubble sort completes in seconds.
  - **Controls**: ▶ play/pause, ▶│ step (one event), ↺ shuffle, ≡ sorted (set the array to ascending so you can sanity-check the algorithm or stage a screenshot), ♪ mute. Algorithm + size + speed pickers in `<fieldset>` groups so they read well to screen readers. Keyboard: Space play/pause · S step · R shuffle · M mute · 1/2/3 algo select.
  - **Aesthetic**: `Audiowide` lockup ("neon · sort / dancing bars" — pink mid-dot, lime slash), Space Mono italic tagline ("bubble vs quicksort · synth tones · race them"), IBM Plex Mono UI. Deep purple-black bg with three radial-gradient glows (pink top-left, cyan bottom-right, lime bottom-center). Glassmorphic backdrop-blur HUD pills + legend.
  - **Accessibility**: rem units, 100% root font-size, semantic `<main>` + `<header role=banner>` + `<canvas role=application>` + labelled fieldsets, `aria-live="polite"` on the HUD column, `aria-pressed` on toggle buttons, focus-visible lime outlines, ≥2.6rem button heights, `prefers-reduced-motion` no-ops the button transitions, skip link to canvas.
  - **Responsive**: under 760px the legend hides, dock collapses, brand text shrinks, range inputs narrow.

## issues
- The `setSorted` button leaves `state.done` true so it counts as "completed" — pressing play after that triggers a fresh shuffle via `if (state.done) reset()`. That's intentional but slightly surprising (clicking play on a sorted-state-display starts a new run). Could add a separate "clear sorted state" affordance if anyone asks.
- Bubble sort's early-termination optimisation kicks in once a no-swap pass occurs; on arrays that happen to be presented as already-sorted (rare with shuffle) the visualisation finishes in one pass with all bars going lime simultaneously. Visually correct, just less of a show.
- Web Audio firing one oscillator per event at speed 60 = 60 oscillators/frame = ~3.6k/sec. Each lives for 0.18s, so ~650 active simultaneously at peak. Modern browsers handle this fine but a future limit guard would be safer.
- Pivot frame uses `strokeRect` with a 1.5×dpr line — at high DPR (3+), the stroke can look slightly fuzzy. Acceptable, not pixel-perfect.

## todos
- Side-by-side race mode: bubble vs quick on the same array, two canvases stacked.
- More algorithms: merge, heap, radix, cocktail shaker.
- Custom array shapes: sawtooth, reverse-sorted, mostly-sorted (so users see best-case vs worst-case).
- "Bug bar" prank where a single value is corrupted to test stability.
- Save preset as a shareable URL (algo + size + speed in querystring).
- Ambient drone backing track that swells with `beatPulse`.
