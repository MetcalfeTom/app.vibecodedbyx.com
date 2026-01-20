# Micro City

## log
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

## costs
- Residential: $150
- Commercial: $200
- Industrial: $250
- Road: $75
- Power Plant: $500
- Police Station: $750
- Fire Station: $750
- Park: $300
- Bulldoze: $25

## maintenance (per year, base)
- Residential: $4
- Commercial: $6
- Industrial: $8
- Power Plant: $40
- Police/Fire: $80 each
- Park: $15

## tax income (per level)
- Commercial: $6/year (at 100% happiness)
- Industrial: $4.5/year (at 100% happiness)

## maintenance surges
- After year 5, ~12% chance per year of maintenance surge
- Surges increase all maintenance by 30-60% for 2-4 years
- Types: Power Grid Strain, Infrastructure Decay, Labor Shortage, Equipment Failure, Material Costs
- Alert shown when surge starts, income shows ⚠️ during surge
- Good players build cash reserves to weather surges

## pollution system
- Industrial creates pollution that scales with building level
- Pollution now drifts to adjacent tiles over time
- Natural decay is slower (97% vs 95% per tick)
- Parks actively clean pollution in 1-tile radius
- Without parks, pollution accumulates and spreads!

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
