# Neon Maelstrom

## log
- 2025-12-30: Changed controls to cursor-based - click/tap to move toward cursor, double-click/double-tap to dash. Removed d-pad.
- 2025-12-30: Added spawn warning indicators - pulsing circles with "!" and direction lines appear ~0.5s before bullets spawn
- 2025-12-30: Initial creation - fast-paced bullet hell with glowing triangle player, dash mechanic, multiple bullet patterns (spiral, ring, aimed, wave, cross, scatter), wave-based difficulty scaling, neon cyberpunk aesthetic with Orbitron font

## issues
- None yet

## todos
- Leaderboard integration with Supabase
- Sound effects for dash and game over
- Boss waves every 5 waves
- Power-ups (slow-mo, shield, bomb)
- Screen shake on hit

## notes
- 6 bullet patterns: spiral, ring, aimed, wave, cross, scatter
- Dash gives brief invincibility frames (dashDuration + 5 frames)
- Wave increases every 10 seconds
- Spawn rate decreases with wave (starts at 120 frames, min 30)
- Mobile controls: d-pad on left, dash button on right
