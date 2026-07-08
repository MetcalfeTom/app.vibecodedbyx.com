# Point Nebula — notes

## log
- 2026-07-08: v1 — WebGL2 point-cloud viewer (chat ask: millions of colored points, GPU technique, rotate/zoom). **Renderer**: raw WebGL2, no libs — gl.POINTS, ONE draw call, three GPU-resident VBOs (posA vec3f, posB vec3f, color as normalized Uint8 RGB); the shape MORPH runs entirely in the vertex shader (`mix(posA, posB, uT)` w/ eased uT) — the canonical fastest path for point clouds (instancing adds nothing for POINTS; noted here since chat asked "instancing or transform feedback": geometry never leaves the GPU after upload). Point size = clamp(k/w) perspective attenuation. Depth on, DPR-capped-2 canvas. **Shapes** (5, cycle via MORPH button): 3-arm galaxy (sqrt-radius spiral + thin disc), sphere shell, (2,3) torus knot w/ jitter, standing-wave grid, chaos cube; buffer-swap on morph completion (old target becomes source exactly — no CPU readback), fresh target generated into B. **Colors**: rainbow-by-|xyz| (Uint8 attr), nebula-heat (shader, radial), monochrome (uniform switch). **Camera**: hand-rolled perspective+lookAt (no lib), spherical orbit w/ drag + inertia, wheel + pinch zoom (0.7–9), optional auto-spin. Count slider 100k–4M rebuilds buffers live. FPS EMA + count + shape HUD; fading hint line; WebGL2-missing fallback message. Unica One + Space Mono, deep-void UI. **Verified headless (SwiftShader)**: 1M @ ~180fps EMA, drag changed theta, wheel zoomed, morph completed galaxy→sphere shell, 2M rebuild @ 76fps, zero errors; screenshot shows the million-point cloud.

## issues
- HEADLESS: rAF fires in bursts w/ long gaps; dt cap (0.1s) discards gap time → animations run ~6× slower under the harness ONLY (morph took 8.5s vs ~1.4s real). Same family as the transition-freeze artifact — don't chase as an app bug.
- readPixels on the default (non-preserved) framebuffer after compositing reads zeros — use screenshots to verify rendering, not readPixels.
- First truncated Write of this file produced garbage mid-CSS ("#263florence") — full rewrite; watch for that failure mode.

## todos
- PLY/XYZ file drop-in loader (real point clouds!), transform-feedback particle physics mode, additive blending toggle, point-size slider, screenshot button.
