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

## issues
- Phone layout: the stove and board sit side by side. The phone media query must stay LAST in the CSS, or the 12rem .hob height wins.

## todos
- More recipes and a shopping trip (the fridge runs out).
- A drag-to-chop swipe gesture on phones.
- Plating / a table scene for the result.
- Day and night time with a clock.
- Tips from the diner.
