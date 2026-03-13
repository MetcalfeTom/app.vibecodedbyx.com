# Meme Graveyard

Digital graveyard for dead memes where users place headstones and leave flowers.

## log
- 2026-03-13: Initial build. Supabase-backed `meme_graves` table (meme_name, epitaph, born_year, died_year, flowers, username). Place headstone form, flower button (localStorage tracking to prevent duplicates), sort by newest/oldest/flowers/name, delete own graves. Hash-based headstone icon from 8 emojis. Fog/grass ambient CSS layers. EB Garamond + Fira Code typography, dark green/moss graveyard palette.

## issues
- None yet

## todos
- Add "cause of death" field for more flavor
- Popular memes section / hall of fame
- Seasonal decorations (Halloween, Day of the Dead)

## notes
- Database: meme_graves table with RLS (read all, owner insert/update/delete)
- Flower tracking uses localStorage Set keyed by created_at timestamp
- Icon selection: deterministic hash of meme name mod 8 icons
- Username resolution: localStorage sloppy-profile -> sloppygram_profiles -> manual input -> 'Anon'
