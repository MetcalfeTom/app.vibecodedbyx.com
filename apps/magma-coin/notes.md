# MagmaCoin

Live crypto prices. When coins dump, they burn.

## log
- 2026-03-16: Initial build. Live crypto ticker using CoinGecko free API (no key). 12 coins: BTC, ETH, SOL, DOGE, ADA, XRP, DOT, AVAX, LINK, LTC, UNI, NEAR. Card grid with price, 24h/1h/7d change, market cap, 7-day sparkline. Fire system: coins with >2% 24h drop get "burning" state (red border glow, fire gradient overlay). When 3+ coins burning, global fire mode activates — fullscreen canvas fire particle system with bottom glow, crackling burn sound. Green glow for coins pumping >3%. Market mood indicator: "EVERYTHING IS ON FIRE" / "MELTING DOWN" / "COOLING OFF" / "PUMPING" based on average 24h change. Auto-refresh every 60s. Sparklines drawn on canvas with fill under curve. Permanent Marker + Fira Code typography, volcanic dark palette with fire/green accents.

## issues
- CoinGecko free API has rate limits (~10-30 calls/min), 60s refresh should be fine
- Sparkline data comes from CoinGecko's 7-day sparkline (168 data points)

## todos
- Click card to expand with more details (volume, ATH, supply)
- Price alert thresholds (custom fire triggers)
- Portfolio mode (enter holdings, track total value)
- Sound toggle

## notes
- No database — pure frontend
- API: CoinGecko /coins/markets with sparkline=true and price_change_percentage=1h,24h,7d
- Fire particles: HSL hue 0-40 (red to yellow), rise from bottom, random drift, glow shadowBlur
- Global burning: triggered when 3+ coins have >2% 24h loss
- Background fire canvas: fixed position, opacity transition, 3 particles/frame when burning
- Sparkline: canvas per card, stroke + fill under, color based on 24h change direction
- Market mood thresholds: <-3% fire, <-1% lava, <1% cool, >1% green
- Burn sound: lowpass-filtered noise with periodic crackle spikes
