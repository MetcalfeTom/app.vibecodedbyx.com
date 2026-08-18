# Scrubbert — spatula-washing mini-game

## log
- 2026-08-18: v1.0 per chat ("simple spatula-washing repeat-play mini-game with sticker rewards and gentle feedback"). Single file, Sniglet + Delius + Space Mono, pastel kitchen-tile palette.
  - **Loop**: procedural spatula (seeded per wash count: 5 palettes × 3 head shapes × slot counts × tilt) arrives with 11–16 seeded sauce blobs on an offscreen grime canvas; scrubbing = destination-out erasure under the pointer + suds particles; sampled alpha ratio <8% → rinse unlocks → water-streak rinse animation → praise line → next spatula slides in. NO fail states, no timers (probe enforces the copy).
  - **Scrubbert**: yellow sponge w/ eyes/blush-holes/smile, follows the pointer with lerp, squishes on press, idles bottom-right blinking.
  - **Stickers**: every 3rd wash pulls from a 15-emoji pool onto the persisted sticker sheet (tilted chips, pop-in animation, aria role=img labels). washed + stickers in localStorage.
  - **Gentle audio**: sine-only tones (bubble blips 25% throttled, ready/done/sticker soft arpeggios ≤0.06 gain) + one band-passed rinse noise; suite stub-audits sine-only + gain cap; mute = zero nodes.
  - Keyboard path: Space scrubs random spots, R rinses (documented in canvas aria-label).
  - Suite sb-probe 14/14. Screenshot lesson: newSpatula's slide-in animation means early-frame screenshots show no spatula — settle SP.slide=0 in shot scripts (virtual-time screenshots can capture EARLY frames when network fonts are permitted).

## issues
- Grime ratio sampled every 4th pixel & every 8th scrub event — cheap and honest enough.
- Emoji tofu in headless screenshots only.

## todos
- Pan / whisk / ladle guest items every 10th wash
- Sticker sheet page 2 with layout persistence
- Tiny ambient sink-drip loop (optional, off by default)
- 2026-08-18 (2): v1.1 — GENTLE DAMAGE-PREVIEW per chat, kept true to the no-fail contract. Every spatula now wears a seeded ♥ decal under the sauce (unbreakable BY CONSTRUCTION — drawn on the spatula, not in the erasable grime layer; no damage state exists in code, the suite asserts it). 🔍 care preview toggle overlays amber cells where sauce remains + a dashed ring labeling the delicate zone. Hurried strokes over the heart (7+ in 500ms) earn only a gentle word — "light touches ✋ (it forgives you)" — throttled 2.5s, Scrubbert squishes apologetically; an all-gentle wash appends "gentle hands over the little heart, too." to the praise. BUG caught by suite: the warn throttle initialized at 0 suppressed all warnings for the first 2.5s of page life — warnAt now starts at −99999. Suites: care 7/7, core 14/14.
