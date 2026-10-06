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

- v1.1 (2026-10-06): the ring is a circle of rope laid on the sand (Tatum: "to count as boxing there should be a ring, a circle of rope on the ground, preventing players from running away"). Flat beach, no platform; the sea comes up close on the west side. Nobody can leave the circle (soft wall, knockback bounces off the rope). Grains knocked over the rope are lost on the beach for good; inside the rope they pile up and can be scooped back. Four stakes hold the rope (red corner, blue corner).
- v1.2 (2026-10-06): THE TIDE (Tatum, 01:38-01:52). Two phases: while the sand is dry it heals (scoops piles back, even from over the rope) and your hits charge the tide meter under the clock (knocked grains / 330, +0.08 per countered special, +0.1 per perfect). Full = T key, the meter button, or the TIDE button on phones. The sea washes across the ring, soaks the fighter (8 s soaked, then dries over ~4 s): no healing, no specials, slower windups, +30% grains per hit, and the going-out water drags 75% of the loose piles out to sea for good. ACCEPT PERMADEATH flashes as a glitchy terminal line (Tatum: the swarm's phrase), docks top-right and its letters crumble as the sand dries. "DRY AGAIN" when the window closes. Banner moved down to clear the tide meter.
- v1.3 (2026-10-06): FIRSTFLAGPOISONED (Tatum's special for the AI). 1 s tell: it rears back, head glows, the name glitches up as a lime terminal line with the hint "step back out of the cloud". Then it blows a cone of sand (3 m, widening); if it reaches you, you cough for 2 s: half your punches are dropped (*cough* pops up), block flickers, you move slower, touch buttons flicker, -3 hp. Stepping back out of reach = DODGED (counts as a counter). It's in the special bag with Escape, Swarm, Sacrifice. ACCEPT PERMADEATH / FIRSTFLAGPOISONED lines sit at 66% height so they don't hide the fighter.
- v1.4 (2026-10-06): anti-mash (Tatum: "if the player keeps spamming punch, the opponent doesn't do much healing"). Dry sand now heals all the time (13 grains/s under fire, 20/s after 1 s untouched, +3/round) in idle/guard/stagger/windup/strike/recover, not in stun/weak. Stamina: jab -0.15, swing -0.28, regen 0.2/s (0.55/s after 0.6 s without punching); punches thrown under 0.3 are tired: 40% damage, no stagger, 25% slower, gloves go dull red, TIRED in the HUD, one-time "TIRED — ease off" banner. The tide meter is now its own bar right under your health bar (Tatum), filling from damage dealt only. Labels follow the touch UI (TOUCHUI) instead of the pointer media query. Bots: a masher (jab every 0.1 s) now loses in round 2; a steady jabber wins late round 1 with the tide; a stamina-aware bot wins in round 2.

## Issues
- Headless Chromium runs at ~2 fps: use `SB.pause(true)` + `SB.logic(dt)` for synchronous probes; the round clock runs in real time.
- Fight balance checked with bots (hm/sb/bot.js, they block perfectly and jab every 0.27 s): idle player loses ~50 s into round 1; bots with the tide win round 1 with 7-17 s left (tide ready ~15 s in), without it they win late round 1 or in round 2. Humans are far slower, expect 2-3 rounds.
- Tide state lives in `T` (SB.T); wet line is E.wet > 0.6 (WETLINE). The sea-side rope only dampens to 0.55 so it never stops healing.

## Todos
- Optional (Tatum): round 1 in a lab, fighter escapes through a vent to the beach.
- og.png, phone screenshot check.

## Debug
- `window.SB` = { G, E, P, SH, newGame, queue, pause, logic, info, count }. `#shot` hash hides the end card.
