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

## Issues
- Sprites are small on phones (the building is ~374 px wide); a zoom may help.
- The café sign clips to "THE KETTL" — kept on purpose, the voice made it a joke.

## Todos
- Grow a sixth floor when more tenants come from chat (NF = 6 in w1).
- Sloppy's complication idea: whoever moves in last gets the worst job in the place.
- Agnes vs the ghost: rival gossip columns in the gazette.
- Ask Pushed about the walk-in names and whether Otis may cameo.
