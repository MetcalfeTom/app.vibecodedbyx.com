# physics-ui

## log
- 2026-05-07: shipped — every visible UI element is a Matter.js rigid body. Single full-window canvas, custom render so each body looks like a real UI piece (window frames, sliders with tick marks, pill-shaped toggles, round buttons).
  - **Engine**: Matter.js 0.20 from jsdelivr. World gravity starts at 0.6, walls on all four edges, MouseConstraint for dragging. Per-frame `Engine.update` driven by rAF, custom canvas render swapping out Matter's built-in renderer entirely.
  - **Body kinds + per-kind renderer**:
    - `window` — chamfered rect with a colored title bar, three close-dots, three faux body lines. Three windows by default (SETTINGS / TOOLS / ABOUT).
    - `slider-track` — thin static pill with tick marks every 1/6 + a label below.
    - `slider-knob` — circle with tactile dots; an `afterUpdate` listener locks its X to the parent track's X and clamps Y to the track's range so it can only slide vertically. Live value tag below the knob in IBM Plex Mono.
    - `button` — circle with inner ring + glyph; brief press scale on tap (`pressedT`).
    - `toggle` — pill with a sliding white knob disc + label flipped per state.
    - `letter` — small chamfered square holding a single character. Boots spelling `PHYSICS UI` across the top.
    - `confetti` — thin rect with rotation-modulated width; `life` countdown removes after 8s.
  - **Custom click-vs-drag detection**: track `mouseDownBody` + position; if `mouseup` happens within 220ms and 8px, treat as a tap and fire the body's `onTap` (buttons) or flip its `state` (toggles). Otherwise MouseConstraint handled it as a drag. Cursor swaps to `grabbing` while held.
  - **Slider value plumbing**: `sliderValueOf(knob)` computes 0..1 from clamped Y position then maps to the slider's range. `onChange` callbacks rewire to live engine state — gravity slider directly mutates `engine.gravity.y`.
  - **Audio (Web Audio synth)**: bonk on each meaningful collision (`Events.collisionStart`, intensity from relative velocity), short square-wave click on tap, two-note snap on toggle, ascending-triangle pop on confetti spawn. Audio off until the user flips the SOUND toggle.
  - **Walls**: 4 invisible static rectangles. Walls toggle (later tier) flips their `isStatic` so everything drifts past the edges into space.
  - **Aesthetic**: paper bg `#f3ede0` with 11° fiber-grain noise, ink `#1a1a1c`, mint/coral/sky/lavender/gold/rose/sage palette. IBM Plex Mono for chrome, IBM Plex Sans for body, Cormorant Garamond italic for the bottom hint. Theme toggle button (☾) flips the body to a `dark` variant.
- 2026-05-07: chat ask — "make the control UI a physical object that can be upgraded or swapped in the simulation."
  - Added a draggable **Control Module** body (`kind: 'control-module'`) — a 230×64 chamfered panel with a colored tier-stripe down its left edge, a `TIER · BASIC` label, 4 progress pips, and an UPGRADE button on its right side.
  - **Tap detection on the upgrade region** is hit-tested in body-local space (so the module can be rotated and the click target rotates with it). Outside the upgrade region, the module just drags like any other element.
  - **4 tiers cycle** on each tap, each one physically dispensing new control bodies into the world above the module:
    - **BASIC** — initial state, only the gravity slider exists.
    - **TUNER** — adds a bounce slider (mutates restitution across all dynamic bodies on change).
    - **CHAOS** — adds a `time` slider (mutates `engine.timing.timeScale` 0.2–1.6) plus a `wall ⤴` toggle that flips the world's edge walls between solid and pass-through.
    - **MAX** — fires a confetti burst and spawns a gold ★ button at the top that rains gold-letter ★s.
  - **Wrap-around RESET**: tapping UPGRADE on MAX cycles back to BASIC and triggers `cycleToBasic()` — every spawned control gets re-tagged as `debris` (dim grey rounded rect with an `×`), keeps its physics body, gets a velocity kick, and falls to the floor as visible junk. The original three windows + the module survive. Then a fresh gravity slider drops in so the module always has at least its baseline knob.
  - Module color stripe + UPGRADE button label change with tier. Pulse animation on the button briefly inflates it on each upgrade. Snap + click sounds on every press.
  - Bottom hint copy now reads "drag a window · tap a button · push a slider · upgrade the module to dispense more controls."

## issues
- Slider knobs are constrained to their tracks via per-frame `Body.setPosition`. That's stable but bypasses the constraint solver — knobs feel slightly stickier than purely-physics-driven ones. A real distance constraint with a slot direction would be smoother but harder to tune.
- The Control Module's UPGRADE region is a flat rect hit-test in local space; rotating the module to ~90° makes the click target a tall thin strip, which can be surprising. A circular sub-region would be more forgiving.
- Confetti bodies pile up near the floor; cleanup is purely time-based (8s). Could add a density-aware cull when overall body count exceeds N.
- Light/dark theme swap isn't live-redrawn on the bg until the next clear, so the very first frame after toggling can have a stale tint for ~16ms.

## todos
- A "scrap → recycle" mechanic where dragging debris into a static "trash bin" body removes it from the world.
- Snap-to-rack constraints so dispensed sliders dock inside the Control Module's bounding box, then come along when you drag the module.
- Saved layouts: serialise body positions/types into localStorage so reloads keep the room arranged.
- A second "MODULE-B" panel of a different shape (round dial?) with completely different upgrade tree (visual-only effects: trail length, blur, vignette).
- Multiplayer drag — a remote pointer constraint synced via Supabase realtime so two browsers tug the same windows.
