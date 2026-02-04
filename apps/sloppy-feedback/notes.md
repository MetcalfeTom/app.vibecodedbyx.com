# Sloppy Feedback

Standalone idea board and bug tracker extracted from Sloppygram's feedback hub.

## log
- 2026-02-04: Added embed mode for Sloppygram IDEAS tab iframe
  - Embed mode (?embed=true): hides header/backlink, compact toolbar/feed padding
  - window.supabase exposed for error catcher
  - Fourteenth iframe extraction from Sloppygram monolith
- 2026-02-01: Initial creation
  - Submit ideas with title (100 chars), description (500 chars), category
  - 4 categories: Apps, Sloppy/AI, Streamer, General
  - Directional voting (up/down) with toggle, denormalized vote count on feedback row
  - 6 filter tabs: All, Apps, Sloppy/AI, Streamer, General, My Ideas
  - 3 sort modes: Top (by votes), Newest, Controversial (near-zero votes)
  - Stats header: total ideas, total votes, unique contributors
  - Delete own ideas (RLS-safe)
  - Status field in DB (currently "new") for future admin workflow
  - Real-time: INSERT/UPDATE/DELETE on feedback table via postgres_changes
  - Rate limiting: votes (30/min), submissions (5/min)
  - Content sanitization and XSS prevention
  - Newsreader + Source Code Pro typography
  - Green/dark suggestion-box aesthetic
  - Mobile responsive
  - Same database tables as Sloppygram (full data sync)

## data sources
- feedback (ideas with title, description, category, votes, status)
- feedback_votes (per-user vote tracking with vote_type +1/-1)
- sloppygram_profiles (username lookup)

## issues
- None yet

## todos
- Could add comments/discussion on feedback items
- Could add admin status workflow (new → in progress → done → declined)
- Could add duplicate detection
- Could add search by title/description
- Could add user attribution (show who submitted)
- Could add trending algorithm weighting recency + votes
