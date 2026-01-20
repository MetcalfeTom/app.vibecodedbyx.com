# Micro City

## log
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
- Add natural disasters (tornado, earthquake)
- Add difficulty settings

## issues
- None yet
