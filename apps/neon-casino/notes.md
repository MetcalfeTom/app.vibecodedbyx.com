# Neon Casino

## log
- 2026-01-04: Initial creation - slot machine and roulette wheel

## features
- Two casino games in one app
- Virtual chips system (starts with 1000)
- Chips persist in localStorage
- Tab-based game switching

### Slot Machine
- 3 spinning reels with emoji symbols
- 7 different symbols with weighted probability
- Animated reel spinning effect
- Paytable with multipliers:
  - 7️⃣ 7️⃣ 7️⃣ = 50x
  - 💎 💎 💎 = 25x
  - 🍒 🍒 🍒 = 10x
  - 🍋 🍋 🍋 = 5x
  - Any 3 match = 3x
  - 🍒 🍒 Any = 2x
- Adjustable bet (10-500)

### Roulette
- Canvas-drawn spinning wheel
- 37 numbers (0-36) with proper European layout
- Smooth easing animation on spin
- Bet options:
  - Red/Black (2x)
  - Green/0 (35x)
  - Odd/Even (2x)
  - Low (1-18)/High (19-36) (2x)
- Visual result display with colored number

## design
- Neon pink/magenta primary color
- Gold accents for premium feel
- Orbitron + Russo One fonts
- Glowing effects and shadows
- Dark gradient background
- Responsive for mobile

## technical
- Pure HTML/CSS/JavaScript
- Canvas for roulette wheel rendering
- localStorage for chip persistence
- CSS animations for slot reels
- requestAnimationFrame for smooth wheel spin
- Weighted random for slot symbols

## issues
- None yet

## todos
- Add number betting for roulette
- Add blackjack game
- Add sound effects
- Add Supabase leaderboard
- Add daily bonus chips
- Add more slot machines with different themes
