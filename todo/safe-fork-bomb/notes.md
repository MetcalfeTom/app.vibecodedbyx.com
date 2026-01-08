# Safe Fork Bomb

## log
- 2025-12-29: Initial creation
  - Neon circles that split and multiply
  - Physics-based bouncing with slight gravity
  - Fade trail effect for motion blur
  - Pulsing glow animation on each circle
  - 12 vibrant neon colors
  - Max 500 circles (keeps browser safe)
  - Click to add more circles
  - Pause/Reset controls
  - Keyboard: Space to pause, R to reset

## issues
- None so far

## todos
- Could add circle collision detection
- Could add explosion effect on split
- Could add sound effects on split
- Could add size-based lifespan

## notes
### Mechanics:
- Each circle splits after 60-120 frames
- Children are 70% parent size
- Minimum radius of 4px (no more splits)
- Slight gravity (0.02) and friction (0.999)
- Bounce with 95% energy retention

### Performance:
- Capped at 500 circles to prevent browser slowdown
- Uses fade trail instead of full clear for motion effect
