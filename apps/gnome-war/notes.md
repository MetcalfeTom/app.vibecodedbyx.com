# gnome-war

## log
- 2026-05-02: Created. **Cottagecore tower-defense — place angry gnomes to stop invading weeds.** Single-file vanilla canvas game, 640×384 buffer with `image-rendering:pixelated` for chunky garden vibes. **Map**: 20×12 tile grid (32px), 5-segment hand-drawn polyline path that snakes from west spawn to east cabbage patch. Path tiles tracked in a `pathTiles` Set (built from `tilesAlongSegment` walks) so placement clicks reject path tiles instantly. **5 gnome types**: PINK GNOME (25c, basic acorn pelter), AXE GNOME (60c, short-range hard hits), STONE GNOME (50c, slows weeds 50%), WIZARD GNOME (100c, splash damage), BOMBARD GNOME (140c, long-range artillery). Each has its own hat color + body palette, drawn via inline canvas vector art (cone hat + pillow beard + skin face + robe + belt) with a subtle bob via `Math.sin(age*3.5)`. **5 weed types**: DANDELION (30hp 36spd), THORN (20hp 60spd), BRAMBLE (90hp 26spd), POISON IVY (60hp regen 4/s), CREEPER (160hp 22spd). Each weed renders as 3-leaf cluster + stem + angry eye-and-frown face, with HP bar above when damaged + cyan SLOW pip when slowed. **12 hand-tuned waves** with mixed weed plans + escalating counts; each wave builds a `spawnQueue` with per-weed delays. Wave-clear bonus = `10 + wave*4` coins. **Combat**: gnomes pick target with highest path-progress in range (closest-to-cabbage), fire a colored projectile at 260u/s, splash weapons spawn a fading ring + 0.55× damage to neighbors, slow weapons set `slowUntil = now+800ms`. Damage-number floaters in VT323. **Controls**: click gnome card to select, click grass tile to place (range circle preview + ghost gnome), right-click placed gnome to refund 60%, SPACE to start next wave. **Aesthetic**: green-checker grass + dark-soil path with pebble dots + dashed centerline, gold/plum/leaf palette, Fraunces italic display + Silkscreen + VT323 + Special Elite. Spawn portal renders as cyan triangle spiral + pulsing halo; cabbage patch as 3 stylized green cabbages. **Audio**: Web Audio synth — place (sine + triangle), hit (square blip), splat (sawtooth), coin (square pair), wave start (3-tone arp), bell (clear), bad (descending saw), win (5-note arpeggio). **HUD**: top WAVE/GARDEN/COINS pills in matching style. Title + end overlays in Fraunces italic. Mobile: palette stacks below canvas. Pollinations OG, 🍄 favicon.

## issues
- The path is hardcoded — same layout every run. Future: procedurally generate.
- Gnomes can be placed anywhere off-path but the placement logic doesn't check if it's reachable visually (some spots are surrounded by path tiles which is fine since path tiles are walkable for weeds, not for the player).
- No upgrade system yet — gnomes don't level up.
- Splash projectiles travel toward the moving target's CURRENT position; if the target dies mid-flight the splash detonates at the last known position.
- No prestige / meta-progression. Each run is fresh.

## todos
- Procedurally generated path per run.
- Per-gnome upgrade tier (click placed gnome → spend coins to upgrade).
- More weed types (boss weed at wave 6/12).
- Sell gnome menu instead of right-click for mobile.
- Speed-up button (fast-forward 2× during waves).
- Multi-path layouts.
- Endless mode after wave 12.
- Music — soft cottagecore loop.
