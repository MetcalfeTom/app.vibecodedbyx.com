# DOOM 3D

## Art direction (Invasion, 2026-10-13)
- Invasion mode = zennlogic's "take over the world, then protect it". NEVER Halo names or designs (no Covenant / Elites / Grunts / Spartans / energy swords / ring worlds), no Vogons or other franchise names.
- Dusk world: fog + sky horizon #b0503a, deep purple zenith with stars, low warm sun from the west. Flat-shaded vertex-coloured low poly (one merged mesh per kind, instanced where there are many).
- Ours = mint #4dffc3, theirs = red #ff3355, neutral = warm grey. Ground near a beacon tints to the owner's colour, spreading out from the pylon.
- Fonts: Big Shoulders Display 900 (banners, meter) + Chakra Petch (HUD text). Classic/Moon keep the old Courier look.
- Tone: villainous takeover ("THE NORTH IS YOURS", "THE WORLD IS YOURS"), then smug bureaucratic invaders ("THE OCEAN PLATFORM HAS BEEN REPOSSESSED", pushedbutton's paperwork idea).
- Invader looks live in INV_LOOK (part lists: body + glow) and stats in INV_TYPES, so the art can be swapped in one place. Zenn's pick is pending: space geese / witches / paperwork aliens (default if no pick: paperwork aliens with clipboards and stamps).

## Log
- Initial creation: Full 3D first-person shooter using Three.js
- Proper FPS camera with mouse look and WASD movement
- Procedural textures: checker floor, brick walls
- 3D sphere enemies that chase player
- Sphere projectile bullets with collision detection
- Arena with 4 walls and textured floor
- Dynamic lighting with ambient and point lights
- Shadow mapping enabled
- Fog effect for atmosphere
- Enemy spawning from arena edges
- Health/ammo/kills HUD
- Game over screen with restart
- Pointer lock for proper FPS controls
- 2026-09-26: touch controls — stick bottom-left moves (same units as the gamepad stick), drag the view to look, SHOOT (hold = ~5 shots/s), BFG and JUMP buttons; start screen shows touch lines instead of WASD on touch screens; compact one-line HUD on touch. Before this, phones could not move or shoot at all (every tap only retried pointer lock).
- 2026-10-14 00:01: INVASION mode (zennlogic; hamburglar06's "make the takeover huge"; coordinator's tug-of-war design). Start screen: INVASION / CLASSIC / MOON BASE.
  - Take phase: five named beacons (Western Wilds, Eastern Dunes, The Capital, Northern Continent, Ocean Platform), each with guards. Stand in the ring with no invader within 10 m for 3.2 s. Banner per capture, WORLD CONTROL meter + round world map top-left, beacon markers clamped to the screen edge.
  - All five = "THE WORLD IS YOURS" fanfare, then the horn and the mothership descends ("…NOT FOR LONG").
  - Hold phase: 5 timed waves (35-60 s) of drop pods near beacons you own. Invaders standing on a beacon drain it; at 0 it is repossessed (smug banner). Stand in the ring to restore it (24/s). Own beacons resupply health and ammo.
  - Win: hold 3+ of 5 when the final wave's clock runs out (or wipe the final wave). Lose: 0 beacons, or you die. Best run score in localStorage `doom3d-invasion-best`.
  - Shared with Classic/Moon: WebAudio SFX after the first gesture (mute button + M, saved as `doom3d-mute`), muzzle flash, hit marker (red X on kill), red hurt vignette, arrow keys, Enter/R restarts from the end card, MENU button, keys cleared on blur.
  - three.js 0.160 import map -> r170 by full URL, no import map. Fixed: first Moon start skipped its tint (mood applied before initScene), end card kept "YOU ESCAPED", double rAF loops on restart.
  - Draw calls (renderer.info, 390x844 headless): take phase 19-26, wave with 18 invaders + pods + BFG + tracers 35. Tris ~15-20k.

## Issues
- Hitscan rays come from eye height (1.6); hit cylinders are T.h + 0.7 tall so short runners can be hit when aiming straight ahead.
- Ruins block shots (AABB) — test spawns need a clear line (spawn point area is ruin-free within 12 m).

## Todos
- Tilt aim for phones (pushedbutton): optional, off by default, iOS permission from the toggle tap, recentre on enable/resume, fallback note if no events in 1 s.
- Invader art pass (Zenn's pick or paperwork aliens: clipboards, stamps, tiny ties).
- Boss: a giant auditor/mothership event for the final wave.
- More polish: footstep dust, pod scorch marks that stay, beacon capture flare.
- Could add different weapon types (shotgun, rocket launcher)
- Could save high scores to database

## Notes
- Invasion code is one block near the end of the module ("INVASION MODE"). Separate invScene built lazily on the first Invasion start; the camera (with its weapon child) is re-parented between scene and invScene.
- animate() routes to invFrame(): fixed 60 Hz step (invStep), hitstop via timeScale, trauma shake applied to camera rotation only around render().
- Movement input is shared: gatherMove(delta) fills `velocity` from keys/arrows, gamepad, touch stick, held SHOOT. Invasion moves 1.25x faster (beacons are far apart).
- shoot() / fireBFG() / gameOver() dispatch to invShoot / invFireBFG / invEnd('dead') when MODE === 'invasion'.
- World: radius 72 playable, ground 280x280 / 64 segs, invH(x,z) height function flattens 7 m around every beacon, mountains past R-4. Mothership parks at (0, 92, -165).
- Test hook: `// @testhook` marker at the end of the invasion block; tests swap it for window.__T in a test copy only. Never ship window.__T.
- Classic notes below still hold for the arena.
- Color scheme: Dark red (#1a0000, #2a0000, #3d0000), bright red (#ff0000), yellow bullets (#ffff00)
- Camera height: 1.6 units (human eye level)
- Player speed: 0.15 units per frame
- Bullet speed: 0.8 units per frame
- Enemy health: 3 hits to kill
- Arena size: 50x50 units, wall height 5, fog 50
- Shadow mapping: PCFSoftShadowMap (classic only; invasion has no shadow casters)
- Enemy spawn rate: 60 frames - min(kills, 40) for progressive difficulty
- Killing enemies grants +5 ammo (classic), +3 (invasion)
