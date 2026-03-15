# Rock Fashion

Your rock does nothing. But it looks fabulous doing it.

## log
- 2026-03-15: Initial build. Canvas 2D pet rock dress-up simulator. Hand-drawn bezier rock with highlight, shadow, speckles. 4 accessory categories: Hats (12 — top hat, crown, cowboy, party, chef, santa, wizard, flower, bow, helmet, pirate), Eyes (10 — drawn pupils, sunglasses with shine, heart/star emoji, monocle+chain, sleepy zzz, nerdy glasses, wink, angry brows), Mouths (8 — smile arc, grin, tongue, drawn mustache, kiss lips, "oh" mouth, teeth grid), Extras (8 toggleable — scarf, tie, medal, wings mirrored, sparkle particles, fire flanking, music notes floating, rainbow arcs). 4 actions: Pet (blush + floating hearts), Poke (wiggle + snarky text), Spin (full rotation), Compliment (blush + gold sparkles). Dynamic mood text based on outfit count. Name input. Save to localStorage. Gaegu + Patrick Hand typography, warm kraft paper aesthetic.

## issues
- None yet

## todos
- Rock color/type customization
- Screenshot/share button
- Googly eyes (follow mouse)
- Outfit presets / randomize button

## notes
- No database — localStorage save key: rock-fashion-save
- Separate app from pet-rock (passive-aggressive personality simulator)
- Rock: bezier body, ellipse highlight, seeded speckles
- Sunglasses: roundRect lenses + bridge + shine rects
- Mustache: bezier curve, not emoji
- Blush: pink ellipses, 0.97 decay
- Wiggle: sin*decay (0.93x), Spin: target += 2pi, lerp 0.06
- Extras are toggleable (multiple at once)
- Mood pools: 8 idle, 10 dressed (3+ items), 6 pet, 6 poke, 6 compliment
