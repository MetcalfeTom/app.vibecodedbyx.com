# Boss Arena

## log
- 2026-04-07: Initial build — souls-lite 3D third-person combat prototype with Three.js. Circular stone arena (R=18) with 8 torch pillars and flickering braziers. Player warrior (stacked boxes with sword, hood, armor) and giant boss "The Colossus" (stacked humanoid with horns, glowing red eyes, giant hammer). Third-person orbit camera with pointer-lock, ACES tonemapping, PCF soft shadows, warm key light + cool rim + dynamic torch point light tracking the action. Cinzel serif + JetBrains Mono HUD typography.

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
- No mobile controls
- Boss hitboxes are simple arc checks, not true mesh collision

## todos
- Body collision pushback between player and boss
- Audio: sword swoosh, hammer impact, hit grunts, victory fanfare
- Phase 2 for boss at 50% HP (faster, new attacks)
- Parry/block mechanic
- Lock-on camera
- Health potions
- Real PNG OG image
