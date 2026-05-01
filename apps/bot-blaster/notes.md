# bot-blaster

## log
- 2026-05-01: Created. **Three.js neon FPS where you fight 5+ glowing bots in a low-poly synthwave arena.** User asked for "raycaster FPS with bots using only pure canvas and math", then immediately asked "can we use Three.js from a CDN" — went with Three.js (r0.160 via jsdelivr import-map) for the better visual payoff. **Map**: 20×16 ASCII grid, '#' = wall (TILE=2u, 4u tall, 3 alternating wall colors magenta/cyan/amber, white-edge wireframe outlines for neon volume read), '3' = player spawn, '2' = bot spawn (5 bots placed). **Player**: yawObj+pitchObj+camera rig (mouse-look via PointerLock), eye height 1.55u, capsule radius 0.35, speed 4.0u/s, WASD movement in yaw-space, axis-decoupled wall collision (circle-vs-AABB closest-point test per cell), small head-bob while moving, 100/100 HP regenerates 1.5/s when not freshly damaged, fire CD 0.16s. **Bots** (class Bot): low-poly stack (magenta body box + cyan sphere head + 2 gold eye dots + gold antenna + white edge wireframe), HP 3, radius 0.55, state machine `idle ↔ chase ↔ attack`. Idle = wander every 1.5–3.5s in random direction. Chase = LOS-gated path toward player up to dist 14. Attack = within 4u, also keeps space (back away if dist<3.0) and shoots every 1.6–2.8s with 25–85% hit chance scaled by distance, dmg 6–11. LOS check = step along line in 0.25u increments, abort on wall cell. Death = white flash → 350ms shrink+rise implosion + scene removal + sfx. **Render**: WebGLRenderer, FogExp2 0.045 deep-purple, 72° FOV PerspectiveCamera, GridHelper neon overlay on the void floor, ceiling plane at 4.4u tinted. **Combat**: click-fire raycasts from camera world-pos through camera world-direction. Hits cycle: ray-vs-bot-spheres (smallest t wins) → also raycast walls (0.1u step march), if bot hit-distance < wall hit-distance, register damage. 1 dmg per shot (3-shot kill). Tracer line spawned per shot (gold = hit, magenta = miss/wall) with 200ms fade. **HUD**: HP bar (gradient hot→gold), kills count (cyan), bots-left count (green). Damage radial-flash overlay pulses red on take-damage. Crosshair: 18px gold cross via gradient, white→hot color flash on confirmed hit. **Audio**: Web Audio synth blips — square shoot (900Hz pop + sawtooth low body), bot shoot (sawtooth+square), gold hit (square+triangle ascend), kill (sawtooth descending), damage (low sawtooth thud), end-arpeggio. **Aesthetic**: Bungee Shade title with hot-pink→gold→cyan vertical gradient + glow; JetBrains Mono body, Silkscreen HUD labels. Crosshair, HP/kills/bots-left HUD, mouse-aim hint that fades after 4s. **Title overlay**: click anywhere to begin + lock pointer. **End overlay**: YOU WIN (green) or BOTS WIN (magenta) + kills + HP remaining + PLAY AGAIN (page reload to keep the code small). Pollinations OG image, 🤖 emoji favicon.

## issues
- `cursor:none` on body hides the OS cursor before pointer-lock kicks in, which is a brief moment after first click. Fine for the title screen but worth revisiting if first-click cursor flicker bothers anyone.
- Bot LOS step granularity (0.25u) can technically miss thin diagonal wall corners — acceptable since walls are full-cell.
- Bot collision uses circle-vs-AABB; bot-on-bot collision is NOT modeled, so bots can clip through each other when chasing. Adds light arena chaos rather than feeling buggy.
- `raycastWall` march at 0.1u is slow but small map (~16×20) keeps it under 1ms per shot. A proper DDA would be cleaner.
- PLAY AGAIN reloads the page — keeps state reset trivial but loses any pause/score-keeping.
- No bot-bot LOS friendly fire — bots ignore each other.
- 5 bots is the default; harder waves not implemented yet.

## todos
- Wave system: kill all 5 → spawn 7 → spawn 9 (pop the bots from corner spawns).
- Pickups: HP packs + ammo (currently no ammo system).
- Vary bot archetypes (sniper / rusher / sentry).
- Better gun sprite at bottom of view (currently just crosshair + tracer).
- Footstep audio + ambient drone.
- Mobile touch controls (joystick + tap-to-fire).
- Particles on bot death (currently just shrink/rise).
- Save high-score (kills) to localStorage.
- Better minimap / radar.
- Map variants picked at start.
