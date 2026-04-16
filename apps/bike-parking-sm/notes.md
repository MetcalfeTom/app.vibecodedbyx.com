# Bike Parking Santa Monica

Interactive map of bike parking spots in Santa Monica with safety ratings and tips.

## log
- 2026-04-16: Initial build. Canvas-rendered stylized street map of Santa Monica with 24 bike parking spots. Each spot has safety rating (1-5 stars), type (rack/cage/valet/corral/locker), capacity, covered/camera/free attributes, address, and detailed tips. 6 filter buttons (All, 5-star, 4+, Covered, Camera, Free). Clickable map pins and card list sorted by rating. Bottom sheet detail panel with tips, tags, and features. Outfit + IBM Plex Mono typography, warm parchment/green naturalist aesthetic.

## features
- Canvas map with street grid, ocean, beach, pier, labeled streets
- 24 bike parking spots with unique data
- 1-5 star safety rating system with color coding
- Spot types: rack, cage, valet, corral, locker
- Filter by: rating, covered, camera, free
- Clickable map pins with selection highlight
- Scrollable card list sorted by rating
- Bottom sheet detail panel with:
  - Address, rating, type, capacity
  - Covered/camera/free tags
  - Detailed safety tips per spot
  - Feature hashtags
- Mobile responsive
- Touch support

## issues
- Map is stylized/schematic, not geographically precise
- Spot data is illustrative, not sourced from official city data

## todos
- Community ratings (Supabase integration)
- User-submitted spots
- Report a problem feature
- Directions/navigation hints
- Real-time theft reports
- Photo uploads per spot
