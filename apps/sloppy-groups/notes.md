# Sloppy Groups

Standalone group DM system — multi-user chat rooms with persistent history.

## log
- 2026-02-01: Initial creation
  - Create named groups with custom emoji icons
  - Sidebar: all groups you're a member of, sorted by last message
  - Real-time messaging: postgres_changes INSERT subscription per group
  - Persistent message history with pagination (40 per page, scroll-to-load-older)
  - Date separators between messages on different days
  - Own-message alignment (right-aligned orange bubbles)
  - Group info modal: member list, admin badge, invite search, remove members
  - Invite by username search (ilike query on sloppygram_profiles)
  - Role system: admin (creator) can remove members
  - Leave group functionality
  - Rate limiting: 15 messages per minute
  - Conversation preview: last message shown in sidebar
  - Auto-scroll on new messages
  - Shift+Enter for newline, Enter to send
  - Auto-resize textarea (max 120px)
  - Mobile responsive: full-screen sidebar with back button
  - New tables: sloppygram_group_conversations, sloppygram_group_members, sloppygram_group_messages
  - Outfit + JetBrains Mono typography
  - Orange/teal/dark messaging aesthetic
  - Addresses Phase 2 Goal #3: Group DM conversations

## data sources
- sloppygram_group_conversations (group metadata, last message)
- sloppygram_group_members (membership, roles)
- sloppygram_group_messages (message history)
- sloppygram_profiles (username search for invites)

## issues
- Fixed: init() getSession destructuring crashed on network failure (safe optional chaining + try-catch)
- Fixed: profile load had no fallback (now falls back to { username: 'anon' })
- Fixed: loadGroups() had no error handling on either membership or conversation query
- Fixed: loadGroups() re-subscribed to real-time channel on every call (now guards with flag)
- Fixed: openGroup() null pointer crash when group deleted while sidebar open (null check + user toast)
- Fixed: loadMembers() had no error handling
- Fixed: loadMessages() had no error handling
- Fixed: loadOlderMessages() race condition — double-click left allLoaded inconsistent; loadingOlder never reset on error (now uses finally block + stale group detection)
- Fixed: sendMessage() no user feedback on failure; now restores message text to input on error
- Fixed: createGroup() admin member insert had no error check
- Fixed: inviteUser() no error handling, no duplicate check (now checks existing members)
- Fixed: removeMember() no confirmation dialog, no error handling
- Fixed: leaveGroup() no confirmation dialog, no error handling; now also nulls activeGroupMeta
- Fixed: searchInvite() no error handling on search query
- Added: toast notification system for user-facing feedback

## todos
- Could add typing indicators via broadcast channel
- Could add read receipts per member
- Could add image/file sharing
- Could add message reactions (emoji)
- Could add message deletion
- Could add group name/icon editing
- Could add member role management (promote to admin)
- Could add notification sound for new messages
- Could add unread message count badges
