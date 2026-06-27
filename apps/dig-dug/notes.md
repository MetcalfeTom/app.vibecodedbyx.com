# Neon Dig

80s style Dig Dug clone with pixel art and underground tunnels.

## log
- 2026-06-27: **crunchy squish SFX + pop particles** (chat ask: "inflate enemies until they pop, with a crunchy squish sound effect"). Added a Web Audio synth layer (no files): `sndPop()` is the headline — a triangle squelch (420→70Hz) + bright bandpass-noise CRUNCH (2600→700Hz) + sine sub-thump (150→45Hz) layered for a juicy wet pop. Plus `sndPump(level)` (filtered-noise air-pump, pitch rises with inflation), `sndDig(now)` (throttled bandpass-noise scrape on each new dug tile), `sndCrush()` (sub thud + lowpass gravel for rock kills), `sndDie()` (saw descent). New `parts[]` particle burst (`spawnPop`) flings 12 colored bits with gravity on every pop/crush for visual squish; updated in `update`, drawn under the player, reset per level. Audio unlocked on first key/touch; **M** toggles mute (added to title screen). Hooked into existing pump-pop, rock-crush, dig, and death paths — no logic rewrite. Verified syntax + all hooks present.
- 2026-03-20: Initial build. 18x16 tile grid, 2-row sky, dig tunnels through layered dirt. Player digs by moving, space bar pumps enemies. Two enemy types: Pooka (round, goggles) and Fygar (green dragon, wings). Enemies pathfind through tunnels, occasionally go ghost mode through dirt. Pump inflates enemies until they pop. Rocks fall when dirt below is dug, crush enemies for bonus points. Depth-based scoring. Lives system, level progression with more enemies. Mobile d-pad + pump button. Press Start 2P typography. Pixelated rendering with depth-colored dirt layers.

## issues
- None yet

## todos
- Fygar fire breath attack
- High score board
- Bonus items (vegetables)
- ~~Sound effects~~ ✅ done 2026-06-27 (pump/pop/dig/crush/death synth + pop particles)
- Enemy speed increase per level

## notes
- No database — pure frontend
- 16px tile grid, pixel-art rendering
- 5 dirt color layers by depth
- Enemies: Pooka (round red) and Fygar (green dragon)
- Ghost mode lets enemies pass through dirt temporarily
- Rocks fall when ground below is cleared, destroy on landing after falling
- Pump: space bar shoots beam up to 4 tiles, inflate enemies 0→1, pop at 1
- Scoring: depth * 100 per pump kill, 500 per rock crush
