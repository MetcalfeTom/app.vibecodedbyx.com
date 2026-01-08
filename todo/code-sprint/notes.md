# Code Sprint

## log
- 2026-01-05: Initial creation - competitive timed coding dashboard

## features
- Create timed coding challenges (5-60 minutes)
- Join active sprints and compete
- Real-time countdown timer
- See other participants in real-time
- Submit work with URL when done
- Leaderboard shows finish order
- Vote on submissions
- Sprint history

## database tables
- `code_sprints`: title, prompt, duration_minutes, status, started_at, ends_at, created_by_name
- `sprint_participants`: sprint_id, display_name, status, submitted_at, submission_url, votes

## statuses
Sprint statuses:
- waiting: Created, waiting for creator to start
- active: Timer running, participants coding
- ended: Time's up, voting phase

Participant statuses:
- coding: Currently working
- finished: Submitted their work

## design
- Space Grotesk + JetBrains Mono fonts
- Dark theme with cyan/green gradient accents
- Real-time participant list
- Animated timer with color changes (green → yellow → red)
- Card-based sprint display

## technical
- Supabase for database and real-time subscriptions
- Anonymous auth for easy participation
- Local storage for display name persistence
- Auto-ends sprints when timer expires

## issues
- None yet

## todos
- Add notification sounds for timer warnings
- Add sprint templates/presets
- Add team mode (2v2, etc.)
- Add code editor integration
- Add spectator mode
