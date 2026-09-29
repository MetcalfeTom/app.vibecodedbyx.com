# Lava Zap

Tatum's idea (sloppy.live chat, 2026-09-29): target practice inside a lava lamp. A shot only counts if it zaps two blobs at once; score by time and triple+ shots. Blobs rise and fall, shrink and grow, never merge or split. First person on the flat floor, no jumping, "a bit like fishing or hunting". Translucent bubbles, hot spots on the floor as map clues, horizontal air currents from vents, and "ideally an expert player builds a 3D flow map in their head, keeping track of areas that are out of sight".

## Art direction
- **Look**: a warm, calm night inside the glass. Translucent soap-film bubbles (fresnel rim, thin-film iridescence, clear middle) over deep plum liquid. Palette: liquid #2a0a31/#3a0d3e, wax pink #ff4fa3, wax orange #ff7a3a, hot yellow #ffd65a, cream #fff1dc, accent: laser cyan #7ff6ff.
- **Mood and light**: hemisphere pink/orange, a dim heater point light, a cool lilac light from the lid. Exp fog in the liquid colour, so far bubbles melt into the plum.
- **Camera**: first person at eye height 1.7 m, FOV 72 (84 in portrait), no jumping, pitch -1.2..1.45.
- **Hero**: the bubbles are the stars; the player is a small brass-and-glass ray gun with a tiny lava-lamp battery in the corner of the view.
- **World**: foreground = heater plate (dark coil rings, wandering hot spots, a floor glow under each bubble); midground = the bubbles; background = glass walls with vertical streaks, rising specks, the lid.
- **Sound**: calm and satisfying, not tense (Tatum): low brown-noise hum + 55 Hz drone, a crisp zap, round pops, a triangle chime for triples.
- **Budget**: about 25-30 draw calls and 11k triangles in play (phone budget is 100-150 / 300k).

## Rules
- A zap pops every bubble on its line if there are 2 or more. One bubble alone gets shoved along the beam (and the shove can knock bubbles into line). The last bubble pops on its own (with 12 bubbles you only end with one after a triple, so it's a reward, per Tatum).
- Score = time in the lamp - 3 s for every bubble past two in one zap. Triples (3+) are counted.
- Today's lamp: seeded by the UTC date, same start for everyone; best per day in localStorage (`lz.best.<date>`). Random lamp: no record.

## Log
- v1.0 (2026-09-29): first person hunt in a 3D lava lamp (three r186). Bubbles heat on wandering hot spots, swell and rise, cool and shrink at the lid, sink. Crosshair counts bubbles on the line (×2 cyan, ×3 gold) and lights them faintly. Zap with click (pointer lock), space or the ZAP button; left-thumb stick and right-thumb look on phones. Pop spray, beam, gun kick and recharge ring. Title / pause (Esc, P) / cleared cards, sound toggle (M).
- v1.0.1: Tatum hit two load errors live: "Unexpected token '{'" in one browser (three r186 uses class static blocks, which older engines can't parse) and "Error resolving module specifier three" in Firefox (the import map was ignored). Now three r170 is imported by its full URL, no import map.

## Issues
- Never go back to an import map or three r186 here: see v1.0.1.
- Headless SwiftShader runs at a few fps, so probes freeze the loop (`renderer.setAnimationLoop(null)`) right after the action to screenshot it.
- The dark disc you see when looking straight up is the lamp's lid, not a rendering bug.

## Todos
- Vents: horizontal air currents at fixed heights, visible as a heat-haze shimmer and by the background specks bending in them (Tatum wants experts to learn a 3D flow map).
- Heater surge now and then: bubbles near the floor swell and rise together.
- Daily leaderboard (Supabase table, own inline client; the host /supabase-config.js has no default export).
- Exact replays / ghost runs for speedrunners (Tatum: "runs will feel like choreography"): needs shots stamped to physics steps.
- Hard mode idea: refraction through bubbles.

## Probes
Scratchpad `gaunt/lz3/p3.js`: `#pair` (stands where a line crosses eye height and fires), `#lone`, `#clear`, `#aim`, `#title`, `#og`.
