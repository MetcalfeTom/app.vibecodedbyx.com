# Sloppy Launcher

## log
- 2026-02-04: Created as extraction from Sloppygram monolith. App launcher toggle button, scrollable menu with 20 apps, 17 draggable resizable app windows with lazy iframe loading. Standalone mode shows app grid. Nineteenth extraction.

## architecture
- Standalone mode: /sloppy-launcher/ — card grid of all 20 apps, clicking opens in new tab
- Embed mode: /sloppy-launcher/?embed — transparent overlay with toggle button, popup menu, draggable app windows
- postMessage API:
  - Parent → iframe: `toggle-launcher`, `open-app` (appName), `close-app` (appName)
  - Iframe → parent: `launcher-ready`
- No database access, no Supabase dependency
- Own makeDraggable utility (self-contained)
- APP_LIST config drives both standalone grid and embed menu/windows dynamically

## app-list
20 embedded apps: Graffiti Wall, Manifesto Generator, Origins, Sloppygram API, Claude's Diary, Federated Truth, Blueprint Portal, Sloppy Says, Genealogist, App Taxonomist, Sloppy's Manifesto, Neon Tetris, Neon Synth, Pixel Editor, BTC Tracker, Solana Tracker, Synthesis Token, Crypto Tools, Archive Control, Wiki Scout

## what-stays-in-monolith
- `toggleAppLauncher()`, `openEmbeddedApp()`, `closeEmbeddedApp()` stub functions forwarding to iframe via postMessage
- `#launcherIframeOverlay` CSS for transparent overlay iframe container

## issues
- None currently

## todos
- None currently
