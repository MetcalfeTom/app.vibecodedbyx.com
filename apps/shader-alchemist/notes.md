# shader-alchemist · notes

## log
- 2026-07-11: v1 (chat ask, after feasibility Q&A chose splat mode: image → pure-math WebGL shader). **Fitter (pure, node-tested)**: `makeFitter(targetF32rgb,w,h,rand)` — base = image mean; greedy loop per splat: seed at max-|residual| pixel w/ residual color ×0.9, coarse-to-fine size (30%→3.5% of max dim by index), 64-iter hill-climb (1-of-4 mutation: pos/scale/angle/color, temperature decay, loss evaluated over splat bbox only, stride-2 sampling for big boxes), apply into running buffer (bbox-clipped, g<.004 cutoff). Splats are SIGNED rgb deltas (negative lobes darken) around the mean — key to fitting dark regions additively. Synthetic 48×48 test: 18.1→41.3 dB with 80 splats. **GLSL export** `genGLSL`: Shadertoy-flavor, GLSL ES 3.0 array constructors (`const vec4 P[N]=vec4[N](…)`), P=(pos px, scale px) + C=(rgb, angle), **works in fit-grid PIXEL space** (`p=uv*GRID`) so rotated anisotropic splats match the fitter exactly on any aspect — caught & fixed 2 bugs pre-ship: mat2 column-major arg order rotated the wrong way (now explicit vec2 rotation), and per-axis normalization distorted rotations on non-square images. Emitted-constant rounding (4 decimals) verified ≤0.00015 abs err vs exact math. **Preview honesty**: while fitting, canvas shows CPU buffer (2d ctx); on finish the canvas is SWAPPED (cloneNode — a canvas that has had a 2d ctx can't become webgl2) and the actual exported code is compiled in WebGL2 with injected `uCount` break for the ▶ replay build-up animation (quadratic ease 2.6s, reduced-motion jumps to full). Compile errors surface in status. **UI**: upload/drop/demo (pollinations cat, cached), splat slider 60–400 (default 220), live psnr/time/progress, copy GLSL + download .frag. Eczar + IBM Plex Mono, alchemist plum/gold. Pollinations OG (flux seed 6633). Hook `__alchemy {makeFitter, genGLSL, psnr}`.

## issues
- Working res is 96px max dim — bigger fits are CPU-time, not quality-limited; raise WORK + chunk size together if chat wants HD fits.
- 400 splats ≈ 800 const vec4s — some mobile GLSL compilers get slow; if reports come in, emit uniforms + data texture instead.
- The canvas swap on beginFit is load-bearing (2d→webgl2 context switch impossible on one canvas). Don't "simplify" it away.

## todos
- Similarity score (SSIM) next to PSNR.
- "Export as PNG render" straight from the GL canvas.
- Optional refine pass (re-optimize worst 10% splats after full pass).
