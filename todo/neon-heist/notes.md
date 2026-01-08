# Neon Heist

## log
- 2026-01-03: Initial creation - terminal hacker game with puzzles

## features
- 5 vaults to crack
- 3 puzzle types: Code Breaker, Memory Sequence, Laser Grid
- Terminal command interface
- Credits system
- Alert/failure tracking
- Increasing difficulty per vault
- Hint system (costs credits)
- Scanlines CRT effect

## puzzles

### Code Breaker
- Guess 4-digit code
- 6 attempts maximum
- Green = correct position
- Yellow = wrong position
- Mastermind-style logic

### Memory Sequence
- Watch symbol sequence flash
- Repeat in correct order
- Length increases per vault
- One mistake = fail

### Laser Grid
- 5x5 grid navigation
- Avoid horizontal/vertical lasers
- Move to adjacent cells only
- Reach exit (bottom-right)

## terminal commands
- help: Show available commands
- scan: Scan vault security type
- crack: Reminder to use puzzle panel
- hint: Get hint (costs 50 credits)
- status: View current progress
- clear: Clear terminal

## scoring
- 100 credits × vault number per success
- -50 credits for hints
- 3 alerts = game over

## design
- Green terminal aesthetic
- Cyan puzzle panel
- Red laser effects
- Magenta sequence highlights
- Scanlines overlay

## technical
- Split-screen layout
- Dynamic puzzle generation
- Command parsing system
- Progressive difficulty

## issues
- None yet

## todos
- Add sound effects
- Add more puzzle types
- Add leaderboard
- Add timed challenges
- Add vault themes
