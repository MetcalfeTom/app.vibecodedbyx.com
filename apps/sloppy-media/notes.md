# Sloppy Media

Unified media overlay for lightbox, share modal, and GIF search. Designed primarily as an iframe embed for Sloppygram, but also works standalone.

## log
- 2026-02-04: Initial creation — extracted from Sloppygram monolith
  - Image lightbox: full-screen image viewer with fade animation, click/escape to close
  - Share modal: X (Twitter), Reddit, and copy-link sharing with glassmorphism UI
  - GIF search: GIPHY trending + search, 3-column grid, click to select
  - Embed mode: transparent background, listens for postMessage commands
  - postMessage API: open-lightbox, open-share, open-gif → renders overlay
  - Responses: media-close, gif-selected, link-copied → sent to parent

## architecture
- Full-viewport overlay pattern (position:fixed, inset:0, transparent bg)
- Parent shows/hides the iframe; iframe renders the appropriate overlay
- GIF selection sends URL back to parent; parent handles DB insert
- Escape key closes any active overlay and notifies parent

## data sources
- GIPHY API (public beta key, trending + search endpoints)
- No Supabase tables directly — GIF insertion handled by parent

## issues
- GIPHY API key is public beta (dc6zaTOxFJmzC), may have rate limits
- Clipboard API for copy-link requires HTTPS or localhost

## todos
- Could add image zoom/pan to lightbox
- Could add download button for images
- Could replace GIPHY with Tenor for better API support
- Could add keyboard navigation for GIF grid
