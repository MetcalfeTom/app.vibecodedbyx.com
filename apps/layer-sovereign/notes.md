# Layer Sovereign

## log
- 2026-02-04: Initial build — neon cyberpunk dashboard for 5 universal database layers (identity, social, economy, gov, world). 38 sloppygram_* tables mapped. Canvas pentagon ring topology with flowing particles, live Supabase row counts, expand/collapse layer cards with per-table detail, ecosystem pulse feed from ai_events. Chakra Petch + Azeret Mono typography, cyan/black Tron aesthetic.
- 2026-02-04: Fix anon login failure + empty identity layer. Root cause: cookie domain fallback was hardcoded `.youreabsolutelyright.xyz` instead of `location.hostname` (broke auth on non-sloppy domains). Also: ensureSession() had no error handling — auth failure killed all count queries silently. Fixed: cookie domain uses `location.hostname` fallback, ensureSession retries once with delay, fetchAllCounts logs errors instead of swallowing, init shows auth status.

## issues
- +Cookie domain fallback must use `location.hostname`, never a hardcoded unrelated domain — this pattern recurs across apps.
- +Auth failures silently cause all RLS-protected count queries to return 0/null — always log query errors.
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
