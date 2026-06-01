# knight-cyclone

## log
- 2026-06-01: **3-HERO CLASS SYSTEM** + **UNDEAD KING BOSS** + **ZENITH multi-sword path** + **BESTIARY menu** + **hearts/dodge** + **per-enemy hit cooldown** in one session.
  - **Hero classes** with intro-screen card select: KNIGHT (3HP, spinning sword) / MAGE (2HP, homing missiles) / NINJA (1HP, fast + shadow-dash). Per-class config object drives maxHearts, base speed, primary attack mode, and a Q-key special with its own cooldown. Class-aware sprite swap in drawKnight via PLAYER_FRAMES lookup.
  - **Heart system**: 2-HP base (or 1/3 by class) shown as ♥♥ HUD pip. Damage routes through damagePlayer() which rolls PLAYER_DODGE_CHANCE=0.15 first — dodge emits cyan "DODGE!" floater + 0.45s i-frames; hit costs 1 heart + 0.9s i-frames + red flash. Enemies drop hearts (giant 85%, brute 32%, zombie 10%, wraith 5%, shade 4%) that pop outward → land → magnet to player within 90px.
  - **Zenith multi-sword upgrade path**: 5 tiers at waves 1/3/6/9/12 add evenly-spaced rotating blades (1→5). Each tier bumps angVel +0.4 and tints the blade body (silver → ice blue → mint → amber → gold). sword.trails[] is now per-blade. Multi-blade collision picks the FIRST blade to land each hit.
  - **Middle-sword "infinite damage" bug fix**: angular subtention pad capped at 0.45rad + new per-enemy `e.hitCD = 0.22s` cooldown prevents wide-pad collision from burning through multi-HP enemies in a single frame. Sword hit-test loop iterates all Zenith blades but only one hit per CD window.
  - **Class specials** (Q or Shift): **KNIGHT SWORD CYCLONE** = ×3 angVel for 1.5s + 160px radial 4dmg detonation, 10s CD; **MAGE MISSILE STORM** = 10 homing missiles in radial spread, per-missile reacquires nearest enemy to MISSILE position (not player) so fan doesn't collapse, 14s CD; **NINJA SHADOW DASH** = teleport 160px in last-move direction, 3dmg to all enemies along path, 0.6s i-frames, 2s CD.
  - **Mage auto-attack**: every 0.65s fires a homing missile at the nearest enemy within 680px. Missile homes with 4.5/s steering toward target, 280→320 px/s, 1dmg.
  - **Ninja auto-attack**: every 0.55s the nearest enemy within 170px takes 2dmg via a cyan slash visual (ninjaStrikes). Knockback handled by the dash mechanic.
  - **UNDEAD KING boss** at waves 10/15/20/25/30: 17×21 crowned skull-king sprite (2 frames, gem pulse, cape ripple). Spawns from top center with dramatic flash+shake+banner. Circle-strafes at ~220px preferred distance. **Phase 1** (>50% HP): summons 2 shades every 3.5s. **Phase 2** (≤50% HP): "WRATH" announcement, speed ×1.65, summon cadence 2.4s, fires homing bone-bolts every 2s. Top-screen HP bar in gold (phase 1) / crimson (phase 2) with halfway marker. Death = 2 hearts dropped + 500 score + full juice.
  - **Bestiary menu** (📖 HUD button or **B** key): role=dialog overlay with 2 tabs (enemies / Zenith path). Each card has per-type left-border color + stats + Cormorant italic flavor prose. Escape closes; focus moves to close button on open, back to HUD button on close.
  - **Per-type enemy speed/HP buffs + zombie LUNGE attack + brute/giant per-wave speed scaling + global enemySpeedMul()** = enemies catch AFK knights by mid-late waves. Zombies state-machine: walking → tellLunge (0.45s red dashed arc) → lunging (0.35s burst at ×4.2 speed) → lungeCD (1.6s).
  - **Knight sprite polish**: 13×17 sprite with 4-row feathered red plume on top of helm, gold cheek plates, rivet-detailed pauldrons, 5-row flowing crimson cape with shadow rim that ripples differently in F0 vs F1.
  - **Mage + Ninja sprites**: 13×17 each. Mage = pointed purple wizard hat, glowing cyan eye, gold-tipped staff. Ninja = black hood + red headband + white eye-slits + twin daggers that swap sides per frame.
  - **HUD additions**: ♥♥ hearts pip + special-cooldown readout (cyan "READY" or "5.2s") + 📖 bestiary button.
