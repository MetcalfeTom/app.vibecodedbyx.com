# grocery-rank · notes

## log
- 2026-07-13: v1 (chat ask: standalone GroceryRank — clean sortable table of ~50 healthy foods ranked by cheapest/serving + healthiest by nutrient density, hardcoded dataset; message truncated at "~50 f[oods]"). **Dataset**: exactly 50 staples across 7 categories (grains/legumes/protein/dairy/nuts/produce/frozen/canned), each {serving, $/serving rough US 2026, kcal, protein, fiber, micro 0–10 hand-set}. **Scores** (computed, footer-documented): density=(2·protein+2.5·fiber+1.5·micro)/(kcal/100) — nutrients per calorie; value=density/price — nutrients per dollar (the third preset chat didn't ask for but is the actual point). Spot-checked in tests: oats 18.3 density, 140.8 value. **UI**: full-column sorting (th buttons, aria-sort, ▲▼, numbers default desc / text asc), search, category chips, 3 preset ranks (💰 price asc / 🥦 density / ⚡ value) with 🥇🥈🥉⭐ medals + row tint for top 5, inline bars normalized to max density/value, sticky header, mobile hides secondary cols (.hide-sm). Honest caption+footer: rough estimates, budgeting toy not medical advice. Node 15/15-ish (one stub artifact: fake innerHTML doesn't clear children → double-draw counted 100 rows; real DOM fine): dataset shape/bounds, formula spot-checks, sort monotonicity both types, search/category filters, presets sanity (cheapest=white rice $0.08, densest=leafy greens, top value = cabbage/spinach/kale/black beans/frozen spinach — the lentil lobby placed 6th). Bricolage Grotesque + IBM Plex Mono, fresh-market paper/green.

## issues
- Prices are national-average guesses; chat WILL dispute their local egg prices. That's the fun.
- Micro score is editorial (hand-set) — documented as such.

## todos
- localStorage price overrides ("my store" mode) + reset.
- CSV export; serving-size normalizer (per 100 kcal / per 10g protein views).
- Weekly cart builder: pick foods → total cost + macro summary.
