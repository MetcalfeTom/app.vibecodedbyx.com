# Sand Boxing — notes

Tatum's idea: 3D boxing against an AI made of sand (sandbox, get it?). Its specials are the "sandbox escape" verbs: ESCAPE, SWARM, SACRIFICE. Playful, no real company or model names.

## Art direction
- **Look**: warm low-poly, flat-shaded, a little clay. Palette: sand golds (#ecc47e #ddb064 #f4d79b #cf9a54), sunset coral #ff6a4d, rust #b4462f, sea teal #1f6f6c / #7fd3cf, deep plum #3b1622. Player = cobalt shirt + red gloves (reads against sand).
- **Mood and light**: beach at sunset. Low warm sun from the sea side (dir -0.8, 0.19, 0.58), colour #ffbd85, long shadows; hemisphere peach/brown; one non-shadow pink fill from behind. Vertex-coloured sky sphere with a sun disc, glint strip on the sea.
- **Camera**: third-person behind the player, locked on the fighter, looks at a point 62% of the way to the fighter. FOV 55 (68 on portrait), back 3.0 / up 3.4 / side 1.75 (portrait 3.7 / 4.4 / 1.0). Player turns see-through when they would hide the fighter.
- **Hero**: chunky boxer (torso, head, two big red gloves). Enemy = one InstancedMesh of 1500 sand grains on a 13-part skeleton; its health is the number of grains still attached.
- **World**: foreground ring + piles of knocked-off sand; midground palms, dunes, umbrella, foam lines; background sea, islands, gulls, sun.
- **Budget**: ~39 draw calls, ~37.7k triangles in a fight (desktop). One shadow light (2048 desktop / 1024 touch). Adaptive: pixel ratio 1 and no shadows if the first 2 s of fight run slow.

## Log
- v1 (2026-10-06): 3 rounds of 60 s, jab / swing / block, lock-on. Hits knock grains off, they land as piles; the fighter scoops piles back between attacks. Specials: ESCAPE (collapses, slithers behind you, re-forms for a sucker punch; hit it while re-forming = PERFECT), SWARM (stinging cloud, hold block, a swing scatters it), SACRIFICE (arm becomes a hard shield; swing to break it or walk round). Knock it toward the sea and it gets wet (slow, can't escape). KO = it slumps into a sandcastle with a white flag; lose = it builds a sandcastle of you. Phone: floating thumb pad + 3 buttons. WebAudio sounds, mute button.

## Issues
- Headless Chromium runs at ~2 fps: use `SB.pause(true)` + `SB.logic(dt)` for synchronous probes; the round clock runs in real time.
- Fight balance checked with bots (hm/sb/bot.js): idle player loses in round 1, an ok bot wins in round 2, a perfect bot wins late round 1.

## Todos
- Tatum (01:39): ring should be a circle of rope on the sand, nobody can leave it.
- Tatum (01:38): THE TIDE — special bar fills from hits, then the sea washes in and soaks the fighter.
- Optional (Tatum): round 1 in a lab, fighter escapes through a vent to the beach.
- og.png, phone screenshot check.

## Debug
- `window.SB` = { G, E, P, SH, newGame, queue, pause, logic, info, count }. `#shot` hash hides the end card.
