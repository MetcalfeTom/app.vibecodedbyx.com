# mandelbulb-explorer

## log
- 2026-05-02: Created. **Real-time GLSL distance-field ray-march of the Mandelbulb fractal in Three.js.** Single-file via importmap (three@0.160). **Pipeline**: a fullscreen quad (`PlaneGeometry(2,2)` + ortho camera at 0..1) renders a `ShaderMaterial` whose fragment shader does ALL the work. Vertex shader is a one-liner pass-through. **Camera in JS, ray construction in GLSL**: orbit camera state {theta, phi, radius} kept in JS, recomputed each frame to a `uCamPos` Vec3 uniform. Inside the shader, NDC + a hand-built right/up basis (forward × Y) constructs `rd` per pixel — no Three.js camera matrices touching the fractal pass. **Mandelbulb DE**: standard spherical-coords formula iterating `z = z^P + c` with `dr` accumulator; returns `0.5 * log(r) * r / dr` as the smooth approximate distance. Loop bounded at 20 iterations max with `if (i >= uIters) break` so the slider can drop precision for performance. **Ray march**: 200-step cap with `if (i >= uMaxSteps) break`, `t < 8.0` far plane, `d < 0.0006` hit threshold. **Shading**: surface normal via 4-tap finite-difference gradient of the DE; Lambertian against a fixed (0.6, 0.8, 0.5) light dir; **soft shadow** via secondary 32-step march toward the light (`min(res, k*d/t)` accumulator); rim light from `pow(1 - n·-rd, 2.5)`. **Color**: `orbitTrap` (closest approach to origin during iteration) + step-count mixed into a 0..1 scalar that samples one of 4 palettes — PLASMA (pink → violet → cyan), TOXIC (green → yellow → magenta), FROST (deep blue → ice → white), EMBER (black → red → gold → white). Each palette is a 4-stop interpolation. **Background**: deep-violet gradient + pseudorandom-hash star sparkles. **Fog**: `1 - exp(-t * 0.2)` mixes 55% toward bg color over depth. **Vignette**: smoothstep on distance from screen center darkens edges to 50%. **Controls**: drag canvas to orbit (theta/phi update; phi clamped ±1.4 rad), wheel to zoom radius (clamped 1.4..6.0), auto-rotate at 0.18 rad/s on by default until first user input. **HUD**: glassy panel with Power slider (2..12, default 8 — the canonical Mandelbulb power), Iterations (3..16, default 10 — quality vs speed), Detail (40..160 max steps), Palette toggle, live FPS readout. Major Mono Display title with chromatic-split text-shadow. Pollinations OG, 🌀 favicon.

## issues
- Soft-shadow secondary march costs a LOT — frame rate drops sharply on integrated GPUs at high iteration counts. The 32-step cap is the primary perf knob.
- High Power values (10+) produce visually wild lobes but the DE diverges faster, so far cells get under-sampled and you see banding. Acceptable artifact of the fractal.
- Mobile devices may stall on the first compile of the fragment shader — there's no spinner. Could add a "compiling shader…" overlay.
- No anti-aliasing — single sample per pixel. A 2x2 supersample would help but tank FPS.
- The orbit math doesn't handle continuous-360-pitch flips smoothly — phi clamp prevents inversion.

## todos
- AA via temporal jitter (subpixel jitter per frame + accumulate over N frames when not interacting).
- Save/share view URL with cam state encoded.
- Touch zoom via two-finger pinch.
- Render to PNG button.
- Animate power over time (breathe between 4 and 9).
- Add Mandelbox / Sierpinski / Menger options as alternative DEs.
