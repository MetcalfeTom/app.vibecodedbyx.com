# maki-mura · notes

## log
- 2026-07-13: v1 (chat ask: "Maki-mura sushi ball roller — 2D canvas, WASD/arrows, grow on food collision, darker background w/ conveyor belts, score display"). **Katamari-lite**: maki ball (nori/rice/salmon rings, rice-grain specks rotating with roll angle), swallow rule `item.r < ball.r*0.8` → growth `r=√(r²+0.55·ri²)` (area-ish, test-exact); bigger items bounce (push-out + 1.7 reflect ×0.75 damp + thud). **Swallowed items STICK to the ball** (up to 26 colored chips riding the rim, rotating at 0.8×roll) — the signature. 10 food tiers sesame→barrel (graded population 70→3), per-type procedural draws (nigiri/tamago/gunkan/bowl/teapot/crate/barrel…), edible items bob subtly. **Belts**: 2 horizontal + 1 vertical, animated chevrons, carry their items (wrap at edges), drip-feed fresh smalls at belt heads every 1.1s, ball riding a belt drifts at 0.55×. **Camera** zoom `clamp(46/r, .34, 1.6)` lerped — zooms out as you grow; offscreen item culling. HUD: swallowed count / timer (hot <15s) / size in cm (r×0.9 fiction); milestone toast + jingle every 25 items; 120s run → end card (COLOSSAL/RESPECTABLE/SNACK) + localStorage best. Audio: nom pitch DROPS as ball grows (900−6r Hz), bounce thud, jingles; M mute. Dark izakaya: plank grid, lantern glow pools, DotGothic16 + Rubik Mono One. Touch joystick. **Two real bugs caught by tests pre-ship**: (1) debug hook exposed `ball` object directly but startGame reassigns it → stale-snapshot cascade (fixed: live accessor `ballRef()` — lesson: never expose reassignable bindings by value in hooks); (2) `belt:onBelt||null` — **belt index 0 is falsy** → the first conveyor never carried anything (fixed with explicit undefined check + regression test). 18 total checks green.

## issues
- Bounce vs huge items can feel sticky when sandwiched between two big objects — acceptable, rare.
- Item cap 420 + population floor 180; if chat wants a "clean the whole room" win mode, disable restock and count down.

## todos
- Growth milestones change what fits: doors/rooms? (big scope)
- Rival roller AI to race.
- "Everything you ate" end-screen collage from stuck list.
