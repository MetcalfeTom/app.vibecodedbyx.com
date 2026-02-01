# Oracle Forum

Standalone community Q&A board extracted from Sloppygram's Oracle Log widget.

## log
- 2026-02-01: Initial extraction from Sloppygram
  - Extracted Oracle Log component (originally ~166 lines in monolith)
  - Expanded from small collapsible widget into full-page forum layout
  - Crimson Pro serif + JetBrains Mono typography (orchid/purple palette)
  - Filter system: All, Unanswered, Answered, Most Important
  - Star importance voting (click stars to rate 1-5)
  - Real-time updates via Supabase postgres_changes subscription
  - Answer display block for answered questions
  - Relative time formatting (just now, Xm ago, Xh ago, date)
  - NEW badge for questions less than 60s old
  - ANSWERED badge with green accent
  - Ambient glow background effect
  - Mobile responsive
  - Second Phase 1 modularization extraction from Sloppygram

## issues
- None yet

## todos
- Could add reply/comment threading
- Could add user attribution (show who asked)
- Could add sorting by most recent, most important, oldest
- Could add search/filter by keyword

## notes
- Uses same `oracle_log` database table as Sloppygram
- Questions posted here appear in Sloppygram and vice versa
- Schema: id, question, context, answered, answer, importance, user_id, created_at, updated_at
- Importance voting updates the row directly (last vote wins - no per-user tracking yet)
- RLS: users can read all rows, write their own
