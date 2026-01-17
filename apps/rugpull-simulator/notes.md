# Rugpull vs Creator Profit Simulator

## log
- 2026-01-17: Initial creation
  - Educational token economics simulator
  - Side-by-side rugpull vs legitimate comparison
  - Interactive sliders for parameters
  - Real-time price chart visualization
  - Outcome calculations for both scenarios
  - Red flags vs green flags info section
  - JetBrains Mono + Inter fonts
  - Dark theme with red/green accents
  - Mobile responsive design

## features
- Rugpull Scenario:
  - Creator allocation slider (50-95%)
  - Initial liquidity slider
  - Dump speed slider
  - Shows: creator profit, investor loss, price drop
  - Red price chart showing pump & dump

- Legitimate Scenario:
  - Creator allocation slider (5-30%)
  - Initial liquidity slider
  - Vesting period slider (3-24 months)
  - Shows: creator profit, investor gain, price growth
  - Green price chart showing organic growth

- Comparison Section:
  - Side-by-side metrics
  - Creator earnings comparison
  - Investor outcomes comparison
  - Project survival indicator
  - Reputation indicator

- Educational Info:
  - Rugpull red flags list
  - Legitimate green flags list
  - How to spot the difference

## simulation model
- Simple AMM-style price impact
- Buying increases price proportionally
- Selling decreases price proportionally
- Rugpull: rapid dump crashes price
- Legitimate: gradual vesting + growth

## todos
- Add more realistic AMM curve (constant product)
- Add honeypot detection example
- Add historical rugpull case studies
- Add quiz mode
- Add share results feature

## issues
- Simulation is simplified for education
- Not meant to model real market dynamics exactly
