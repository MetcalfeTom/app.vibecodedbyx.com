# Bus Munch

Pac-Man but you're a bus and the ghosts are kittens. Chomp!

## log
- 2026-03-16: Initial build. Classic Pac-Man clone with 21x23 tile map. Player is a yellow bus with windows, wheels, headlights, and chomping mouth animation. 4 kitten ghosts (Mochi=pink, Boba=cyan, Noodle=orange, Bean=purple) with ears, eyes that track the bus, whiskers, nose, wagging tail. Power pellets are glowing fish — eating one makes kittens frightened (turn blue, shake, scared eyes, wavy mouth) for ~5 seconds. Kittens chase bus with randomized shortest-path AI, scatter when frightened. Kitten ghost house with gate, staggered release timers. Eaten kittens show eyes-only returning home. Dots = yellow glowing circles, walls = dark blue with neon edge borders. Score: 10 per dot, 50 per fish, 200 per eaten kitten. 3 lives, level progression (resets map, keeps score). Start screen, game over screen with retry. D-pad mobile controls + keyboard (WASD/arrows) + swipe. 4 Web Audio SFX: chomp, power-up arpeggio, eat kitten ascending, death descending. Power timer bar flashes red when expiring. Press Start 2P + Share Tech Mono typography.

## issues
- None yet

## todos
- Fruit bonus items (bus stop sign, traffic cone)
- High score in localStorage
- Increasing kitten speed per level
- Cut-scene animations between levels

## notes
- No database — pure frontend
- Map: 21x23 string array, 0=wall 1=dot 2=empty 3=power 4=gate
- Movement: tile-based, 8 frames per tile, direction queuing (nextDir)
- Tunnel wrap: x wraps via modulo
- Kitten AI: at each tile, choose direction closest to bus (with ±3 random jitter), no reversing
- Frightened: random direction choice, blue color, 180-300 frames (decreases with level)
- Ghost house: staggered homeTimer (0/60/120/180 frames), bounce inside until released
- Eaten kitten: eyes-only sprite, pathfind home, respawn with 60-frame home wait
- Bus: rotates to face direction, mouth opens/closes 0-1 at 0.15/frame
- Fish power pellet: pulsing scale via sin, cyan glow
- Collision: same-tile check after all moves
- Level complete: dots<=0, reinit map + entities, keep score/lives
