# Pixel Shader

Trippy pixel shader canvas with colorful particles. 5 shader modes, mouse-reactive, click to burst.

## log
- 2026-04-13: Initial build. 5 fullscreen pixel shaders at 4x pixel scale: Plasma (layered sine waves), Warp (mouse-attracted distortion), Voronoi (moving cell boundaries), Fractal (animated Julia set), Melt (swirl + drip patterns). All shaders react to mouse position. Up to 600 particles with additive blending onto shader buffer. Click/tap to burst 40 particles. Ambient particles trail the cursor. Scroll to zoom shader space. Lookup table sin/cos for performance. HSL-to-RGB per pixel. Touch support.

## features
- 5 shader modes (Plasma, Warp, Voronoi, Fractal, Melt)
- Per-pixel HSL rendering at 4x scale
- Mouse-reactive shader parameters
- 600 particle system with additive blending
- Click to burst particles
- Ambient cursor trail particles
- Scroll to zoom
- Fast sin/cos lookup tables
- Touch support

## issues
- Performance may drop on older devices at full resolution

## todos
- OG preview PNG
- More shader modes (fire, water, noise)
- Audio reactivity option
- Screenshot/record button
- Blend between modes
