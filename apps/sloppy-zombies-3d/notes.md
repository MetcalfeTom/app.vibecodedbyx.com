# sloppy-zombies-3d

## log
- 2026-05-02: Created. **PS1-style Three.js port of the 2D iso wave-survival shooter.** Sister app to `sloppy-zombies` — the 2D game stays untouched. Per chat: "switch to ps1 style three-js 3d engine, third-person camera, mouse aim". **PS1 aesthetic stack**: (1) low-res render target — canvas pixel buffer locked to 480×360, CSS scales up to fit stage with `image-rendering:pixelated` for that signature blockiness; (2) `ps1ifyMaterial` helper applies vertex snapping via `material.onBeforeCompile` shader chunk that floors clip-space x/y to a coarse pixel grid (the famous PS1 wobble), enables `flatShading` + `dithering`; (3) fixed pixel ratio of 1 (no subpixel ever); (4) `THREE.NearestFilter` on every texture (no smoothing); (5) heavy short-distance fog `THREE.Fog(0x100a0d, 14, 42)` to hide pop-in like PS1's tiny draw distance. **Engine**: Three.js r0.160 via importmap CDN. **Scene**: 80×80 floor plane with a hand-drawn 64×64 grid+grit texture (canvas-painted, repeat 20×), 4 perimeter walls each split into 2 segments for window gaps, 4 wooden window frame markers at the gaps (zombie spawn points), 8 procedural pillars sprinkled inside the bunker (1.2×1.4×1.2 boxes). **Player**: capsule = 0.7×1.0×0.5 cream box body + 0.5³ skin head + 0.7-long cylinder weapon held at right hip. Anchored at `Vector3` with separate yaw. **Camera**: third-person chase that lerps `dt*6` toward a slot 7u behind + 5u above the player along their facing yaw, looks at a point 2u ahead of the player so over-shoulder framing shows the action zone. **Mouse aim**: cursor → NDC → raycast through camera onto the floor plane → set `player.yaw = atan2(dx, dz)` to face the world cursor every frame. **Combat**: WASD movement (Shift sprint 1.55×, Space dodge-roll w/ 0.35s i-frames + 1.4u impulse), click fires a yellow sphere bullet at 32u/s toward the cursor, autofire while held. Bullets hit-detect against zombie hitboxes (0.4 + 0.15)². **Zombies**: 0.7×1.0×0.5 sickly-green box body + slightly lighter head + 2 red glowing-eye blocks on the face; spawn from the 4 window gaps, path straight toward player at `1.4 + wave×0.08` u/s, push out of pillars on collision, bite for 8 dmg every 0.9s on contact (gated by player.invulnUntil). **Wave system**: identical to the 2D version's pacing — `5 + wave×2` zombies per wave, spawn cadence `0.9 - wave×0.05` (floor 0.2s), 4s interlude between waves, banner on start/clear. **HUD**: top header pills (WAVE / HP / KILLS) in the same Bungee Shade + Silkscreen + VT323 stack as the 2D version so it visually matches. **Web Audio** synth sfx: shoot (640Hz square + 180Hz saw thud), hit (220Hz saw), bite (120Hz saw), zombie death (180Hz → 80Hz saw fall), wave start (3-note saw descent), dodge (880Hz triangle blip), end (rolling saw fall). **Title + end overlays** with PLAY / RETRY buttons. **Pollinations OG**, 🧟 favicon. ~600 lines, single file, no build step.

## issues
- Scaffold only has ONE basic weapon (single-shot autofire with the cylinder-at-hip stand-in). Needs the full arsenal (rifle/drumshot/raygun/rocket/railgun/tesla/chainsaw) ported from the 2D version with correct projectile/AOE/chain/beam/melee mechanics translated to 3D.
- No powerups yet (no power armor, radioactive aura, black hole grenade, energy shield, speed/armor boosts). The 2D game's full powerup pool needs porting.
- No zones/corridors yet — the 3D bunker is a single 28×28 tile rectangle. The 2D 2×2-zone procedural-corridor system would need to be re-implemented in 3D with proper wall-segment + corridor mesh generation.
- No mystery box, no wall-buys, no boss zombies, no combo system, no upgrade store, no meta-progression yet — these all need porting from the 2D version.
- Camera locks behind the player's facing — when the player rapidly spins (mouse circle), the camera follows aggressively which can cause motion sickness. May need to add a deadzone or cap the lerp rate per frame.
- No collision with walls beyond simple AABB clamp — a zombie can theoretically pop INTO a window frame mesh since they path straight through it. Frames are decorative but should add their own push-out.
- Bullet trajectories are flat (Y=1) and don't account for vertical aim — fine for ground enemies but no air/elevated targets work.
- HUD overlay is DOM (good for sharp text at any zoom) but the 2D bottom-HUD/cost panels aren't here yet — only the top pills.

## todos
- Port the full WEAPONS dict (rifle/drumshot/raygun/rocket/railgun/tesla/chainsaw) with 3D projectile + AOE + chain + beam + melee behaviors.
- Port the powerup pool (radaura/blackhole/eshield/powerarmor/speedboost/armorboost/instakill/double/nuke/ammo).
- Port boss zombies (every 5 waves, scaled-up sickly-violet mesh, 800+wave×220 hp).
- Port mystery box (corner of bunker, 950pt re-roll).
- Port wall-buys (chalk-outlined weapon silhouettes on inner walls).
- Port pillars + zone unlock + corridor procedural generation in 3D.
- Port meta-progression (gold currency, persistent upgrades, prestige).
- Port combo + screen shake + bottom HUD.
- Add weapon-swap (1-5 number keys + scroll wheel + Q cycle).
- Add gamepad support for thumbstick aim (mouse-equivalent dual-stick controller).
- PS1 affine texture warping — currently the scene uses MeshBasicMaterial which is already perspective-correct-disabled in some flows, but a custom shader that explicitly disables UV/W division would lock the swimmy-texture look on the floor + pillars.
- Add a per-frame screen-space dither pass via a render-target post-process for the canonical PS1 color banding.
- Tag-based color palette quantization (8-bit BGR555) for full era authenticity.

## design-notes
- Why a sister app, not a rewrite of the 2D version: the 2D iso has dozens of mature systems (zones, corridors, pillars, wall-buys, 6+ weapons, beam/chain/melee modes, star-power, black holes, energy shields, combo system, screen shake, bottom HUD, meta-progression, save state). A from-scratch 3D rewrite would either lose all of that or take many sessions to re-implement, all while breaking the live game. The sister-app approach lets both versions evolve in parallel and chat votes via upvotes which lineage to push forward.
- PS1 vertex snap is at 1.0 (full screen pixel) for max wobble. Lower (0.25) for more subtle jitter. The shader uniform `uPs1Resolution` controls this via the `*0.5` divisor in the inject — bumping that to a higher number reduces wobble.
