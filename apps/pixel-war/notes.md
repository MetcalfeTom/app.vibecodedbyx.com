# Pixel War

## log
- 2026-04-07: Initial build — persistent r/place-style pixel battle arena. 64x64 grid, 15-color palette, 3-second cooldown per pixel, real-time updates via Supabase postgres_changes. Optimistic rendering with rollback on error. Press Start 2P + Share Tech Mono typography, dark neon arena aesthetic. Ships with schema.sql for the pixel_war_grid table.

## features
- 64x64 persistent grid backed by Supabase
- 15 vibrant colors + black/white/grey
- 3-second cooldown between placements (live countdown indicator)
- Real-time pixel updates via postgres_changes subscription
- Optimistic rendering: pixel appears immediately, rolls back if DB rejects
- Pixel flash burst effect on placement
- Live coordinate display as you hover
- Total pixel count + your pixel count
- Anonymous auth via Supabase
- Mobile + desktop touch support
- Responsive cell sizing — fits the viewport
- Graceful "SETUP REQUIRED" message if table doesn't exist
- Subtle grid lines, neon glow background

## issues
- Table `pixel_war_grid` must be created before app works (schema.sql shipped)
- Cooldown is client-side only — could be bypassed by power users
- No way to undo your own pixels (intentional — it's a war)
- 64x64 means 4096 cells; load fetches all at once (fine for now)

## todos
- Server-side cooldown enforcement
- Pixel hover info: who placed it, when
- Heatmap mode (most-fought-over cells)
- Zoom + pan for larger grids
- Templates / overlays
- OG image
- Top contributors leaderboard

## schema
The pixel_war_grid table needs to exist with (x int, y int, color text, user_id uuid, primary key (x,y)) and RLS allowing select-all + insert/update for authenticated users. See schema.sql in this folder.
