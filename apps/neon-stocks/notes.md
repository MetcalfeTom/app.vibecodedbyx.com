# Neon Stocks

Live-updating financial dashboard with glowing neon charts and simulated market data.

## log
- 2026-03-20: Initial build. 8 mock stocks (SLPY, VIBE, NEON, GLOW, CRYO, FLUX, PIXL, VOID) with unique colors and volatility. Ticker strip with live price/change. Canvas main chart with glow line, area fill, pulsing current price dot, volume bars, grid lines, price labels. 6 stat cards (market cap, 24h volume, day range, open, day change, volatility) with sparkline mini-charts. Prices tick every 1.5s with random walk. Click ticker cards to switch stock. Live clock. Responsive grid layout. Chakra Petch + Fira Code typography, cyan/dark terminal aesthetic.

## issues
- None yet

## todos
- Candlestick chart mode toggle
- Portfolio tracker (buy/sell mock trades)
- Price alerts
- Historical timeframe selector (1D, 1W, 1M)

## notes
- No database — pure frontend, all data simulated
- 120-point price history per stock
- Volatility varies per stock (1.2% to 2.5%)
- Slight upward bias (random()-0.48) to simulate bull market
- Chart redraws every frame for smooth pulse animation
- Prices update every 1.5s
