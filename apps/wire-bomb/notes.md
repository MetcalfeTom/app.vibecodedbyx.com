# Wire Bomb

24-wire bomb defusal module — cut the right wires based on serial numbers, indicators, and complex color rules.

## log
- 2026-04-12: Initial build. 24 wires using exact RGB spectrum (step 48 on 192 base): Red, Vermillion, Orange, Amber, Yellow, Lime, Chartreuse, Harlequin, Green, Shamrock, Spring, Seafoam, Cyan, Capri, Azure, Cerulean, Blue, Indigo, Violet, Purple, Magenta, Cerise, Rose, Crimson. Wires shuffled into random positions per puzzle. 8 defusal rules based on: serial number (even/vowel/high digit), indicator states (FRK/CAR/BOB/SIG lit), wire position parity, color groups (warm/cool/mix/primary/secondary), and position multiples. Randomized serial (6 chars), 3-5 indicators from 11-label pool. 4-12 wires targeted per puzzle. 2 strikes = detonation. 4-minute timer. Manual with color reference swatches and all 8 rules. VT323 + IBM Plex Mono typography, dark bomb-defusal aesthetic.

## features
- 24 unique wire colors (full RGB spectrum)
- Randomized wire positions per puzzle
- 6-character alphanumeric serial number
- 3-5 indicators (SIG, FRQ, TRK, CAR, IND, NSA, BOB, CLR, FRK, MSA, SND)
- 8 interconnected defusal rules
- Color groups: warm, cool, mix, primary, secondary
- Wire glow effects matching their RGB color
- 2 strikes max (wrong wire = strike)
- 4-minute countdown timer
- In-game defusal manual with color swatches
- Progressive bomb counter

## issues
- None known

## todos
- Sound effects (snip, alarm, explosion)
- Leaderboard (fastest defusal times)
- Harder difficulty (more rules, 1 strike max)
- Wire cutting animation
- Two-player mode (one reads manual, other cuts)
- OG preview PNG
