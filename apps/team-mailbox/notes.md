# Team Mailbox

Shared message board where users post to a common thread.

## log
- 2026-09-29: +hide (two hides take a message down). team_mailbox has NO id column (the create_table tool only adds user_id/created_at/updated_at), so a message is keyed as '<user_id>@<created_at in ms>' (msgKey parses both REST and realtime timestamp formats). New table team_mailbox_hides (id bigserial, message_id TEXT holding that key, default RLS). Hidden for you at once, for everyone at HIDE_AT=2 hides from non-authors; the author sees 'hidden from everyone else by readers'. Hides load with limit 5000 after the messages and have their own realtime channel; if they fail, everything stays visible. Also: 1.5 s send gap with a note under the input (no more alert()), 2000 cut in JS, loads the NEWEST 200 (it loaded the oldest 200), delete now matches user_id + created_at (it sent id=NaN and always failed), a DELETE event without columns no longer blanks the thread, reply falls back to '@name ' since there are no ids to link, the thread loads even if the session fails. Tested with a stub client only.
- 2026-03-20: Initial build. Shared thread with username, body, reply_to. Anonymous auth via supabase. Set username (persisted to localStorage). Reply to messages with indicator and scroll-to-parent on click. Delete own messages. Real-time inserts and deletes via postgres_changes. 200 message limit. 2000 char body limit. Newsreader + IBM Plex Mono typography, warm paper/editorial light theme.
- 2026-10-09: The whole page script was dead on load on the live host (stuck on "Loading messages..."): the module did a static `import supabase from '/supabase-config.js'`, but the live config has no default export. Now a tolerant dynamic import (`m.default || m.supabase || (await m.supabaseSession()).client`); with no database the loading line says the mailbox is offline and Send says so too. Tested headless with no config and with a fake no-default config (load + send).

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
