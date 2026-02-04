# Sloppy Friends

## log
- 2026-02-04: Created as extraction from Sloppygram monolith. Online users list, away status, activity feed, followers/following, mentions feed. Standalone mode + embed mode for Sloppygram sidebar iframe.

## architecture
- Standalone mode: /sloppy-friends/ — full social hub with tabs (Online, Follows, Mentions, Activity)
- Embed mode: /sloppy-friends/?embed=true — sidebar iframe inside Sloppygram left sidebar
- postMessage API:
  - Parent → iframe: `presence-sync` (users array), `presence-join` (username), `presence-leave` (username), `set-profile` (profile, userId)
  - Iframe → parent: `username-click` (username), `set-status` (status), `clear-status`, `mention-alert` (from, sourceType, count), `friends-ready`

## data-sources
- sloppygram_follows — follower/following lists
- sloppygram_mentions — @mention tracking
- sloppygram_profiles — username lookup for current user
- Supabase presence channel `sloppygram_presence` — online users (standalone mode only; embed gets data via postMessage)

## what-stays-in-monolith
- Presence channel setup (setupPresence) — needed for ghost radar, welcome bot
- saveMentions() — called during chat message send
- parseChatTags() — chat rendering with @mention and #tag styling
- filterChatByMention() / clearChatFilter() — chat UI filtering
- showUserProfile() — profile card bridge
- Welcome bot (welcomeNewUser, addBotMessageToUI) — adds bot messages to chat container
- updatePresenceStatus() — tracks status changes in presence channel
- Chat mention CSS (.chat-mention, .self-mention) — used by parseChatTags
- Chat filter bar CSS — used by filterChatByMention

## issues
- In embed mode, the iframe height is fixed at 280px; may need adjustment for many online users
- Presence data flows: monolith owns the channel, forwards state to iframe via postMessage on every sync
- Away status round-trip: iframe sends set-status to parent, parent updates presence track, sync fires, parent forwards back to iframe

## todos
- None currently
