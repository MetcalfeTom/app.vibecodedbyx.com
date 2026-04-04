# Cursed Spins

## log
- 2026-04-04: Initial build — pixel art slot machine that pays out in terrifying low-res fortunes. 8 pixel symbols (skull, eye, coffin, spider, ghost, moon, bat, candle), 4 fortune tiers (cursed/doomed/haunted/blessed), 50+ unique fortunes. Soul economy with betting, animated reels, spin history, CRT overlay. Press Start 2P + Silkscreen fonts, dark purple palette.

## features
- 8 hand-drawn 8x8 pixel art symbols rendered on canvas
- 3-reel animated slot machine with staggered stop times
- 4 fortune tiers: Cursed (horror), Doomed (inconvenience), Haunted (ghost tech), Blessed (rare dark luck)
- 50+ unique terrifying/funny fortunes
- Soul economy: start with 100, bet 5 per spin, payouts for matches
- Triple match jackpot, tier match, partial match payouts
- Spin history log (last 20)
- Machine shake on cursed results
- Game over + restart when souls run out
- Keyboard support (Space/Enter to spin)
- CRT scanline overlay

## issues
- No sound effects
- Bet amount is fixed at 5
- Symbol distribution is uniform — could weight rarer symbols

## todos
- Add Supabase leaderboard (most spins survived)
- Variable bet amounts
- Sound effects (reel spin, stop click, cursed drone)
- Rare animated symbol (e.g. skull with glowing eyes)
- Fortune collection/album system
- OG image
