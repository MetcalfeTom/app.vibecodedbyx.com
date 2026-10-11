# Rooster Reps

iamflax's idea (2026-10-11): "i need a caliathetics app, that shows me different exercises for my morning Workout with motivational coach". Sloppy's twist is that the coach is a rooster.

## Log
- v1.0 2026-10-11: phone-first single file. Setup (5/10/15 min, easy/normal/beast, full/upper/legs/core, Drill Sergeant or Hype Friend), 18 no-equipment moves drawn as animated SVG figures, get ready → work → rest with a next-up preview, countdown ring, beeps in the last 3 s, pause/skip/back, wake lock, a speaking rooster coach, a done screen with a morning streak and share.

## Art direction
- Retro gym poster at sunrise: paper #fbefd9, ink #2a1a1f, red #c7361f, sun #ffc23a, sky #2f6f86. Conic sunburst rays plus a halftone dot layer.
- Fonts: Ultra (display, slab), Bricolage Grotesque (body). Chunky 3px ink borders with offset hard shadows.
- Figure: pictogram with a red shirt torso. Near limbs are ink, far limbs dusty #b39184, with a sun-yellow headband. Rest phase recolours the torso sky-blue.
- Rooster: inline SVG `<template id="roosterTpl">`. `.drill` adds a campaign hat, whistle and angry brow; `.hype` adds a teal headband and arched brow. Animation classes `.flap`, `.squawk`, `.talk`; the idle bob is on `.rb`.

## How the figure rig works (read before touching moves)
- Everything lives in the first inline script, `RIG`. World units: floor y=0, y up, figure faces +x. Angles are absolute degrees (0=+x, 90=up).
- Limbs are either FK `[upper, lower, foot?]` or pinned `P(x,y,s,ft)` (2-bone IK; s=±1 picks the knee/elbow side).
- Pinned→pinned tweens lerp the target, so planted hands and feet stay put. FK→FK lerps the raw numbers, so the authored sign picks the swing direction (e.g. -250 vs 110). Mixed tweens take the shortest arc.
- `hop` bounces the pelvis. `lift` raises the hips by rotating the torso about the neck (mountain climbers). `ease:'lin'` gives linear keys, and a key at at=1 allows continuous rotation (arm circles).
- Front view (`view:'front'`, jacks and side plank) spreads shoulders/hips with sw/hw.
- Scratch tools (session scratchpad rr/): check.js reports floor penetration and IK reach per move; mksheet.js renders a contact sheet of all moves.

## Issues
- Real phones untested, and iOS speech voices untested. iOS needs the first speak() inside the Start tap, which it gets.
- Toe stroke radius touches the floor by ~0.05 on some moves. This is visual only.

## Todos
- Ask Flax: is the drill sergeant too shouty or just right? Any moves to add (e.g. a dead bug or calf raises)?
- Possible later: a custom routine builder, rep counting via tap, and a longer 20 min option.

## Testing
- The headless CDP harness (scratch rr/cdp.py) drives `window.__RR` (start, enter(i), freeze(ph), finish). It is debug-only and harmless.
