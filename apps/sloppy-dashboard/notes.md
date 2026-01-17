# SLOPPY Token Dashboard

## log
- 2026-01-17: Initial creation
  - Live dashboard tracking all SLOPPY tokens
  - DexScreener API integration
  - Auto-refresh every 30 seconds
  - Aggregate stats (volume, liquidity, mcap)
  - Individual token cards with details
  - Mini sparkline charts
  - Links to explorers (DexScreener, Solscan, Birdeye)
  - Copy contract address button
  - Chain identification badges
  - JetBrains Mono + Space Grotesk fonts
  - Dark theme with pink/green accents
  - Mobile responsive grid

## features
- Header Stats:
  - Total 24h volume across all tokens
  - Number of tokens found

- Totals Bar:
  - Combined 24h volume
  - Combined liquidity
  - Combined market cap
  - Active trading pairs count

- Token Cards (for each SLOPPY token):
  - Token name and symbol
  - Trading pair
  - Chain badge (Solana, etc.)
  - Current price
  - 24h price change (color coded)
  - Mini sparkline chart
  - 24h volume
  - Liquidity
  - Market cap
  - DEX name
  - Contract address with copy button
  - Links to DexScreener, Solscan, Birdeye

- Status Bar:
  - Live connection indicator
  - Last update timestamp
  - Manual refresh button

## api
- Uses DexScreener public API
- Endpoint: /latest/dex/search?q=sloppy
- Filters results for tokens with "sloppy" in name/symbol
- No authentication required

## todos
- Add sorting options (by volume, price, change)
- Add price alerts
- Add historical price charts
- Add whale wallet tracking (would need additional API)
- Add token comparison view
- Save favorite tokens to localStorage
- Add sound notification on big price moves

## issues
- Sparklines are generated, not real price history
- Limited to what DexScreener returns (may miss some tokens)
