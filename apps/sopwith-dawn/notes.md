# Sopwith Dawn

A fancy remake of the 1984 Sopwith, asked for by varj1 on 2026-10-03: "make a fancy version of the classic Sopwith game",
"make sure the colors are in the classic CGA scheme", "the looks", "factories", "crappy internal pc speaker sound", "fuel tanks".

## Art direction
- Canvas only ever uses CGA palette 1 high intensity: black #000, cyan #55ffff, magenta #ff55ff, white #fff. Shades come from 4x4 Bayer dithering, never from other colours (text on the canvas is snapped to one colour + black rim; rotated sprites use nearest sampling).
- 200 px tall like the CGA screen, 300-400 px wide depending on the window, scaled up pixelated.
- Sky: plain black (v1.1, varj1). A magenta far ridge (parallax .2), a black near ridge with a cyan rim (.45), white/cyan clouds (.55).
- Player: white/cyan biplane; enemies: magenta with a black and white cross. Ground: white edge, cyan grass, magenta earth dithering to black.
- Sound: one square-wave oscillator like the PC speaker; one sound at a time, highest priority wins (win tune > boom > moo/hit > gun/landing > bomb whistle > engine buzz that follows speed).

## log
- 2026-10-03 v1: fly, boost, gun, bombs with craters dug into the height map, 4 factories (chimney topples), 3 fuel tanks (chain blasts), 2 enemy hangars. Enemy planes take off from their airfield once you hit your first target (varj1 "wait") or get close; no new ones once both hangars are down. Land level and slow on the home runway to refuel, re-arm and repair. Birds you can strike, cows that get launched by bombs and moo (never hurt). Strip map at the bottom like the original. 3 planes; win bonus 300 per plane left; best score/time in localStorage.
- 2026-10-03 v1.1: plain black sky (varj1: "remove the background sky"); the dithered dawn, sun and stars are gone, ridges and clouds stay. Phone pad: bigger turn arrows, labels fit.

- 2026-10-06 v1.2: three missions (from the todo list): a mission picker on the title, each mission unlocked by clearing the one before, best score/time per mission (localStorage 'sopwith-dawn-prog'; mission 1 takes over the old 'sopwith-dawn-best'). 1 DAWN PATROL is v1.1's map. 2 FLAK ALLEY (seed 1918): 3 sandbagged AA guns whose barrels track you and fire shells fused for your height, leading you a little with 9-24 px of error; a burst within 13 px costs 1 hp (2 within 6). 3 THE ZEPPELIN (seed 1916): a 100 px dithered zeppelin drifts from the far end toward your runway at 11 px/s (about 3.7 min), bombing every 4-6.5 s, with a gondola gun that fires bursts of 3 inside 125 px; 100 hp, bullets 1, bombs 12, ramming crashes you; it smokes under half, falls nose-first and blows a crater for +1000 and the win; reaching your runway bombs it and ends the mission. HUD LEFT becomes ZEPPELIN %. On tall phones the menus are position:fixed over the whole screen.

- 2026-10-06 v1.2.1: on a narrow phone (< 560 px) the score row sits under the fuel row (they overlapped, ZEPPELIN 93% made it worse); shorter zeppelin warnings.
- 2026-10-06 v1.3: mission 4 NIGHT RAID (seed 1915, night: no clouds): 4 searchlights (kind 'light', 4 hp, 125 pts) sweep a dithered cyan beam 185 px long (half-width 2 + d*.075); flying into one locks it on, and it follows at .6 rad/s (a hard turn gets out) and lets go after .7 s outside. While any light is on you (G.lit) the AA guns see you from 420 px instead of 290, fire every .75-1.3 s and aim within 4-11 px. 'CAUGHT IN A SEARCHLIGHT!' at most every 6 s.
- 2026-10-06 v1.3.1: wings for each cleared mission (gold: no planes lost, silver: one, bronze: more; PROG.wing keeps the best) on the end screen and as ◆ pips under the mission buttons; the title stays on one line (it wrapped on big screens).
- 2026-10-06 v1.4: mission 5 BALLOON LINE (my own idea from the todo list): 3 kite balloons on cables from winch lorries. A balloon that can see you (within 260 px) sets G.lit like a searchlight; come within 170 px and the crew winds it down to 26 px, then lets it back up slowly. Shot in the air (balloonAt, 4 hp shared with the lorry) it falls burning and the observer parachutes; a ground hit on the lorry cuts it loose and it floats away. Flying into the balloon or its cable crashes you. stepBalloons/drawBalloon, hitTarget(t, dmg, x, y, air)
## issues
- Lift-off: holding the pull-up key straight after lift-off looped the plane backwards; the first .45 s in the air turns at a quarter rate.

## todos
- Ideas: the ox on the runway joke; escort planes that stick to the zeppelin; a mission 6 (a bridge? a train?). varj1 wanted a plain black sky, so no sunrise.

## testing
- window.__S: freeze(true), start(), step(n, ['l','r','boost','fire','bomb']), draw(), G(), P(). Probe: scratchpad hm/psw.js (taxi, lift, bomb run, land/refuel, crash, respawn). v1.2 adds pick(i) (opens and selects a mission), prog(), end(won), zepHurt(d, x, y); probes hm/sd2/pf.js (flak), pt.js (end screen + picker), pz.js#fly|burn|fall|down|lost. hud() only runs in the frame loop, so frozen probes read stale HUD text.
