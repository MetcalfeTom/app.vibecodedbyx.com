# Sloppy Chat

Standalone global chatroom extracted from Sloppygram's messaging system.

## log
- 2026-05-30: **Retro-terminal theme retrofit.** Kept all underlying functionality (sloppygram_messages real-time chat, votes, reactions, tags, mentions, hacker markup, ghost-text, lightbox, embed mode) and bolted a green-phosphor CRT theme on top via an override block appended to the existing `<style>`. Palette: `#33ff66` phosphor green + `#9dffb8` bright + `#1a8a3a` dim + `#ffb74d` amber (self-messages) + `#ff5dc4` magenta (tags) + `#ff5e5e` error red on a `#02110a` near-black radial. Body: VT323 everywhere with subtle text-shadow glow (`0 0 1.2px + 0 0 6px` green). Body::before = repeating-linear scanlines (1px black-18%-alpha bands @ 3px pitch, mix-blend multiply, z-9998); body::after = radial vignette + top/bottom screen-curvature shadow (z-9999). prefers-reduced-motion kills scanlines. Standalone header restyled as a window title bar with VT323 "sloppy-chat v1.0" wrapped in `┌─[ ... ]─ tty0 ─ connected` ASCII frame, online-count pill prefixed with pulsing `●` (1.8s ease keyframe). Avatars hidden — messages now render as 1-line terminal log entries: `[hh:mm:ss]` bracketed timestamp + `user@sloppy` username + `▸ msg content` with a left phosphor border on the bubble that goes from deep-green idle to bright-green on hover; own messages get amber border + amber username + amber `▸`. Tags inline render in magenta with dashed underline; @mentions in amber with glow. Input area: `$_` prompt (animated blinking caret keyframe `crtCaret`) + bordered textarea that focus-glows in phosphor; SEND button wrapped in `[ ... ]` brackets with green box-shadow; action buttons (image/draw/GIF) flat-bordered with phosphor outline. Empty-state replaced with a fake 8-line boot sequence (`checking system memory... [ OK ]` etc) ending in blinking `█` block-cursor prompt. Vote/reaction/toast/filter-bar/clear/image-preview all restyled flat-zero-radius with phosphor borders. Lightbox bg darkened to 92% black. Mobile @600px: hides the `─ tty0 ─ connected` suffix, scales message-content + input down. OG meta refreshed: new pollinations image prompt (green-phosphor CRT terminal flux seed 42), new description "A green-phosphor CRT chatroom. Everyone connects. Real-time global terminal.", favicon swap from 💬 to 🖥. Zero changes to the JS layer — every existing function (sendMessage, renderMessages, real-time INSERT subscription, presence, rate-limiting, hacker markup parsers, ghost-text completion) preserved as-is.
- 2026-02-04: Migrated to header sync hub
  - Added sloppy-bar.js (minimized, hidden in embed mode)
  - Profile data now comes from sloppyBarGetContext() instead of direct sloppygram_profiles query
  - Listens for identity-changed + context-ready events for live profile updates
  - Listens for theme-changed events in standalone mode for cross-tab theme sync
  - Fallback: direct DB query if header not loaded, embed set-profile postMessage still works
  - First app migrated to header sync pattern
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
