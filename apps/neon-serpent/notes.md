# Neon Serpent

Classic snake with neon glow, color-shifting fire trail, and pulsing food.

## log
- 2026-03-12: Initial build. 26x26 grid, wall wrap, self-collision. Fire trail from tail that shifts color through 8-hue palette on each eat. Glowing food with radial glow and pulsing animation, special star food (15% chance, 30pts). Snake has forked tongue flicker, glowing eyes with pupils. Eat burst particles. Streak counter. Speed ramps from 110ms to 55ms. Local hi-score. Press Start 2P + Outfit typography. Swipe + D-pad + WASD/arrows.

## issues
- None yet

## todos
- Leaderboard with Supabase
- Power-ups (slow time, ghost through self)
- Different food types with unique effects

## notes
- No database — local hi-score in localStorage
- Named neon-serpent to avoid conflict with existing neon-snake (Sea Serpent)
- 8 color palette cycles: green, cyan, pink, purple, gold, orange, blue, red
- Fire trail: particles emitted from tail each step, burst particles on eat
- Special food is star-shaped, rotates, worth 3x points
- Speed decreases by 2ms per food eaten, minimum 55ms
