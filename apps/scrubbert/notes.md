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
