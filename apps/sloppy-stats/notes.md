# Sloppy Stats

Universal scoreboard aggregating all sloppy.live game leaderboards into one dashboard.

## log
- 2026-02-01: Initial creation
  - Queries 11 game leaderboard tables in parallel
  - Per-game top 10 cards with rank medals (gold/silver/bronze)
  - All-time cross-game rankings sorted by games played + best score
  - Player search with fuzzy matching
  - Player card shows all scores across games
  - Click any player name to look them up
  - Anybody + DM Mono typography, gold/dark arcade aesthetic
  - Subtle grid background
  - Mobile responsive

## games tracked
- Breakout Terminal (breakout_terminal_scores)
- Icy Tower (icy_tower_scores)
- Neon Tetris (tetris_leaderboard)
- Star Catcher (star_catcher_leaderboard)
- Sea Scourge (sea_scourge_leaderboard)
- Laptop Fire (laptop_fire_scores)
- Lighthouse Keeper (lighthouse_scores)
- Road Rage (simpsons_road_rage_scores)
- Toilet Run (toiletrun_leaderboard)
- Treasure Calculator (treasure_calculator_scores)
- Sloppy's Gift (sloppys_gift_leaderboard)

## issues
- None yet

## todos
- Could add time-based filtering (today/week/all-time)
- Could add game-specific detail pages
- Could add score trend sparklines per player
