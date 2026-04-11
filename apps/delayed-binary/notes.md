# Delayed Binary

Decompose numbers using bracketed positional notation in base 2 with non-standard (delayed) digits.

## log
- 2026-04-11: Initial build. Non-standard binary decomposition where each bracket position is a power of 2, but coefficients aren't limited to 0/1. Bracket notation displays coefficients as 2/3 expressions (e.g. [3-2]=1, [2+3]=5, [-(3-2)]=-1). 4 difficulties: Easy (2-15, 4 positions, coeffs -2 to 3), Medium (10-60, 6 positions, -3 to 5), Hard (30-250, 8 positions, -5 to 7), Expert (100-1000, 10 positions, -7 to 7). Click coefficient then click bracket to place. Real-time value computation with breakdown formula. Auto-check on exact match. Skip shows standard binary solution. Crimson Pro + Fira Code typography, dark grid background with gold/green/blue accents.

## features
- Base-2 positional system with non-standard digits
- Bracket notation with 2/3 expression display
- Coefficient range varies by difficulty
- Real-time breakdown (shows each [coeff]×power=contribution)
- Standard binary shown for reference
- Keyboard input (digits, shift+digit for negative)
- Multiple valid solutions per target
- Streak tracking with localStorage

## issues
- None yet

## todos
- Show all valid decompositions on solve
- Challenge mode: fewest non-zero brackets
- Supabase leaderboard
- Sound effects
- OG preview PNG
