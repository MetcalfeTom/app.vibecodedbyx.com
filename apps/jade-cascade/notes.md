# jade-cascade · notes

## log
- 2026-07-14 v1.0: chat "Mahjong-inspired cascading tile slot — weighted symbols, cascades, combo multipliers, wild/scatter, bonus rounds, free spins" + follow-up "configurable RTP, volatility settings". PLAY-MONEY ONLY (disclaimers header+commit). 5×4 ways-pay grid (consecutive reels left→right, per-reel hit counts multiply ways, 百 wild substitutes). Cascades: winners shatter → gravity → weighted refill → ladder climbs (calm ×1/2/3/5/8, spicy ×1/2/4/6/10; FS doubles both). 寶 scatter 3+ → 8 FS (+2/extra, retriggers). Ladder-max in base game → Fortune Pick (3 of 9, prizes ×bet×scale). **RTP is measured, not asserted**: engine is pure + node-extractable, RNG injectable (xorshift); 30k-spin Monte Carlo per volatility gave RTP1 calm=3.7590 spicy=3.8507 at scale 1, runtime scale=target/RTP1 (targets 88/94/97%), verification sim across all 6 combos landed 89.6–98.5% (±2pp MC noise, sd≈3 per spin). Settings (调 tune) persist to jade-config; paytable shows EFFECTIVE scaled pays + current ladder + tune. Balance persisted, temple grants +500 when broke.
- **BUG CAUGHT BY SIM (would've shipped silently)**: scatters were summed per cascade STEP but never removed from the grid → each scatter counted once per cascade → FS triggers exploded → divergent retrigger loop (first sim literally ran forever). Fix: scatters = count in FINAL grid (nothing removes them, so it equals distinct scatters seen). Lesson: sim the feature loop, not just the spin.
- Ops gotchas: `pkill -f "node -e"` matches the CALLING shell's own argv → killed itself + the fix that was queued behind it (verify edits landed after any kill); node /dev/stdin heredoc broken here — write sim scripts to scratchpad files.

## issues
- Per-way pays after scaling are small decimals (0.005–0.275×bet) — normal for ways games but chat may ask why pays look tiny. Ways multiply fast: 4 hits/reel × 5 reels = 1024 ways.
- MC noise ±2pp on the RTP label at 20-30k spins; label says "measured" honestly.

## todos
- Win-history sparkline; biggest-win ledger.
- "turbo" toggle (skip cascade waits).
- Chat requests were truncated at "co…" twice — possibly "coin shop" or "community jackpot"; ask.
