# Micro City

## log
- 2026-09-27: phones: the page was laid out 705px wide on a 390px screen (the slide-in stats panel waits at translateX(105%) inside `.main`, which didn't clip). `.main` now has `overflow: hidden; overflow: clip`; scrollWidth = viewport at 390, 800 and 1280, and the panel still opens fully on a phone.
- 2026-09-27 v2.1 **Services & milestones** (built by a helper, reviewed headless by me: 0 errors desktop + phone, no new network code): 🏫 School (E, reach 8, $500) lets homes/shops reach level 3 (industry exempt, existing towers kept); 🏥 Clinic (C, reach 7, $600) +up to 10 mood, abandonment 1%→0.3%. Overlays, inspector rows, budget lines, City health meters.
- v2.1 ranks Village / Town 500 / City 2,500 / Big City 8,000 / Metropolis 20,000 (kept once reached, badge in the title bar, 🏆 Milestones window, Win95 banner that respects reduced motion). Landmarks, one each: Stadium 2×2 $3k, Sky Tower 2×2 $6k, Airport 4×3 $12k (tourism income, demand, land value; immune to disasters; 2-tap bulldoze). Goals 12→22.
- v2.1 ☰ Random disasters Off/Rare (≥8 yrs apart, 5%/yr, saved per city). Coverage cached by a service-position signature → simTick ~2.1→1.6 ms on 60×60. v2.0 saves adopt their rank quietly (no banner), same localStorage keys. Test hook `window.MicroCity` {version, place, tick, state}.
- v2.1 caveats: Metropolis (20k) is a long haul on 48×48, watch feedback; og-image is still the v2.0 town; "Sky Tower" label clips around 900px.
- 2026-09-27 v2.0: the helper's revamp (new graphics, tool palette + inspector, power along roads, local crime/police reach, land value, fire cover, tax slider) was promoted from beta.html to index.html after my own headless check (0 errors, scripted city). The old version is kept at classic.html; beta.html is gone.
- 2026-09-27: **beta.html step 3 (logic)** — Power grid: plants power 50 building levels each (`POWER_CAP`), power flows through touching roads/buildings (8-neighbour union-find) and jumps 3 tiles from a plant; growth reserves grid capacity (`n.demand<n.supply`), so a full grid stops growth instead of leaking. Road-touching zones without power blink a ⚡. Crime is local (density within 3 tiles, parks trim it, each police station cuts up to 80% falling off to 0 at ~11 tiles). Land value per tile (parks, coast, police, fire cover, roads; pollution and crime pull it down) scales people per home and home growth. Fire stations cover 6 tiles: no fires start there, covered fires are put out 50%/tick and never spread. Fire burnout and decay drop one level and keep the zone. Tax slider 5–25% (panel + budget modal), saved as `taxRate` (default 0.15, validated) — shifts demand ×2/pt and mood ×1/pt. 8× speed now runs 8 sim ticks per 400 ms; months shown. Bankruptcy is < −$2000 everywhere, red-ink warning toast. Overlays: power / land value / crime / pollution (O). Placing police/fire/power/park shows its reach; existing stations show faint rings. Old saves load unchanged; a one-time toast explains the new power rule if the old city is short.
- 2026-09-27: **beta.html step 2 (UI)** — Win95 title bar holds the vitals as sunken fields (💰 money + net/yr → budget, 👥, 📅, mood face + %, tiny R/C/I demand bars), speed buttons (phones: one button with a pop-up), ☰ game menu (new/save/load/expand/budget/city stats/controls). Palette is generated from the `TOOLS` table (icon, name, cost, key 1–0; B bulldoze, I inspect; disasters at the end, still tap twice). Drags preview then build on release: zones fill a rectangle, road/park/bulldoze follow the stroke, power/police/fire drop one building with a dashed coverage square; yellow tag shows count + cost (red when short). 🔍 Inspect tool: hover (desktop) fills the right-hand Inspector, tap (touch / narrow) opens a floating card; `growthNote()` says what is blocking growth in the sim's own order. Toasts replace the single alert box (`showAlert` kept as a wrapper). Keys: 1–0, Space pause, +/−, F fit, arrows/WASD, O overlay, Esc cancels/closes, H help. Panel slides in under 1000px (📊 or tap the stats); under 700px the palette is a swipe strip under the map and the camera starts at ~19 px tiles on the town (`homeCam`). "Save first → new game" uses a flag instead of monkeypatching saveToSlot. Pause glyph is ❚❚ (⏸ is missing from some fonts).
- 2026-09-27: **beta.html v2.0 step 1 (graphics)** — separate test build at /micro-city/beta.html (index.html untouched, same save slots). Canvas renderer rewritten: oblique 3/4 view, buildings drawn per zone/level (houses → apartments → towers, shops → malls → glass skyscrapers, sheds → factories with chimneys), roads join by neighbour mask with lane lines, trees/ponds in parks, cars on the road graph (count scales with density), chimney/cooling-tower smoke, flames, day/night cycle (150 s real time, only while running) with lit windows + street lamps, island + beach around the map. Pan/zoom camera (wheel, pinch, right/middle-drag, +/- buttons 30%–450%), drag-to-paint with Bresenham fill. Perf: sprites painted once per tile-size bucket into offscreen canvases; ground and building layers cached at screen size, rebuilt only when the city/camera/light changes (steady frame <2 ms, rebuild ~20–40 ms in SwiftShader).
- 2026-09-27: **Disasters** toolbar section. 🌪️ Tornado and 🌋 Quake are free; click once to arm (button blinks "Sure?"), again within 3 s to unleash. Tornado enters from a random edge, wanders with a pull toward the middle at ~2.4 tiles/s and `wreck()`s its tile plus sometimes a neighbour (grid → EMPTY, rubble left behind); alert with the count when it leaves. Quake: random epicentre, radius max(8, 30% of map); zones lose a level (p = 0.6 × falloff, 10% of those catch fire), roads crack away (p × 0.35), services/power/parks can be destroyed (p × 0.4); screen shake 2.6 s (canvas transform), cracks fade over 30 s, pulse rings. Overlays drawn by `drawDisasterFx()` at the end of draw(); a rAF loop runs only while a tornado or shake is active. Rubble is visual only (Map "x,y" → expiry, 90 s, dropped when the tile is rebuilt), cleared on new game, load and expand. Also fixed: New/Save/Load/Expand buttons used to clear the selected tool (they have no data-tool). rAF timestamps can be earlier than performance.now(): dt is clamped at 0 (negative dt gave a negative arc radius).
- 2026-09-26: SEO — descriptive title/meta description, schema.org JSON-LD.
- 2026-09-26: Mayor's goals — 12-step Win95 goal window over the map (roads → homes → power → 50 people → shops → factory → park → 300 → police+fire → 1,000 → expand → 5,000), each pays a small grant ($200–$3000). `goalIdx` saved with the city; old saves without it skip goals they already meet (no grant). Minimize button in the title bar
- 2026-09-26: og-image.png added — the og:image meta pointed at a file that never existed, so shares had no picture. Screenshot of a sample town (headless, twemoji swapped in for the emoji glyphs).
- 2026-01-20: Road connectivity matters! Buildings without road access generate no income/population, red corner indicator
- 2026-01-20: REBALANCE v4 - Perfect scaling: crime/fire/happiness now scale with city size, diminishing returns on parks
- 2026-01-20: REBALANCE v3 - Anti-capitalist nightmare edition: nerfed commercial, buffed residential & industrial, cheaper services
- 2026-01-20: Added exponential speed controls (1x, 2x, 4x, 8x), loan system with 5% interest, monthly income ticker, and budget breakdown modal
- 2026-01-20: REBALANCE v2 - Ran economy simulations, fixed power plant killing early game. Now profitable from the start!
- 2026-01-20: MAJOR REBALANCE - Much more forgiving! Lower costs, higher income, less disasters, mayors can thrive!
- 2026-01-20: Economy rebalance - higher taxes, lower base maintenance, random maintenance surges, pollution drift
- 2026-01-20: Improved tooltips with 450ms hover delay and comprehensive game mechanic explanations
- 2026-01-20: Added zoom controls (50%-200%) and land expansion ($2000 for +6 tiles, max 60x60)
- 2026-01-20: Added 5 named save slots + New Game button with save prompt
- 2026-01-20: Added autosave every 30 seconds + on window close
- 2026-01-20: Added save/load feature using localStorage (auto-loads on start)
- 2026-01-20: MAJOR OVERHAUL - Added challenging mechanics (fires, crime, pollution, power, services, bankruptcy)
- 2026-01-19: Initial creation - SimCity style city builder
- 2026-09-26: phones (≤600px): toolbar is one swipeable row of 46px-tall tool buttons (section labels hidden, cost under the name, right-edge fade, no scrollbar) instead of five stacked boxes eating ~240px above the map; desktop layout unchanged.

## features (v2 - Challenge Update)
- 36x36 grid city building
- Zone types: Residential, Commercial, Industrial
- Road infrastructure required for development
- **NEW: Power plants** - Buildings need power to develop (need 30%+ coverage)
- **NEW: Police stations** - Reduce crime in area
- **NEW: Fire stations** - Prevent and contain fires
- **NEW: Parks** - Reduce pollution, boost happiness
- **NEW: Fires** - Random fires that spread without fire stations
- **NEW: Crime system** - High crime without police
- **NEW: Pollution** - Industrial zones pollute, affects residential
- **NEW: Happiness** - Affects all growth and income
- **NEW: Building decay** - Low happiness causes abandonment
- **NEW: Bankruptcy** - Game over at -$1000
- **NEW: Maintenance costs** - All buildings cost upkeep
- **NEW: Save/Load** - 5 named slots, autosave, New Game button
- **NEW: Zoom** - 50% to 200% zoom controls
- **NEW: Land Expansion** - Buy more land for $2000 (max 60x60)
- **NEW: Hover Tooltips** - Delayed tooltips (450ms) with full mechanic explanations
- **NEW: Exponential Speed** - 1x, 2x, 4x, 8x speed controls
- **NEW: Loan System** - Borrow up to $10k at 5% annual interest
- **NEW: Income Ticker** - Floating +/- animations when yearly income is applied
- **NEW: Budget Modal** - Click treasury for detailed income/expense breakdown
- Harder development requirements

## challenge mechanics

### Power System
- Each power plant supports ~15 building levels
- Below 30% power = no development
- Below 50% power = happiness penalty

### Crime System
- Crime increases with more buildings
- Police stations reduce crime in range
- High crime blocks residential development
- Parks slightly reduce crime

### Pollution System
- Industrial zones spread pollution
- Pollution visible as purple overlay
- Residential won't grow in polluted areas
- Parks absorb pollution

### Fire System
- Random fires start periodically
- Fires spread to adjacent buildings
- Fire stations prevent fires in range (4 tiles)
- Fire stations contain spread (3 tiles)
- Uncontained fires destroy buildings

### Happiness
- Affected by: power, crime, pollution, parks, shops
- Low happiness = buildings decay/abandon
- Happiness affects tax income
- Happiness affects development speed

### Economy
- Starting money: $5,000 (reduced from $10,000)
- Higher zone costs
- All buildings have maintenance
- Income scales with happiness
- Bankruptcy at -$1,000

## costs (REBALANCED v3)
- Residential: $100
- Commercial: $150
- Industrial: $200
- Road: $50
- Power Plant: $300
- Police Station: $500
- Fire Station: $500
- Park: $150
- Bulldoze: $10
- Starting Money: $10,000!

## maintenance (per year - v3)
- Residential: $1
- Commercial: $2
- Industrial: $3
- Power Plant: $10
- Police/Fire: $20 each (reduced from $30!)
- Park: $5

## tax income (per level - v3 rebalanced)
- Commercial: ~$14.4/year at L3 (nerfed from $18 - TAX_COM 100->80)
- Industrial: ~$18/year at L3 (buffed from $14 - TAX_IND 80->100)
- Tax rate: 15%
- Population bonus: $0.05 per citizen per year! (buffed from $0.02)
- Residential L3 now earns $12/yr from pop bonus alone!

## v3 ROI analysis (at 60% happiness)
| Building    | Cost | Maint | Income/yr (L3) | Net/yr | Payback |
|-------------|------|-------|----------------|--------|---------|
| Commercial  | $150 | $2    | $43            | $41    | ~4 yrs  |
| Industrial  | $200 | $3    | $54            | $51    | ~4 yrs  |
| Residential | $100 | $1    | $12            | $11    | ~9 yrs  |

## pollution (v3 - less punishing)
- Industrial pollution output reduced 40% (0.25+0.05 -> 0.15+0.03)
- Decay rate increased (0.92 -> 0.88) - clears faster
- Industrial is now viable without park spam!

## v4 scaling mechanics (scales with city size)

### Crime Scaling
- Base crime = min(100, totalBuildings × 2)
- Each police station reduces crime by 30% (multiplicative)
- Each park reduces crime by 5% (multiplicative)
- Example: 50 buildings + 3 police + 5 parks = 50×2 × 0.7³ × 0.95⁵ = 27% crime

### Fire Risk Scaling
- Fire chance = min(20%, 5% + buildings × 0.3%)
- Small city (10 buildings): 8% fire chance
- Medium city (30 buildings): 14% fire chance
- Large city (50+): 20% fire chance (capped)

### Happiness Diminishing Returns
- Parks: 5% each but diminishing (cap at 30% total)
- Commercial: sqrt(levels) × 4 (cap at 20% total)
- Prevents happiness spam at large scale

### Infrastructure Overhead
- $1 per 10 building levels
- Represents bureaucracy, roads, utilities
- Small cities barely notice, large cities feel the cost

## maintenance surges (mild and rare)
- After year 10, only ~6% chance per year
- Surges only increase maintenance by 15-25% for 2-3 years
- Much more manageable than before!

## pollution system (forgiving)
- Industrial creates pollution but it decays FAST (92% per tick)
- Minimal drift to neighbors
- Parks still clean pollution effectively
- Pollution tolerance raised to 50% for residential growth

## growth conditions (easier!)
- Demand threshold lowered from 45% to 35%
- Pollution tolerance: 50% (was 40%)
- Crime tolerance: 70% (was 60%)
- Faster growth rate
- Decay only at <20% happiness (was 30%)

## strategy tips
- Build power first!
- Place fire stations before building up
- Keep industrial away from residential
- Use parks as buffers
- Balance growth with services
- Don't expand too fast

## todos
- Add water system
- Add education buildings
- Add health facilities
- More disasters: monster, flood; optional random disasters setting (off by default)
- Add difficulty settings

## beta v2 sim (beta.html only — the sections above describe index.html)
- Power: `computePower()` labels grids, then BFS from plants hands out capacity: built zones take `lv`, empty lots only while supply > demand. `powerZonePct` (road-touching zones with power) drives the meter; `powerCoverage` (level-based) drives happiness.
- Maps (`computeMaps()`): powerMap, crimeMap, landMap, policeCov, fireDist, netOf — rebuilt every sim tick (~1.5 ms of ~4.5 ms per tick at 60×60 in SwiftShader). Use `refreshSim()` after any edit that must show at once.
- Sim state is `var` / declared before the UI section on purpose (TDZ: UI code runs during init).
- Happiness: 50 − power gap − crime·0.3 − pollution·0.2 + parks (≤30) + shops (≤20) + (15 − tax%).
- Test harness hook lives in the session scratch (gaunt/mcbetahook.js): scenarios sim / tax / oldsave / speed / perf / live.

## issues
- Big maps: sim tick ≈ 4.5 ms at 60×60 (fine at 8×, but maps could be computed only before develop / when dirty).
- Pollution spread and yearly drift numbers are unchanged from the live game.
- A lazy player caps at 50 levels until a second plant — the ⚡ bolts, meter and inspector explain it, but watch chat for confusion.

## todos
- beta → live: when chat likes beta.html, copy it over index.html (same save keys, `taxRate` is additive)
- Power line tool (cheap, carries power, no road) if chat finds the road-only grid awkward
- More goals / a few rotating challenges after the 12 (e.g. zero pollution city)
