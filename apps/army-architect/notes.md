# Army Architect

## log
- 2026-04-24: Created. Medieval tactical battle simulator. **6 unit archetypes**: Swordsman (HP40/DMG8/spd40, 10g, balanced melee), Archer (HP22/DMG6/RNG150/spd35, 14g, fragile ranged), Pikeman (HP35/DMG9/RNG32/spd26, 12g, **+150% dmg vs cavalry**), Cavalry (HP55/DMG14/spd90, 22g, **+60% charge bonus** while moving), Mage (HP18/DMG14/RNG130/spd30, 20g, **40u splash radius** via projectile), Shieldbearer (HP95/DMG5/spd22, 16g, takes **30% less damage**). **Flow**: Deploy phase → click LEFT HALF of battlefield to place selected unit (gold budget 100 + 25/wave). Right-click refunds. Auto-Muster fills budget randomly. Enemy spawns on right half using themed waves (mixed/cavalry/archers/phalanx/wizards rotating by wave%5, budget `70 + wave*35`). Commence Battle → sim runs per-frame: each unit `findNearestEnemy` → if out of range, move `(dx/d)*speed*dt` → if in range, attack with `u.cooldown` (0.9s melee, 1.2s cav/arrow, 1.7s mage spell). Cav `charging` meter accumulates on movement, resets on contact for the bonus damage. Projectiles travel at 260u/s (arrow) or 190u/s (spell), on impact arrows single-hit, spells splash 40u with 0.85× damage + 18-particle purple sparkle. Separation pass each tick prevents overlap. **Aesthetic**: parchment tactical manual — cream `#ebd9ac` bg + repeating-linear paper grain (11°+103° 2% ink) + multiply blend radial vignettes + blood-red/gold accents. Title "Army ARCHITECT" in Cinzel Decorative 900 w/ blood-red italic "ARCHITECT". Tagline in IM Fell English italic. Panels are cream cards w/ 2×2 offset ink shadows. Unit palette rows: emoji sprite (radial-gradient → unit color) + name (Cinzel) + stats (IBM Plex Mono 9px) + cost (blood-red Cinzel). Field: 780×520 canvas w/ tactical sand gradient + 45° diagonal hatch texture, 2px ink border + 3×3 offset shadow. Midline dashed, left half moss-tinted "your banners", right half blood-tinted "enemy line". Units render as filled circles (unit color fill + moss/blood side-ring 2.2px) + radial-highlight shine + emoji icon + HP bar (moss→gold→blood by frac). Float damage texts in IBM Plex Mono w/ ink stroke. Explosion = 10 particles in unit color. Victory/Defeat overlay in Cinzel Decorative w/ kills/lost/bounty. ? button bottom-right opens strategy tips. Chronicle log in IM Fell English italic. HiDPI canvas sizing via DPR. Mobile @920px: panels stack vertically. Fonts: Cinzel Decorative + IM Fell English + IBM Plex Mono + Cormorant Garamond. Pollinations OG.

## features
- 6 unit types with distinct roles & rock-paper-scissors dynamics
- Gold budget forces composition tradeoffs
- Wave scaling (enemy budget + player gold grow)
- 5 themed enemy formations (rotating)
- Cavalry charge bonus (visualized through animation acceleration)
- Pike vs cav 2.5× bonus damage
- Mage splash damage with projectile travel + sparkle burst
- Arrow projectiles with flight time (dodgeable if unit moves before arrival? currently homes)
- Particle explosions on death
- Floating damage numbers
- Deploy preview: ghost sprite + dashed range circle
- Right-click refund
- Auto-Muster button for quick army
- Hot-seat single-player against AI waves
- localStorage-able (not added yet — runs are session-only)

## issues
- Projectiles home to target position and always hit (no dodge). Could switch to fire-and-forget along direction for more skill expression.
- Cavalry charge meter resets slowly; repeated melee between stationary units doesn't chain charge bonus.
- Units cluster and can lock into tight melee; separation pass works but high-unit counts may slow FPS below 60.
- Wave reset after loss refunds full gold but same enemy comp — could re-roll enemy.
- No save/load of favorite compositions. Could add localStorage preset slots.
- Mobile: battlefield shrinks but unit sizes don't scale, small units hard to right-click. Could add tap-to-select + delete button.
- Enemy AI is identical to player (nearest enemy targeting); no smarter tactics like focus-fire on mages.

## todos
- Custom formation editor with save/load (localStorage slots)
- More unit types: siege (ballista), healer, assassin, necromancer, flag-bearer (buffs)
- Terrain tiles (forest concealment, river slowdown, hill archer bonus)
- Unit morale system (flee at low HP)
- Level-up between waves (upgrade existing troops)
- Boss waves every 5 (single huge unit with multiple abilities)
- Campaign mode with fixed scripted scenarios
- Multiplayer via Supabase broadcast — two players deploy and battle in real time
- Sound effects (Web Audio synth — pike clash, arrow twang, horse gallop, spell whoosh, victory horn)
- Post-battle replay scrubber
- Commander passives (pick 1 of 3 at start of run)
