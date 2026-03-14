# Neon Chase

Fast-paced neon obstacle course. Dodge glowing barriers at increasing speed and chase the highest score.

## log
- 2026-03-14: Initial build. 5-lane obstacle course with ship dodging neon hazards. 5 obstacle types: bar (horizontal with gap), diamond (rotating), zigzag (bouncing side-to-side), pulse (expanding/contracting circles), sweep (fast horizontal sweeper). 3 pickup types: point orb (+25*combo), combo multiplier (up to x10), shield (2s immunity). Speed ramps continuously (2.5 + frame*0.0012). Score from surviving + dodging + pickups, multiplied by combo. Player ship with trail, engine glow, shield ring. Course borders with neon gradient, dashed lane lines, speed lines. Web Audio tones for dodge/crash/pickup/combo. Touch controls (half-screen zones) + keyboard (arrows/AD) + device tilt. Shift for focus mode (slower, tighter). Death screen with score, best, retry. localStorage high score. Orbitron + Share Tech Mono typography, cyan/magenta/yellow neon palette.

## issues
- None yet

## todos
- Power-ups (slow-mo, magnet, double points)
- Boss waves with pattern sequences
- Leaderboard via Supabase
- Unlockable ship skins

## notes
- No database — localStorage for best score only
- Speed formula: 2.5 + frame * 0.0012 (endless ramp)
- Spawn rate: max(12, 40 - speed*3) frames between obstacles
- Combo: earned from combo pickups, decays after 300 frames (5s), max x10
- 5 obstacle types unlocked by speed thresholds (3 at start, 4 at speed 4, all 5 at speed 6)
- Collision uses 70% of player hitbox for forgiving feel
- Focus mode (shift): 3.5 move speed vs 7 normal
