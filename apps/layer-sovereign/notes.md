# Layer Sovereign

## log
- 2026-02-04: Initial build — neon cyberpunk dashboard for 5 universal database layers (identity, social, economy, gov, world). 38 sloppygram_* tables mapped. Canvas pentagon ring topology with flowing particles, live Supabase row counts, expand/collapse layer cards with per-table detail, ecosystem pulse feed from ai_events. Chakra Petch + Azeret Mono typography, cyan/black Tron aesthetic.

## issues
- Physical table names still use sloppygram_* prefix even though schema-layers.sql defines renamed versions; dashboard queries actual table names.
- ai_events table may have varying column names for event content (content, message, description); guessLayer heuristic is basic.
- Canvas text rendering requires font preload via document.fonts.ready.

## todos
- Add click-on-canvas-node to scroll to corresponding layer card
- Add sparkline mini-charts per table showing growth over time
- Add layer health indicators (growth rate, staleness detection)
- Consider WebSocket presence count overlay

## architecture
- Single-file HTML app, ~700 lines
- Supabase SSR client with cookie domain detection
- 38 parallel HEAD-only count queries (zero row data transfer)
- Canvas: pentagon ring with 5 nodes, 10 gradient edges, 80 flowing particles, center hub
- Real-time: postgres_changes on ai_events for pulse feed
- Auto-refresh counts every 60 seconds
- 5 layer colors: identity=#ff2d78, social=#00e5ff, economy=#ffe14d, gov=#b44dff, world=#39ff7a
