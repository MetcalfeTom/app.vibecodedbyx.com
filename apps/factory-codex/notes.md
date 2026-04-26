# Factory Codex

## log
- 2026-04-26: Created. **Searchable Satisfactory recipe book** + **production cost calculator** with full alternative-recipe support. ~1100 lines, 50KB. **80+ recipes** entered via compact DSL `R(name, alt, building, time, inputs, outputs)` covering Smelter (Iron/Copper/Caterium Ingot + Pure Iron/Copper/Caterium alts), Foundry (Steel Ingot + Solid Steel/Copper Alloy alts, Aluminum Ingot), Constructor (Iron Plate/Rod, Screw, Wire, Cable, Concrete, Steel Beam/Pipe, Quickwire, Silica, Quartz Crystal, Empty Canister + Cast Screw / Stitched Plate / Steel Rotor / Insulated Cable / Wet Concrete alts), Assembler (RIP, Modular Frame, EIB, Rotor, Stator, Motor, AI Limiter, Circuit Board, Smart Plating, Versatile Framework, Automated Wiring + Heavy Flexible Frame / Bolted Frame / Caterium CB / Silicon CB / Crystal CB alts), Manufacturer (HMF, Computer, Crystal Oscillator, HSC, Modular Engine, Adaptive Control Unit, Supercomputer, RCU, Plutonium Pellet + alts), Refinery (Plastic, Rubber, Fuel, Petroleum Coke, Alumina Solution, Aluminum Scrap, Sulfuric Acid + Recycled Plastic / Recycled Rubber / Heavy Oil Residue / Diluted Fuel alts), Packager (Packaged Water, Packaged Fuel). **3 tabs**: RECIPES (filter chips per building + search across name/inputs/outputs), CHAIN PLANNER (cost calculator), ALTERNATIVES (item dropdown → side-by-side compare of all recipes producing it). **Recipe cards** corner-accent borders, std default in orange, alt in gold; each row reads `+ name · ALT? · per-min`. Click → modal w/ INPUTS/OUTPUTS rate tables (qty per craft + qty/min from `qty * 60 / time`) + sibling alternatives list. **Chain calculator**: enter target item + target rate (items/min) → recursive `buildChain(item, ratePerMin, path, choice)` walks recipe tree until raw resources (Iron/Copper/Caterium Ore, Limestone, Coal, Sulfur, Bauxite, Raw Quartz, Crude Oil, Water, Biomass, Uranium, Nitrogen Gas). Cycle detection via `path` Set prevents infinite recursion through alts (Recycled Plastic ↔ Recycled Rubber, Diluted Fuel ↔ Heavy Oil Residue). **Per-node alt picker**: each non-raw node renders dropdown listing all recipes that produce that item; choosing an alt updates `plannerChoices` map keyed by `path::item`, triggers full rebuild. Tree node shows building badge + time/craft + multiplier × buildings count. **Aggregator** walks tree → totals raw resources (teal cards) + total building counts grouped by type → readable summary table. **Aesthetic**: charcoal `#0e1115` bg + hex SVG grid pattern (56×48 polygon stroke, 7% opacity orange), scanline overlay (1px@4px multiply), FICSIT orange `#ee7a1e` primary, gold `#f5c453` for alts, teal `#7ec5c1` for raw materials. Audiowide brand mark "FACTORY **C**ODEX" (orange C), Saira Condensed 700 0.36em-tracked labels, Saira 400/500/600 body, JetBrains Mono for all numbers/rates. Tab pills active = orange fill. Search input is a transparent dark bar with orange focus ring. Pollinations OG (industrial blueprint prompt).

