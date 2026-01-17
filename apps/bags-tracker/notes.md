# BAGS Tracker

## log
- 2026-01-17: Redesigned with neon terminal aesthetic
  - Command-line style interface
  - ASCII art BAGS title banner
  - Terminal prompt styling ($)
  - CRT scanline and vignette effects
  - Mini ASCII chart for 24h movement
  - System time display
  - Countdown timer for auto-refresh
  - Fira Code + VT323 fonts
  - Green/cyan terminal colors
  - Blinking cursor effect
  - Loading bar animation
- 2026-01-16: Initial creation
  - Fetches real-time data from DexScreener API
  - Displays price, 24h change, market cap, liquidity, volume
  - Auto-refresh every 30 seconds

## features
- Real-time price tracking via DexScreener API
- Neon green terminal aesthetic
- ASCII art title banner
- Command-line style output
- Mini ASCII chart showing price movement
- CRT scanline and vignette effects
- System time and countdown display
- Price change indicators (1h, 6h, 24h)
- Market cap, liquidity, volume stats
- Chain and DEX identification
- Pair address display
- Auto-refresh (30 second intervals)
- Manual refresh button
- Mobile responsive design
- Blinking cursor effect

## api
- Uses DexScreener public API (no auth required)
- Endpoint: https://api.dexscreener.com/latest/dex/search?q=bags
- Searches for BAGS token and displays highest liquidity pair

## todos
- Add price alerts
- Add price history chart
- Add multiple token support
- Add sound effects for price changes
- Save favorite tokens to localStorage

## issues
- None yet
