# Sloppy Archive

## Log
- 2026-01-28: Rebranded to Sloppy Archive
  - Neon dark theme with cyan/magenta accents
  - Space Grotesk + JetBrains Mono typography
  - Shimmer gradient title animation
  - Updated OG image and meta tags
  - New tagline: "The Digital Time Capsule"
- Initial creation: Internet Archive/Wayback Machine inspired app
- Features:
  - Save snapshots of URLs
  - Search archive history for specific URLs
  - View timeline of snapshots for a URL
  - Statistics dashboard
  - Recent snapshots gallery
  - Neon cyberpunk aesthetic matching sloppy.live
- 2026-10-09: The whole page script was dead on load on the live host: the module did a static `import supabase from '/supabase-config.js'`, but the live config has no default export, so stats, recent snapshots, Save and Search never worked. Now a tolerant dynamic import (`m.default || m.supabase || (await m.supabaseSession()).client`); with no database the grid and the buttons say the archive is offline. Tested headless with no config and with a fake no-default config (stats, save, search).

## Issues
- Need to create web_snapshots table in Supabase if not exists

## Todos
- Create web_snapshots table with columns: id, url, title, user_id, created_at
- Could add actual screenshot/HTML capture functionality
- Could add calendar view for browsing snapshots
- Could add full-text search

## Notes
- Currently saves metadata about snapshots (URL, timestamp)
- Could be extended to save actual page content/screenshots
- Timeline view shows all snapshots for a given URL
- Anonymous and authenticated users can save snapshots

- 2026-09-26: App script was dead on load — `import { supabase, supabaseSession }` from the root config, which has no named `supabase` export (SyntaxError kills the whole module). Now `import supabase, { supabaseSession } from '/supabase-config-fixed.js'`; verified loading with a stub db (no errors, db calls run).
