# TSLA DCF Desk — notes

## log
- v1.0 (2026-09-14): Built per chat ("TSLA DCF dashboard with the blue WACC-versus-terminal-growth sensitivity heatmap"). No prior DCF/TSLA app existed — fresh build. Pure engine in `<script id="eng">` (node-testable): 10-year FCFF projection (growth + EBIT margin lerp year1→year10, FCF = EBIT(1−t) + D&A − capex − ΔNWC), end-year discounting, Gordon terminal, EV → equity (+ net cash) → per share, upside vs a USER-ENTERED reference price. 14 editable assumptions persisted in localStorage (`tsla-dcf-v1`), reset button. Heatmap = 7×7 `<table>` of `<button>` cells (WACC rows ±1.5pp, g cols ±1.5pp, 0.5 steps), dataviz-skill blue sequential ramp steps 600→100 (dark = low, light = high; validated on the app's own #0c1526 surface), ink switches at step 300, ringed base cell, hatched+disabled cells where g ≥ WACC, hover/focus tooltip, click-to-adopt recentres the grid. Bodoni Moda + Spline Sans Mono, navy desk.
- HONESTY: every default is labelled illustrative/not live/not advice, footer says not affiliated with Tesla; NO price feed, NO external data (none reachable/allowed from the sandbox). Chat may ask for "live price" — answer: enter it in the reference-price field.
- Verified: engine 25/25 node (hand-computed Y1 FCF, all valuation identities, monotone sensitivities, g ≥ WACC → null never Infinity, grid centring, colour steps); browser 29/29 at 1200/390/320 (heatmap shape, blue-ness of every cell, ink switching, labels, tooltip on focus, click-adopt + persistence, undefined region, reset, live typing, a11y targets, no overflow, disclaimers, zero anchors); screenshots both widths.

## issues
- LAYOUT LESSON (+): a nowrap table inside an `overflow-x:auto` box STILL pushes its min-content up through a grid item — the section widened to 565px at 390 and the whole right column overflowed. Fix = `min-width:0` on the grid items (sections) + explicit `minmax(0,1fr)` column. Probe overflow AFTER content is populated.
- Tooltip: hide-on-scroll must not kill a keyboard-focused cell's tip — focusing a below-the-fold cell scrolls the page and fired the hide; now scroll re-anchors the tip when the active element is a cell.

## todos
- Mid-year discounting toggle; two-stage explicit growth; share-based comp line; a "what would it take" solver (which WACC/g pair hits the reference price).