## issues
- Recipe coverage is **complete through Tier 6** (oil/computers/aluminum) but does not cover Tier 7+ Nuclear (only Plutonium Pellet stub), Quantum, or pipe-only fluid items beyond Plastic/Rubber/Fuel/Sulfuric Acid. Adding a recipe = one `R(...)` line.
- Cycle detection uses path-based exclusion — choosing Recycled Plastic forces children to use a non-Recycled-Rubber recipe for Plastic and vice-versa. This is correct but means the calculator can't show the "use both for free" trick where the loop balances out perfectly. Future: add a balanced-loop solver mode.
- Power costs are NOT modeled (each building has a flat MW rating in Satisfactory; we only count building counts).
- Building counts are fractional (e.g., 1.34× Constructors). Player has to round up in practice — UI shows the fraction so you can see slack.
- "qty/min" for variable-output recipes (e.g., Heavy Oil Residue produces both Heavy Oil and Polymer Resin) splits correctly because the DSL stores outputs as an array — but the planner only "consumes" one output per craft. Byproducts of alt recipes are listed in the modal but aren't credited toward downstream demand. Future: track byproducts in the aggregator.

## todos
- Add Nuclear (Uranium Fuel Rod, Plutonium Fuel Rod, Encased Plutonium Cell), Quantum (Time Crystal, Quantum Computer, Ficsonium), and Particle Accelerator recipes.
- Add power cost column to chain summary (per-building MW × count).
- Persist last-used planner target + alt choices in localStorage so refresh keeps your plan.
- Power-shard / overclock helper: input a target rate, output the overclock % needed if you cap building count.
- Byproduct credit pass: walk the tree once to collect byproducts, then second pass nets them against demand.
- Export chain as text/markdown for sharing builds.

## design
- Palette: bg `#0e1115`, panel `#1b2028`/`#222933`, ink `#e6e9ec`, dim `#8a96a3`, FICSIT orange `#ee7a1e`/`#ffa14d`, gold `#f5c453`, raw teal `#7ec5c1`/`#a4dcd9`, accent lines `rgba(238,122,30,0.22)`.
- Fonts: Audiowide (brand mark only), Saira Condensed 700 (uppercase tracked labels), Saira 400/500/600 (UI body), JetBrains Mono 400/500/700 (numbers, rates, tree paths, recipe times).
- Cards: 1px line border + corner accent SVG-style ::before/::after triangles in orange, alt cards swap to gold border + gold corners.
- Tree nodes: indented by depth, raw leaves render as teal pill, non-raw render with dropdown selector + qty/min readout + ×N building count.
- Hex grid backdrop = single inline SVG via data URI, 56×48 px tile, 7% opacity stroke. Scanline overlay = 1px on 4px stripes via repeating-linear-gradient + mix-blend overlay.

## code-shape
- Single file, ~1114 lines, ~50KB.
- `RAW_RESOURCES` Set (12 items) + `RECIPES` array populated via `R(name, alt, building, time, inputs, outputs)` factory.
- `recipesByOutput` map: item name → list of recipes that produce it; primary index for the planner's alt picker.
- `recipeByName` map for direct lookup; `allItems` Set for the alternatives-tab dropdown.
- Helpers: `ratePerMin(qty, time) = qty * 60 / time`, `fmt(n)` (compact number formatting w/ 0/1/2 decimals depending on magnitude), `isRaw(item)`.
- `renderRecipes()` — filters by activeBuilding chip + search query, renders cards.
- `openRecipeModal(name)` — overlay w/ inputs/outputs tables + sibling alts list.
- `buildChain(item, ratePerMin, path, choiceMap)` — returns `{item, rate, recipe, building, time, multiplier, children:[...]}` recursively.
- `aggregate(node, raws, buildings)` — recursive accumulator for the totals tables.
- `renderTreeNode(node, depth)` — recursive DOM walker; non-raw nodes get `<select>` listing alt recipes, on-change updates `plannerChoices` and re-runs `runCalculator()`.
- `runCalculator()` — wires target + rate input → `buildChain` → aggregate → renders tree pane + summary pane.
- `renderAlternativesTab()` — for selected item, renders side-by-side cards of every recipe producing it w/ input/output tables and per-min rates.
- Tab switching toggles `.active` class on tab-pill + corresponding section.
