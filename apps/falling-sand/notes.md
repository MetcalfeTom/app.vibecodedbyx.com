# falling-sand · notes

## log
- 2026-05-16: v1 — **falling-sand cellular automaton with sand, water, lava, acid, oil, stone, wood, leaves, fire, steam, and plantable trees** per stacked chat asks: "build a falling sand game with lava, water, and trees" + amendment "include acid and oil in the falling sand game, and make sure the oil is highly flammable for extra chaos." Both addressed in the v1 ship.
  - **Engine**: pure canvas 2D, no libraries. Grid of `W × H` cells on a `Uint8Array` (≈200×130 at 5px CELL on a 1080p viewport). Auxiliary `Uint8Array` per cell tracks ages (fire lifetime, steam dissipation). `buoy` flag prevents a cell from being processed twice per frame after a swap/move.
  - **Render**: pixel-perfect via a small offscreen canvas (W×H) that's drawn scaled-up with `imageSmoothing: false` for that crisp chunky-pixel look. Each frame writes RGB bytes directly to the `ImageData` buffer — ~26k cells per frame at <2ms on desktop.
  - **11 materials**: EMPTY · SAND · WATER · LAVA · WOOD · LEAVES · FIRE · STEAM · STONE · **ACID** · **OIL**. Each has bespoke physics + render colour (with subtle per-pixel variation for grain — sand has tan flecks, water flickers blue, lava pulses orange, acid bubbles green).
  - **Physics**:
    - **Sand** falls + slides on diagonal. Sinks through water and oil.
    - **Water** falls + flows; spreads 3 cells laterally per step (further than oil/acid). Adjacent to lava → both become STEAM + STONE. Sits below oil (oil floats).
    - **Oil** (NEW): falls + flows slower than water; **floats on water** (swaps places with water beneath); **highly flammable** — adjacent fire/lava ignites it INSTANTLY (no probability roll); burns longer than wood.
    - **Acid** (NEW): falls + flows like water (slower lateral); dissolves adjacent **sand / wood / leaves** at ~18% per neighbour per step (and consumes itself 50% of the time when dissolving); dissolves **stone** at 2.5% (slow but possible); acid + lava → STEAM + STONE (caustic encounter).
    - **Lava** falls slowly (random 42% step skip); ignites adjacent wood (10%) / leaves (30%) / oil (100% instant).
    - **Fire** ages over ~28 frames then expires; spreads to wood (7%) / leaves (22%) / oil (85% — chain reaction!); adjacent water extinguishes to STEAM; emits occasional smoke (steam) upward.
    - **Steam** rises and wanders sideways; dissipates after ~80 frames, with a 7% chance to condense back to WATER (so a kettle boils away to nothing usually, but occasionally rains).
    - **Leaves** are static unless unsupported (no wood/leaves/stone adjacent) — then drift downward; burn very fast.
    - **Wood** and **stone** are static (don't fall). Stone forms the walls (grid edges return STONE so cells don't escape).
  - **Tree planting** is a special brush mode: each pointer-down on a "Tree" brush selection drops a hand-shaped tree — 6-tall trunk with a few branch wobble cells, plus an elliptical leaf canopy at the top. Trees burn satisfyingly once a spark lands.
  - **Brush + UI**:
    - Bottom-centre glassmorphic toolbar
    - 10 material buttons with `--mat-bg` colour swatches and the material name overlaid in tiny caps
    - 4 brush sizes (1 / 3 / 5 / 9)
    - Pause / Clear action buttons
    - Keyboard: `1-9, 0` selects material (matching the toolbar order); `[ ]` shrinks / grows brush; `Space` pauses
  - **Painting**: click + drag paints with the current material; line interpolation between samples so fast drags fill cleanly. Right-click erases. Tree is single-click only (no continuous spawn). "Spark" brush ignites only flammable cells (wood/leaves/oil) and lights a small radius — with a small chance to spawn fire in empty cells too for that "lit match" feel.
  - **Initial terrain** on load: wavy sand ground line two-thirds down (10-12 deep, then stone bedrock below), two stone outcrops, and two planted trees. Reseeded on window resize.
  - **Status pill** top-right: live `cells: N` (non-empty count) + `fps: NN`.
  - **Hint pill** top-left fades after first interaction.
  - **Audio (synth)**: tiny sawtooth `whoosh` on spark, triangle+sine `bloop` on tree planting, low sine `thunk` on clear. Audio resume on first pointerdown.
  - **Mobile**: pointer events with `touch-action: none`. Toolbar wraps and shrinks at 640px.
  - **OG image**: Pollinations flux seed 4747.

## issues
- Inter-material interactions are pairwise — no temperature field. Lava → wood ignites directly via "rolls" rather than a real heat propagation, which is fine for the satirical sandbox but feels arbitrary at edge cases.
- Acid doesn't dissolve OIL (intentional — they'd both be liquids and it'd cancel out too quickly). Could add a low-probability oil dissolve rule.
- Steam-to-water condensation is rare (7%) so most fire+water encounters end in tiny steam puffs that just vanish — accurate-ish but you don't see clouds drift across the screen. A future "humidity" tracker could make rain spawn.
- At 200×130 grid, dense fire/oil scenes can dip below 60 FPS on lower-end mobile. Could batch the render loop or reduce grid resolution.
- Resize discards current state and reseeds — a save-state would be nice.

## todos
- Plant variations: pine (taller, conical) / mushroom (short with cap) / cactus (vertical with sand requirement).
- Glass (sand + lava high-temp) and obsidian (lava + water specific spots).
- Wind slider that adds horizontal force to all fluids.
- Rain / snowfall toggle that drops water/snow from the top edge.
- Save current grid to localStorage + a "snapshot to PNG" button.
- Sandbox presets: "lava world", "flood", "forest fire", "acid pit".
- A small "burning intensity" meter or fire count display.
- A 2-finger pinch on mobile to change brush size.
