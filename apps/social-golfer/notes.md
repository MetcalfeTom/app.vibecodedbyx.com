# social-golfer

## log
- 2026-05-04: shipped — solver + interactive visualization for the (12, 3) social golfer problem with a forbidden trio (players 1, 6, 12 must never share a group).
  - **Solver**: backtracking depth-first that pre-marks the 3 forbidden pairs (1-6, 1-12, 6-12) as already-played so they're never picked. Greedily picks the first unbound player in the remaining pool, tries every still-unbound (b, c) partner pair, recurses on the remainder. Runs `buildAll(R)` from R=5 down to R=3; **finds 4 rounds** as the maximum where all pairs are unique AND the forbidden constraint holds. (5 rounds is impossible with this constraint: 5 rounds × 12 pairs/round = 60 pairs needed, but 66 total minus 3 forbidden = 63 legal pairs — close to enough, but the structural overlap with the constrained trio prevents a valid 5-round Steiner-like packing.)
  - **Result baked into the page** so first paint is instant: 4 rounds, 48 unique pairs covered out of 63 legal pairs (76%), zero pair repeats, zero forbidden-trio violations. Schedule:
    - R1: 01-02-03 · 04-05-06 · 07-08-09 · 10-11-12
    - R2: 01-04-07 · 02-05-10 · 03-08-12 · 06-09-11
    - R3: 01-05-08 · 02-07-11 · 03-06-10 · 04-09-12
    - R4: 01-09-10 · 02-06-08 · 03-04-11 · 05-07-12
  - **Unique visualization** — 12 golfer-nodes arranged in a clockwise circle with player 01 at 12-o'clock. For each round, four colored translucent **triangles** connect the three players in each group (cyan/A, magenta/B, gold/C, lime/D), each triangle's centroid getting a small filled disc with the group's letter. As the round changes, the page **cross-fades** between the previous round's triangles and the new one over ~1.1s via a `displayRound` float that lerps toward `currentRound` — so the geometry visibly *morphs* between configurations rather than just snapping. Background concentric rings + 12 radial spokes give it an old-club-medallion feel.
  - **Constrained-trio highlight**: players 1, 6, 12 are drawn as gold filled discs (vs forest-green for the others), with a dashed gold ring 8px outside the disc, and their radial spokes are tinted gold. The schedule grid + heatmap header label them in the constraint colour too. They're impossible to miss as you scrub through rounds.
  - **Schedule rail**: clickable round rows with each group rendered as a colored chip showing `01-02-03`. The constrained trio's numerals get an underlined heavy weight inside chips so you can spot at a glance that none of them ever share a chip with another constrained player.
  - **Controls**: Prev / Auto / Next buttons, a cadence slider (700ms-3.5s between auto-advances), keyboard ←/→ for prev/next, Space to play/pause. `aria-pressed` toggles on the play button so screen readers announce state.
  - **Pair coverage matrix**: a 12×12 heatmap where each cell is colored with the round-color of the round in which that pair first played, and labelled with the round number (1-4). Diagonal is dimmed. The three forbidden cells (1·6, 1·12, 6·12, plus their mirrors) are rendered with a red diagonal-stripe pattern + ✕ symbol so they read as "off-limits" at a glance. Header row + column highlight the constrained trio in gold.
  - **Metrics column**: rounds count, unique pair tally vs the 63 legal pairs, pair-repeat count (0), forbidden-together count (0), coverage percentage. Each metric in IBM Plex Mono with Cinzel numerals + a small caption.
  - **Aesthetic**: deep emerald `#0a1f1a` bg with panels in slightly lighter forest green + gold `#d4a93d` accents + paper-cream ink `#f4e8c8`. Cinzel display, IBM Plex Mono for chrome + numerals, IBM Plex Sans for body, Cormorant Garamond italic for taglines. Subtle 43° hairline grain across the bg.
  - **Accessibility**: rem units, semantic `<header>`/`<main>`/`<aside>`/`<section>`/`<footer>`, canvas `aria-label` describing the layout, `aria-live="polite"` round number announces transitions, schedule rows are real `<button>`s with focus-visible gold outlines, keyboard nav (Arrow keys + Space), `prefers-reduced-motion` skips control hover transitions (the canvas cross-fade is short enough to keep).

## issues
- The forbidden constraint really does cap us at 4 rounds. Without the constraint, 5 rounds (a Kirkman-style packing) would be achievable for some n; with three pairs taken off the table, the 4-round cap is provably tight here.
- The cross-fade interpolates triangle alpha but not vertex positions. Animating triangle vertices to "morph" between rounds would be nicer but requires solving the assignment problem (which old triangle becomes which new one). Group-letter-to-letter mapping would be the natural pairing.
- Auto-play loops back to round 1 after round 4 with no separator — could add a "lap" pulse on the wrap-around.

## todos
- Toggle to relax the forbidden-trio constraint and re-solve for 5 rounds, with a visible diff of which new pairs become legal.
- Optional "minimize repeats" mode that allows 6+ rounds with the constraint, scoring repeat count.
- Round-by-round triangle morph (vertex interpolation with optimal group-letter pairing).
- Export schedule as printable PDF / TSV.
- Other (n, k) presets — (16, 4), (20, 5), etc — with the same circle viz.
