# Lost & Found

Community-driven lost and found tracker with an interactive map.

## log
- 2026-01-24: Initial creation - Leaflet map, item submission form, filtering by type

## features
- Interactive Leaflet map with dark theme tiles
- Click-to-place location picker
- Report lost or found items
- Filter by all/lost/found
- Item cards with details and time ago
- Click card to pan map and show popup
- Mark your own items as resolved
- Real-time updates via Supabase
- Geolocation to center map on user
- Custom colored markers (red=lost, green=found)
- Mobile responsive layout

## database
- lostfound_items: item_type, title, description, lat, lng, username, avatar, contact, image_url, resolved

## todos
- Add image upload for items
- Add search functionality
- Add distance-based sorting
- Add notifications when nearby items are reported
- Add categories (electronics, pets, documents, etc.)
