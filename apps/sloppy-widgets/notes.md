# Sloppy Widgets

## log
- 2026-02-04: Created as extraction from Sloppygram monolith. Ghost Radar + Confidence Monitor combined into one overlay iframe. Canvas-based radar with presence blips, 3-mode confidence meter with real DB metrics. Standalone showcase + embed overlay. Twentieth extraction.

## architecture
- Standalone mode: /sloppy-widgets/ — showcase layout with both widgets centered, subscribes to presence channel directly
- Embed mode: /sloppy-widgets/?embed — transparent overlay with floating widgets at fixed positions
- postMessage API:
  - Parent → iframe: `presence-sync` (state), `content-counts` (messageCount, postCount, onlineCount), `refresh-confidence`, `set-widget-opacity` (value), `set-accent` (color)
  - Iframe → parent: `widgets-ready`
- Own Supabase client for confidence metric queries (6 parallel count queries)
- Confidence Monitor: 3 modes (SYSTEM/ENGAGE/SYNTH), real DB metrics, sessionStorage caching (30s TTL)
- Ghost Radar: canvas-based radar sweep, presence blips with distance-based positioning, ping toast

## data-sources
- `sloppygram_messages` — message count for confidence
- `sloppygram_posts` — post count for confidence
- `sloppygram_manifestos` — manifesto count for confidence
- `sloppyid_verifications` — verification count for confidence
- `sloppygram_follows` — follow count for confidence
- `sloppygram_post_likes` — vote count for confidence
- Supabase presence channel — ghost radar blips (standalone mode only)

## what-stays-in-monolith
- `sendWidgetsPresence(state)` — forwards presence data to iframe
- `sendWidgetsCounts()` — sends message/post/online counts every 10s
- `updateGhostRadar(state)` — calls sendWidgetsPresence
- `window.updateConfidenceMonitor` — sends refresh-confidence to iframe
- `window.cycleConfidenceMode` and `window.ghostRadarPing` — no-op stubs
- `#widgetsIframeOverlay` CSS for transparent overlay iframe container
- `@keyframes diamondGlow` — shared by app launcher, confidence monitor, ghost radar

## issues
- None currently

## todos
- None currently
