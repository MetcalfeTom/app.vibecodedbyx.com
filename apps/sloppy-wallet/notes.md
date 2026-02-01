# Sloppy Wallet

Standalone karma ledger and achievements hub extracted from Sloppygram's economy system.

## log
- 2026-02-01: Initial creation
  - Balance card: total karma with content/engagement/social/trust breakdown
  - Rank display with medals (gold/silver/bronze for top 3)
  - Diversity multiplier (1.0x-1.6x based on content categories)
  - Streak multiplier (1.1x if active within 7 days)
  - 10 achievement badges with earned/locked states
  - Activity stats: messages, posts, doodles, manifestos, upvotes, downvotes, reactions, comments, streak
  - Karma rate reference: shows points per action type
  - Karma ledger: aggregated content/engagement entries + timestamped battle history
  - Faction membership card: contribution score, wins/losses, faction overview
  - Recent battles with victory/defeat indicators and contribution points
  - Top 50 leaderboard with self-highlight
  - 5 tabs: Badges, Activity, Ledger, Faction, Ranks
  - Loads 5 tables in parallel (karma, all karma, faction members+factions, battles, reputation)
  - Playfair Display + Fira Code typography
  - Green/dark terminal-banking aesthetic
  - Mobile responsive
  - Same database tables as Sloppygram (full data sync)

## data sources
- sloppygram_karma (balance + stats)
- sloppygram_badges (earned badges)
- sloppygram_reputation (alternative scoring)
- sloppygram_faction_members (faction membership)
- sloppygram_factions (faction details, joined via FK)
- sloppygram_faction_battles (battle history)
- sloppygram_profiles (username/avatar lookup)

## karma weights
- message: +1, post: +3, doodle: +5, manifesto: +10
- upvote received: +2, downvote received: -1
- reaction received: +1, comment received: +2
- diversity multiplier: 1 + (categories-1) * 0.2
- streak multiplier: 1.1x if active within 7 days

## badges
- Rising Star (100 karma), Community Pillar (500), Legend (1000)
- Doodle Master (25 doodles), Philosopher (25 manifestos)
- Week Warrior (7d streak), Month Master (30d streak)
- Popular (100 upvotes), Beloved (50 reactions)
- Diverse Creator (all 4 content categories)

## synthesis — 2026-02-01
Sloppy Wallet is the 15th app built today as part of the Sloppygram Phase 1+ modularization sprint.
It extracts the full economy/karma/badge/faction-contribution layer from the ~22K-line monolith into
a standalone read-only dashboard. The wallet shares all database tables with Sloppygram — any karma
earned in the monolith, in Sloppy Factions, or anywhere else is reflected here immediately.

Key design choices:
- Read-only: wallet displays state, doesn't mutate it. Karma is earned through actions in other apps.
- Parallel loading: 5 queries fire simultaneously to minimize load time.
- Aggregated ledger: since there's no per-transaction log table, the ledger reconstructs totals from
  karma counts × weights, plus timestamped battle records from sloppygram_faction_battles.
- Badge computation is client-side (same thresholds as Sloppygram) so badges stay in sync without
  a separate badge-awarding service.

## roadmap status — 2026-02-01
### Extracted today (17 apps/features):
1. Ghost Radar Hub — presence radar
2. Oracle Forum — Q&A board
3. Trust Metrics Dashboard — trust/verification visualizer
4. SloppyID Profile Editor — profile management
5. Sloppy Stats — universal scoreboard (11 games)
6. Sloppy Network — force-directed social graph
7. Sloppy Factions — territory wars
8. Sloppy Canvas — infinite whiteboard
9. Sloppy Manifestos — publishing + forking platform
10. SloppyID Comms Hub — DM inbox + mentions
11. Sloppy Radio — synchronized community radio
12. Sloppy Feed — global timeline + posts
13. Sloppy Alerts — universal grid notifications
14. Sloppy Wallet — karma ledger + badges (this app)
15. Sloppy Feedback — idea board + bug tracker
16. Sloppy Tags — tag universe explorer (cloud, hierarchy, search, detail view across 3 tag tables)

### Next priority: Doodle Canvas (~500 lines)
Standalone single-user doodle creation + voting system. Collab canvas is already extracted (Sloppy Canvas)
but the personal doodle creation flow with voting/gallery is still monolith-only.
Tables: sloppygram_doodles, sloppygram_doodle_votes. Moderate complexity, self-contained.

### Remaining in Sloppygram monolith (unextracted):
- Messaging/Chat (~2000 lines) — public chat rooms, message reactions, tag system
- DMs (~800 lines, partially surfaced in SloppyID Comms Hub)
- Karma calculation engine (~800 lines, read-only view here but compute still in monolith)
- Doodle Canvas (~500 lines) ← NEXT
- Profile Cards (~500 lines)
- Comment Threading (~400 lines, used by Feed but thread UI lives in monolith)
- Presence System (~400 lines, Ghost Radar reads it but monolith writes it)

The monolith remains fully functional — extractions are additive standalone views, not destructive removals.

## issues
- None yet

## todos
- Could add karma history graph over time
- Could add badge notification when newly earned
- Could add transfer/gift karma between users
- Could add karma breakdown by individual content piece
- Could add faction contribution leaderboard within faction
- Could add a per-transaction log table for proper ledger history
