# Cheese Catcher

Retro arcade fishing game — catch cheese blocks from a boat on a nacho ocean.

## log
- 2026-02-14: Initial build. Canvas-based game with 5 cheese types, 60s timed rounds, shop upgrades (Stronger Crackers + Golden Reel), Supabase leaderboard. Press Start 2P + VT323 typography, warm nacho/cheese palette. Tables: cheese_scores, cheese_saves.

## issues
- None yet

## todos
- Add sound effects (catch, cast, round over)
- Consider adding power-ups (time bonus, magnet)
- Mobile touch controls: left/center/right thirds

## notes
- cheese_scores: stores best scores per user, leaderboard pulls top 10
- cheese_saves: stores total_cheese coins, cracker_level (0-4), reel_level (0-4)
- Cracker upgrade increases hook catch radius
- Reel upgrade increases line speed and max depth
- 5 cheese types weighted by rarity: Cheddar(40) Gouda(30) Swiss(18) Brie(8) Golden(4)
