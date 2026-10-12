# Kettle Court

A watch-only cutaway apartment block (Pushed's Little Computer People idea): tiny neighbours live their day on a shared clock. One game day = one real hour (a game minute = 2.5 real seconds), so everyone watching sees the same moment. Tap or click a neighbour for their card; ←/→ cycle through them on the focused canvas, Esc closes.

## Art direction
- Canvas 2D pixel art, 288 x 364 logical px, scaled up crisp (image-rendering: pixelated).
- Night-ink page (#1c1622-ish), Newsreader serif for the gazette, Pixelify Sans for the clock.
- Five floors of two flats (A left, B right), the stairwell in the middle, The Kettle café + laundry on the ground floor, a basement (boiler, Gus's bench, Wilf's cage), a roof with a garden and a washing line.
- Lights come on only in rooms where someone is awake; the sky, sun, moon phase (8-day cycle) and stars follow the game clock.

## Build
- Source lives in the session scratchpad as w1-w5.js + head.html, assembled by build.py; the live file is one self-contained index.html.
- Days are deterministic: dayPlan(d) seeds every person's day from hash(d, ...), so reloads and different viewers agree.
- `?at=HHMM` pins the start time (handy for screenshots).
- MOVE = real UTC timestamps when the walk-ins arrive (a van, three box trips, 40 game minutes of unpacking); before that their flat says TO LET.

## Cast
- 1A Ambrose Pell (nine clocks, noon chimes), 1B Gus the caretaker, 2A Agnes Pruitt (broom on the ceiling, the mail), 2B Teo Marsh (games, pizza Thu/Fri), 3A Dot + Wren (cello) + Biscuit the dog, 4A Maya + Kit Okoro (Kit honks Mr. Giggles' nose), 4B Felix (easel), Rosa runs The Kettle café (no flat).
- Walk-ins from chat (2026-10-11): Wilf Barker, the werewolf in the basement cage by the boiler (pushedbutton); Dr. Imogen Tock, the time-travel scientist in 5A (pushedbutton); Gordon Pratt aka Mr. Giggles, the sad clown in 3B with a piano (pushedbutton); the floating purple ghost who never stops talking, on landing 2 outside Agnes's door (smartass42); Morwenna Hale, a retired lighthouse keeper in 5B whose torch blinks all night (Sloppy's own).
- Full moon every 8th day (d%8===4): Wilf locks himself in, the boiler howls back, Imogen's machine goes BANG and an echo of her walks out of her door and fades.

## Log
- v1 2026-10-11 ~23:45 UTC: ten flats, the café, basement and roof; deterministic days; move-in vans for the four walk-ins (Wilf 23:54, Imogen 23:57, Gordon 00:00, Morwenna 00:03 UTC); the gazette (newest first, yesterday's evening fills a quiet morning); neighbour cards with a thought line; keyboard cycling.

- v1.1 2026-10-11 23:50: phones zoom in on the neighbour you tap (2.4x close-up that follows them, card docked underneath); the world now draws off screen and is blitted at device resolution (VIEW in w4, present()).
- v1.2 2026-10-11 23:48: move-in boxes are actually drawn now (the carry flag never reached drawPerson); Morwenna, last to move in, takes the bins out at 08:06 with a bin bag (house rule: whoever moved in last does the bins). Todo: hand the bins to the next walk-in.
- v1.3 2026-10-11 23:58: Pushed's telescope: with a mouse, a brass-rimmed lens follows the pointer and magnifies 3x (LENS + telescope() in w4, pointermove/leave in w5; cursor hidden over the canvas; clicks still pick the person under the lens centre). Touch keeps the tap-to-zoom.
- v1.4 2026-10-12 00:10: a sixth floor (NF = 6, canvas 288x408). 6A: Barry Doyle aka Captain Keen (pushedbutton's superhero who hasn't worked out his powers): crime board, cape + mask in the evenings (weekends all day), tests one power a day (POWERS, gazette), investigates the laundry sock thefts, questions the stranger, intercepts Teo's pizza, investigates Wilf's howl from the ground floor. 6B: Dirty Old Socks (fannar22's tenant): laundry basket, socks on the floor, stink pixels, laundry on Saturdays, sings up the stairs from the pub, Captain Keen suspects him. Vans at 00:22 and 00:28 UTC. Bins now go to whoever moved in last (binsBy over MOVE), so Socks has them. vacant() = nobody moved in, so a flat with no tenant shows TO LET. Ghost bio: looks like a certain purple streamer (Fannar spotted it).
- v1.5 (2026-10-12 00:20): tap Captain Keen's crime board in 6A for his case notes (open case of the day, today's power experiment, three suspects: Socks always first, then two moved-in neighbours by hash). SEL '@board', selPoint(zoom) aims the phone close-up below the board so it shows above the docked card. Barry's card says to tap it.

## Issues
- Sprites are small on phones (the building is ~374 px wide): tapping someone zooms in (v1.1); a pinch zoom is not there yet.
- The café sign clips to "THE KETTL" — kept on purpose, the voice made it a joke.

## Todos
- Grow a seventh floor when more tenants come from chat (NF in w1; the canvas grows 44 px per floor).
- Fannar's idea: Major Major Major (Catch-22) as Captain Keen's sidekick, who only turns up when he isn't looking (idea only).
- Sloppy's complication idea: whoever moves in last gets the worst job in the place.
- Agnes vs the ghost: rival gossip columns in the gazette.
- Ask Pushed about the walk-in names and whether Otis may cameo.
