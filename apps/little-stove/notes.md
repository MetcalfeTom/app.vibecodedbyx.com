# Little Stove

A cozy home-cooking game, built phone-first. You grab food from the fridge, chop it on the board, cook it in a pot or pan without burning it, salt it, and serve dinner to someone (roommate, Grandma, the cat…).

## log
- v1 (2026-10-04, ~20:00 UTC): first version for inventorychest764 (Twitch, Europe). Their asks: "woman simulater", "work as woman in kitchen", "as home", "make it mobile app", "yes start". I made it gender-neutral: you're simply the cook.
  - 7 recipes rotate (soup, egg on toast, stir-fry, pasta, cheesy potatoes, rice & beans, mushroom toast).
  - Pot recipes simmer. Pan recipes drain a stir meter: when it's empty, cooking runs ×1.8 and counts as scorching.
  - Cooking only moves while the heat is on (7.5 points/s on a 0..130 scale; above 100 is burnt; the heat shuts off at 130).
  - Serving scores half-stars off for: missing or extra ingredients, whole items that needed cutting, doneness, salt, and scorching.
  - localStorage key little-stove-v1 holds the dinner count and the best stars per recipe (the cookbook).
  - Sounds are made with oscillators; there are no files.
  - The drawings are inline SVG. There are no emoji in the UI because headless and og previews show tofu boxes for them.
  - Test probe: hm/pls.js (soup round → just right → 5 stars).

- v1.1 (2026-10-05, ~05:10 UTC): PANCAKES, the first breakfast, with a FLIP (the producer's nudge plus my own pancake riff; nonamenumbe and holaholawedemboys were in chat).
  - Added flour and milk to the fridge.
  - A recipe with flip:true hides the stir meter and shows a 'flip it' button; tapping the pan also flips.
  - Side 1's cook value is saved in S.sideA, then side 2 cooks from 0. Score = (judge(side 1) + judge(side 2)) × 0.6. Never flipping costs 2 stars plus half of side 1's penalty.
  - Salt 0 shows 'no salt', and the hint only nags when salt is short.
  - ?dish=<id> opens straight on a recipe (handy for links and tests).
  - Probe hm/pfl.js: 60/60 → 5 stars, 'golden on both sides'.
- v1.2 (2026-10-05, ~08:15 UTC): TAMAGOYAKI, the rolled omelette (the voice's pick; Tatum cheered it with AYAYA).
  - Added soy sauce to the cupboard. The recipe is 3 eggs + soy sauce, no salt, zone 40-58: the tightest window in the kitchen.
  - flip:true + roll:3 means a 'roll it' button: two rolls, and the third layer is judged at serving. S.sideA/S.side became S.parts (one cook value per finished layer or side).
  - Each layer cooks 15% faster than the one before (the pan heats up). A fattening egg log sits at the back of the pan.
  - Score: each layer's judge × 0.6, plus −1 per missing layer. Probe hm/ptam.js (#serve) rolls at 46 → 5 stars, 'every layer rolled just as it set'.
- v1.3 (2026-10-05, ~16:10 UTC): SIZZLE, procedural cooking sounds (Web Audio, still no files).
  - The audio context starts on the first tap (pointerdown/keydown capture listener → ac()); it suspends when the tab is hidden.
  - A mute button sits in the header (aria-pressed). localStorage key little-stove-sound = 'off' / 'on'. When muted, no context is created at all; muting an existing one ramps the master gain to 0 and then suspends it.
  - Graph: four looping pre-rendered buffers (wet crackle, sparse crackle, burn hiss, low boil), each through a filter and its own gain, into master → compressor. Loop lengths differ (3.3/4.1/3.7/2.9 s) so the mix doesn't audibly repeat. Live one-shots on top: pop() (noise scrap through a bandpass) and bubble() (a sine sliding up).
  - sizzle(dt) runs every frame from loop(). SND.warm eases to 1 while the heat is on (the pan heats up, and cools slower than it heats). damp = how wet/loud: 1 while raw, ~0.3 at the start of the zone, 0.13 at the end, so the sizzle calms as it goes golden. Past zone[1] a dry hiss creeps in; past 100 it's a burning hiss with big pops. Tamagoyaki layers (×1.15) and a stuck stir-fry (×1.5) are louder.
  - splash(k): wet food meeting a hot pan (into the pan, a flip, a new egg layer) = a loud burst that dies over ~1.5 s. Preheating is rewarded with the crackle.
  - Pots: bubbles at 1/s when warming, up to 8/s at the zone, 13/s overdone; boiled dry (>100) they hiss like a pan.
  - Visual twin: .hob.spit shows oil droplets (.spat) spitting off the pan while it's wet and hot, so muted players get the cue too. Hidden under prefers-reduced-motion.
  - Fixed: the food icons floated above the pan (the .stuff offset was made for the pot). .vessel.pan .stuff now sits on the pan surface.
  - Probe: scratch stove/pz.js measures master RMS with an AnalyserNode (stir-fry: hit .082, raw .047, nearly .026, golden ~.012, burnt .055; muted 0, context suspended).

## issues
- Phone layout: the stove and board sit side by side. The phone media query must stay LAST in the CSS, or the 12rem .hob height wins.
- Sound: headless Chromium runs the AudioContext fine (state 'running'), so probes can measure RMS on __LS.snd.master. __LS.AC is the context.

## todos
- More recipes and a shopping trip (the fridge runs out).
- A drag-to-chop swipe gesture on phones.
- Plating / a table scene for the result.
- Day and night time with a clock.
- Tips from the diner.
