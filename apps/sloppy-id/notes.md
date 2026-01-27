# SloppyID

Central identity hub for the sloppy.live ecosystem.

## Log
- 2026-01-27: Initial creation
  - Hybrid auth (Twitter OAuth + Anonymous)
  - Data Vault for JSON metadata storage
  - Profile card with badges and stats
  - Preset keys for common vault entries (faction, bio, links, etc.)
  - Public/private visibility toggle

## Features
- **Hybrid Authentication**
  - Twitter OAuth sign-in
  - Anonymous authentication fallback
  - Session persistence via Supabase
- **Profile Display**
  - Avatar (from Twitter or default)
  - Username and truncated user ID
  - Auth type badge (Twitter/Anonymous)
  - Premium badge (if purchased_at exists)
  - Stats: vault items, public items, days active
- **Data Vault**
  - Key-value storage with JSONB support
  - Public/private visibility per entry
  - Preset keys: faction, bio, links, preferences, achievements
  - Create, update, delete entries
  - Real-time stats update

## Database
Table: `sloppyid_vault`
- username (text)
- vault_key (text)
- vault_value (jsonb)
- is_public (boolean)
- user_id (uuid)
- created_at, updated_at (timestamptz)

RLS: Read all, write own.

## Design
- Orbitron + IBM Plex Mono fonts
- Cyan/purple gradient accents
- Dark cyberpunk aesthetic
- Animated grid background
- Responsive mobile layout

## Todos
- Add vault entry search/filter
- Add public vault viewer (view other users' public data)
- Add vault export/import (JSON)
- Integration with Sloppygram profile

## Issues
- None yet
