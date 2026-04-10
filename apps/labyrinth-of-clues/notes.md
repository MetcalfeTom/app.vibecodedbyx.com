# Labyrinth of Clues

Cyberpunk puzzle hunt — crack 8 layers of HYDRA's encryption to break into the vault.

## log
- 2026-04-10: Initial build. 8-stage puzzle hunt with cyberpunk heist narrative. Puzzles: classic riddle, ROT13 cipher, logic riddle, number sequence (primes), word riddle, binary-to-ASCII, riddle, and meta-puzzle (combine first letters of all answers). Progress bar, file header with status, terminal-style clue display, 2-tier hint system, lore between stages, attempt tracking, total time scoring. Best time in localStorage. Rajdhani + Fira Code typography, dark magenta/cyan cyberpunk terminal aesthetic with CRT scanlines.

## features
- 8 layered puzzle stages
- Mix of puzzle types: riddles, ciphers (ROT13, binary), number sequences, meta-puzzles
- Cyberpunk heist narrative with lore between stages
- Terminal-style encrypted file presentation
- 2-tier progressive hint system
- Attempt tracking per stage
- Total time scoring with best time persistence
- Progress bar with stage dots
- File status indicators (LOCKED → CRACKED)
- Keyboard + click input
- WebAudio SFX
- CRT scanline overlay

## issues
- Puzzles are static — once solved, answers are known
- No multiplayer/leaderboard
- Answer for stage 5 (empty) is debatable — the riddle is tricky

## todos
- Supabase leaderboard (fastest times)
- Randomized puzzle pool so replays are different
- More puzzle types (image-based, pattern matching)
- Daily cipher challenge
- Timed mode with countdown per stage
- OG preview PNG
