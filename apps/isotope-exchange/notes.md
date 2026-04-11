# Isotope Exchange

Neon options trading simulator — buy calls and puts on volatile digital isotopes. Fission, fusion, and decay events rock the market.

## log
- 2026-04-11: Initial build. 6 fictional isotopes (Neonexium-7, Quartzine-13, Vibranite-42, Plasmonium-99, Zeronium-256, Darkmatter-Zero) with unique volatility/decay profiles. Price simulation: geometric Brownian motion with drift, vol shocks, random jumps, mean reversion. Options trading: CALL (bet up) and PUT (bet down) with 4 expiry durations (10/20/40/80 ticks). Premium calculation pseudo-Black-Scholes. Open positions show live P&L with early close. Auto-exercise at expiry. 7 market events (fission cascade, fusion surge, decay event, isotope discovery, containment breach, quantum tunneling, half-life reset) trigger randomly. Scrolling ticker tape, price chart with gradient fill, position cards, event log. Start balance ₿10,000. Orbitron + Fira Code typography, dark terminal/Bloomberg aesthetic.

## features
- 6 digital isotopes with unique volatility and decay rates
- CALL and PUT options with 4 expiry durations
- Premium pricing (pseudo-Black-Scholes)
- Live P&L on open positions
- Early close or auto-exercise at expiry
- Price chart with history, gradient fill, glow line
- 7 random market events (fission, fusion, decay, etc.)
- Scrolling ticker tape
- Event log with timestamps
- Isotope stats panel (high/low/avg/vol/decay)
- Responsive layout (grid collapses on mobile)

## issues
- None known

## todos
- Supabase leaderboard (highest balance)
- Limit orders / stop losses
- Portfolio history chart
- More exotic options (straddles, spreads)
- Sound effects on events
- OG preview PNG
