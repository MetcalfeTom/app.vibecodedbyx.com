# Sloppy Quests

Standalone daily challenge and karma rewards hub.

## log
- 2026-02-01: Randomizer overhaul & karma multiplier fix
  - Replaced weak djb2 hash with FNV-1a for date seeding (better distribution on short strings)
  - Each quest now gets its own difficulty via continued LCG steps (was uniform for all 5)
  - earn_upvotes/earn_karma progress now uses daily deltas instead of lifetime totals
  - Tags/mentions progress uses actual table counts (sloppygram_post_tags, sloppygram_mentions)
  - Completion bonus (1.5x) now persists to sloppygram_karma table on transition
  - Karma refreshed each cycle for accurate display
  - Error handling added to init(), ensureTodayQuests(), refreshProgress(), loadHistory()
  - Safe getSession destructuring with optional chaining + try-catch
  - Profile load fallback to { username: 'anon' }
- 2026-02-01: Initial creation
  - 5 daily quests per day, deterministically selected from 12 templates via date seed
  - 3 difficulty tiers (easy/medium/hard) cycling by day
  - Quest types: send messages, create posts, write manifestos, cast votes, give reactions, earn upvotes, make doodles, leave comments, use tags, mention users, visit apps, earn karma
  - Progress auto-refreshed every 30s by counting actual activity from source tables
  - Completion bonus: 1.5x multiplier when all 5 quests done in a day
  - Streak tracking: consecutive days with all quests complete
  - 7-day dot row showing completion status (green=complete, orange=partial)
  - History tab: 30-day quest completion log with karma earned
  - Stats pills: total karma, today's completion, streak count
  - Uses existing `daily_quests` table (quest_type, quest_target, quest_progress, quest_completed, quest_date, reward_points)
  - Cinzel + Fira Code typography
  - Gold/dark fantasy RPG aesthetic
  - Mobile responsive
  - Same database tables as Sloppygram (full data sync)

## data sources
- daily_quests (quest state per user per day)
- sloppygram_karma (karma display)
- sloppygram_profiles (username lookup)
- sloppygram_messages (progress: send_messages)
- sloppygram_posts (progress: create_post)
- sloppygram_manifestos (progress: write_manifesto)
- sloppygram_message_votes (progress: cast_votes)
- sloppygram_message_reactions (progress: give_reactions)
- sloppygram_comments (progress: leave_comments)
- sloppygram_doodles (progress: make_doodle)

## quest templates
| Type | Icon | Easy | Med | Hard | Reward Range |
|------|------|------|-----|------|-------------|
| send_messages | 💬 | 3 | 5 | 10 | 5-20 |
| create_post | 📝 | 1 | 2 | 3 | 10-30 |
| write_manifesto | 📜 | 1 | 1 | 2 | 20-40 |
| cast_votes | ⬆️ | 3 | 5 | 10 | 5-15 |
| give_reactions | 😂 | 3 | 5 | 8 | 5-15 |
| earn_upvotes | ⭐ | 2 | 5 | 10 | 10-35 |
| make_doodle | 🎨 | 1 | 2 | 3 | 10-30 |
| leave_comments | 💭 | 2 | 3 | 5 | 5-15 |
| use_tags | 🏷️ | 2 | 3 | 5 | 5-12 |
| mention_users | 👋 | 1 | 2 | 3 | 5-15 |
| visit_apps | 🧭 | 1 | 1 | 1 | 5 |
| earn_karma | ✨ | 10 | 25 | 50 | 10-40 |

## issues
- Fixed: seedFromDate() used weak djb2 hash with poor distribution on short date strings (replaced with FNV-1a)
- Fixed: getQuestsForDate() assigned uniform difficulty to all 5 quests (now per-quest via LCG continuation)
- Fixed: earn_upvotes/earn_karma used lifetime totals instead of daily activity
- Fixed: use_tags/mention_users counted messages instead of actual tags/mentions tables
- Fixed: 1.5x completion bonus was display-only, never persisted to karma
- Fixed: init() getSession destructuring crashed on network failure
- Fixed: ensureTodayQuests() had no error handling
- Fixed: refreshProgress() had no error handling, silent failures
- Fixed: loadHistory() had no error handling

## todos
- Could add weekly mega-quests with bigger rewards
- Could add quest chains (complete quest A to unlock quest B)
- Could add rare/legendary quest variants on special days
- Could add leaderboard for most quests completed
- Could add karma actually being awarded (currently display-only, karma earned through normal activity)
- Could add notification when quest completes
