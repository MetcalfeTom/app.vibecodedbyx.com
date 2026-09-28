# Cake Counter — notes

Requested by angienimo: "a game where you bake cakes based on the customer's request".

## log
- **v1.0 (2026-09-28)**: first release.
  - Patisserie counter look: awning, Fraunces + IBM Plex Mono, cream/cocoa/raspberry.
  - 12 SVG customers, including a cat, a robot, a frog prince and a ghost. Their faces change with mood; they react after you serve and slide out.
  - Orders are generated with key words in `<b>`, and difficulty ramps by day:
    - day 1: 1–2 layers, frosting, maybe 1 topping
    - day 2: adds drips, several toppings and candles
    - day 3: adds negatives ("no sprinkles") and plain cakes
    - day 3+: riddles ("frosting the colour of the sky")
    - day 4+: count riddles ("as many candles as a spider has legs")
  - Scoring per requirement: stars, coins, tip, pop word, count-up and sfx.
  - Patience bar goes pistachio → butter → raspberry. At zero the customer walks out.
  - 5 customers per day, then an end-of-day card with a review from critic Mona Gâteau and your best day.
  - Save in `cake.save` with Continue / Start over; best day in `cake.best`.
  - Keys: 1–4 switch tabs, Backspace undoes, Enter serves.
  - Accessibility: aria-live, reduced motion, 44px targets.
  - og.png is 1200x630.

## issues
- Orders are capped at 185 chars by rejection sampling in `genOrder` (40 tries). New phrases that are much longer will be rejected silently and make orders repetitive, so keep new phrases short.
- Every order must be unambiguous. Anything not mentioned is free choice. If you add a riddle, make sure it maps to exactly one pantry item.
- Layer positions: bottom = index 0, top = n-1. "Middle" is only used when n === 3.
- On phone, the order bubble sits above the scene (flex column). On desktop it floats top-right in the scene. Check both after changing bubble text size.
- Absolutely positioned SVGs (#who, #cake) need an explicit `width`, because `right:` is ignored when a height is set.
- Emoji (coin, bin, serve icon) render as boxes in headless screenshots. That is fine.

## todos
- Extras chat might like: seasonal customers, a "rush hour" day, custom cake names.
- A shared leaderboard of best days (would need a supabase table; left out for v1).
- More toppings or layer shapes (e.g. a square cake) if chat asks for variety.
- Sound toggle in a hidden settings corner.

## art direction / how scoring works
- **Look**: a warm bakery counter, not a neon arcade. Cream paper, cocoa ink outlines (2–3px), raspberry for accent and key words, pistachio/butter for status. Chunky offset shadows on cards and buttons. The characters are simple flat SVG heads and shoulders with big readable expressions.
- **Scoring**:
  - `checks(r, cake)` lists one check per stated requirement: layer count, each named layer, same-flavour, frosting (or none), drip (or none), each wanted topping, each banned topping, plain, and candles.
  - `acc` = passed / total.
  - Stars: acc = 1 gives 3, acc ≥ .75 gives 2, acc ≥ .45 gives 1, otherwise 0.
  - Coins = round(10 × acc) + tip, where tip = round(patience × 6) and is only paid when acc ≥ .75.
  - A walk-out pays 0.
- **Patience** = max(24, 45 − 4·(day−1)) seconds, plus 2s per check beyond 5, plus 2s for a riddle order.
- **Test hooks**: `window.__cake` (gen, grade, solveReq, solve, wrongify, serve, drain, hold, speed, …). `probe.js` drives them from the URL hash (bulk, play, timeout, keys, eod, og, …).
