# neon-crust

## log
- 2026-05-08: shipped — 3D first-person procedural-desert harvester. Roam glowing dunes, point a gathering laser at crystal nodes, drain them dry.
  - **Procedural terrain**: `PlaneGeometry(240, 240, 160, 160)` rotated to lie on XZ. Vertex Y displacement via a layered sine heightmap `heightAt(x, z)` — big dunes (0.018 freq, ±6.5 amplitude), medium ripple (0.046 freq, ±2.0), tiny chop (0.11 freq, ±0.6), plus a 0.32/0.18-mixed phase wobble. All driven by `worldSeed` so reseed (R key) reshapes coherently. `computeVertexNormals` after displacement so lighting reads dune curvature. Vertex colors interpolated per height: warm sand at valleys → pink-tinted gold at crests.
  - **Cyan wire grid** overlay — second `PlaneGeometry` at half resolution with the same heightmap + 0.03 Y offset, rendered as `wireframe: true MeshBasicMaterial` cyan at 18% alpha. Gives the synthwave grid feel without obscuring the painted dunes underneath.
  - **Lighting**: peach AmbientLight 0.32 + pink DirectionalLight as the "sun" + a cyan rim light from the opposite quadrant + a player-attached PointLight (`headLamp`) so dune valleys aren't pitch black at night. 600-point pink starfield at radius 280–340 + a gold MoonSphere at (140, 90, -160) with a soft halo ring.
  - **Resource nodes**: 36 randomly-placed `THREE.Group` clusters of 3-5 tilted neon cones. Three kinds: **Aether Crystal** (cyan, 100 hp, +1/hit), **Solis Shard** (magenta, 140 hp, +1/hit), **Lumen Geode** (gold, 200 hp, +2/hit). Each cluster has its own per-node `PointLight` so the dunes are dotted with little glow puddles. Placement: each node at a random `(theta, r)` in `[20%, 80%]` of the terrain radius — keeps spawn near-but-not-on the player.
  - **Gathering laser**: held left-click streams a beam from the camera muzzle to the impact point on the targeted node. Beam = `THREE.Line` with a per-frame `BufferGeometry` position update + a pulsing opacity sine. Muzzle = a tiny sphere pinned to `(0.18, -0.18, -0.5)` in camera space (so it sits in the bottom-right of the viewport like a gun). Impact = a sphere + colocated PointLight that retints to the targeted resource's color on each tick.
  - **Targeting**: `findTargetedNode` raycasts from `camera.getWorldPosition` + `getWorldDirection` against each node group within 50 units (skip-distance optimisation), picks the closest hit. Crosshair at viewport center turns **magenta** when locked onto a node, **gold** when actively firing. Target-info pill below the crosshair shows the node's name + a live HP bar.
  - **Drain economy**: `LASER_DRAIN_PER_SEC = 80` hp drained per second from the targeted node. Player gains a fractional resource amount per drain tick (`yieldPerHit × hpDrainedThisFrame / capHp × 6`); whole units accumulate via a `_frac` bucket so high-HP nodes still trickle inventory in real time. Player has `energy` (max 100), drained `22/sec` while firing, regens `18/sec` when not. Energy pill flashes red below 25% and the laser stops firing if it hits 0 — forces a brief recovery beat.
  - **Node depletion**: when HP hits 0, `depleteNode` triggers a 700ms scale-down animation on each cluster cone + a 12-particle spark burst in the node's color + a small bonus drop (`yieldPerHit` units added directly), the per-node `PointLight` fades to 0, and the group is removed + GPU resources disposed. Toast announces the type drained.
  - **First-person camera**: `playerRig` Group holds the camera, mouse-look uses **pointer lock** (sensitivity 0.0023 rad/px, pitch clamped ±π/2-0.05). WASD camera-relative with **Shift sprint** at 1.55×. **Head-bob** while moving (vertical sin + lateral cosine sway, scales with speed). Player follows terrain height each frame via `heightAt(player.x, player.z)`.
  - **R key reseeds**: rolls a fresh `worldSeed`, rebuilds terrain + grid + nodes, re-snaps player to the new ground height. Toast confirms the seed value.
  - **Audio**: shared AudioContext lazy-init on first gesture. Continuous laser sound = sawtooth carrier 220 Hz through a bandpass at 1800 Hz Q=4 + highpass-filtered noise sub layer; both gain-ramped 0→0.16 / 0→0.06 on fire-down with 40ms attack + 80ms release. One-shot blips on resource collect (880+1320 Hz triangle pair) and on node depletion (440/660/880 Hz triad).
  - **HUD**: 4 glassmorphic backdrop-blur pills along the top — Aether (cyan), Solis (magenta), Lumen (gold) inventory counts + Cell (energy lime, pulses red when crit). Each pill has an inline color swatch with neon glow.
  - **Controls**: WASD + Shift sprint + mouse look (pointer-locked) + hold left-click fire + R reseed + Esc release cursor. Mobile: virtual joystick (pink knob, lower-left) + FIRE button (cyan, lower-right).
  - **Aesthetic**: deep purple-magenta sky `#1a0826`, FogExp2 at 0.014 density tinted to match. Pink + cyan + gold + lime palette. Audiowide title with the same neon glow shadows as other apps in the suite. IBM Plex Mono UI / Press Start 2P numeric pills.
  - **Accessibility**: rem units, semantic `<canvas role="application">` with descriptive aria-label, skip link, `aria-live="polite"` HUD region, focus-visible white outlines on buttons, ≥2.6rem button heights, `prefers-reduced-motion` no-ops the energy-crit flash.

## issues
- Terrain heightmap is sine-based, not real Perlin/Simplex — at very low frequency you can spot obvious lattice artefacts. Acceptable for the synthwave style; a real Perlin upgrade would be ~30 lines.
- `findTargetedNode` does a raycast against every alive node within 50u every frame — fine for 36 nodes but won't scale to 500. A spatial grid would help if NODE_COUNT grows.
- No save/load — inventory/seed reset on page reload by design (it's an arcade-feel session).
- Ground-follow is one-tile-resolution (samples heightAt at the player's exact x,z each frame); on extreme dune slopes the camera can clip through if the slope is steeper than the player can step. No step physics.
- Energy is a soft gate, not a brutal one — the laser interrupts but doesn't damage the player. No way to die yet.
- No crafting (the original chat ask was for a "procedural landscape with crafting", but the user pivoted to a 3D desert harvester) — could layer crafting on later if requested.
- No XR/VR support yet (the tighter cousin app `neon-cruise-zombies-3d` has it).

## todos
- Real Perlin/Simplex noise (one-import via three/examples or a small inline impl).
- Crafting bench: drop a placeable structure that converts X Aether + Y Solis → Z Lumen (or sigil tools).
- Power-up: rare "Vault" node with 1000 hp that drops a satchel of all three resources.
- Time-of-day cycle: sky color + sun intensity drift over a 4-min loop.
- Worm-style enemy that surfaces when you stand still too long.
- Spend-resources sink: build a beacon out in the dunes that reveals all undiscovered nodes on a minimap.
