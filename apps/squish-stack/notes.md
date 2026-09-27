# Squish Stack

Stacking puzzle: every block squishes under the weight stacked above it. Use all the blocks and land the top of the tower in the pink band. Idea by Tatum (sloppy.live chat, 2026-09-27 16:51: "stack blocks which compress based on the amount of weight above them").

## log
- v1.5 (2026-09-27): BOX (code x, sizes 1+2, d 1): a threshold block, not a curve: MAT.box lim 4 / low .35, sq() returns 1 while it carries ≤4 kg and .35 above (strict >). Crushed boxes get class .crushed (creases, dashed edge, 1.2× wider), label shows load/4 kg or "crushed", crumple sound when a drop flattens one. Levels 16–19 (L16 intro = keep it standing, L17 = crush it on purpose, L18 two boxes, L19 six-block finale 65.8–66.4, all unique answers; found with sq/pick.js because boxes create many exact ties, so isolated totals are rare). Workshop pool (ORDER) includes boxes after streak 2; POOL_DAILY untouched, probe confirms today's daily is identical. Phone header no longer wraps the ? button.
- v1.4.1 (2026-09-27): SEO: "Name — what you do" title, 141-char meta description, canonical https://app.sloppy.live/squish-stack/, schema.org VideoGame JSON-LD before </head> (h1 already visible). Level-1 probe still wins with 0 errors.
- v1.4 (2026-09-27): PUZZLE MAKER + SHARED STACKS. Levels dialog → "Make a puzzle for a friend" (S.lv MAKER=NL+2): the tray is a palette of 14 block types, tap to stack (3–7), "Make it" sets a 0.8 cm band around your top, counts how many distinct orders land it ("Only your order lands it. Devious!"), and gives Copy link / Play it. Link = #p=<codes sorted canonically, so it never leaks the order>_<lo×10>_<hi×10>, codes s j r w g t i b + size. parseP() is a strict regex (3–7 blocks, balloon size 1 only, lo<hi, band ≤ 20 cm) — anything else is ignored. Opening a link (or hashchange) loads CUSTOM=NL+3 ("SHARED"); winning offers "Make one back →". Digit keys now click tray buttons.
- v1.3 (2026-09-27): BALLOON + levels 13–15. MAT.balloon d −3 (w −3, size 1 only), soft k 2.5 min .45; sq() clamps load at 0 (blocks under a balloon never "stretch"). Labels show ↑3 kg; loads shown clamped at 0. L13 band hand-picked (28.2–29.6 = sponge > iron > balloon, the "put it on top" answer; next nearest 24.9/35.7), L14/L15 from camp.js. Workshop adds balloons after streak 2; the Daily keeps POOL_DAILY (the original 7 materials) so the daily puzzles never change when materials are added. Squeaky balloon landing sound.
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
- more materials chat might like (marshmallow? cheese? springs?) — add to ORDER only, never to POOL_DAILY
- drag to insert mid-tower (now only top drops)
