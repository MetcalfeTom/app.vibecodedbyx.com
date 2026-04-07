# Cornell Box

## log
- 2026-04-07: Initial build — real-time WebGL2 progressive path tracer rendering the classic Cornell box. Fragment-shader ray tracer (the "main.cpp" logic lives in GLSL): AABB slab intersection, Y-rotated box hits, plane-checked walls with red/green/white materials, ceiling area light (emission 18,15,10), cosine-weighted hemisphere bounces, Russian roulette after depth 3, PCG RNG per-pixel per-frame. Ping-pong float FBOs (RGBA32F via EXT_color_buffer_float) accumulate samples each frame; display pass tonemaps (Reinhard) + gamma. Two rotated white boxes inside (tall + short). 640×640 target, 5 bounces default. Controls: reset, cycle bounces (3/5/8/12), save PNG. JetBrains Mono + Space Grotesk typography, dark minimal frame.

## features
- GPU path tracer in a single fragment shader
- Progressive Monte Carlo accumulation via ping-pong RGBA32F FBOs
- Classic Cornell scene: red left wall, green right wall, white floor/ceiling/back, emissive ceiling patch, tall + short rotated boxes
- Cosine-weighted diffuse scattering
- Russian roulette termination after 3 bounces
- PCG random number generator seeded per pixel per frame
- Reinhard tonemap + gamma 2.2 display
- Live SPP, bounce depth, and FPS overlay
- Reset button, bounce-depth cycle, save PNG of current converged image
- Graceful fallback messages if WebGL2 or float FBOs unavailable

## issues
- No next-event estimation — converges via naive path tracing (slower than a production tracer)
- Only diffuse materials (no specular/glass/dielectric)
- No BVH — fine for this tiny scene but won't scale
- Light area is fixed; camera is static
- 640×640 may be heavy on older mobile GPUs

## todos
- Add direct light sampling (NEE) for faster convergence
- Specular + dielectric materials
- Mouse orbit camera (reset accumulation on move)
- Different scenes: mirrors, glass spheres, tall box becomes a mirror
- Real PNG OG image
