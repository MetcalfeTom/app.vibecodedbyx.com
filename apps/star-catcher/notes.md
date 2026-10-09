# Star Catcher - Mini Game

## Log
- Initial creation: Fun star-catching mini-game
- Features:
  - Catch falling stars (⭐) to gain points
  - Avoid bombs (💣) or lose lives
  - Mouse/touch controls for movement
  - Progressive difficulty - speed increases with level
  - Lives system (3 hearts)
  - Level progression (every 100 points)
  - Score tracking
  - Particle effects on catch
  - Pause functionality (SPACE key)
  - Game over screen with replay
  - Animated background with twinkling stars
  - Responsive canvas
- Made for @Jo! Have fun! 🎮
- 2026-10-09: The head module (static `import supabaseDefault from '/supabase-config.js'`) died at load on the live host because the live config has no default export, so window.supabase was never set and the leaderboard and score submit always failed. Now a classic head script loads the config with a tolerant dynamic import into window.supabase/window.supabaseSession (window.__sbReady); submit and the board await it and say "offline" when there is no database. Tested headless with no config and with a fake no-default config (insert + select).
- 2026-10-09: The leaderboard popup no longer stacks on top of the game-over window: opening it hides the game-over panel, Close brings the panel back (if no game is running).

## Issues
- None yet

## Todos
- Could add power-ups (shield, slow-mo, double points)
- Could add high score saving to Supabase
- Could add sound effects
- Could add different star types with bonus points
- Could add combo system

## Notes
- Simple but addictive gameplay
- Difficulty increases naturally with levels
- Clean, starry night aesthetic
- Works on mobile with touch
- 80% stars, 20% bombs spawn rate
- Speed increases with level
- Level up every 100 points
