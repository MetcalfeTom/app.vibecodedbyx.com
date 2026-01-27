# System Health Dashboard

Real-time monitoring of sloppy.live database tables and services.

## Log
- 2026-01-27: Initial creation
  - 70+ database tables organized into 13 categories
  - Real-time row counts for each table
  - SloppyID status panel with vault stats
  - Connection status indicators (Supabase, Auth, Realtime)
  - Auto-refresh every 30 seconds
  - Manual refresh button

## Features
- **Connection Status**
  - Supabase connection health
  - Auth service status
  - Realtime subscription status
- **Metrics Overview**
  - Total tables count
  - Healthy tables count
  - Total rows across all tables
  - Active users (24h)
- **SloppyID Panel**
  - Vault entries count
  - Public entries count
  - Unique users
  - Schema keys (4 validated)
- **Table Categories**
  - Sloppygram Core (messages, profiles, posts, manifestos)
  - Sloppygram Social (likes, comments, reactions, tags)
  - Sloppygram Manifestos (votes, reactions, lineage)
  - Karma & Badges
  - Direct Messages
  - Collaborative (canvas, backgrounds, radio)
  - Comments & Threads
  - Identity & Auth
  - AI & Events
  - Games (14 leaderboards)
  - Community
  - Creative
  - Other Services

## Design
- JetBrains Mono + Orbitron fonts
- Green/cyan accent on dark background
- Animated grid background
- Pulsing status indicators
- Responsive mobile layout

## Database
- Read-only dashboard (no writes)
- Uses count queries for row counts
- Batch queries (10 at a time) for performance

## Todos
- None currently

## Next Development Phase: HEALTH v2.0
**Theme: Predictive Monitoring & Automated Response**

1. **Advanced Metrics**
   - Query performance tracking
   - Storage usage per table
   - Real-time error rate monitoring
   - Response time histograms

2. **Alerting System**
   - Threshold-based alerts
   - Anomaly detection (ML-based)
   - Slack/Discord notifications
   - Alert history and acknowledgment

3. **Historical Analysis**
   - 30-day trend charts per table
   - Growth rate projections
   - Capacity planning tools
   - Database optimization suggestions

4. **Automated Health Checks**
   - Scheduled integrity scans
   - Dead row detection
   - Index health monitoring
   - RLS policy verification

5. **Admin Actions**
   - One-click table maintenance
   - Backup status visibility
   - Migration tracking
   - Emergency procedures dashboard

## Issues
- None yet
