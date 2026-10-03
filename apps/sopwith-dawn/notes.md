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

## issues
- Lift-off: holding the pull-up key straight after lift-off looped the plane backwards; the first .45 s in the air turns at a quarter rate.

## todos
- Ideas: the ox on the runway joke, AA guns, a second mission with a new map, the sun rising during a mission.

## testing
- window.__S: freeze(true), start(), step(n, ['l','r','boost','fire','bomb']), draw(), G(), P(). Probe: scratchpad hm/psw.js (taxi, lift, bomb run, land/refuel, crash, respawn).
