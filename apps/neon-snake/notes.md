# Neon Snake

Classic snake game with neon glow aesthetics.

## log
- 2026-03-19: Initial build. 28x28 grid, responsive cell sizing. Rainbow gradient snake (green→cyan→blue→purple→magenta) with glow trails on tail removal. Pulsating food with concentric glow rings and halo. Head has eyes tracking direction. Speed increases with score (120ms→55ms). Wall and self collision. Death burst particles. LocalStorage high score. Mobile: d-pad buttons + swipe controls. WASD/arrow keys. Orbitron + Share Tech Mono typography. Dark background with subtle grid.

## issues
- None yet

## todos
- Wrap-around walls mode toggle
- Multiple food types (bonus points, speed boost)
- Sound effects
- Leaderboard (Supabase)

## notes
- No database — pure frontend, localStorage for hi score
- Speed formula: max(55, 120 - score*1.5)
- Snake colors lerp through 7-color rainbow array
- Trail particles fade on tail removal for glow trail effect
