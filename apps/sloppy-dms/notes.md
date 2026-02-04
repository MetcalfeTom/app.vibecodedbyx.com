# Sloppy DMs

Direct messaging system for the sloppy.live stream. Conversation list, threaded DM view, user search, send messages. Works standalone or embedded in Sloppygram's DM tab.

## log
- 2026-02-04: Initial creation — extracted DM system from Sloppygram monolith
  - Full conversation list with last message previews and timestamps
  - Threaded DM view with message history and send input
  - New DM modal with user search (searches sloppygram_profiles)
  - Real-time message subscription via postgres_changes on sloppygram_dm_messages
  - Embed mode (?embed=true): hides header/backlink for tab iframe
  - postMessage: username-click → parent opens profile card
  - postMessage: dm-notification → parent plays notification sound
  - Receives: start-dm (recipientId + recipientUsername), reload-conversations
  - Newsreader + Fira Code typography

## architecture
- Tab iframe pattern: iframe within Sloppygram DM tab (?embed=true)
- Same Supabase credentials and auth as monolith (same-origin, shared cookies)
- monolith's startDMWithUser() switches to DM view and sends start-dm postMessage to iframe
- Sound playback stays in monolith (dm-notification message triggers playNotificationSound)

## data sources
- sloppygram_dm_messages: sender_id, recipient_id, content, read
- sloppygram_dm_conversations: participant_1, participant_2, last_message, last_message_at
- sloppygram_profiles: username, avatar (for user search and display)

## issues
- Real-time subscription filters by current user's ID; needs auth to be ready before subscribing
- User search queries profiles table which may have many rows; limited to 10 results

## todos
- Could add read receipts / unread count badges
- Could add typing indicators via presence channel
- Could add group DM conversations