- 2026-06-01: polished sprites + zombie LUNGE + speed-ramp + middle-sword fix + HP buffs.
  - **Sprite polish — 2-frame animations**: KNIGHT_F0/F1 (subtle breathing on pauldrons + cape fold ripple), SHADE_F0/F1 (ooze flex w/ light slick shift), WRAITH_F0/F1 (hooded specter w/ tatter shimmer), GOBLIN_F0/F1 (dagger forward → raised mid-stab), ZOMBIE_F0/F1 (mirrored arm-out walk cycle). BRUTE + GIANT polished but kept single-frame (heavy = static reads better). `SPRITE_BY_TYPE` is now arrays per type; `drawEnemies` picks frame from `Math.sin(e.bob) > 0` so it syncs to existing lurch. `knightAnimT` advances 2.2Hz and toggles KNIGHT_F0/F1 in `drawKnight`.
  - **Middle-sword damage fix**: previous hit-test only checked the enemy's CENTER angle against the swept wedge. Now adds `Math.asin(min(0.95, e.r / max(8, distToPlayer)))` to the angular pad — accounts for the enemy's physical angular half-width at its current distance, so anything clipping the middle of the blade registers a hit regardless of where along the blade.
  - **Zombie LUNGE attack**: new state machine on zombies — `walking → tellLunge (0.45s, dashed red arc telegraph + red flicker tint) → lunging (0.35s burst at ×4.2 base speed, ~200 px/s) → lungeCD (1.6s half-speed limp recovery)`. Lunge direction locks at tell-start so the player can sidestep during the 0.45s window. Triggers any time cooldown expires AND player is within 230px. Catches AFK knights.
  - **Global enemy speed boost**: new `enemySpeedMul()` returns `1 + min(0.85, (wave-1)*0.075)` — caps at ~1.85× by wave 12. Applied to ALL non-state-machine movement plus inside giant/zombie AIs. Stacks on top of per-type additive scaling in `spawnEnemy`.
  - **Per-type speed/HP buffs**: shade `52 + wave*4 / hp = 1 + wave/3`, wraith `84 + wave*5 / hp = 1 + wave/4`, goblin `70 + wave*4 / hp = 2 + wave/3`, zombie `36 + wave*2 / hp = 3 + wave/2`, brute `38 + wave*2.5 / hp = 5 + wave*0.8`, giant `22 + wave*1.2 / hp = 18 + wave*4`. Brute + giant now finally scale speed with waves.
