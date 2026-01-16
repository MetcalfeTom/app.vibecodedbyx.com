# BAGS Tracker

## log
- 2026-01-16: Initial creation
  - Neon cyberpunk aesthetic with animated grid background
  - Fetches real-time data from DexScreener API
  - Displays price, 24h change, market cap, liquidity, volume
  - Auto-refresh every 30 seconds
  - Manual refresh button
  - Floating particle effects
  - Scanline overlay for retro CRT feel
  - Orbitron + Share Tech Mono fonts
  - Glowing neon text effects
  - Link to DexScreener for full chart

## features
- Real-time price tracking via DexScreener API
- Neon green/cyan color scheme
- Animated background grid
- Floating particles
- Price change indicator (green/red)
- Market cap, liquidity, and volume stats
- Chain identification
- Auto-refresh (30 second intervals)
- Manual refresh button
- Mobile responsive design
- CRT scanline effect

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
