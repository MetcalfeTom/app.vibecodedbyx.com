# The Purple Trap

## Log
- 2026-01-11: Enhanced game over sequence
  - 10-second death animation before restart appears
  - Golden suit with player trapped inside
  - Red liquid pouring from suit seams
  - Growing blood pool on floor
  - Creepy messages: "THE SUIT ALWAYS FINDS ITS OWNER", "I ALWAYS COME BACK", "IT'S ME"
  - Screen shake and glitch effects
  - Final score display during animation
- 2026-01-11: Initial creation
  - 2D arcade game inspired by FNAF
  - Purple Guy player dodges 5 ghost children
  - Collect golden springlocks to score
  - Level progression with faster/more ghosts
  - Glitchy neon factory aesthetic
  - "IT'S ME" random flash effect
- 2026-01-11: Added SPRINGLOCK FAILURE mechanic
  - Stay still for 3 seconds = brutal death
  - Warning indicator with flashing border
  - "MOVE!" text and progress bar
  - Golden suit crushing animation
  - Blood splatter effect
  - Loud crunch sound (Web Audio API)

## Features
- **Purple Guy**: Player character with evil grin
- **5 Ghost Children**: Gabriel, Jeremy, Susie, Fritz, Cassidy
- **Springlock Collectibles**: Golden animatronic heads
- **Springlock Failure**: Stay still too long = crushed
- **Level Progression**: More ghosts, faster movement
- **Glitch Effects**: Random screen tears and shake
- **Mobile Controls**: Touch buttons for mobile play
- **"IT'S ME"**: Random FNAF easter egg text

## Controls
- Arrow Keys / WASD: Move
- Mobile: On-screen buttons

## Technical
- Canvas 2D rendering
- Web Audio API for crunch sound
- Responsive canvas sizing
- 60fps game loop

## Todos
- Add high score leaderboard (Supabase)
- Add power-ups (speed boost, invincibility)
- Add more sound effects
- Add boss level (Golden Freddy?)
