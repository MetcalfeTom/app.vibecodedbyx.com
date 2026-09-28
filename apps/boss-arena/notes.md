# Boss Arena

## log
- 2026-04-07: Initial build — souls-lite 3D third-person combat prototype with Three.js. Circular stone arena (R=18) with 8 torch pillars and flickering braziers. Player warrior (stacked boxes with sword, hood, armor) and giant boss "The Colossus" (stacked humanoid with horns, glowing red eyes, giant hammer). Third-person orbit camera with pointer-lock, ACES tonemapping, PCF soft shadows, warm key light + cool rim + dynamic torch point light tracking the action. Cinzel serif + JetBrains Mono HUD typography.

- 2026-09-28: Phone controls. Floating stick in the left 45% of the screen (analog: walks slower near the centre), drag anywhere else to orbit the camera, ⚔ SLASH button (hold keeps swinging) and ↺ ROLL button. Pointer lock skipped on touch (`lockPointer()`); keys + stick share `inputDir()`. Start card and HUD swap to touch hints; player HP moves under the boss bar on phones. Portrait screens get a wider lens (fitCam: fov up to 85, camera 7.8 back). Victory now offers click/tap to fight again (it was a dead end). `restartReady` + removing the pending document click listener keeps a tap restart from double-firing. Real og.png (1200x630, the wanderer under the Colossus) — og:image pointed at a missing og-image.png before.

## features
- WASD + camera-relative movement, mouse-look pointer-lock third-person camera
- Dodge roll (Shift/Space) with 0.35s i-frames, 30 stamina cost, body-tilt animation
- Slash attack (left click) with proper hit window in the middle of swing, arc + range check, 12 dmg
- Stamina bar (regens when not acting)
- Boss AI state machine: idle → chasing → telegraph → attack → recover
- 3 attack types: hammer slam (narrow arc, big dmg), wide sweep (huge arc), stomp AOE (circle around boss)
- Boss telegraphs with 0.9s wind-up (hammer raised, eyes glow brighter)
- Player HP (100) + stamina, Boss HP (500)
- Damage vignette flash, boss hit-flash (emissive)
- Victory + You Died screens, click to restart on death
- Circular arena containment for both actors
- Walking leg+arm animation on player, leg swing on boss
- Torch point light lerps to midpoint between combatants for mood lighting

## issues
- No collision between player and boss body (can run through)
- Boss only has 3 attacks on a random picker — not varied enough for long runs
- No audio
- Boss hitboxes are simple arc checks, not true mesh collision

## todos
- Body collision pushback between player and boss
- Audio: sword swoosh, hammer impact, hit grunts, victory fanfare
- Phase 2 for boss at 50% HP (faster, new attacks)
- Parry/block mechanic
- Lock-on camera
- Health potions
