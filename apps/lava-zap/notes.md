# Lava Zap

Tatum's idea (sloppy.live chat, 2026-09-29): target practice inside a lava lamp. A shot only counts if it zaps two blobs at once; score by time and triple+ shots. Blobs rise and fall, shrink and grow, never merge or split. First person on the flat floor, no jumping, "a bit like fishing or hunting". Translucent bubbles, hot spots on the floor as map clues, horizontal air currents from vents, and "ideally an expert player builds a 3D flow map in their head, keeping track of areas that are out of sight".

## Art direction
- **Look**: a warm, calm night inside the glass. Translucent soap-film bubbles (fresnel rim, thin-film iridescence, clear middle) over deep plum liquid. Palette: liquid #2a0a31/#3a0d3e, wax pink #ff4fa3, wax orange #ff7a3a, hot yellow #ffd65a, cream #fff1dc, accent: laser cyan #7ff6ff.
- **Mood and light**: hemisphere pink/orange, a dim heater point light, a cool lilac light from the lid. Exp fog in the liquid colour, so far bubbles melt into the plum.
- **Camera**: first person at eye height 1.7 m, FOV 72 (84 in portrait), no jumping, pitch -1.2..1.45.
- **Hero**: the bubbles are the stars; the player is a small brass-and-glass ray gun with a tiny lava-lamp battery in the corner of the view.
- **World**: foreground = heater plate (dark coil rings, wandering hot spots, a floor glow under each bubble); midground = the bubbles; background = glass walls with vertical streaks, rising specks, the lid.
- **Sound**: calm and satisfying, not tense (Tatum): the lamp song (slow pentatonic phrases + pad), a whisper of brown-noise hum + 55 Hz drone, vent whooshes, a crisp zap, round pops, a triangle chime for triples.
- **Budget**: about 25-30 draw calls and 11k triangles in play (phone budget is 100-150 / 300k).

## Rules
- A zap pops every bubble on its line if there are 2 or more. One bubble alone gets shoved along the beam (and the shove can knock bubbles into line). The last bubble pops on its own (with 12 bubbles you only end with one after a triple, so it's a reward, per Tatum).
- Score = time in the lamp - 3 s for every bubble past two in one zap. Triples (3+) are counted.
- Today's lamp: seeded by the UTC date, same start for everyone; best per day in localStorage (`lz.best.<date>`). Random lamp: no record.

## Log
- v1.0 (2026-09-29): first person hunt in a 3D lava lamp (three r186). Bubbles heat on wandering hot spots, swell and rise, cool and shrink at the lid, sink. Crosshair counts bubbles on the line (×2 cyan, ×3 gold) and lights them faintly. Zap with click (pointer lock), space or the ZAP button; left-thumb stick and right-thumb look on phones. Pop spray, beam, gun kick and recharge ring. Title / pause (Esc, P) / cleared cards, sound toggle (M).
- v1.0.1: Tatum hit two load errors live: "Unexpected token '{'" in one browser (three r186 uses class static blocks, which older engines can't parse) and "Error resolving module specifier three" in Firefox (the import map was ignored). Now three r170 is imported by its full URL, no import map.
- v1.1: vents. Three slots in the glass at different heights (seeded per lamp) blow steady sideways currents that breathe on their own slow rhythm (9-15 s). You see them as lilac streak ribbons scrolling away from the grille and by the rising specks bending sideways in them; bubbles drift with them (force 2.6, about 1 m/s at the strongest). Heater surge every 35-60 s: the coils flicker for 2 s, then the plate flares and bubbles below 9 m heat up and rise together. Phones: smaller gun; a touch after a locked mouse no longer pauses.
- v1.1.1: each vent has a soft whoosh (band-passed noise) that swells with its breath, gets louder near the current and is panned left/right to where it is, so you can hear the air behind you.
- v1.2: today's board. Clearing today's lamp posts your run to Supabase table `lava_zap_runs` (day, name, score_ms, time_ms, triples, zaps; one row per user per day, only a better score replaces it). The title card lists today's top 5 (plus your row), the cleared card shows the board with a name box (defaults to your Twitch name, else "hunter xxxx"; stored in `lz.name`). A local best from before the board existed is posted once when the title loads. Own inline client (UMD supabase-js 2.39.0, async); offline shows a quiet line and keeps the local best. Tatum: 27.4 s on 2026-09-29 with the vents.
- v1.2.1: the last two drift together. Tatum: "the worst part is waiting for the final 2 blobs to sink enough to line up". With two left, while no line through them reaches eye height comfortably inside the lamp (crossing point < FLOOR_R-5, not steeper than ~82°), they pull toward each other sideways (1.4 m/s²) and spread apart in height when level (1.1 m/s²), ramping in over 1.5 s; a toast says so once. Simulated from 6 bad starts: a line opens in 3-4.6 s with the drift, 30 s+ or never (within 40 s) without it.
- v1.3: the lamp song (Tatum: "can you compose some gentle rising and falling tones BGM?"). Generative: phrases of 3-6 notes on an A major pentatonic (A3-B5, over the 55 Hz drone) that climb or sink one or two steps at a time, each note a sine plus a quiet octave triangle that swells in over 0.28 s with a small glide in its direction and fades over 3 s, through a lowpass and a 0.62 s echo; rests of 2.5-6 s between phrases; a 3-sine pad changes chord every 12 s (A, F#m, D sus, E). Scheduled 0.6 s ahead from a 250 ms timer; 40 % volume while paused. The brown-noise hum is down from 0.09 to 0.035. Offline render: peak 0.10, RMS about 0.02 (pops peak about 0.16). Probe page `gaunt/lz3/mus.html` renders 40 s offline and draws the notes.

## Issues
- Never go back to an import map or three r186 here: see v1.0.1.
- Headless SwiftShader runs at a few fps, so probes freeze the loop (`renderer.setAnimationLoop(null)`) right after the action to screenshot it.
- The dark disc you see when looking straight up is the lamp's lid, not a rendering bug.

## Todos
- Maybe a flow-map overlay for beginners.
- Exact replays / ghost runs for speedrunners (Tatum: "runs will feel like choreography"): needs shots stamped to physics steps.
- Hard mode idea: refraction through bubbles.

## Probes
Scratchpad `gaunt/lz3/p3.js`: `#pair` (stands where a line crosses eye height and fires), `#lone`, `#clear`, `#aim`, `#title`, `#og`, `#board` and `#carry` (with `stub.js`, an in-memory stand-in for the database client that replaces the UMD script in t3.html; tests never write to the real table).
