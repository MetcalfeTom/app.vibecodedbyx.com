# THE UNCLICKABLE

## Log
- 2026-01-10: Added Vite build setup
  - Modular source code in src/ folder
  - messages.js: All gaslighting and UI messages
  - console.js: Styled console logging utilities
  - game.js: Core game logic
  - style.css: All styles separated
  - Custom build.js script (sandbox-friendly, no native binaries)
  - Run `node build.js` to bundle into dist/
  - Production index.html is the bundled output
- 2026-01-10: Initial creation
  - Frustration simulator with evasive update button
  - Button dodges cursor with increasing difficulty
  - Console gaslighting messages
  - Rage meter and stats tracking
  - Fake progress bar tease
  - Multiple button moods (normal, smug, angry)

## Features
- **Evasive Button**: UPDATE button runs away from cursor
- **Console Gaslighting**: 25+ messages that blame the user
- **Rage Meter**: Tracks frustration level
- **Stats Tracking**: Attempts, distance traveled, time wasted
- **Fake Progress**: At 15 attempts, shows fake download that fails at 99%
- **Button Moods**: Changes text/color based on rage level
- **Taunts**: Spawns emoji taunts when button escapes
- **Anti-Cheat**: Blocks keyboard focus and direct clicks
- **Increasing Difficulty**: Evasion level increases every 10 attempts

## Console Messages Include
- "The button moved? No it didn't. That's impossible."
- "Our analytics show 99.7% of users click this button successfully."
- "What if the button was inside you all along?"
- "Achievement Unlocked: Professional Button Misser"
- "Maybe the real update was the friends we made along the way."

## Button Moods
- Normal (0-40% rage): "UPDATE NOW" - Green
- Smug (40-80% rage): "lol", "too slow", "nope" - Yellow
- Angry (80-100% rage): "STOP CHASING ME", "I SAID NO" - Red

## Design
- JetBrains Mono font
- Neon magenta/cyan color scheme
- CRT scanlines effect
- Crosshair cursor
- Glowing button effects

## Todos
- Add sound effects
- Add more gaslighting messages
- Add secret way to actually click it
- Add leaderboard for lowest attempts
