# Nacho Empire

## log
- 2026-01-07: Initial creation - infinite clicker with golden chip and 10 upgrades

## features
- Giant golden nacho chip to click
- 10 upgrade tiers from Salsa Dipper to Cheesiverse
- Exponential cost scaling (1.15x per purchase)
- Click power scales with production
- Cheese/nacho particle effects
- Auto-save to localStorage every 10 seconds
- Number formatting (K, M, B, T, Q)
- Mobile responsive layout

## upgrades
1. Salsa Dipper - 0.1/s
2. Abuela - 1/s
3. Corn Farm - 8/s
4. Chip Factory - 47/s
5. Cheese Mine - 260/s
6. Nacho Temple - 1,400/s
7. Queso Wizard - 7,800/s
8. Salsa Portal - 44,000/s
9. Nacho Planet - 260,000/s
10. Cheesiverse - 1,600,000/s

## design
- Warm orange/gold/brown color scheme
- Bangers font for titles
- SVG golden chip with salt specks and cheese
- Glowing pulse animation
- Floating emoji particles on click

## technical
- localStorage for persistence
- 60fps game loop for smooth production
- Cost formula: baseCost * 1.15^count
- Click power: 1 + floor(nachosPerSecond / 100)

## todos
- Add achievements system
- Add prestige/reset mechanic
- Add golden nacho random events
- Add sound effects
- Add cloud save with Supabase
