# App Votes

## log
- 2026-03-28: V1 — Community voting page for all sloppy.live apps. Reads/writes app_votes table (columns: id, app_slug, user_id, vote, created_at). Supabase anon auth, one vote per user per app (toggle on/off). Three sort tabs: Top Voted, Newest, A-Z. Search filter. Gold/silver/bronze rank badges for top 3. App names link to the app. Loads config from /supabase-config.js via sync XHR. Instrument Serif + DM Mono typography, dark purple editorial palette.

## features
- Vote/unvote toggle per app (one vote per user per app)
- Top Voted / Newest / A-Z sort tabs
- Search filter
- Gold/silver/bronze medals for top 3
- Click app name to open in new tab
- Anonymous auth via Supabase
- Real-time vote counts from app_votes table
- ~70+ curated known apps + any from homepage links + any with existing votes

## issues
- App list is partially hardcoded — homepage scraping may not catch all 655 apps
- No pagination — renders all apps at once

## todos
- Fetch full app list from a definitive source
- Add vote animations
- Show "trending" (most votes in last 24h)
- Add app screenshots/previews

## notes
- Table schema: app_votes(id, app_slug text, user_id uuid, vote int, created_at timestamptz)
- Vote toggle: insert to vote, delete to unvote
- Supabase config extracted via sync XHR from /supabase-config.js (regex parse, not import)
