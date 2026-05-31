# pixel-swamp · notes

## log
- 2026-05-20: v1 — **pixel art digital swamp with a snappy half-submerged alligator that snaps at flying insects**, per chat ask "create a pixel art digital swamp with a snappy alligator". Single-file ~22KB, Canvas2D at 320×180 internal resolution scaled up via `image-rendering: pixelated`, zero deps.
  - **Scene** · 16:9 canvas framed in a chunky brown bezel. Background painted once to an offscreen canvas and blitted each frame (skylight gradient + sun/moon + mist band + 7 cypress trees in silhouette + hanging Spanish moss + water gradient + bank silhouettes + 5 cypress knees + 7 cattails + 4 lily pads with two flowers + horizontal water highlights).
  - **The alligator** · ~50px wide pixel-art entity with: 6 dorsal back-ridge bumps trailing as the tail, 4 mid-spine ridge segments, a 22px-long snout with rendered top + bottom jaws, 2 nostril dots, 6 alternating top teeth, 2 raised eye bumps with yellow sclera + black slit pupils that **track the cursor** (deterministic slit aim via normalized cursor vector). Faces left or right based on cursor x.
  - **Snap mechanic** · click anywhere or press <kbd>Space</kbd> to snap jaws. Snap animation lerps `jaw` from 0→1 over ~200ms then back to 0 (220ms hold), revealing dark-red mouth interior + bottom teeth + bottom jaw silhouette. 320ms cooldown prevents spam. While snapping, a 12u-radius hit zone around the snout tip checks for live insects.
  - **Insects** · two species: 🦋 **dragonflies** (cyan body + flapping wings, 70% spawn weight) and **mosquitoes** (small brown speck + tiny pulsing wings, 30%). Spawn from off-screen left or right at 0.35-0.8 px/frame horizontal velocity. Wander vertically by retargeting Y every 0.7-2.1s, with 45% chance to dip toward the gator (y≈90-102, in snap range). Max 5 alive at once. Despawn off-screen.
  - **Combo** · catching a fly within 1.4s of the last catch increments combo to ×2/×3/.../×8 cap; the displayed `+N` floats up red at ×3+. Missed snap (no fly caught) gently decrements combo by 1. Combo decays back to ×1 after 1.4s of no catches.
  - **Score persistence** · best-ever fed count to `localStorage['pixel-swamp-best']`. HUD shows live fed / combo / best.
  - **Fireflies** · 18 wandering yellow dots with sin-wave pulse alpha. Much dimmer in day mode (×0.25 alpha) vs night mode (full glow). Bound to 30-95y range so they hover near the trees, not in water.
  - **Day / Night toggle** · click 🌙 button or press `N`. Repaints the background bitmap with night palette (deep indigo sky, crescent moon + 50 stars vs sun, cooler mist, accent-blue tree highlights). Fireflies become the visual centerpiece.
  - **Ripples** · click in the water (y > 95) spawns an elliptical ripple that expands and fades over 1.2s. Snap also drops a small ripple at the snout tip. 0.4 aspect ratio so they look like horizontal water rings, not circles.
  - **Particles** · 6 wing-colored sparks + 4 mouth-red sparks burst on each successful catch, with gravity. Float-text "+N" rises above the kill spot for 1.2s (red at ×3+).
  - **Pixel rendering** · all geometry drawn at the canvas's internal 320×180 grid via `fillRect(x|0, y|0, w, h)` (integer-snapped). CSS `image-rendering: pixelated` scales the canvas to fit while preserving crisp blockiness up to ~960×540. HiDPI not used (intentionally low-res). Background's `mix()` helper interpolates between two hex colors so the sky gradient looks smooth despite being 80 horizontal 1px strips.
  - **Audio** · none yet (chat can ask for chomp/croak/dragonfly buzz).
  - **HUD** · top bar with Press Start 2P "PIXEL SWAMP" title in moss-green with amber emphasis. Live stats top-right (fed / combo / best). Bottom hint with night toggle + kbd-styled key reference. VT323 + Silkscreen + Press Start 2P trio.
  - **WCAG basics** · canvas `aria-label`, focus-visible on buttons, prefers-reduced-motion shortens the floating-text animation, all interactive targets ≥36px.
  - **OG image** · Pollinations flux seed 2424, "Pixel art swamp at dusk, half-submerged alligator with glowing yellow eyes, cypress trees, fireflies, lily pads, deep greens and violets, low-fi 32-bit palette". No `referrer` param per project notes.

## issues
- The eye-pupil tracking uses a 1-pixel offset because the eye is 2×1px; on extreme cursor angles the pupil pixel can land on the very edge, which can look slightly off. Acceptable for the resolution.
- Jaw open animation rotates the jaws via integer y-offsets along the snout — the top + bottom triangulate smoothly enough, but the very far snout-tip pixels can briefly disconnect at peak open. A 1-frame artifact at best.
- Insects can occasionally fly THROUGH a closed gator without triggering anything (correct — the gator isn't auto-snapping). If chat wants an auto-snap mode, add a check in `updateInsects` that calls `snap()` when an insect enters the zone.
- Sun/moon are at fixed positions (top-right corner of the canvas); no time-of-day animation.
- No frog sprites yet — lily pads are decorative.
- Background is paint-once; if chat wants animated wind / drifting clouds it'd need to move to per-frame painting.

## todos
- 🐸 Add a frog sprite on one lily pad that ribbits and jumps occasionally.
- 🥁 Chomp / splash / dragonfly-buzz / firefly-chime sound effects via Web Audio.
- 🪨 Click on a tree → owl flies out.
- 🐍 Snake mode: rare red water snake swims past, worth ×5 if eaten.
- 🐊 Second alligator that competes for flies in a versus mode.
- Twitch chat → "throw a fly": chatters' messages spawn an insect with their name as a tooltip.
- "Fed" milestone unlocks: after 25 catches, a heron lands on a bank. After 50, a dragonfly swarm.
- Subtle clouds drifting across the sky band.
- Wind ripples in the water (sin-wave shimmer) instead of just click ripples.

## design notes
- Per the windows-11-recall-nightmare debugging session, NO CSS `transform-box: fill-box` is used. All animation here is canvas-driven (per-frame redraw), avoiding SVG bbox quirks entirely.
- The alligator is drawn procedurally with fillRect calls per body part rather than a stored sprite — this lets the jaw open by parametrically tilting the per-x-column y-offset, which would be a pain with a fixed bitmap.
- Picked a 7-tree cypress silhouette because: 3 felt sparse, 5 was OK, 7 fills the horizon without feeling crowded at this resolution.
- Combo system gives a satisfying ramp without making single-catch play feel pointless. The decay-on-miss is small enough (-1) to not punish exploration.