- 2026-06-01: initial build + first revisions (sprite art + goblin/zombie). Survival-loop arcade game where a knight's cursed sword swings nonstop around their body — player only moves, sword auto-attacks 360° continuously.
  - **Loop**: WASD/arrows to move, sword rotates at fixed angular velocity. Enemies spawn from screen edges and march toward the knight. Walk in arcs to keep the sword between you and them. Touching an enemy = death.
  - **Sword physics**: `sword.angle += sword.angVel * dt`. Hit detection: enemy is "in the arc" if its distance to player is between `length - width/2 - 6` and `length + width/2 + enemy.r` AND its angular offset from sword.angle is within `angVel*dt*0.55 + 0.18` rad (the swept arc with a small forgiveness pad). Knockback on non-killing hits.
  - **5 enemy archetypes** with wave-influenced spawn weights:
    - **shade** (default fodder) — slow purple blob, 1 HP, 8pt
    - **wraith** (≥wave 2) — fast wispy ghost, 1 HP, 14pt
    - **goblin** (≥wave 2) — quick green darter with tiny silver dagger, 1 HP, 12pt
    - **zombie** (≥wave 3) — slow gray-green lurcher, 2 HP, 18pt
    - **brute** (≥wave 4) — armored shadow tank, 3+ HP scaling, 30pt
  - **Wave system**: ~18s per wave. Sword angular velocity ticks up slightly each wave (caps at +8 rad/s). Spawn burst count scales with wave. Spawn interval scales down with wave (min 0.35s).
  - **Combo**: each kill bumps combo ×1→×9, decays 2.2s after the last kill. Score = `reward × combo` per kill.
  - **16-bit pixel-art renderer** (Terraria-inspired):
    - `makeSprite(rows, palette)` helper converts string-array sprites into cell lists rendered at `PIXEL_SIZE = 3` (each sprite cell = 3×3 screen pixels)
    - Knight sprite: 11×11 cells, silver helmet w/ gold visor slit, mailed body, red cape draped behind
    - 5 enemy sprites hand-pixeled at 9×11 to 11×11 cells, each with a distinctive silhouette (wraith = tatter-tail wisp, goblin = pointy-ear hood + dagger pixels, zombie = stitched-mouth lurch + arm-out posture, brute = full armor with red rim, shade = simple blob)
    - Sword is procedurally drawn each frame as a chunky chain of 3×3 pixel rectangles stepping from grip → crossguard → blade with a darker shadow line on one side and white glints every other cell
    - Sword trail = age-tapered squares (no smooth strokes), tip flash brighter at center
    - Sparks = filled axis-aligned squares with brighter cream core (no glow blur)
    - Stars = 1px/2px filled rectangles (not smooth circles) so they pixelate cleanly when scaled
    - Background tiled grass/stone pebbles via deterministic hash → consistent frame-to-frame texture without per-frame randomization
    - `image-rendering: pixelated` on the canvas + `ctx.imageSmoothingEnabled = false` on every resize for hard-edged scaling
  - **HUD**: score / wave / combo (×N) / best with localStorage persistence under `knight_cyclone_best` + `knight_cyclone_best_wave`. New-best banner in the death overlay swaps the title to "A NEW LEGEND".
  - **Aesthetic**: dark medieval moonlit field — `#06081a` night sky with subtle radial vignette, Cinzel 900 title with red "Cyclone" mid-italic + glow text-shadow, Cormorant Garamond italic tagline, JetBrains Mono HUD numerals. Death overlay uses Cinzel "FALLEN" / "A NEW LEGEND" headlines. Mobile gets a chunky d-pad (3×3 grid layout) bottom-left, only shown on coarse-pointer devices.
  - **A11y per directive**: rem-everywhere, semantic markup (`<main>`/`<header>`/`<section>` + `<button type=button>`), role=application + descriptive aria-label on canvas, role=status + aria-live HUD + sr-only announcer, focus-visible gold outline on the start/restart buttons, 2.75rem touch targets, prefers-reduced-motion respected (game requires motion to function so the disable is at the CSS-effect level only — death overlay animation, etc. There's no motion-essential gameplay to gate).
  - Single self-contained ~31KB HTML, zero deps.

## issues
- The d-pad on mobile only allows 4 cardinal directions — no diagonal movement (would need a virtual joystick for smooth 360° movement)
- Sword hit-test is angular-sweep only; very fast enemies could theoretically tunnel through the arc between frames at very low fps (rare in practice with `dt` capped at 0.05)
- Brute HP-bar uses `Math.round(barW * (hp/maxHp))` so partial-pixel HP appears as discrete steps — by design for the pixel-art look
- No power-ups yet — every wave is purely the same loop with faster sword + more enemies

## todos
- Diagonal movement on mobile (virtual joystick or 8-button d-pad)
- Power-ups: longer blade, faster swing, briefly invincible, healing flask
- Boss enemies every 5 waves (e.g. a wraith lord with a banner of smaller wraiths)
- Sound: Web Audio synth for sword whoosh + enemy hit thunk + death scream
- More enemy types: bat swarms (group movement), archers (ranged)
- Particle pool for sparks to avoid GC pressure at high kill rates
- Pixel-perfect tile-aligned background instead of hash-positioned pebbles
- Optional CRT scanline overlay toggle
