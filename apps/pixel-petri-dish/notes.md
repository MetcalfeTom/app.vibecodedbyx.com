# pixel-petri-dish

## log
- 2026-05-30: initial build. **Cellular-automata sandbox** with 6 colored species competing inside a circular dish, fed by user-dropped data pellets. Distinct from existing `petri-dish` (which is Twitch-chat-driven bacteria sim) — this one is fully player-driven.
  - **Grid**: 150×110 cells (16,500 total) backed by two parallel Uint8Array buffers (`cells` holding species id 0..6 + `energy` holding 0..255 freshness), plus a `pellets` Uint8Array for food drops. Double-buffered `nextCells`/`nextEnergy` swapped each tick. Circular `mask` pre-computed at boot (`dx² + dy² ≤ r²`) so the visible interior is exactly the dish.
  - **Render**: 150×110 ImageData written per-frame, then CSS `image-rendering: pixelated` scales it crisp inside a circular dish wrapper (5:4 aspect, 60vh max). Each cell mixed between species `base` and `hi` colors by `energy / 200` so brighter = fresher. Pellets render as warm-white glowing pixels with brightness `180 + pellet*0.6`. Empty agar is a subtle warm-dark radial-gradient. Outside-the-mask pixels are transparent (CSS dish bg shows through).
  - **6 species** in a rainbow cycle (crimson → amber → citrine → verdigris → azure → ultraviolet). Eat rule: species `i` eats `(i+1)%6` and `(i+2)%6`, fled by `(i-1)%6` and `(i-2)%6`, neutral with the third across. Rich RPS-style dynamics — no single species can dominate without ecology checks.
  - **Sim tick** (`step()`):
    1. **Pellet phase** — every pellet looks for an eater: cell directly on it wins, else the hungriest neighbour (highest energy). Eater gains `consumed × 2` energy (consumed = `min(pellet, 60)`). If post-feast energy >200, parent spawns a child into a random empty neighbour with 120 energy, parent drops to ≥40. Unattended pellets decay -1/tick.
    2. **Cell phase** — random-sample ~55% of cells per tick (avoids iteration bias). Each sampled cell: energy decays -1; pick random Moore neighbour. Empty neighbour → grow into it with `P = 0.18 + (energy/255)*0.18` if energy >50, splitting energy 55/45. Same-species neighbour → nothing. Weaker species → eat with `P = 0.10 + max(0, my_e - their_e)/600`, child energy = `(e+ne)*0.45`, predator gains +20. Stronger neighbour → flee (their turn will hit us).
  - **Tools**: 8 brush modes via radio-style buttons + keyboard 1-8 — **◆ pellet** (drops 200-energy food), 6 species swatches (paint that color at 150 energy), **⌫ erase** (zeros out cells + energy + pellets). Brush size adjustable with `[`/`]` (radius 0-5).
  - **Pellets are first-class user input**: click anywhere = drop pellet, drag = paint pellet trail. Pellets attract the hungriest nearby cell which creates emergent flow patterns as colonies migrate toward food.
  - **Stats panel** (right sidebar): live per-species population bars normalized to leader, sorted by spectrum. Header readout shows tick / total cells / pellets / fps + a flavor text that auto-changes: "sterile" / "awaiting life" / "monoculture" / "feast time" / "overgrown" / "cultivating".
  - **Actions**: ⏸ pause (Space), → step (.), ⚄ seed (R, scatters 40-70 random cells), ✦ scatter food (F, drops 60-120 pellets), ✕ clear (X). Speed slider 1-30 ticks/sec.
  - **Aesthetic**: laboratory-notebook with cream-paper grid bg (24px grid + warm radial corners), dark circular petri dish with inset 4px rim shadow + glassy highlights + corner darkening, Cormorant Garamond italic display ("*Pixel* **Petri Dish**" with copper "Petri Dish" word), Bricolage Grotesque body, IBM Plex Mono for all numerals/labels/specimen meta. Chunky stamped buttons (2-3px hard offset shadow, 0-6px radius). 280px sidebar with field-notes panel (Cormorant italic) + keys reference.
  - **A11y** per project directive: rem-everywhere, semantic markup (`<main>`/`<header>`/`<section>`/`<aside>`/`<nav>`/`<h1>`/`<h2>` + `<button type=button>`), role=application + descriptive aria-label on canvas, aria-pressed on brush tools, role=status + aria-live on stats + sr-only announcer for tool/action changes, focus-visible copper 3px outline, 2.75rem touch targets, prefers-reduced-motion kills bar transitions.
  - Single self-contained ~30KB HTML. Zero deps.

## issues
- Random sampling means some cells skip turns; rare visual jitter on slow speeds with sparse pops
- 150×110 = 16.5k cells stresses iteration on phones; could drop to 120×84 if mobile perf complains
- Stronger species occasionally extinct themselves by over-consuming weaker prey before the prey can regenerate — by design but might want a "pellet rain" auto-mode for sustained play

## todos
- Pellet trail when dragging (currently each pointer event drops a discrete pellet — could draw a line)
- Toxin pellets (poison cells) as a third brush type
- Auto-feed mode (sprinkle N pellets per second automatically)
- Heat-map overlay toggle showing energy as brightness regardless of species color
- Save/load dish snapshots to localStorage
- Speed up render: dirty-rect tracking instead of full ImageData rewrite each frame
