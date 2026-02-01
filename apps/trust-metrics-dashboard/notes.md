# Trust Metrics Dashboard

Standalone confidence monitor extracted from Sloppygram. Full-page dashboard with gauges, factor breakdowns, and history.

## log
- 2026-02-01: Initial extraction from Sloppygram
  - Extracted Confidence Monitor (~180 lines in monolith)
  - Expanded from small circular widget into full-page dashboard
  - Canvas gauge arc with animated needle, glow, tick marks
  - Three modes: System, Engagement, Synthesis (same as original)
  - Factor breakdown cards with colored bars and weight labels
  - Raw metrics panel: votes, reactions, manifestos, upvotes, online users, connection
  - History sparkline (last 60 readings) with gradient fill
  - Queries 6 Sloppygram tables in parallel for real metrics
  - sessionStorage caching (5 min TTL) + in-memory cache (10s)
  - Presence channel connection (counts online users)
  - Anybody + Fira Code typography, purple/violet palette
  - Grid overlay background
  - Mobile responsive
  - Third Phase 1 modularization extraction from Sloppygram

## issues
- None yet

## todos
- Could add per-mode history tracks (separate sparklines)
- Could add export/share functionality for current readings
- Could add alerts when confidence drops below threshold

## notes
- Queries same Sloppygram tables: post_likes, post_reactions, manifestos, message_votes, message_reactions, manifesto_votes
- Connects to sloppygram_presence channel for user count
- Tracks itself as "Trust Dashboard" in presence
- Score smoothing: 60% old + 40% new (same as original)
- System mode: connection health + data loaded + presence count
- Engagement mode: content score + vote activity + reactions
- Synthesis mode: manifesto count + upvotes + diversity ratio
