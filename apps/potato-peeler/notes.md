# potato-peeler (Spud — A Peeling Simulator)

## log
- 2026-06-26: shipped (chat ask: "potato peeling game with a drag-to-peel mechanic, one continuous spiral breaks the peel, and a potato that grunts if you slice too deep"). Self-contained canvas game, zero deps.
  - **Geometry**: lumpy potato = ellipse (rx,ry) modulated by `lump(θ)=1+Σ sin(kθ+phase)` (3 randomized phases per game → a new potato each round). `inPotato(x,y)` tests normalized radius vs `lump(atan2)`.
  - **Layers** (offscreen canvases): `flesh` (revealed cream gradient + speckles + 5 potato "eyes"), `peel` (brown skin gradient + grit, clipped to potato), `gouge` (red gashes from over-slicing). Composited each frame: shadow → flesh → gouge → peel → rim → face.
  - **Drag-to-peel**: pointerdown starts a strip; pointermove erases the `peel` canvas under a BRUSH=15 circle (`destination-out`) revealing flesh. A coarse `peeledGrid` (CELL=9) counts newly-peeled in-potato cells → drives `% peeled` + strip length. `samplePeel()` reads 1px alpha of the peel canvas to know if there's skin under the cursor.
  - **One continuous spiral**: while peeling skin, `curLen` accumulates and a brown ribbon trails the peeler. Strip BREAKS (ribbon detaches + falls, `best=max(best,curLen)`) on: pointerup (lift), dragging over already-bare flesh / off-potato past `BREAK_GAP=30px`, or a grunt. "Longest spiral" is the headline score.
  - **Grunt on too-deep**: pointer `speed=dist/dt`; if `speed>DEEP(1.25 px/ms)` while cutting skin (debounced 450ms) → `grunt()`: grunts counter++, screen shake, red gouge stroke on the gouge layer, synth "ungh" (sawtooth 165→72Hz through bandpass + noise grit), Caveat speech bubble ("OW!/GRR!/OUCH!/EASY!/nnghh"), face winces (X eyes + open mouth for 420ms), and the strip snaps.
  - **Win** at 85% peeled → overlay with longest spiral (cm = px/12), % , grunts; "Flawless peel!" if 0 grunts. "Peel another" rebuilds a fresh potato.
  - **Audio**: one AudioContext (unlocked on Start/ first pointerdown). Continuous scrape = looping noise → bandpass → gain, gain+freq ramped by drag speed. Grunt + win synths. ♪ mute toggle.
  - **Peeler cursor**: Y-peeler drawn at pointer (blade + green handle), rotates to drag direction, `cursor:none` on canvas.
  - **Aesthetic**: cozy cutting-board — warm wood gradient + grain curves + bowl shadow. Fraunces italic title ("Spud."), Caveat handwritten grunt bubbles, Space Mono HUD. Cream stat cards w/ hard offset shadows, green peeled-progress bar.
  - **WCAG**: canvas role=application + full control-summary aria-label, semantic header, overlays with buttons, focus-visible gold rings, aria-pressed mute, rem units, prefers-reduced-motion disables screen shake. 720×540 internal res, CSS-scaled (aspect-ratio 4/3) → crisp + responsive without resize-reset complexity.
  - Verified: inline script syntax OK; mechanics (brushAt/breakStrip/grunt/samplePeel/WIN_PCT) all present.

## issues
- `samplePeel` uses `getImageData(1×1)` per pointermove — cheap, and the peel canvas is untainted (gradients/arcs only), but it's a per-move readback; fine on desktop/mobile, revisit if profiling shows jank.
- `ctx.roundRect` used for the peeler/handle — supported in all modern browsers (Chrome 99+/Safari 16+/FF112+); ancient browsers would throw on the peeler draw only.
- Depth is modeled purely by drag SPEED (no real pressure input) — fast = deep. Reads well but is an abstraction.
- Win threshold 85% because the last few % near lumps/edges get fiddly; intentional.

## todos
- Combo/΂streak flair for very long unbroken spirals (sparkles, length milestones).
- A "perfect peel" bonus if you finish with one single strip.
- Difficulty: thinner peel margin / lower DEEP threshold / "nervous potato" that grunts easier.
- Optional knife mode (chop) after peeling; plate presentation screen.
- Persist best longest-spiral to localStorage.
