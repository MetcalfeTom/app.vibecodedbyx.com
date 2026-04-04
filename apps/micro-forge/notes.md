# MicroForge

## log
- 2026-04-04: Initial build — industrial micro-manufacturing marketplace prototype. 7 workshop listings with machine status, live activity feed, area map, quick order form. Instrument Serif + DM Mono + Anybody typography, warm paper/industrial light palette. Filter by capability, search, simulated live machine load updates.

## features
- 7 workshop listings with detailed machine status (running/idle/maintenance + load bars)
- Capability filter chips (CNC, 3D Print, Laser Cut, Welding, Sheet Metal, Woodwork, Electronics)
- Text search across names, locations, capabilities
- Live activity feed with 8 event types
- Area map with colored status dots
- Quick order form with process, material, quantity, notes
- Stats strip with marketplace metrics
- Simulated live machine load updates every 8 seconds
- Responsive — collapses to single column on mobile, hides nav

## issues
- All data is static/simulated — no backend
- Map is placeholder (dots on grid, not real map)
- No user auth or order tracking
- Quick order just shows confirmation animation

## todos
- Add Supabase backend for real workshop data
- Real map integration (Leaflet or similar)
- Workshop detail page with full machine specs
- Order tracking system
- Review/rating system
- Photo galleries for workshops
