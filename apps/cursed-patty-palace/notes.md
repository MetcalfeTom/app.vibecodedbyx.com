# Cursed Patty Palace — Bob's fictional meme menu

## log
- 2026-09-04: v1.0 per a public request ("fictional cursed burger meme menu now, featuring Bob, pickle soda, Sour Patch Kids, slogan, and chaos receipts"). NAME CARE: not "Bob's Burgers" (real show) — Bob is our fry cook at the Cursed Patty Palace; footer carries a parody/no-affiliation line for the candy/soda names. All five requested stars: Bob (🧑‍🍳 + rotating quips, signs every receipt), Big Dill Fizz pickle soda, The Sour Patch Smash, rotating ™ slogans (reroll button), and CHAOS RECEIPTS — `cppReceipt(seed)` pure + deterministic (mulberry): 2-5 items × qty, fees (VIBES TAX 6.66%, 3AM SURCHARGE, BOB'S FORGIVENESS −$1.11…), CHAOS FLOOR keeps totals ≥ 0, and the ARITHMETIC IS HONEST — the chaos is in the items, never the math (500-seed node sweep asserts items→subtotal→total). Receipt strip torn with clip-path polygon. 100% FICTION banner. Alfa Slab One + Courier Prime, red-leather diner.
- Suites: data node 8/8 (stars present, prices+descriptions, ™ slogans, determinism, 500-receipt arithmetic + non-negative + shape); browser 20/20 ×3 widths (banner, Bob, sections 3/items 10, slogan reroll, receipt print + PRINTED-LINES-ADD-UP parse check + engine match, Bob signature, seed labelled fictional, same-seed reprint identical, button path, parody footer, zero anchors, geometry, stamp). PROBE LESSON: when parsing '-$1.11', parseFloat already consumes the minus — multiplying by a sign test again double-negates (my 52.77-vs-50.55 was exactly 2×1.11).

## issues
- Bob's emoji renders as tofu in headless screenshots only — fine on real devices.
- The menu is fixed on purpose (memes are load-bearing); chaos lives in the receipts. If chat wants a menu randomizer, add a seeded variant rather than mutating the canon.

## todos
- "frame it" — download/share a receipt as an image, if chat asks (canvas render).
- a Bob mood that reacts to the receipt total.
