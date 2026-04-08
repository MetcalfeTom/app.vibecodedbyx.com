# MemePulse

## log
- 2026-04-08: Added DexScreener fallback for contracts CoinGecko doesn't index (pump.fun, new DEX listings, etc.). Pipeline: try CoinGecko first (best data incl. full chart), fall through to DexScreener `/latest/dex/tokens/{address}` on 404, pick highest-liquidity pair, normalize into the standard row shape with `_source: 'dex'`. DEX tokens get a rolling client-side price history (`dexHistory`) that builds up over time from the 60s refresh cycle — up to 6h / 240 samples. Chart shows "DEX-TRACKED · CHART BUILDS LIVE" until 2+ samples collected. Default-tracked `J16vnwycY1UCF384bEkL18MVLki37YvkZo1F3g31pump` (Sloppy The Builder — $SLOPPY on pump.fun) so it's visible out of the box.
- 2026-04-08: Added contract address tracking — sidebar input with chain selector (ETH/SOL/BASE/BSC/POLY/ARB), calls CoinGecko `/coins/{platform}/contract/{address}`, normalizes the response into the same row shape as the category list, merges tracked tokens at the top of the sidebar with a ◆ marker and × remove button. Tracked refs (id, platform, contract) persist in localStorage and rehydrate on page load. Tracked tokens refresh every 60s on their own timer. Selecting a tracked token loads its 24h chart same as any other coin.
- 2026-04-08: Initial build — live memecoin tracker using CoinGecko's free public API (no key). Three-panel layout: left sidebar with top 20 meme-category coins ranked by market cap, center chart pane with canvas-rendered 24h price history, right hype feed with generated social reactions weighted by real price movements. Click any coin to switch chart. Markets auto-refresh every 45s, hype feed ticks every 1.8s with templated bull/bear/mega events pulled from a coin weighted by its absolute 24h change. Canvas chart has grid, axis labels (price on Y, HH:MM on X), area gradient + glow line colored green/red by net direction, last-price pulse dot. Bungee + Space Mono + Rubik Mono One typography, magenta/cyan/lime neon palette with scanline overlay.

## features
- Real prices + 24h changes from CoinGecko /coins/markets (meme-token category)
- Real 24h price history via /coins/{id}/market_chart (days=1)
- Canvas line chart with grid, axis labels, area gradient, glow, pulse dot
- Sidebar of top 20 memecoins with image, name, symbol, price, 24h %
- 4-stat panel (market cap / volume / 24h high / 24h low)
- Live hype feed: 26 usernames, 12 bull + 12 bear templates, 5 mega-bull + 4 mega-bear events
- Sentiment weighted by real direction (80% matches price) and coin picked weighted by absolute volatility
- Mega events only trigger when |24h%| > 5
- Auto-refreshing markets (45s) + hype ticker (1.8s)
- Live clock + pulsing LIVE indicator
- Scanline overlay + CRT vibes
- Fully responsive (collapses to single column under 980px)

## issues
- CoinGecko public API has rate limits (10-30 req/min) — excessive tab reloads may 429
- Hype feed is generated, not real social scraping (no API keys available)
- Chart is limited to 24h window (can be extended by changing days param)
- First paint depends on network; shows "Loading…" until first fetch succeeds

## todos
- Multi-timeframe buttons (1h/24h/7d/30d)
- Sparklines in the sidebar for each coin
- Actually sound-on option with coin-specific pump/dump sounds
- Real social feed via a public feed proxy (if available)
- Real PNG OG image
