# Rad Tac Toe

Radioactive tic-tac-toe with CRT glitch effects. Can you beat the reactor?

## log
- 2026-03-14: Initial build. Tic-tac-toe with radioactive/biohazard symbols drawn on per-cell canvases. Player 1 = radioactive ☢ (green, 3-blade trefoil), Player 2/AI = biohazard ☣ (red, 3 interlocking circles). CRT aesthetic: scanline overlay, vignette, flicker animation, horizontal glitch on win. AI mode ("VS REACTOR") with basic strategy: win > block > center > corner > random. 2-player local mode. Score tracking. Glitch flash animation on piece placement. Win cells highlighted amber. Sound effects (place, win fanfare, draw rumble). Major Mono Display + VT323 typography, green/red/amber on black CRT palette.

## issues
- None yet

## todos
- Unbeatable AI (minimax)
- Online multiplayer via Supabase
- Difficulty settings (easy/hard)
- Match history

## notes
- No database — pure frontend
- Symbols drawn via canvas (radioactive trefoil + biohazard circles)
- AI strategy: check win move > check block move > center > random corner > random
- CRT effects: CSS scanlines (3px repeat), radial vignette, flicker keyframes, horizontal glitch on win
- Per-cell canvas resizes on window resize and redraws existing symbols
