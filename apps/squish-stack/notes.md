# Squish Stack

Stacking puzzle: every block squishes under the weight stacked above it. Use all the blocks and land the top of the tower in the pink band. Idea by Tatum (sloppy.live chat, 2026-09-27 16:51: "stack blocks which compress based on the amount of weight above them").

## log
- v1.2 (2026-09-27): DAILY STACK. Same puzzle for everyone each UTC day: genDaily(dayKey) = FNV hash of "YYYY-MM-DD" → rng → genStack(R, 6 blocks, 0.8 cm band). makeLevel now shuffles with Fisher–Yates (sort with a random comparator gives different orders in different browsers → different dailies). Open from the Levels dialog (pink button, always unlocked) or #daily in the URL. Win card: "Copy result" (clipboard; falls back to showing the text). SV.daily[day] = best moves. Win card moved below the stage (it covered tall towers), tray hides on a win; global [hidden]{display:none!important}. Probe: 30 days → 30 distinct stacks, 0 fallbacks, same day = same stack.
- v1.1 (2026-09-27): SOUND. All WebAudio-synthesized, no files: a landing sound per material (squelch sponge, wobble jelly, boing rubber, clack wood, chime glass, thud stone, clank iron) + an extra squelch scaled by how much the blocks below got squished; crack for a rejected glass overload, pop on take-off, 4-note win arpeggio. ♪ toggle in the header (localStorage `squish-stack.snd`).
- v1.0 (2026-09-27): first build. 7 materials (sponge, jelly, rubber soft; wood, glass, stone, iron solid; glass cracks above 6 kg). 12 campaign levels, Workshop (endless, seeded generator, streak) opens after 6 cleared. Hint = next right block for the current stack (or which block is wrong). Tap tray to drop on top, tap a stacked block to take it off. Keys 1–9, Backspace, H, R, N. Progress in localStorage `squish-stack.v1`.

## model
- block weight w = density × size (size 1 or 2 = 10 or 20 cm). Load on a block = sum of weights above it.
- squish f = min + (1−min)/(1 + load/k) for soft materials, 1 for solid. Height = size×10×f. Soft blocks bulge wider as they squish (width × (1 + .55(1−f))).
- MAT: sponge d1 k1.2 min.28 · jelly d2 k3.5 min.4 · rubber d2 k9 min.55 · wood d2 · glass d2 cap 6 · stone d4 · iron d7.
- Win check uses the total rounded to 0.1 cm (same as displayed).
- Campaign bands were chosen offline (scratch camp.js: brute force of all distinct orders; 1 winning order on most levels, 2 on L5/L10, 6 on L11 "reach high"). If you change MAT numbers, RE-CHECK every band — the headless probe `solve` mode auto-plays every level's first solution through the real buttons.
- Endless: n = 4 + streak/2 (max 7), band 1.0/0.8/0.7 cm, makeLevel() retries (maxHit up to 6, gap ≥ .15/.1 cm between band edges and the nearest miss).

## issues
- (none reported yet)

## todos
- more materials chat might like (marshmallow? cheese? a balloon that lifts = negative weight? springs?)
- drag to insert mid-tower (now only top drops)
