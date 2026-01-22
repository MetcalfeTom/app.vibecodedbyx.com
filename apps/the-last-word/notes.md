# The Last Word

Only one post exists at a time. Every new post erases the previous one forever.

## log
- 2026-01-22: Initial creation with real-time updates, survival timer, post counter

## features
- Single global post visible to all users
- New posts replace the previous post (conceptually deleted)
- Real-time updates via Supabase broadcast + postgres_changes
- Post survival timer shows how long current post has lasted
- Post number counter tracks total posts ever made
- Dark, dramatic aesthetic with blood red accents
- Anonymous auth with Supabase
- Custom username and avatar (18 dark-themed emojis)
- Profile saved to localStorage
- Character limit 280
- Keyboard shortcuts (Escape to close, Ctrl+Enter to submit)
- Mobile-friendly responsive design

## database
- lastword_post: content, username, avatar, post_number, user_id

## design notes
- Minimalist void aesthetic - single post floats in darkness
- Crimson Pro serif font for dramatic elegance
- JetBrains Mono for technical elements
- Blood red (#8b0000) accent color for danger/deletion theme
- Vignette overlay for depth
- "Obliterate & Post" button to emphasize destructive nature

## technical notes
- Due to RLS policies, old posts aren't actually deleted from DB
- App always shows the most recent post (ORDER BY created_at DESC LIMIT 1)
- Old posts accumulate invisibly but have no effect on UX
- Broadcast channel provides instant updates across all users

## todos
- Add "graveyard" mode to see ghosts of deleted posts
- Add post lifetime leaderboard (longest surviving posts)
- Add notification sound when your post gets replaced
