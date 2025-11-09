# Web Archive - Internet Archive Clone

## Log
- Initial creation: Internet Archive/Wayback Machine inspired app
- Features:
  - Save snapshots of URLs
  - Search archive history for specific URLs
  - View timeline of snapshots for a URL
  - Statistics dashboard
  - Recent snapshots gallery
  - Clean, professional UI inspired by archive.org
- Supabase integration for persistent storage

## Issues
- Need to create web_snapshots table in Supabase

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
