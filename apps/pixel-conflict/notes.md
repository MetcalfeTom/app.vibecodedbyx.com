# Pixel Conflict

Hex-based territory war game where players click to claim hexes for their team.

## log
- 2026-01-23: Added GlitchBot - claims random hexes every 3-8 seconds with flash effect
- 2026-01-23: Initial creation - 6 teams, 20x15 hex grid, real-time sync

## features
- 20x15 hex grid canvas
- 6 team colors (red, blue, green, yellow, purple, cyan)
- Click/tap to claim hexes
- Real-time sync via Supabase broadcast
- Presence tracking shows online players
- Territory percentage stats
- Mobile-friendly touch support
- Orbitron + Share Tech Mono fonts

## database tables
- pixel_conflict_hexes: hex_key (PK), team, col, row, user_id

## todos
- Add cooldown between clicks
- Add team chat
- Add daily reset option
- Add sound effects
- Add hex capture animations
