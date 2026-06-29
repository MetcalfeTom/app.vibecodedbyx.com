# recipe-fridge (Recipe Fridge)

## log
- 2026-06-29: shipped (chat ask: "recipe-fridge app — clickable grid of common fridge ingredients you toggle on/off, then it recommends dishes you can make with those exact items — no camera needed"). Fully self-contained, **local curated recipe DB** (no API/camera/login → instant + offline).
  - **Ingredient grid**: 39 ingredients in 5 categories (Proteins / Vegetables / Dairy & Eggs / Pantry / Fruit & Extras) as `aria-pressed` toggle chips (emoji + label). Styled like a steel **fridge door** (metallic gradient panel + handle pseudo-element); selected chips turn green like fridge magnets.
  - **44 recipes**, each `[name, emoji, [ingredientIds], blurb, mins]`. A build-time cross-check (in the validation step) confirms every recipe ingredient id exists in the grid — no orphans.
  - **Matching**: `available = selected ∪ basics(if on)`. For each recipe, `missing = ing not in available`; `matchedReal = ing actually selected` (basics excluded so they don't inflate relevance). **Ready now** = `missing.length===0`. **Almost** = `missing ≤ 2 AND matchedReal ≥ 1` (relevance gate stops unrelated recipes showing). Ready sorted by *most of your fridge used* then quicker; Almost by fewest missing then best match. Almost capped at 12.
  - **Assume basics** toggle (default on): `BASICS=['butter','olive_oil']` treated as always-available (also tagged "basic" in the grid) so dishes don't fail on butter/oil. Salt/pepper/water never appear in recipes (assumed implicit).
  - **Cards** show each ingredient as a green "have" or red "miss" chip + a "need: x, y" line for almost-matches + time badge. **🎲 Surprise me** selects a random recipe's non-basic ingredients to demo a full match. **Clear** resets.
  - **Aesthetic**: warm cozy kitchen — cream bg, tomato-red + fresh-green accents, Fraunces italic display + Hanken Grotesk body. Honest footer ("curated guides, not exact measurements").
  - WCAG: semantic main/section, `aria-pressed` chips, `aria-live=polite` results, labelled checkbox, focus-visible, ≥2.4rem targets, prefers-reduced-motion. Responsive auto-fill card grid + wrapping chips.
  - Verified: JS syntax OK; all recipe ingredients valid; head/og/favicon present. (No HTTP server reachable from sandbox to render-test; served statically.)

## issues
- Recipe DB is hand-curated (44) — broad everyday coverage but not exhaustive; some dishes simplify (e.g. parmesan/feta/mozz all map to generic "cheese", cream maps to "milk") to keep the ingredient grid small and the matching clean.
- "Exact items" is interpreted as *you have everything the recipe needs* (extras in your fridge are fine). A strict "uses ONLY my selected items" mode could be a toggle later.

## todos
- "Strict mode": only show recipes whose ingredients are a subset AND you've selected nothing wildly off (already mostly the case).
- localStorage to remember your usual fridge.
- Optional Pollinations "chef's wildcard" that invents a dish from the exact selection (clearly labelled AI).
- Dietary filters (veg/vegan/gluten-free) tags on recipes.
- More recipes + an ingredient search/filter for the grid.
