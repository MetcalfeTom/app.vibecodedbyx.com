# BTC Tracker

## log
- 2026-01-05: Initial creation - Ratatui-style Bitcoin price tracker

## features
- Real-time Bitcoin price from CoinGecko API
- 24h price change percentage
- Stats: high/low, volume, market cap, supply, ATH
- ASCII block chart with 24h price history
- Top 5 cryptocurrencies table
- Auto-refresh every 60 seconds
- Keyboard shortcut (R) to manual refresh
- Connection status indicator

## design
- Ratatui/TUI aesthetic with bordered blocks
- Tokyo Night color palette
- JetBrains Mono font
- Box-drawing characters for borders
- Dashed lines for table rows
- Keybindings bar at bottom
- Green/red for up/down indicators

## technical
- Vanilla JavaScript + CSS
- CoinGecko free API (no key required)
- ASCII chart rendered with Unicode blocks
- Responsive grid layout
- Auto-refresh interval

## issues
- CoinGecko has rate limits on free tier
- Chart may be unavailable if API throttled

## todos
- Add more timeframe options (7d, 30d)
- Add price alerts
- Add more coins to track
- Add sparkline mini-charts
