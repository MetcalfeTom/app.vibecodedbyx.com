# bee-smiles · notes

## log
- 2026-05-16: v1 — **pastel sky of floating bees in top hats and monocles that grin when clicked** per stacked chat asks: "create a web app called bee-smiles with floating bees that have happy faces when clicked" + amendment "add tiny top hats and monocles to the bees in the bee-smiles app." Both baked in for v1.
  - **Scene**: sky-blue gradient background with **7 drifting puffy clouds** (CSS `@keyframes drift` over 40-120s each with randomised delays for parallax), a soft green ground strip across the bottom with a fluffy grass-tuft border, and **6-8 pixel flowers** spaced along the ground in 6 different petal colours (pink, red, purple, yellow, magenta, blue).
  - **Bees** are full inline SVG (92×64 viewBox). Each bee has:
    - **Antennae**: 2 curved black paths from the head with little dot tips
    - **Body**: large yellow `#ffd442` oval with `#3a2008` stroke + 3 vertical black stripes (ellipses) + a black stinger triangle on the right
    - **Head**: separate yellow circle on the left, slightly overlapping the body
    - **Tiny top hat**: black brim ellipse + black rectangle crown + coloured hat band (randomised per bee from 6 options: maroon / navy / purple / forest / brown / black) + a faint white sheen on top
    - **Monocle**: gold `#c89020` 5-radius ring around the right eye + faint glass tint + a tiny diagonal glint + a dashed chain looping down-and-right toward the body
    - **Face**: 2 black eye dots with white pinprick shines, pink blush cheek ellipses, a neutral straight mouth that swaps to a smile path via `.smiling` class toggle
    - **Wings**: 2 translucent blue-tinted ellipses (back wing + front wing) flutter via CSS keyframes scaling Y between 1.0 and 0.32 every 0.10s (front + back staggered by 0.04s for the iridescent feel)
    - Drop-shadow on the whole bee, brightens with a yellow-tinted glow on `:hover` or `.smiling`
  - **Floating motion**: each bee has random `freq`, `phase`, `ampX`, `ampY`, `rotAmp`. `requestAnimationFrame` loop updates `transform: translate() rotate()` from `Math.sin(t * freq + phase)` so each bee drifts on its own gentle figure-8 + slight body tilt that matches the direction of motion.
  - **Click any bee** → `.smiling` class added for 3.2s:
    - mouth swaps to the curved smile
    - body wiggles via a 0.42s keyframe (rotate -6° → +6°)
    - 6 sparkle glyphs (`✨ ♥ 💛 🌼 😊 🍯`) spawn at the cursor and float upward in randomised arcs (~60-110px) over 1.3s with scale + fade
    - 3-note bright triangle/sine arpeggio plays (660 → 880 → 1175 Hz)
    - smile counter increments
  - **HUD**: top-right white-pill smile counter with the bee number in tabular tan `#c89020`. Top-left hint pill (cream tab) reminds you to click bees.
  - **Controls (bottom-centre)**: cream pill with chunky honey-yellow buttons:
    - **+ More bees** — spawns 3 more, plays a short sawtooth `bzzz` with 22Hz vibrato
    - **😊 Smile, all of you** — cascades a smile + sparkle through every bee in 60ms stepped intervals, plays up to 8 chimes in sequence, and bumps the counter by the live bee count
    - **🔇/🔊** mute toggle for the synth sounds
  - **Easter egg**: clicking any empty patch of sky (not on a bee or UI element) spawns a new bee at the cursor with a small bzz. Capped at 30 bees so the screen never gets overwhelmed.
  - **Mobile**: bees shrink to 76×54 below 600px, controls wrap, hint text shrinks. Pointer events work for touch.
  - **OG image**: Pollinations flux seed 8989.

## issues
- Each bee carries a fairly heavy SVG — at 30+ bees with constant transform updates and 0.10s wing keyframes, the GPU paint cost climbs on low-end mobile. Could be canvas-ified for performance but loses the per-bee CSS expression.
- The wing flutter timing is identical across all bees — could vary the duration per bee for more organic feel.
- Top hat is rectangular — a slightly tapered crown would be more period-accurate (turn the rect into a polygon).
- Monocle is always on the RIGHT eye — could randomise left/right per bee.
- Click-target is the bee's bounding box, not the actual silhouette — clicking the wings counts. Probably fine.

## todos
- Different bee variants (queen with a tiny crown, worker with a clipboard, drone with sunglasses).
- A "bee parade" mode where all bees line up and march across the screen.
- A daily petting record persisted in localStorage.
- Click-and-hold to "stroke" a bee — sustained smile + heart trail.
- A subtle bee song that builds intensity with smile count.
- A net cursor that catches a bee, holds it for 2s, then releases it grinning.
- "Show your hat" toggle — bees politely tip their top hats every 8s.
