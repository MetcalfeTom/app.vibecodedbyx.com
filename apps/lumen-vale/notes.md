# Lumen Vale — notes

## log
- 2026-07-05: v1 — single-file three.js (r128) landscape. CPU-generated terrain (240×240 grid, 1000u): domain-warped FBM base + broad valley noise + ridged-multifractal mountains gated by a mask, island edge falloff so the world sinks into water. Per-vertex analytic normals from height grid + cheap cavity AO attribute (8-tap ring average). Three custom ShaderMaterials:
  - **Terrain frag**: height/slope banding (sand→grass→rock→snow) with noise-jittered thresholds, rock strata, underwater tint, hemisphere ambient + lambert + blinn spec on snow, AO, exponential distance fog + animated valley height-fog.
  - **Water frag**: analytic wave normals (2 sines + 2 scrolling vnoise octaves, central differences), fresnel deep↔sky mix, sun specular + sparkle noise, same fog.
  - **Sky frag**: zenith/horizon gradient, sun disc + double glow, moon disc, hash-star field with twinkle (night only), FBM cloud layer with silver lining, all on a 5000u backside sphere whose vDir is camera-relative.
- Day/night cycle: sun orbits (160s day at 1×), JS-side palette keyframes (night/dusk/day) lerped by sun elevation and pushed as uniforms to all 3 materials. Light source hard-switches sun→moon at e=-0.02 (they're antiparallel — lerping through 0.5 would produce a zero vector / NaN, hence the hard select + y-clamp).
- UI: fading title + hint, HH:MM clock pill (phi 0 = 06:00), pause-sun + speed (1×/4×/12×) buttons. OrbitControls with damping, autoRotate until first interaction (off under prefers-reduced-motion).

## issues
- No headless browser in sandbox + no HTTP egress at build time → shaders verified by review only, not runtime compile. If black screen reported: check devtools for THREE shader compile errors first.
- Mobile mediump precision can make sin-hash noise slightly banded — acceptable, but if users report artifacts, switch hash21 to a mediump-safe hash.
- Water has no shore foam / depth blending (no depth texture) — fake it with terrain-distance noise if requested.

## todos
- Optional: fireflies/particles at night, god-ray post pass, seed input to regenerate terrain, screenshot (PNG export) button.
- Time-of-day scrub slider if users ask for direct control.
