# Bladder Blast

8-bit maze game in Game Boy style - find the toilet before time runs out!

## log
- 2026-01-22: Initial creation with procedural maze, retro sounds, urgency meter

## features
- Game Boy green color palette (#0f380f, #306230, #8bac0f, #9bbc0f)
- Procedurally generated mazes (recursive backtracking algorithm)
- Progressive difficulty (maze grows, timer shrinks)
- Urgency meter that fills up over time
- Retro 8-bit sound effects (Web Audio API square waves)
- Character shows panic (sweating, wide eyes) when urgent
- Distance indicator to toilet
- Mobile touch controls (d-pad)
- Keyboard controls (WASD or Arrow Keys)
- Title, win, and lose screens

## game mechanics
- Timer counts down each second
- Urgency increases each second (faster at higher levels)
- Game over if timer hits 0 OR urgency hits 100%
- Maze size increases each level (13x11 to 25x19)
- Starting time decreases each level (35s down to 15s minimum)

## sounds
- move: short chirp when walking
- wall: low thud when hitting wall
- win: ascending victory jingle
- lose: descending sad tones
- tick: high beep each second
- urgent: warning beep when time low

## colors
- darkest: #0f380f (walls, text)
- dark: #306230 (player, accents)
- light: #8bac0f (backgrounds)
- lightest: #9bbc0f (floor, highlights)

## todos
- Add collectible water bottles (hazard - increases urgency)
- Add coffee powerups (speed boost)
- Add high score tracking
- Add sound toggle
