# Halo Lite

## log
- 2026-04-22: Created. Top-down sci-fi arena shooter. 1800×1200 arena, camera-follow lerp, metallic grid floor. **Player**: `{x, y, vx, vy, angle, radius:16, health:100, healthMax:100, shield:100, shieldMax:100, shieldRegenDelay, shieldBreakFlash}`. **Glowing blue shield** — cyan ring (`rgba(60,239,255, 0.35+0.4*a)`) drawn around player at `radius+6`, `shadowBlur = 18*a`, with inner shimmer ring wiggling via `sin(t*6)`. Shield absorbs damage first; on hit, `shieldRegenDelay = 2.6s`; once delay expires, regens at 28/s. On full break, 0.75× leak factor passes to health. Shield bar in HUD flashes when hit. **Weapons** (3): `pistol` (dmg 12, 280ms, speed 620, chief-green #b9ff4a), `rifle` (dmg 7, 90ms, speed 780, visor-blue #42b6ff), `sword` (melee, dmg 58, 360ms, reach 82, 0.45π arc, covenant-purple). **Enemies** (3 types): `grunt` (22hp, no shield, orange, score 15), `jackal` (30hp + 35 frontal-arc shield 0.9π, teal, score 35 — shield checks angle diff between damage dir and enemy facing), `elite` (70hp + 90 bubble shield, purple, 4-round bursts, score 100). Damage logic: jackals block only from frontal arc; elites full-bubble with 0.5× leak on break. **Wave system**: `startWave(n)` escalating composition (jackals @ wave 3, elites @ wave 5), between-wave interlude banner, full shield restore + 25 HP regen. **Controls**: WASD/arrows move, mouse aim, click fire, 1/2/3 weapon swap, Q cycle, Shift dash (0.22s, 1.15s CD, 820 velocity). **Touch**: virtual joystick left, fire + swap buttons right, auto-aim nearest enemy. **Audio**: Web Audio `tone()` + `noise()` helpers, SFX for pistol/rifle/sword/shieldHit/shieldBreak/hit/enemyDeath/eliteDeath/dash/waveStart/gameover. Minimap top-right, wave label top-center, score in Orbitron. Title "HALO LITE / ARMOR ONLINE / ENGAGE", game over "ARMOR OFFLINE / REDEPLOY". Orbitron + Share Tech Mono + VT323. Palette: steel/shield-cyan/chief-green/visor-amber/covenant-purple.

## features
- Glowing blue shield with 2.6s regen delay, cyan ring + shimmer, break flash
- 3 energy weapons (pistol/rifle/sword) with distinct feel and SFX
- 3 enemy types with differentiated shield behavior (no/frontal-arc/bubble)
- Wave-based progression with interlude + partial heal
- Dash with i-frames
- Touch-friendly virtual joystick + auto-aim
- Minimap, score, wave HUD
- Web Audio synth SFX

## issues
- Auto-aim on touch picks nearest enemy; can feel sticky when multiple close together
- No persistent high score yet
- Jackal frontal arc can be confusing — indicator ring helps but is subtle
- Elite bubble shield full-absorb means early waves with elites can feel grindy if only pistol
- CSS shadowBlur on shield ring is expensive; dozens of bullets + shield active can dip fps on weak GPUs

## todos
- Pickup drops from dead enemies (health / overshield / ammo pack)
- Grenade button (plasma grenade lobbed with AoE)
- Boss enemy (hunter) every 5 waves
- Leaderboard via Supabase
- More arenas (swap map between waves)
- Controller support (gamepad API)
- Overshield powerup that stacks 150% shield
