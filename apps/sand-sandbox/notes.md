# Sand Sandbox — notes

## log
- 2026-09-26: polish pass (5th most-voted app, untouched since May):
  - **moved-this-frame stamps** (`moved` Uint8Array vs `tick`): the bottom-to-top scan used to re-process anything that moved UP, so fire and steam rocketed to the top in one frame; sideways movers could also run with the scan. Every swap stamps the destination; stamped cells are skipped.
  - **bottom row was frozen**: the scan started at `H - 2`, so particles on the last row never moved (water there never spread). Now starts at `H - 1` (`get()` treats out-of-bounds as STONE).
  - **accelerating free fall**: `vel` (quarter cells, swapped with the particle, zeroed when something is below or on `set`) → 1 cell/frame at first, up to 5. Used by sand, water, oil, acid and gunpowder via `fall()`.
  - **liquids level out**: `spread(x, y, n)` runs up to n empty cells sideways (water 5, oil/acid 3) instead of a 1-cell 40% nudge — pools flatten instead of standing like jelly.
  - **fire + lava glow**: a quarter-res heat map (5×5 box blur) drawn over the canvas with 'lighter'.
  - **render via a colour LUT** into a Uint32 view (was parseInt on hex strings for 400k pixels every frame).
  - stone, wood, ice, plant (and the eraser) paint solid; loose materials still sprinkle at 40%.
  - removed the "All Apps" backlink (the site bar has it); real og.png (headless shot of a scene); this notes file.
  - **portrait phones get a tall world**: before W/H are read, if `.canvas-wrap` is <700 wide and taller than wide, the canvas becomes 400 × (fits the wrap, 300–900) — no more letterboxed strip. W/H are consts after that, all code uses them.
  - tips line fades 1.5 s after your first stroke.
  - **water really puts fire out now** (the tip always claimed it): water touching fire turns those flames into steam or nothing and boils off itself 35% of the time; before, the water just vanished into steam and the fire kept going. Water reactions (lava → stone, fire) now run BEFORE movement and `continue` — they used to run after a swap on stale neighbour values, so they could hit the wrong cell.
  - Headless probe: 10 checks (fire ≤1 cell/frame, bottom-row water spreads, solid brush, 140k-grain frame ~20–28 ms in headless CPU, fall acceleration, landing, levelling, no errors).

- 2026-09-26: **Seeds** (Fela asked for Sand Sandbox love): SEED falls like sand and sinks through water; once wet (water above/left/right) and resting on something that isn't another seed, 2%/frame it becomes a SPROUT with `life` 30–99 (new `life` Uint8Array, not moved by swap — sprouts never swap). The sprout tip climbs 15%/frame through air or water (70% straight up), leaves PLANT behind plus a 2–4-cell leaf now and then; blocked tips lose 8 life per try; at life 0 `bloom()` paints a round FLOWER (radius 2–4, yellow middle = colorVar 1, petals one of pink/violet/coral — colorVar is set explicitly, not random). Fire burns seeds/sprouts/flowers like plant. Seeds brush at 3% density so they sprinkle. Key S. Material ids now fill the 16-slot LUT (0–15) — a 17th material needs `new Uint32Array(32 * 4)`.

## issues
- Grid is 800×500 at 1 cell per canvas pixel; big scenes cost ~20+ ms/frame on slow CPUs. If phones struggle, halve the grid (400×250 at 2px cells) — all physics is resolution-agnostic.
- The old "Gravity: ON/OFF" toggle always paused the whole simulation; since 2026-09-26 it is labelled ⏸ Pause / ▶ Play (P or G), the variable is still `gravity`.
- Tall water columns still take a few seconds to level (only surface/edge cells can move sideways).

## todos
- Ideas: save/share a scene, more materials (sponge, electricity), wind, pause/step, bigger cells option on phones.
