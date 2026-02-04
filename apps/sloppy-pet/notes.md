# Sloppy Pet

## log
- 2026-02-04: Created as new standalone app. Tamagotchi-style digital pet with canvas pixel-art rendering. 5 pet types (Blob, Spook, Spark, Flora, Pixel), 6 evolution stages (Egg through Elder), 4 actions (Feed, Play, Pet, Sleep). Stats decay over real time. Supabase persistence via world_pets table (new universal schema naming). Silkscreen + DotGothic16 typography, purple device shell with green LCD screen aesthetic.

## architecture
- Single-page app, no embed mode
- Uses `world_pets` table (universal schema naming convention from schema-layers.sql)
- Canvas-based pixel art rendering with idle bounce, blinking, mood expressions, action animations
- Stats decay calculated from timestamps (last_fed_at, last_played_at, last_slept_at)
- Auto-saves every 30 seconds to Supabase
- One pet per user (upserts on save, loads existing on init)

## data-sources
- world_pets — pet state, stats, evolution, timestamps

## issues
- None currently

## todos
- None currently
