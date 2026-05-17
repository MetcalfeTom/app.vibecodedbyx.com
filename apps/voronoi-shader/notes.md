# voronoi-shader · notes

## log
- 2026-05-17: v1 — **live WebGL2 cellular-noise designer**. Single file ~34KB.
  - **Engine**: fullscreen WebGL2 quad with a GLSL ES 3.00 fragment shader doing 3×3 neighbour Voronoi (F1/F2 + integer cell id). All controls feed live uniforms — no recompile on slider drag.
  - **Geometry controls**: density (3–80 cells across), jitter (0–1), warp (0–1.5, 2-octave value-noise domain warp), distance metric chip group (euclidean / manhattan / chebyshev / minkowski-3).
  - **Style modes** (5): cells (per-id flat fill), edges (cell walls bright), f2−f1 raw heatmap, dots (bright cores fading out), cracks (thin bright outlines on dark). Edge thickness + contrast (γ-curve) sliders.
  - **Motion**: animation speed (cells drift along per-point orbits via sin/cos of time × seeded phase), scale, mouse-position pan (cursor → uniform → continuous pan).
  - **Palette**: 6 cosine presets (stained / frost / magma / biofilm / void / ink) using the Iñigo Quílez `a + b * cos(2π * (c*t + d))` formula, palette-shift slider (0–1).
  - **CUSTOM 3-stop gradient** (per chat ask "color pickers for the cell gradients"): three `<input type="color">` for core/mid/edge that auto-flip the palette to mode 6 on change. Shader path: `mix(core, mid, smoothstep(0..1, t*2)) if t < 0.5 else mix(mid, edge, ...)`. Defaults `#1a0420 → #ff4dc8 → #7af0ff`.
  - **6 named presets**: stained glass / biofilm / magma cracks / frosted / circuit / dust. Each is a single click that pushes a whole config into state.
  - **Random**: ⚂ button randomises every continuous + discrete parameter at once (great for chaos exploration).
  - **Pause / play** (Space): freezes time, HUD shows `PAUSED`. Speed slider also doubles as a scrubber when paused.
  - **PNG export** (⤓ png): forces one extra frame draw then `canvas.toBlob → URL.createObjectURL → <a download>` with timestamp filename.
  - **GLSL viewer** ({ } glsl): modal shows the full fragment source verbatim with a ⎘ copy button that uses the Clipboard API (copy-to-clipboard for the shader code, per chat ask).
  - **Keyboard**: Space pause, p panel collapse/expand, r random, Esc close modal.
  - **HUD**: bottom-left pill shows live FPS (sampled over a rolling 1s window) + approx cell count (density²) + PAUSED indicator.
  - **Aesthetic**: glass dark panel (`backdrop-filter: blur(14px) saturate(140%)`, pink/cyan border + glow), Major Mono Display title, Cormorant italic tagline, Syne Mono section heads, JetBrains Mono values. Panel collapses to a thin edge via translateX so the full canvas can be seen during demos.
  - **Accessibility**: rem-everywhere, semantic `<canvas role="img" aria-label>`, chip groups with `aria-pressed`, focus-visible cyan outlines, ≥2.4rem tap targets, `prefers-reduced-motion` kills all transitions/animations.
  - **OG image**: Pollinations flux.

## issues
- The Voronoi loop only checks the 3×3 grid neighbourhood. With very high jitter (~1.0) cell points can sometimes nudge slightly outside their cell, causing rare seam artifacts at high density. Acceptable for the aesthetic; bumping to 5×5 would cost ~3× the per-pixel work.
- iOS Safari has had historical issues with `getUniformLocation` returning null on unused uniforms in some compilers — if a future shader edit removes a uniform, the JS push path needs to guard for null returns.
- The PNG export uses `preserveDrawingBuffer: true` on the WebGL context. Tiny perf cost in exchange for cheap PNG export.
- No localStorage persistence yet — refreshing wipes the current preset (custom palette, slider values). Could persist if requested.
- The custom-palette interpolation is sRGB linear (because `<input type="color">` returns sRGB hex and the shader doesn't gamma-correct). For most uses this looks fine; could add a checkbox for linear-light blending if visual differences become an issue.

## todos
- "Export as GLSL `.frag` file" download alongside the copy button
- Octave count for the warp noise (currently single-octave)
- Save / load presets to localStorage as named slots
- Manhattan + Chebyshev presets in the preset bar
- Reuse the existing shader and offer a Voronoi 2D-feedback "react-diffusion" mode (chat ask candidate)
- Per-cell colour from the integer cell id (already partially supported via `id` channel; would need a 'cell index' palette mode)
