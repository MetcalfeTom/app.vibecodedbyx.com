# Grab Bet

Delivery betting simulator — bet on arrival times through Bangkok traffic chaos.

## log
- 2026-02-14: Initial build. Random delivery routes with conditions (rain, rush hour, floods, elephants on road, etc). 4 bet options per delivery with dynamic odds. Wager system with bankrupt reset. Animated simulation with event log (delays, shortcuts, obstacles). Leaderboard tracks coins, wins, best streak. Chakra Petch + JetBrains Mono typography, Grab green on dark theme.

## issues
- None yet

## todos
- Add more event variety
- Daily specials / bonus rounds
- Sound effects for win/lose

## notes
- grab_bet_scores: username, coins, bets_won, bets_lost, best_streak
- Starts with 500 coins, resets to 500 on bankrupt
- Delivery time = base distance calc × condition multipliers × random variance (0.7-1.3x)
- 4 bet options: fast, on-time, late, chaos — odds vary per delivery
- Wager options: 25, 50, 100, 250
- Simulation runs 8-12 steps with random delay/speedup events
- 20 restaurants, 22 Bangkok areas, 15 condition types, 13 delay events, 5 speed events
