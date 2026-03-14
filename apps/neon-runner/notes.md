# Neon Runner

Dodge glowing obstacles in this endless neon sprint. Tap to jump, swipe to slide.

## log
- 2026-03-14: Initial build. Canvas endless runner with 3-lane system. Touch controls: tap=jump, swipe down=slide, swipe left/right=lane change, swipe up=jump. Keyboard: Space/W/Up=jump, S/Down=slide, A/D/Left/Right=lane switch. 4 obstacle types: block (36x36), tall (28x70), low/floating (50x20, slide under), double (2 blocks in different lanes). Pickups: point diamonds (yellow, +25*multi) and multiplier diamonds (pink, up to x5 for 300 frames). Running figure with animated legs/arms, slide pose, afterimage trails. Perspective depth rendering with vanishing point. Synthwave grid floor, horizon glow, starfield, sun. Speed ramps 4-14 based on distance. Screen shake on death. Hi-score in localStorage. Audiowide + Share Tech Mono typography, neon cyan/pink/purple aesthetic.

## issues
- None yet

## todos
- Power-ups (shield, magnet, slow-mo)
- Leaderboard via Supabase
- Different character skins
- Boss obstacles (full-width walls with gap)
- Background music beat sync

## notes
- No database — pure frontend with localStorage hi-score
- 3 lanes, lane width: min(W*0.22, 90px)
- Ground at H*0.72
- Speed: 4 + distance*0.003, cap 14
- Obstacle spawn: every max(18, 55-distance*0.02) frames
- Jump velocity: -11, gravity: 0.55
- Slide duration: 30 frames
- Floating obstacles can be slid under
- Multiplier: max x5, lasts 300 frames (5 seconds)
- Perspective: scale = 0.3 + depthFactor * 0.7
