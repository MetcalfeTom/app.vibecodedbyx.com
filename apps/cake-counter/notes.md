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

- **v1.1 (2026-09-28)**: "make the cake game more fun" (angienimo).
  - Streak: every perfect cake in a row adds (streak−1)×2 coins, capped at +10; a 🔥 ×N chip shows in the HUD from ×2. A miss or a walk-out resets it.
  - Day plan from day 2: customer 2 is a **regular** coming back for "the usual" (their stored order from an earlier day; a "Remind me?" button shows it for −30% patience; perfect without it = +8). Customers 3–4 are **rush hour** (60% patience, coins ×2). On even days customer 5 is **Mona Gâteau** in person (VIP: an order from day+2, coins ×2, +15 for a perfect cake). Her result sets the review floor or ceiling.
  - The end-of-day card names tomorrow's regular (G.nu, picked from today's served customers with ≥2 stars) and has a **shop**: Shop radio 45 (4 s grace per order), Comfy chairs 60 (+20% patience) and Tip jar 80 (tips ×1.5), one-time purchases.
  - Save gained streak, up, book (id → {req, day}) and nu.
  - Stale arrival callbacks are guarded by G.tok.
  - The card section class is `.ups`. `.shop` is the scene container, so never reuse that name.

- **v1.2 (2026-09-28)**: "make it a realistic cartoon" (angienimo). This is an art pass; the gameplay is unchanged.
  - drawCake now shades everything with per-draw gradients (ids `ck<N>_…` from the GU counter, in a `<defs>` per SVG): cylinder light on the sponge sides, crumb dots, cream filling, a porcelain stand with a floor shadow, a rounded frosting skirt with a glossy dome and a pearl border, rounded glossy drips with beads, and shaded toppings (seeded strawberries, blueberries with crowns, gold stars, candles with stripes and a glow).
  - soften(svg) runs after drawWho: every flat fill of at least 9 px becomes a radial gradient lit from the upper left, and the body gets a drop shadow. It skips INK, elements with an opacity attribute and elements with a class attribute.
  - Scene: a warm window-light beam and a vignette (.scene::before/::after) and a shadow under the counter lip. The tray layer icons have cylinder gradients (ids `mi-<flavour>`).

## issues
- Orders are capped at 185 chars by rejection sampling in `genOrder` (40 tries). New phrases that are much longer will be rejected silently and make orders repetitive, so keep new phrases short.
- Every order must be unambiguous. Anything not mentioned is free choice. If you add a riddle, make sure it maps to exactly one pantry item.
- Layer positions: bottom = index 0, top = n-1. "Middle" is only used when n === 3.
- On phone, the order bubble sits above the scene (flex column). On desktop it floats top-right in the scene. Check both after changing bubble text size.
- Absolutely positioned SVGs (#who, #cake) need an explicit `width`, because `right:` is ignored when a height is set.
- Emoji (coin, bin, serve icon) render as boxes in headless screenshots. That is fine.

## todos
- Extras chat might like: seasonal customers, custom cake names, a queue of two customers at once.
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
