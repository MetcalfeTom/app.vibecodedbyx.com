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

## issues
- None yet

## todos
- Could add karma history graph over time
- Could add badge notification when newly earned
- Could add transfer/gift karma between users
- Could add karma breakdown by individual content piece
- Could add faction contribution leaderboard within faction
