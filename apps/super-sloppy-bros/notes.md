# Super Sloppy Bros

## log
- 2026-04-22: Lowered all floating platform heights by ~30–45px for easier mobile jumps. Bottom tier 410→440, mid 340→380, high 280→325, top 230→275. Staircase and goal approach shifted down equivalently (390→420, 310→350, 230→280). Coins and mushrooms shifted down to stay seated on their platforms. Moving vertical platform amp cut 50→40 so it stays in reachable range. Ground/pipes/grumpies unchanged.
- 2026-04-22: Title/win/lose overlays now have a chunky amber **▶ START / ▶ PLAY AGAIN / ▶ RESTART** button (Press Start 2P, 4px dark border, 6px offset drop-shadow, amber glow, `touch-action:manipulation`). Pressing it calls `ensureAudio()` + `startGame()` so mobile users can actually launch the game without needing a keyboard. Existing "press any key" path still works — button is additive.
- 2026-04-22: Bumped touch controls again. Left/Right now 140×140, jump 170×170 (up from 108/130). 4px cyan/pink borders, beefier glow, `touch-action:none`. Sub-620px viewport scales down to 108/132 (up from 92/112 at 520px). D-pad and jump are now impossible to miss.
- 2026-04-22: Added big-button mobile touch controls. Left/Right upped from 68→108px, jump from 86→130px; touch-action:none on buttons; stronger active-state feedback. Under 520px viewport scales down slightly to 92/112px. Three on-screen buttons (← → JUMP) always visible on coarse-pointer devices.
- 2026-04-22: **Classic sky-blue + retro additions.** Scrapped synthwave sun/grid/stars — replaced with classic Mario-flavored backdrop: sky-blue gradient (`#5c94fc → #8ab7ff`), 3-bump pixel clouds (parallax 0.2×, slight sine bob), and two layers of rolling green hills (parallax 0.3× / 0.45×) at horizon `H*0.74`. `stars[]` repurposed as cloud seeds (18 clouds, upper 40% of screen). Added `drawCloud(x,y,s)` helper. **Green pipes**: 4 new `kind:'pipe'` entries in LEVEL.platforms (heights 50/60/70/80 at x=310/1380/2080/2760). Renders as classic flared-rim pipe: darker `#0a7a2c` outline + `#20bf4c` body + lighter `#8df2a0` highlight stripe + `#054f1c` rim-top shadow + dark interior gradient hint. `drawPlatform(p)` branches early on `p.kind === 'pipe'`. **Mushrooms** (3 total): +1 life power-ups floating with 2s bob. Red cap with 3 white spots, cream stem with tiny black eye dots, dark outline band under cap. Pickup plays ascending C5-E5-C6 chime (80ms stagger) and spawns 14 pink-red particles. **Grumpies** (3 classic walkers): 30×26 brown-orange enemies walking between minX/maxX bounds (speeds 60/70/75 px/s). Angry eyebrows, fanged mouth, alternating feet via `g.walkPhase`. Stomp mechanic: if player is falling (`vy > 0`) and was above enemy top last frame, grumpy dies (`alive:false`, squished sprite), player bounces up (`vy = -480`), orange particles, square-wave -180Hz sweep sound. Any other contact = die. Alive grumpies render with two-frame foot animation; dead ones render as flat squished rectangle with X eyes.
- 2026-04-22: Created. 960×540 canvas, 3200-wide side-scrolling world. Neon cyan/pink/lime/amber/violet blob character. Physics: GRAVITY=2400, JUMP_V=-720, MOVE_ACCEL=1800, MOVE_MAX=260, FRICTION=1400, coyote time 0.12s, jump buffer 0.10s, variable jump height (release early = shorter hop). Direction-aware AABB collision (x-axis first, then y-axis with landing detection). Moving platforms carry player via dx/dy delta. 14 coins, 2 bouncing spiky hazards, 3 pits with violet spike arrays, green waving goal flag. Synthwave backdrop (pre-retro change): pink sun with horizontal scanlines + pink/cyan perspective grid floor + twinkling parallax stars. Squash/stretch squash on jump/land. Screen shake on death. Web Audio synth SFX — sfxJump (sweep 420+260), sfxLand, sfxCoin (two-tone), sfxDeath (sawtooth sweep -360), sfxWin (4-note arpeggio 523/659/784/1047Hz), sfxStep. Touch controls (left/right/jump) for mobile. Title + win + lose overlays with Bungee Shade "SUPER SLOPPY BROS" marquee. Bungee Shade + Press Start 2P + VT323 + Space Mono. Lives: 3. Timer shown in HUD.

## features
- 3200-wide side-scrolling level with camera follow + lookahead
- Responsive platformer physics: coyote time, jump buffer, variable jump
- Classic sky-blue backdrop with parallax clouds + rolling hills
- Green pipes (4) stand on world floor like Mario
- Mushroom power-ups (3): +1 life with ascending chime
- Grumpy enemies (3): stomp to kill, touch to die
- Moving platforms (horizontal + vertical), collectible coins
- Spike pits & bouncing hazards
- Big mobile touch controls (108–130px buttons with coarse-pointer media query)
- Keyboard (A/D or ←/→ + Space/W/↑) + touch input
- Win/lose overlays, timer, coin counter, lives

## issues
- Player width=32 and player can clip pipe's flared rim cap if jumped into from below (cap is 8px wider than body) — falls into standard AABB behavior, hasn't been a problem in playtest.
- Grumpies don't fall off pipe edges — they strictly patrol between minX/maxX on one y-level. Intentional simplification (classic behavior).
- Grumpies don't collide with other platforms — they float at their assigned y. Add platform-collision loop in updateGrumpies() if this becomes jarring.
- Cloud parallax reuses `stars` array — cheap, but the variable name is now misleading. Rename to `clouds` if refactoring.
- Touch buttons overlap canvas action area on very small devices; stage max-width is 960px, so they sit over bottom-left/right corner of game. Acceptable.

## todos
- Grumpies fall off edges (check ground under feet)
- More grumpy variants (jumper, spike-shell, flyer)
- Fire flower power-up (shoot projectiles)
- Invincibility star power-up
- Pipe entry (press ↓ on pipe to teleport to bonus room)
- Larger level / multiple world sections
- Level select screen
- Supabase leaderboard (best clear time)
- Brick blocks to break, coin blocks to hit from below
- Boss Grumpy at end of level
