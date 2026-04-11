# Fox Font Quest

WASD-controlled platformer where you play as the letter F with fox ears.

## log
- 2026-04-11: Word buffer system — floating letters now spell a target word per level. Collect letters IN ORDER to fill the word buffer (shown as boxes at bottom of screen). Target letters glow gold, next-needed letter has a teal pulse ring, decoy letters are dim purple. Wrong-order or decoy pickups give a red/gray particle flash. Word complete triggers celebration particles and teal flash. HUD shows word progress. Death/win screens reference the word. 6 word pools (3-7 letter words) mapped to levels.
- 2026-04-11: Complete rewrite — converted from word puzzle game to canvas-based platformer. Player is the letter "F" rendered in Vollkorn bold with fox ears, tail (with gold tip), eyes that blink, and squash/stretch physics. WASD/arrow/space controls. 6 levels (Whispering Meadow, Amber Thicket, Moonlit Cavern, Crimson Peak, Frozen Archive, The Void Spire). Collectible letter pickups with glow/bob animation, spike hazards, flag goals. Particle system for jumps/landings/collections. Smooth camera follow. Parallax star background. Mobile touch controls. 3 lives system. localStorage best level tracking. Vollkorn + Azeret Mono typography.
- 2026-04-11: Initial build as word puzzle game (replaced by platformer).

## features
- Canvas-based 2D platformer
- Player is the letter "F" with fox ears, tail, eyes
- WASD / Arrow keys / Space controls
- Mobile touch controls (auto-shown on touch devices)
- 6 themed levels with increasing difficulty
- Collectible alphabet letters
- Spike hazards, flag goals
- Squash/stretch animation, ear/tail wobble
- Particle effects on jump, land, collect
- Parallax star backgrounds
- 3 lives, respawn on death
- Level complete screen with letter collection bonus

## issues
- Levels are tile-map based ASCII art — adding new levels means editing map strings
- No sound effects yet

## todos
- WebAudio SFX (jump, collect, death)
- More levels
- Moving platforms
- Enemy characters
- Supabase leaderboard (fastest clear time)
- OG preview PNG
- Wall jump ability
