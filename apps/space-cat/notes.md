# Space Cat

## log
- 2026-04-02: Initial build. Single-file canvas game. Cat with laser eyes vs falling bugs. Silkscreen + Press Start 2P typography, deep space gradient background with scrolling stars.

## features
- Canvas-based 480x720 game world, scaled to fit any screen
- Cat drawn with canvas (body, head, ears, whiskers, glowing laser eyes, wagging tail)
- Auto-fire laser beams from cat's eyes, plus manual fire on space/tap/click
- 5 bug types: fly, spider, beetle, moth, cockroach (emoji-based, unlocked by wave)
- Bugs wobble as they fall, speeds scale with wave number
- HP bars on multi-hit bugs, hit sparks, colorful explosions on kill
- Wave system with increasing difficulty (faster spawns, tougher bugs)
- Lives system (3 lives, lost when bugs reach bottom)
- Score multiplied by current wave
- High score saved to localStorage
- Start screen, game over screen with high score notification
- Keyboard (arrows/WASD + space) and touch (drag to move, tap to fire) controls
- Scrolling starfield background

## issues
- None known yet

## todos
- Supabase leaderboard integration
- Power-ups (shield, rapid fire, spread shot)
- Boss bugs every 5 waves
- Sound effects (WebAudio)
- Screen shake on damage
- Combo system for quick kills
