# Solana Token Tracker

## log
- 2026-01-13: Created neon Solana price tracker with flashing alerts

## features
- Real-time price tracking via Jupiter API
- Tracks token: EiNWA3pEfEisTpC7de2WqhGixuD7zp3gFyD1GfQyBAGS
- Neon Solana gradient styling
- Price display with dynamic decimals
- Change percentage badge (green/red)
- Background flash on significant moves
- 30-bar price history chart
- Stats: 24h high/low, volume, last update
- Price alerts:
  - Set alert above threshold
  - Set alert below threshold
  - Flashing siren emojis
  - Audio alert sound
- Connection status indicator
- Fallback to simulated data if API fails
- Auto-refresh every 10 seconds
- Orbitron + JetBrains Mono fonts
- Mobile responsive

## issues
- API may rate limit on heavy traffic
- Falls back to simulation if Jupiter API unavailable

## todos
- Could add multiple token support
- Could add price history persistence
- Could add notification push
- Could add more chart types
- Could add market cap display
- Could add token metadata fetch
