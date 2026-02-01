# Sloppy Chat

Standalone global chatroom extracted from Sloppygram's messaging system.

## log
- 2026-02-01: Initial creation
  - Full chat with text, image, drawing message types
  - Hacker markup: [shake], [rainbow], [glitch], [pulse], [neon], [fire], [ice], [bounce], [wave], [spoiler]
  - Wave: per-character animation (max 100 chars)
  - Spoiler: click to reveal
  - #tags: clickable filter with hierarchical support (#parent/child)
  - @mentions: highlighted, self-mentions pulse gold
  - Tag persistence to sloppygram_message_tags on send
  - Mention persistence to sloppygram_mentions on send (with seen=false)
  - Directional voting (up/down) on messages
  - 8 emoji reactions with toggle picker
  - Delete own messages (RLS-safe)
  - Pagination: 30 messages per page, manual "Load older" button
  - Tag/mention filtering with filter bar
  - Markup hint shown on input focus
  - Shift+Enter for newline, Enter to send
  - Auto-resize textarea (max 120px)
  - Real-time: broadcast channel + postgres_changes INSERT/DELETE
  - Presence tracking for online count
  - Rate limiting: messages (10/min), votes (30/min), reactions (20/min)
  - Content sanitization and XSS prevention (escapeHtml, escapeAttr, sanitize)
  - ReDoS protection: MAX_MSG_LEN=2000, MAX_TAGS=20, WAVE_MAX_CHARS=100
  - Space Grotesk + JetBrains Mono typography
  - Purple/dark chatroom aesthetic with own-message alignment
  - Mobile responsive
  - Same database tables as Sloppygram (full data sync)

## data sources
- sloppygram_messages (chat messages)
- sloppygram_message_votes (directional voting)
- sloppygram_message_reactions (emoji reactions)
- sloppygram_message_tags (tag persistence)
- sloppygram_mentions (mention notifications)
- sloppygram_profiles (username/avatar lookup)

## hacker markup reference
- [shake]text[/shake] — shaking animation
- [rainbow]text[/rainbow] — rainbow color cycling
- [glitch]text[/glitch] — glitch distortion
- [pulse]text[/pulse] — pulsing opacity
- [neon]text[/neon] — neon glow (cyan)
- [fire]text[/fire] — fire glow (orange)
- [ice]text[/ice] — ice glow (blue)
- [bounce]text[/bounce] — bouncing animation
- [wave]text[/wave] — per-character wave (max 100 chars)
- [spoiler]text[/spoiler] — click to reveal

## issues
- None yet

## todos
- Could add image upload (file → storage → URL)
- Could add drawing canvas for inline doodles
- Could add GIF search/picker
- Could add ghost text predictions
- Could add message DNA signatures
- Could add thread replies
- Could add notification sound for new messages
- Could add emoji-specific confetti on reaction
