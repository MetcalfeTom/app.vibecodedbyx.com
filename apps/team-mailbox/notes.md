# Team Mailbox

Shared message board where users post to a common thread.

## log
- 2026-03-20: Initial build. Shared thread with username, body, reply_to. Anonymous auth via supabase. Set username (persisted to localStorage). Reply to messages with indicator and scroll-to-parent on click. Delete own messages. Real-time inserts and deletes via postgres_changes. 200 message limit. 2000 char body limit. Newsreader + IBM Plex Mono typography, warm paper/editorial light theme.

## issues
- None yet

## todos
- Reactions/emoji on messages
- Pagination for older messages
- Edit own messages
- User avatars

## notes
- Database: team_mailbox table (username, body, reply_to, user_id, created_at)
- RLS: read all, write/edit/delete own only
- Real-time via supabase channel on postgres_changes
- Enter to send, Shift+Enter for newline
- Reply badge scrolls to parent message with highlight animation
- Message count shown in header badge
- Auto-scroll to bottom on new messages
