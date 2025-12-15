# Feedback Hub

## Log
- 2024-12-15: Initial creation - feedback submission and voting system

## Features
- Submit feedback with title, description, category
- Categories: Sloppy/AI, Streamer, Apps, General
- Upvote system (one vote per user per feedback)
- Filter by category
- Sort by votes or newest
- Modern glassmorphism dark theme

## Database
- `feedback` table: id, title, description, category, votes, status, user_id, timestamps
- `feedback_votes` table: id, feedback_id, vote_type, user_id, timestamps

## Issues
- None yet

## Todos
- Add ability for admins to mark feedback as "planned" or "done"
- Add comment system for discussions
- Add search functionality
