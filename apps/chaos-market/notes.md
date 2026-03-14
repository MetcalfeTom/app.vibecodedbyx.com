# Chaos Market Terminal

Trade ADI and BORSH in a chaotic retro stock terminal. Buy the dip or ride the crash.

## log
- 2026-03-14: Initial build. Simulated stock market with $ADI (Adidas Digital Index, start $100) and $BORSH (Borscht Protocol, start $50). Random walk with momentum, mean reversion, volatility spikes, and mega events. Real-time canvas price charts (200-tick history). Scrolling ticker tape with 8 symbols (2 real + 6 decorative). Trading terminal: buy/sell/YOLO all-in. Portfolio tracker with cash, holdings, total value, P/L. Event log with timestamped entries. Chaos events (1% per tick): correlated crashes, volatility spikes, sector rotations, new session days. Breaking news flashes for bull/bear/chaos events. CRT aesthetic: scanlines, vignette, screen flicker. VT323 + IBM Plex Mono typography, green/red/amber terminal palette.

## issues
- None yet

## todos
- Short selling
- Options contracts (calls/puts)
- Leaderboard via Supabase (best P/L)
- More tickers
- Price alerts

## notes
- No database — pure frontend
- Tick rate: 500ms
- ADI volatility: 0.025 base, BORSH: 0.035 base
- Momentum: weighted 0.95 decay + 0.05 new
- Mega events: 0.5% chance per tick per stock
- Chaos events: 1% chance per tick (correlated crash, vol spike, sector rotation, new day)
- Mean reversion: soft floor at 30% of open, ceiling at 400%
- Starting cash: $10,000
- Chart: 200-tick history, auto-scaling min/max
