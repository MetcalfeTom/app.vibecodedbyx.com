# Pirate's Plunder - X Marks the Spot

## log
- 2026-01-07: Pirate theme applied - gold/teal colors, Pirata One font, pirate-themed UI text
- 2026-01-06: Initial creation - full-featured TicTacToe for Slayen's class upgrade

## features
- Local multiplayer (VS Mate mode)
- Captain AI opponent with 3 difficulty levels (Cabin Boy, First Mate, Captain)
- Minimax algorithm for unbeatable Captain AI
- Persistent Hall of Pirates leaderboard via Supabase
- Player statistics tracking (Victories, Defeats, Standoffs)
- Session plunder tracking
- Win animations and highlights
- Pirate gold/teal aesthetic

## game modes
- VS CAPTAIN: Battle against computer
- VS MATE: Local 2-player duel

## Captain's Skill levels
- Cabin Boy: Random moves
- First Mate: 60% optimal, 40% random
- Captain: Minimax algorithm (unbeatable)

## statistics tracked
- Wins, Losses, Draws
- Games played
- Current win streak
- Best win streak
- VS AI wins
- VS Human wins

## database
- Table: tictactoe_stats
- Columns: player_name, wins, losses, draws, games_played, win_streak, best_streak, vs_ai_wins, vs_human_wins
- RLS: Read all, write own

## design
- Pirate gold (X) and teal (O) colors
- Glowing text shadows
- Animated piece placement
- Pulsing win highlight
- Pirata One + Orbitron + Roboto Mono fonts
- Dark wood/parchment gradient background
- Golden board border
- Pirate-themed UI text throughout

## technical
- Minimax with depth scoring
- Supabase auth integration
- localStorage for player name
- Responsive layout
- Touch-friendly

## todos
- Add online multiplayer via realtime
- Add game history replay
- Add sound effects
- Add achievements system
