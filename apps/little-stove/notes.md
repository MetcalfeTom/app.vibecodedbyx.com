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

## issues
- Phone layout: the stove and board sit side by side. The phone media query must stay LAST in the CSS, or the 12rem .hob height wins.

## todos
- More recipes and a shopping trip (the fridge runs out).
- A drag-to-chop swipe gesture on phones.
- Plating / a table scene for the result.
- Day and night time with a clock.
- Tips from the diner.
