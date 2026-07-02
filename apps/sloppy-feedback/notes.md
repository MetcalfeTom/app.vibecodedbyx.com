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

- 2026-07-02: **fixed vote scores being wrong for everyone but the voter** (chat asked for a suggestion board — this app already IS one, so repaired it instead of duplicating). Root cause (proved via 2-user REST probe): the app maintained a `feedback.votes` counter via cross-user `update()`, but RLS silently no-ops updates to rows you don't own (returns 204, touches 0 rows). Meanwhile `feedback_votes` rows ARE readable by everyone. Fix: scores now derived client-side by aggregating ALL `feedback_votes` (`voteTotals` map) on load; `vote()` writes only your own vote row (with error toasts + reload-on-failure) and updates totals locally; the broken counter PATCH is gone; realtime now also subscribes to `feedback_votes` INSERT/DELETE so scores move live for all viewers (DELETE payloads may lack fields without replica-identity-full — guarded, worst case slightly stale until reload). Sorts/stats/cards all use `scoreOf()` instead of the stale column. `feedback.votes` column is now unused/legacy.

- 2026-07-02: **submit failure root-caused & fixed (Fela's report)**: the inline Supabase ANON KEY had a one-character typo in its JWT signature (`ASM4IS32` instead of `ASM8IS32`) — present since the original 2026-02-04 extraction. Invalid key → anonymous sign-in fails → currentUser null → "Sign in to submit" / silent failures; feed loads also failed. The same corrupted key was found and fixed in **sloppy-radio, sloppy-oracle, sloppy-tags** (all copied from the same extraction batch). Convention added: feedback titles starting with `__` are treated as test/probe rows and filtered from display (one such row, id 14 "__probe submit", is orphaned in the DB — its anon owner is gone so RLS blocks deletion; needs service-role cleanup someday).
