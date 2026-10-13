# Rooster Reps

iamflax's idea (2026-10-11): "i need a caliathetics app, that shows me different exercises for my morning Workout with motivational coach". Sloppy's twist is that the coach is a rooster.

## Log
- v1.0 2026-10-11: phone-first single file. Setup (5/10/15 min, easy/normal/beast, full/upper/legs/core, Drill Sergeant or Hype Friend), 18 no-equipment moves drawn as animated SVG figures, get ready → work → rest with a next-up preview, countdown ring, beeps in the last 3 s, pause/skip/back, wake lock, a speaking rooster coach, a done screen with a morning streak and share.
- v1.1 2026-10-11: a rep counter chip ("Rep 4 of 12"). The demo figure now moves at the goal pace (work s / reps, clamped to 0.75-1.35x the authored cycle), so you can rep along with it; goal reached → "Bonus n". Headband tails trail behind the head to show which way the figure faces. In the last 10 s holds tremble and a sweat drop falls. Coach lines use lowercase move names mid-sentence.
- v1.2 2026-10-11: side plank mirrors to the other side at halfway, and arm circles play backwards after halfway. Reduced motion turns off the tremble, sweat and tail flutter (the demo itself keeps moving, since it is the content). Focus moves to Pause on start, to the heading on the done screen and back to Start on New workout. The og.png has a bigger rooster.
- v1.3 2026-10-11: smartass42 got a jumpscare, so: a master mute (🔊/🔇 "Sound on/off") in the top corner of every screen (setup header, workout top bar, done screen; one button moved between slots) mutes crows, beeps and the spoken coach, saved as set.mute. No sound of any kind before the first pointerdown/keydown (the boot greeting is bubble-only). All audio runs through a limiter and a master gain that fades in over 2 s. Beeps are capped at 0.14 gain (were up to 0.26) and the first crow of a visit is quieter. The workout bar's bell toggle is replaced by the mute; the speech-bubble button toggles talking only.
- v1.4 2026-10-12: Flax's pitch "app with exercises against headache" became a 5th focus, Headache break (value 'calm'): 8 gentle 30 s moves in a fixed order (CALM in ui.js: belly breathing, neck side tilts, chin to chest, shoulder circles, chest opener, look far away, palms over eyes, temple massage; repeats for 10/15 min), 6 s rests, no beeps, no tremble/sweat, a whispering hatless rooster (LINES.calm, slower softer TTS, a 2-note strangled crow at the end), level/coach/shuffle hidden, a doctor note (#calmNote). Calm moves carry calm:1, tgt (target text) and are excluded from the other focuses. Rank 'Calm Chicken'.
- v1.5 2026-10-13 05:14: four new moves in rig.js: Plank shoulder taps ('taps', upper+core, each side, lv 0-2), Inchworms ('inchworm', upper+full, lv 1-2), Calf raises ('calfraise', legs), Dead bug ('deadbug', core, each side). Upper focus no longer repeats arm circles/dips so often. Scratch rr/mksvg.js renders a plain-SVG contact sheet of any moves (node mksvg.js rig.js out.svg id1,id2 8; convert out.svg out.png) to judge poses frame by frame; rr/check.js reports floor/reach/head checks.

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
- + Sound must stay gated behind the first tap and the master mute (smartass42's jumpscare, v1.3). Test with the __snd wrapper (scratch rr/s12.json): speak/AudioContext/oscillator counts must be 0 after load.
- Real phones untested, and iOS speech voices untested. iOS needs the first speak() inside the Start tap, which it gets.
- Toe stroke radius touches the floor by ~0.05 on some moves. This is visual only.

## Todos
- Ask Flax: does the headache break help, and is the order right (maybe a seated version for the office)? Palms over eyes is drawn side-on (front view could not bend the elbows down).
- Rep pace: one figure cycle = one rep (each-side moves: one cycle = left + right). Phase 0 of every rep move must be the start pose.
- Ask Flax: is the drill sergeant too shouty or just right? Do the v1.5 dead bug and calf raises look right?
- Possible later: a custom routine builder, rep counting via tap, and a longer 20 min option.

## Testing
- The headless CDP harness (scratch rr/cdp.py) drives `window.__RR` (start, enter(i), freeze(ph), finish). It is debug-only and harmless.
