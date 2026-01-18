# Costeo Gastronómico

## log
- 2026-01-18: Initial creation
  - Spanish language interface
  - Neon magenta/cyan aesthetic
  - Ingredient list management
  - Margin and markup calculations
  - Multiple currency support
  - Recipe save/load to localStorage

## features
- Full Spanish interface
- Add/remove ingredients dynamically
- Ingredient fields: name, quantity, unit, unit cost
- Auto-calculated subtotals per ingredient
- Multiple units: kg, g, lb, oz, L, ml, unidad, docena, taza, cdta, cda
- Multi-currency: USD, EUR, MXN, ARS, CLP
- Calculations:
  - Costo Total (total cost)
  - Costo por Porción (portion cost)
  - Ganancia Bruta (gross profit)
  - % Costo Real (food cost percentage)
  - Margen de Ganancia (profit margin)
  - Markup multiplier
- Suggested price based on target cost %
- Visual margin bar indicator
- Color-coded results (green/gold/red)
- Save recipes to localStorage
- Load saved recipes
- Export recipe as JSON
- Example recipe pre-loaded (Risotto de Hongos)

## design
- Orbitron + Exo 2 fonts
- Dark purple/teal gradient background
- Neon magenta and cyan accents
- Glowing text shadows
- Card-based layout
- Recipe chips for saved items

## controls
- Add ingredient button
- Delete ingredient (×) per row
- Currency selector buttons
- Save/New/Export buttons
- Click saved recipe to load
- All inputs update calculations in real-time

## todos
- Add print/PDF export
- Add recipe scaling
- Add supplier price tracking
- Add inventory integration
- Add recipe costing history

## issues
- None yet
