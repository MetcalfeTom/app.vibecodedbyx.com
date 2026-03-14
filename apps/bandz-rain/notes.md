# Bandz Rain

Golden bricks of money fall from the sky — catch them with your designer bag.

## log
- 2026-03-14: Initial build. Canvas catcher game. 5 money brick tiers: $100 (common), $500, $1K, $5K, $10K (rare). Weighted spawn system. Designer bag with handles, gold clasp, stitching, leather gradient. Bricks have $ stamps, shine, sparkle on high-value. Combo system (x1-x10, multiplies score). 5 misses = game over. Difficulty scales with time (spawn rate increases, speed grows). Gold particle bursts on catch, floating +$ text. Score tiers with end messages. Hi-score in localStorage. Touch + mouse support. Playfair Display + DM Mono typography, dark luxury gold/brown palette.

## issues
- None yet

## todos
- Power-ups (magnet, wider bag, slow-mo)
- Bomb bricks to dodge (lose combo)
- Different bag skins unlocked by score
- Leaderboard via Supabase

## notes
- No database — pure frontend with localStorage hi-score
- Brick weights: $100(60), $500(25), $1K(10), $5K(4), $10K(1)
- Spawn rate: max(15, 50 - difficulty*4) frames
- Difficulty: 1 + frame * 0.0003
- Combo caps at x10, resets on miss
- Bag follows mouse/touch with 0.15 lerp
- Max 5 misses before game over
