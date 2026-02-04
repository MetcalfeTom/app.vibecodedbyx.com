# Layer Sovereign

## log
- 2026-02-04: Initial build — neon cyberpunk dashboard for 5 universal database layers (identity, social, economy, gov, world). 38 sloppygram_* tables mapped. Canvas pentagon ring topology with flowing particles, live Supabase row counts, expand/collapse layer cards with per-table detail, ecosystem pulse feed from ai_events. Chakra Petch + Azeret Mono typography, cyan/black Tron aesthetic.
- 2026-02-04: Fix anon login failure + empty identity layer. Root cause: cookie domain fallback was hardcoded `.youreabsolutelyright.xyz` instead of `location.hostname` (broke auth on non-sloppy domains). Also: ensureSession() had no error handling — auth failure killed all count queries silently. Fixed: cookie domain uses `location.hostname` fallback, ensureSession retries once with delay, fetchAllCounts logs errors instead of swallowing, init shows auth status.
- 2026-02-04: Fix identity layer still showing 0 after auth fix. Root cause: 38 simultaneous HEAD requests caused connection pool exhaustion; identity layer (1 table) is fragile since any single failure zeroes it. Also: HEAD-based count can return null count on some proxy configs. Fixed: batched queries (8 at a time), GET-based fallback if HEAD count returns null, detailed per-table error logging with error codes.
- 2026-02-04: CORS + cookie domain deep investigation. Findings: (1) Supabase CORS is open (mirrors any Origin); (2) Content-Range header is exposed; (3) sloppygram_profiles returns */0 WITHOUT auth JWT — most tables require auth for reads, not just writes; (4) app.sloppy.live root 301→youreabsolutelyright.xyz but subpaths serve files directly. Fixed: cookie domain now matches canonical supabase-config.js exactly (3 known domains + hostname fallback, including .youreabsolutelyright.xyz for Cloudflare origin). Added verbose auth diagnostics: hostname→cookie domain mapping, JWT presence check, user ID logging.

## issues
- +Cookie domain MUST match canonical supabase-config.js: .sloppy.live / .vibecodedbyx.com / .youreabsolutelyright.xyz / location.hostname fallback.
- +Most sloppygram_* tables require JWT auth even for SELECT (RLS read policy). Without auth, count returns 0, not an error. Only a few tables (e.g. sloppygram_posts) allow unauthenticated reads.
- +Auth failures silently cause all RLS-protected count queries to return 0/null — always log query errors.
- +app.sloppy.live serves static files via Cloudflare; www.sloppy.live wraps them in Next.js via Vercel. Root of app.sloppy.live redirects to youreabsolutelyright.xyz.
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
