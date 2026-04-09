# Ki Fighters

## log
- 2026-04-09: Replaced d-pad with large virtual joystick for mobile movement. 150px glowing base + 64px draggable knob that follows the finger, clamps to radius, and snaps back on release. Translates knob offset into the same ArrowLeft/Right/Up/Down keys the game already reads, with a 0.22 deadzone so light taps don't drift. Uses pointer events + setPointerCapture so the stick keeps tracking even if the finger leaves the base. Shrinks to 120px on short screens. Action buttons (KI/DASH/PUNCH/BLAST) unchanged on the right.
- 2026-04-09: Center fight timer. 99-second round countdown in a bordered plate at top-center of the canvas. Pulses red when under 10s. On timeout, whoever has higher HP wins — tie is a draw. Resets with every new match via `reset()`.
- 2026-04-09: Stages + beam + kick + name input. (1) Three stages defined as `STAGES[]` with per-stage `draw(ctx, t, w, h, gy)` functions, gravity, groundY, hasFloor: **NEON STATION** (cyan/magenta grid floor perspective + neon pillars + flickering panels), **VOLCANIC THRONE** (molten sky + caldera throne + pulsing lava cracks + rising embers), **ZERO-G VOID** (full-viewport nebula with swirling clouds + 120 twinkling stars + floating asteroids + ringed planet, no floor, zero gravity). Stage select is now a second step in `#charSelect` after fighter confirm — fighter panel hides, stage preview cards render via canvas with stage's own draw fn at half scale. Fighter physics read `stage.gravity` / `stage.groundY` / `stage.hasFloor` — void stage lets fighters drift freely. (2) Charged beam attack: hold X for ~22 frames to enter `beamActive` state. Beam drains 1.3 ki/frame, deals 0.9 dmg/frame along a 360-px path in the fighter's direction, continuously knocks back + stuns. `drawBeam()` renders wide soft glow + main gradient + white hot core + pulsing source burst. Tap X still fires single blast. AI can commit to beams rarely when mid-range + high ki. (3) Roundhouse kick: `punch()` now returns a kick variant when moving fast (|vx|>1.8) or airborne. Kick has +6 range, ×1.35 damage, bigger knockback/shake, and distinct sprite animation (extended horizontal leg with speed lines, tilted body, tucked arms). (4) Custom name input: added `#nameInput` above the fighter roster, persisted via localStorage, shown in the HUD as `NAME / FIGHTER`. Keyboard controls (1/2/3/Enter) are gated off when the input has focus.
- 2026-04-09: Character select + roster of 3. Added `#charSelect` fullscreen overlay with canvas-drawn pixel portraits (2.2x scale), name/class/bio/stat-bar cards, click or 1/2/3 to select + Enter to confirm. Three fighters with distinct stats funnelled into a `spec` object on each fighter: **KAITO** (balanced, orange, hp 100 / ki 100 / speed 1.0 / punch 6 / blast 30), **DREAD REAPER** (speedster, purple aura, hp 78 / ki 130 / speed 1.35 / fast but weak punches / small fast blasts / longest dash) — was originally "NOVA" (cyan/blue) but renamed + recolored per chat request for a purple energy aura, with added `auraColor` + `auraGlow` fields that drive the charge-state radial gradient and particle color, **DRAKA** (juggernaut, crimson, hp 155 / ki 80 / speed 0.78 / slow hard punches / huge slow blasts). `fireBlast` / `punch` / `dash` / physics all read from `f.spec.*` so every stat is fighter-driven. `drawProjectile` uses per-blast colors so each fighter's blasts look different. Game loop gated on `gameState === 'select'` so the sim doesn't run until a fighter is confirmed.
- 2026-04-09: Mobile + blast overhaul. Rewrote layout — body is now a flex column with `#stage` flex child holding the canvas, so mobile controls reserve space instead of overlapping. Canvas resizes to fit available stage area (orientation-change listener too). Rebuilt on-screen controls as CSS-grid d-pad (3×3) + action cluster (2×2) with color-coded buttons (KI/DASH/PUNCH/BLAST). Switched from per-button touch events to pointer events with setPointerCapture so multi-touch (hold dpad + mash blast) works reliably. Buttons shrink automatically on short screens via `max-height: 520px` media query. Ki blasts: cost raised 25→30, cooldown 35→40, projectile size 6→12, power 18→30, speed 5.5→6.5. New rendering: pulsing halo + radial gradient orb + hot core + comet-tail streak. On impact: 40-particle explosion + 20-particle shockwave ring + 10-frame screen shake. Firing also adds a small shake. Shake applies to the canvas transform in the main draw loop.
- 2026-04-09: Initial build. Pixel-style 1v1 fighter inspired by classic anime energy battles. Player vs AI rival on a sunset mountain stage. Core moves: fly (arrow keys / WASD, free 2D movement), punch (Z, short-range melee), ki blast (X, projectile that costs 25 ki), charge (C, regens ki + aura particles), dash (Shift, i-frame burst that costs 10 ki). Hit-stop flashing on damage, knockback physics, projectile trails with additive-glow radial gradients. Pixel-art hand-drawn fighters with spiky hair sprites that mirror by direction, state-based arm poses (idle/punch/blast). AI opponent approaches when far, backs off when close, randomly blasts at mid-range, charges when low ki. Round restart on Z after KO. Mobile on-screen controls (d-pad + action buttons). Press Start 2P + VT323 typography, purple/orange sunset palette with layered parallax mountains.

## features
- Full 2D flight physics (no ground requirement, light gravity pull)
- 3 offensive moves with cooldowns + ki economy
- Dash with i-frame window and cooldown
- AI with distance-aware behavior tree
- Health + ki bars for both fighters
- Pixel-art sprites with state-based frames
- Aura rendering during charge
- Projectile particle trails + impact explosions
- Mobile touch controls with 54px buttons
- Round restart flow

## issues
- No second AI difficulty; single mid-level opponent
- Collision boxes are fixed rectangles — punches can clip awkwardly at edges
- No sound yet (could add WebAudio blips for punch/blast/KO)

## todos
- Sound: punch whiff, blast charge/fire, KO bell
- Power-up transformation: above 90 ki, player hair glows gold and deals +50% damage
- Second enemy type with teleport
- Super move: hold X for charged beam that penetrates
- Two-player local versus mode
- Stage variants (space, desert, water)
