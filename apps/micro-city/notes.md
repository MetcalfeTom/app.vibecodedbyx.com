# Micro City

## log
- 2026-01-19: Initial creation - SimCity style micro city builder

## features
- 40x40 grid-based city building
- Zone types: Residential, Commercial, Industrial
- Road infrastructure system
- Bulldoze tool
- RCI demand system (like SimCity)
- Buildings grow based on demand and road access
- 3 building levels per zone type
- Basic economy (income/expenses)
- Population tracking
- Year counter
- 4 game speeds (pause, 1x, 2x, 3x)
- Keyboard shortcuts (1-5 for tools)
- Touch support for mobile

## design
- Dark blue/cyan color scheme
- Outfit + Space Mono fonts
- SimCity-inspired UI layout
- Toolbar on left, info panel on right
- Grid overlay on canvas
- Building sprites with windows
- Factory chimney with smoke

## zones
- Residential (green): $100, houses population
- Commercial (blue): $150, shops need population
- Industrial (orange): $200, factories need workers
- Roads (gray): $50, required for zone development
- Bulldoze: $10, clears any tile

## economy
- Income: Commercial × $50 + Industrial × $30
- Expenses: Residential × $10 + Commercial × $5 + Industrial × $5
- Population: Residential buildings × 100

## demand system
- R demand increases with more jobs (C+I)
- C demand increases with population
- I demand increases with population and shops
- Buildings only grow if demand > 40%
- Must be adjacent to road to develop

## controls
- Click/drag: Place zones
- 1: Residential
- 2: Commercial
- 3: Industrial
- 4: Road
- 5: Bulldoze

## todos
- Add power/water utilities
- Add parks and landmarks
- Add disasters
- Add save/load
- Add zoning density levels
- Add traffic visualization

## issues
- None yet
