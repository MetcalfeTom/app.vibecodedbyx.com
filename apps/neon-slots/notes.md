# Neon Slots

## log
- 2026-03-29: V1 — Neon fruit slot machine. 3 reels, 8 symbols with weighted probability pool (Cherry/Lemon most common, Diamond/Seven rarest). Staggered reel stop animation with speed ramp-down. WebAudio procedural sounds: reel ticks, stop thuds, win melodies (small/big/jackpot ascending arpeggios with sparkle), lose descending tones. Glow effect on matching reels with per-symbol neon color. Paytable: Diamond x50, Seven x30, Star x20, Cherry x15 down to pair x2. Bet 5-50 in steps of 5, MAX bet button, space to spin. Free 50 credits on bankrupt. Bungee Shade + DM Mono typography, hot pink/gold neon aesthetic.

## features
- 3-reel fruit machine with 8 symbols
- Weighted symbol pool (Diamond=2%, Seven=4%, Star=6%, fruits=15-20%)
- Staggered reel stop animation (fast > slow > land)
- 3 tiers of win sounds: small pair, big triple, jackpot (Diamond/Seven/Star)
- Neon glow on matching reels with per-symbol color
- Bet adjustment: +/- 5, MAX, range 5-50
- Space bar to spin
- Paytable toggle
- Free 50 credits on bankrupt
- Reel tick sounds during spin

## issues
- None currently

## todos
- Add hold/nudge feature
- Animated coin shower on big wins
- Win history log
- Auto-spin mode
- Supabase leaderboard for biggest single win

## notes
- Symbol weights: Cherry 20, Lemon 20, Orange 18, Grape 15, Melon 15, Star 6, Seven 4, Diamond 2
- Pool size: 100 entries total
- Expected three-of-a-kind rates: Diamond ~0.0008%, Seven ~0.006%, Cherry ~0.8%
- Pair rate: ~30% (any two matching in 3 reels)
- House edge is implicit from payout table vs probabilities
