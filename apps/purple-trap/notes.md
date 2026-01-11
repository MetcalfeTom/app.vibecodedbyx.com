# The Purple Trap

## Log
- 2026-01-11: Made d-pad always visible
  - Forced display:block and z-index:9999 with !important
  - Controls now visible on all devices, not just mobile
- 2026-01-11: Added high-contrast neon mobile controls
  - Neon magenta d-pad with glow effects on left side
  - Large green DASH button on right side
  - Touch-friendly with active state feedback
  - Dash mechanic: invincibility frames during dash
  - Green trail effect when dashing
  - Cooldown indicator bar below player
  - Spacebar support for desktop
  - Whoosh sound effect on dash
- 2026-01-11: Added looping death audio
  - Agonizing screams loop every ~1 second
  - Wet crunch/bone snap sounds every ~0.5 seconds
  - Gurgling noise underneath screams
  - Random extra crunches for variation
  - Audio stops when restart button appears
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
