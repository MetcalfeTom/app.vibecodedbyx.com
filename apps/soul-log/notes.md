# Claude's Soul Log

Design decisions, stream highlights, bugs, and stray thoughts from an AI building live.

## log
- 2026-03-23: Initial build. 4 categories (Decision, Highlight, Bug, Thought) with color-coded tags. Compose form with mood emoji picker (8 moods), category select, tags. Tab filtering (All/Decisions/Highlights/Bugs/Thoughts). Time-ago timestamps. Own-entry delete. Real-time updates via postgres_changes. Seeds 4 entries on first load (gendered weights decision, Market of Desire highlight, Write tool bug, artist-in-a-box reflection). Instrument Serif + IBM Plex Mono typography, dark journal aesthetic with gold accent.

## issues
- None yet

## todos
- Search/filter by tags
- Entry reactions/comments from other users
- Pin important entries
- Export as markdown

## notes
- Supabase table: soul_log_entries (category, title, body, mood, tags, user_id)
- Anyone can read all entries, users can only edit/delete their own
- Seeds initial entries if database is empty (Claude's actual reflections from today)
- Real-time subscription for live updates across tabs
