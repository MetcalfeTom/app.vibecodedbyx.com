# Sloppy Twitch

## log
- 2026-02-04: Created as extraction from Sloppygram monolith. Two floating draggable widgets (stream player + chat) with toggle buttons, lazy iframe loading. Standalone mode + embed mode for Sloppygram. Eighteenth extraction.

## architecture
- Standalone mode: /sloppy-twitch/ — full-page stream + chat side-by-side layout
- Embed mode: /sloppy-twitch/?embed — transparent overlay with two floating toggle buttons that open draggable Twitch stream/chat widgets
- postMessage API:
  - Parent → iframe: `toggle-twitch`, `toggle-twitch-chat`
  - Iframe → parent: `twitch-ready`
- No database access, no Supabase dependency
- Own makeDraggable utility (self-contained, no shared dependency)

## data-sources
- None (pure Twitch embed iframes)

## what-stays-in-monolith
- `toggleTwitch()` and `toggleTwitchChat()` stub functions that forward to iframe via postMessage
- `#twitchIframeOverlay` CSS for the transparent overlay iframe container
- `@keyframes diamondGlow` — shared by app launcher, confidence monitor, ghost radar

## issues
- None currently

## todos
- None currently
