# Micro City

## log
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

## maintenance (per year)
- Residential: $5
- Commercial: $8
- Industrial: $10
- Power Plant: $50
- Police/Fire: $100 each
- Park: $20

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
