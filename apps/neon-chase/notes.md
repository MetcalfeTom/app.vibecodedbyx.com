# Neon Chase

Fast-paced game where you control a cat chasing a laser dot through mirrors that teleport or shatter.

## log
- 2026-03-12: Initial build. Arrow/WASD + mobile D-pad controls. Cat with tracking eyes, whiskers, bobbing animation, wagging tail. Laser AI flees when cat is close, wanders with jitter otherwise. Two mirror types: teleport (cyan, paired portals) and shatter (gold, break after hits, reflect laser faster). Combo system (5 catches = level up). Timer per catch — miss and lose a life. Levels increase laser speed, mirror count, reduce timer. Particles, glass shards on shatter, laser trail. Silkscreen + Outfit typography, neon pink/cyan/gold on dark.

## issues
- None yet

## todos
- Add leaderboard with Supabase
- Power-ups (catnip speed boost, slow-mo)
- Boss levels with moving mirrors

## notes
- No database — pure frontend game
- Laser AI: flee when cat < 150px (1.5s timer), random wander + sinusoidal jitter otherwise
- Mirrors: teleport pairs linked at level init, shatter mirrors have HP scaling with level
- Combo: every 5 catches advances level; missing resets combo to 0
- Cat: ellipse body, triangle ears with pink inner, green eyes tracking laser, diamond nose, whiskers
- 5 lives, timer shrinks with level (15s down to 5s minimum)
