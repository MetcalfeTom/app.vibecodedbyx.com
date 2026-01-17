# Sloppy Slots

## log
- 2026-01-17: Initial creation
  - Sloppy Coin themed slot machine
  - Neon pink (#ff0080) and green (#00ff80) color scheme
  - 3-reel slot machine with emoji symbols
  - Weighted random symbol selection
  - Animated reel spinning with easing
  - Sound effects (spin, win, lose)
  - Confetti effect on jackpot wins
  - Balance and bet controls
  - localStorage persistence
  - Share Tech Mono + Orbitron fonts
  - CRT scanline effects

## features
- 8 emoji symbols with different payouts:
  - 🌈 Rainbow (50x) - Jackpot!
  - 💀 Skull (25x)
  - 👽 Alien (15x)
  - 🦄 Unicorn (10x)
  - 🔥 Fire (8x)
  - ⭐ Star (5x)
  - 🍀 Clover (3x)
  - 💎 Diamond (2x)
- Weighted randomness (rarer symbols = bigger payouts)
- Smooth reel spinning animation
- Win detection for 3 matching symbols
- Partial win for 2 matching symbols (0.5x bet)
- Confetti particle effects on big wins
- Web Audio API sound synthesis
- Balance persistence in localStorage
- Adjustable bet amounts (10, 25, 50, 100)
- Mobile responsive design

## controls
- SPIN button to play
- Bet buttons to adjust wager
- Auto-saves balance

## gameplay
- Start with 1000 Sloppy Coins
- Choose bet amount
- Spin the reels
- Match 3 symbols for full payout
- Match 2 symbols for half bet back
- Rainbow jackpot = 50x multiplier!

## todos
- Add auto-spin feature
- Add bonus round mini-game
- Add Supabase leaderboard for biggest wins
- Add more symbol animations
- Add sound toggle button
- Add daily free coins

## issues
- None yet
