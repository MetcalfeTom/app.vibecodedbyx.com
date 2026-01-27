# SloppyID Network Analytics

Centralized analytics dashboard tracking teleport usage and app popularity across the SloppyID ecosystem.

## Log
- 2026-01-27: Initial creation
  - Real-time teleport tracking
  - Top destinations leaderboard
  - Top launch points leaderboard
  - Popular routes visualization
  - Live feed with real-time updates
  - 7-day time chart
  - Time filters (All/24h/7d)
  - Auto-refresh every 30 seconds
  - Created sloppy_analytics table

## Features
- **Metrics Dashboard**
  - Total teleports
  - Unique travelers
  - Apps visited
  - Today's teleports
  - Top destination
- **Top Destinations**: Ranked list with bar visualization
- **Top Launch Points**: Where users teleport FROM
- **Popular Routes**: Most common source→destination pairs
- **Live Feed**: Real-time teleport activity stream
- **Time Chart**: 7-day teleport history
- **Time Filters**: All time / 24 hours / 7 days

## Database
Table: `sloppy_analytics`
- event_type (text) - 'teleport'
- source_app (text) - where user teleported from
- destination_app (text) - where user went
- username (text)
- metadata (jsonb) - { timestamp }
- user_id (uuid)
- created_at (timestamptz)

Indexes: event_type, source_app, destination_app, username
RLS: Read all, write own

## Technical
- Real-time updates via Supabase postgres_changes
- 30-second auto-refresh
- SloppyBar logs teleport events automatically
- Purple/pink/cyan gradient aesthetic

## Todos
- None currently

## Issues
- None yet
