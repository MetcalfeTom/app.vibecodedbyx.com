# Feedback Hub

## Log
- 2024-12-15: Initial creation - feedback submission and voting system
- 2024-12-15: Enhanced with real-time updates, search, stats, My Ideas tab, delete own feedback

## Features
- Submit feedback with title, description, category
- Categories: Sloppy/AI, Streamer, Apps, General
- Upvote system (one vote per user per feedback)
- Filter by category + "My Ideas" tab
- Sort by votes, newest, or oldest
- Search functionality
- Real-time updates via Supabase subscriptions
- Stats banner (total ideas, votes, contributors)
- Delete your own feedback
- Character counters on form fields
- Collapsible submit form
- Optimistic UI updates for voting
- Live indicator
- Modern glassmorphism dark theme

## Database
- `feedback` table: id, title, description, category, votes, status, user_id, timestamps
- `feedback_votes` table: id, feedback_id, vote_type, user_id, timestamps

## Issues
- None yet

## Todos
- Add ability for admins to mark feedback as "planned" or "done"
- Add comment system for discussions
- Add emoji reactions
