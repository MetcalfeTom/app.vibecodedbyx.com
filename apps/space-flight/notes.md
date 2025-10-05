# SpaceCraft Notes

## Log
- Minecraft-only shapes: Removed round meshes (spheres/torus). Engine glow now boxy; anomalies rebuilt as square ring, step pyramid, cube ribbon, and cube clusters.
- Big solids LOD: Far-away view shows a vague, sparser cube shell that swaps to a detailed shell when close.
- Slower speeds: Reduced cruise/boost accel and top speeds; Physics max speed capped lower for a calmer pace.
- Infinite stars: Replaced single star cloud with 3x3x3 tiling star cubes that wrap and reseed, plus distant hue points anchored to camera for skybox-like depth.
- Big solids improved: Larger sizes, unique per-solid color, fewer cubes via irregular trig noise and decimation; low LOD uses bigger opaque cubes (no wireframe) so faces are visible from afar.
- Twinkling sparks: Added variable-density tiling spark fields with per-point twinkle animation; tiles wrap and reseed based on area hash for varied density.
- Smooth LOD: Big voxel solids now crossfade between low/high detail instead of popping at a distance threshold.
- Scale pass: Increased sizes across the board — larger voxel asteroids (with random scale), longer/wider nebula cube strings (fewer but bigger), and much larger big solids with coarser steps to keep perf.
- Subtler shading: Raised ambient and lowered directional sun for softer face contrast.
- Per-cube collision on big solids so you can fly into holes; uses hashed cube sets and local AABB checks near the ship.
- Sparser environment: Reduced asteroid and nebula counts; pushed farther out with distance-based opacity fade so they’re hinted at from far away without clutter.
- Regional variation: Object placement varies by coarse space regions via hashed density, creating clusters and voids.
- Nebulas/rocks sparser + farther: dropped nebula targets to ~10 and asteroids to ~50 (later ~30); moved placement out to 3–11km+ and added far-hint sprites + distance fades for early subtle visibility.
- Big solids: reduced count to ~2, increased size, shared holes across LODs so low-res approximates high-res shape; crossfade tuned for smoother, earlier transition.
- Near-dust particles: Spark tiles now fade strongly with distance to the ship so they pop only when you fly through them, while remaining very subtle at range.
- Nebulas farther + denser (fewer): Reduced count (~6), increased per-string density and far-hint sprite size/opacity; crossfade distances increased (up to ~13k) so they’re visible from much further.
- Camera inertia: Added acceleration-aware camera follow (more lag when speeding up) for a weightier feel.
 - Rocks update: Much rarer (~30), larger scale, slower rotation, and matte material with slightly higher emissive to reduce harsh light contrast across faces.
- Background stars polish: Star tiles now additive; added very big, fuzzy background star sprites (camera-anchored) with gentle opacity pulse for depth.
- Blocky ship redesign: Replaced cone ship with stacked box hull, block wings, and glassy canopy for Minecraft vibe.
- Big solid voxel bodies: Added several large contiguous-cube planetoids with collision.
- Collision + damage: Hull takes damage on impact with big solids; on 0% you "die" and can respawn (R or tap). Velocity/speed dampens on impact.
- UI polish: Moved Mode toggle under stream link (top-right) and replaced Boost text with a subtle progress bar below it; bar color shifts from cyan→amber→red as fuel lowers.
- Environment overhaul: Fewer nebulas but now as Minecraft-like cube strings spread in wide space (1.8–4km out), with gentle drift and infinite wrapping.
- Generative objects further out: Increased voxel asteroids (140) and UFOs (35), placed in distant cylindrical shell (1.5–5km), with X/Z/Y wrapping to maintain density everywhere.
- More stars: Increased starfield density to ~22k points for richer backdrop.
- Occasional anomalies: Added rare, strange objects (monoliths, glowing rings, pyramids, torus knots, orb clusters) far out with slow spin/bob and full wrapping.
- Added Physics mode (inertial): turning doesn't affect velocity; ship coasts until you boost. Boost applies thrust along facing, so it can accelerate, decelerate (retro-burn), or curve your trajectory naturally. Toggle via Mode button (top-left) or UI.
- Mobile UX: Inverted up/down mapping (↑=S, ↓=W), moved Boost to right side of diamond, and ensured on-screen controls hidden on desktop and shown on mobile only.
- Mobile controls: Replaced split bars with centered diamond grid (↑, ←, ⚡, →, ↓) for better fit.
- Boost stronger: increased maxBoostSpeed to 12.0 and boostAcceleration to 0.02 for a snappier, faster boost.
- **Boost acceleration boost**: Boost now accelerates 4x faster (0.008 vs 0.002) and reaches higher top speed (8.0 vs 6.0)
- **Rotational inertia update**: Much slower rotation start (0.003) with gradual ramp-up, continues briefly after release for inertia feel
- Rotation acceleration: now 0.0003 (was 0.0008) for much slower buildup
- Max turn speed reduced to 0.025 (was 0.035) - slower overall rotation
- Added turnDeceleration (0.0005) so rotation gradually stops instead of instant
- Turning decelerates ship more aggressively (0.985 vs 0.995)
- Limited boost fuel system (drains 0.5/frame, recharges 0.15/frame) with color-coded UI
- Very gradual acceleration (0.002) from 0 to max cruising speed (2.5)
- Boost makes significant difference and is limited resource - strategic use required
- Takes a long time to reach top speed for realistic space flight feel
- Added camera inertia with smooth lerp follow (cameraLerpFactor: 0.08) for more cinematic flight feel
- Ship rotates in place, world moves relative to ship
- Voxel asteroids and blocky UFOs in dark starfield
- Nebula clouds with infinite wrapping effect

## Issues
- None currently

## Todos
- Consider adding collision detection
- Could add more voxel object variety
- Potential for shooting mechanics
 - Procedural chunking for spawn/despawn instead of wrapping if perf dips on mobile
 - Per-face greedy meshing on solids to reduce draw calls
 - Screen shake and impact sparks on collision

## Technical Notes
- Uses THREE.js with importmap
- Camera smoothly follows ship using lerp for position and up vector
- World group contains all objects that move relative to ship
- Ship stays at origin and rotates, world translates
- Physics mode uses a velocity vector; arcade mode uses scalar speed with forward direction
 - Asteroids/UFOs/nebula strings wrap over large spans (X/Z: 6–7km, Y: ~1.6km)
