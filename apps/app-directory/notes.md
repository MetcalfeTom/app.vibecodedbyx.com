# App Directory

## log
- 2026-09-27: **front door.** 67% of visitors left within 30 s without touching anything (an A–Z wall starting at "3AM Thoughts"). Now a "fresh off the stream" row sits under the masthead: the 6 most recently updated apps with their screenshot (`https://sloppy.live/screenshots/<slug>.jpg`, falls back to the app's icon or letter), short title (cut at ' — '/' - '), "updated 2h ago"; staggered rise-in, a swipe row on phones; hidden while searching or with a genre picked. A 🎲 SURPRISE ME button opens a random game or simulator (or any app of the picked genre) in the same tab. `load()` now also reads the `/_bar/apps-index.json` rows (`[slug, title, desc, mtime, icon]`, it was skipped before because they're arrays): it's refreshed on every change, so its newer mtime and icon win over the local index (local index.json isn't rebuilt by any cron). Stats line: source hidden, last sync hidden on phones; keyboard hints hidden on touch. Real og.png (1200x630 render of the new top) instead of a pollinations URL; new descriptions.
- 2026-09-27: search placeholder shows the real app count once the index loads (it said 1200+ while 1,641 were indexed).
- 2026-01-13: Created app directory listing all sloppy.live apps

## features
- Lists all 280+ apps on sloppy.live
- Search/filter functionality
- Click to open any app in new tab
- App count display
- Clean grid layout
- JetBrains Mono font
- Neon cyberpunk styling

## issues
- Static list needs manual updates when new apps are added

## todos
- Could auto-generate this list from a build script
- Could add categories/tags
- Could add app descriptions
- Could add thumbnails/previews
- Could add sorting options (A-Z, newest, etc.)
