# Fox Quest

2D platformer where an anthropomorphic fox collects berries across forest levels.

## log
- 2026-04-11: Initial build. Canvas-based platformer with fully drawn anthropomorphic fox character — body, head, ears (with wag), eyes (with blink + pupils + shine), nose, mouth, whiskers, belly, legs (with run animation), paws, bushy tail (with wag + white tip). Berry collectibles with glow, highlight, stem, and leaf details. 6 levels (Mossy Hollow, Bramble Ridge, Thorn Cavern, Crimson Falls, Frozen Thicket, The Den). Grass-topped platforms with blade details. Parallax background trees and stars. Spike hazards. Flag goals. Coyote time + jump buffering. Squash/stretch physics. Particle effects on jump/land/collect. Mobile touch controls. 3 lives. Berry count HUD. System UI font, forest green/orange/berry-red palette.

## features
- Hand-drawn anthropomorphic fox (canvas 2D)
  - Oval body with lighter belly
  - Head with cheeks, ears with inner color
  - Eyes with whites, pupils, shine, blink
  - Nose, mouth curve, whiskers
  - Animated legs with paw dots
  - Bushy tail with white tip, wagging
  - Ear bob tied to movement speed
- Berry collectibles with glow, stem, leaf
- 6 themed levels with increasing spikes
- Grass-topped platforms with blade details
- Parallax tree silhouettes + star field
- WASD / Arrow / Space controls
- Mobile touch controls
- Coyote time (6 frames) + jump buffer (6 frames)
- Squash/stretch on jump/land
- Particle effects (jump dust, land dust, berry burst)
- 3 lives, respawn on death

- 2026-04-11: Added double jump (press jump again in air, 85% force, gold sparkle particles) and dash (Shift+direction, 6-frame burst at 12px/s, 30-frame cooldown, orange afterimage trail, particle burst). Touch dash button added. Controls text updated.
- 2026-04-11: Rewrote fox sprite to be bipedal/anthropomorphic — stands upright on two legs, green vest with V-neck and buttons, tiny brown boots with green trim, arms that swing while running, head centered above body. Hitbox adjusted from 24x30 to 20x34 for taller upright pose.
- 2026-04-11: Added grappling hook — press E to fire a hook at ~45° up-forward, latches onto platforms, pulls fox toward attach point with glowing green rope. Hold E to stay attached, release to let go. 20-frame cooldown. Rope drawn as glowing quadratic curve with bright core and spark particles at attachment. Touch button added.
- 2026-04-11: Added skin selection system with 4 skins — Classic (green vest), Synthwave (neon purple/magenta with glow), Cyber-Pirate (dark vest, eye patch, pirate hat with skull), Detective (brown vest, monocle with chain). Skin picker on start screen with canvas previews. Selection saved to localStorage.

## issues
- None yet

## todos
- Sound effects (jump, collect, death)
- Moving platforms
- Enemy creatures (owls? snakes?)
- Double-jump powerup berry
- Supabase leaderboard (fastest clear, most berries)
- OG preview PNG
