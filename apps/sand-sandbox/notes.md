# Sand Sandbox — notes

## log
- 2026-09-27: **🔗 Share**: saves the grid (deflate-raw via CompressionStream, base64) to supabase `sand_scenes` (id bigserial, w, h, cells, data text, user_id; default RLS: read all, insert own) and copies `?s=<id>`. Opening `?s=<id>` loads it: scaled down to fit (never up), centred, standing on the floor; cell values above BATTERY are dropped. Limits: ≥50 cells, data ≤400k chars, 30 shares a day per browser (localStorage `sandShares`), same scene twice reuses the link. A typical scene is ~2-3 KB. Probed with an in-memory fake db: save → reopen gives the identical grid, phone opening a desktop scene scales it to 400 wide.
- 2026-09-27: **electricity**: METAL (16, solid, key M), BATTERY (17, solid, key B) and a SPARK tool (18, never stored in the grid, key Z).
  - A pulse runs through metal (4 cells a frame) and water (1 a frame, diagonals every other frame so the front spreads in octagon rings). `zap` = flash brightness (×0.7 a frame), `cool` = 16 frames before a cell can carry current again, so pulses never run backwards. `heads` = the front, `lit` = cells still fading; electricity() runs after updatePhysics only when either is non-empty.
  - Batteries jolt their neighbours every 45 physics frames. Current touching gunpowder or oil sets it alight, plants/seeds 30%, wood 4%, ice melts 5%. Acid eats metal and batteries like anything else.
  - Render: zap blends a cell toward #bef5ff; bright cells feed a `volt` glow map that mixes into the fire glow (orange ↔ electric blue). Clear (button or C) also clears the current.
  - Headless probe: wire pulse reached 650 cells away and set off a gunpowder pile, a pool lit in rings, spark tool charged 192 cells, 42-58 fps, 0 errors at 1400x900 and 390x844.
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
- 2026-09-26: phones — the picked material shows its name (labels are hidden under 768px, so the swatches were anonymous); tip says "Drag to draw". Finger drawing verified with synthetic touches (776 cells from one stroke).
- 2026-09-27: glow-up (subagent), all probed headless before/after:
  - **Ctrl/Cmd+C wiped the whole scene** (the `c` shortcut ignored modifiers; Ctrl+P also toggled pause, Ctrl+S picked seeds). The keydown handler now skips ctrl/meta/alt and key repeats, and matches case-insensitively. Probe: 4040 → 0 cells before, 7531 → 7531 after.
  - **hold to pour**: holding the mouse/finger still used to do nothing after the first sprinkle (46 → 46 cells in 2 s). `pour()` runs each frame while drawing and playing: loose materials fill EMPTY cells under the brush at 12% (seeds 1%), the eraser keeps erasing, solid brushes skip (re-drawing them every frame would flicker colorVar). 62 → 597 cells in 2 s headless.
  - **strokes no longer die at the canvas edge**: mousemove/mouseup are now on `window` (mouseleave used to end the stroke), so dragging along a wall paints right up to it (+0 → +970 edge cells). Right-clicks don't start strokes, a move with no button held ends one, and `blur`/`touchcancel` end it too, so a stuck stroke can't pour forever.
  - look/a11y: faint sandy 1px ring around the canvas (it was #0a0a0a on #0d0d0d, invisible) plus a soft warm glow behind it; `:focus-visible` rings on buttons and the slider (the slider had `outline: none`); press-scale on buttons; swatches get `aria-label` + a `title` with their key and `aria-pressed` (on phones they were unnamed dots); canvas `role="img"` + label; `Particles: N` no longer wraps on phones; `user-select: none` so strokes don't select text.

## issues
- Grid is 800×500 at 1 cell per canvas pixel; big scenes cost ~20+ ms/frame on slow CPUs. If phones struggle, halve the grid (400×250 at 2px cells) — all physics is resolution-agnostic.
- The old "Gravity: ON/OFF" toggle always paused the whole simulation; since 2026-09-26 it is labelled ⏸ Pause / ▶ Play (P or G), the variable is still `gravity`.
- Tall water columns still take a few seconds to level (only surface/edge cells can move sideways).

## todos
- Ideas: a gallery of shared scenes (sand_scenes is readable), more materials (sponge; electricity done), wind, pause/step, bigger cells option on phones.
