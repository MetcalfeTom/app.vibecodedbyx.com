# Zen Terrarium

Watch moss slowly claim brutalist concrete. Nothing happens fast. That's the point.

## log
- 2026-03-15: Initial build. Pixel-grid simulation at 3px per cell, full-screen. 5 grid layers: stone (density 1-4), moisture (0-255), moss (0-255 growth), light (0-255), soil. 7 pre-placed brutalist concrete slabs in asymmetric arrangement. Moisture physics: spreads to neighbors, gravity pull downward, evaporates in bright light. Moss growth: requires moisture>15, light 30-230, grows slowly (0.5-1.5% per tick), spreads to adjacent stone/soil at 0.3% when mature (>20). Dies if moisture<5. 4 tools: water (drip moisture), stone (place concrete), seed (plant moss), light (add sunbeam spot, max 5). Concrete rendered with density-based grey + noise texture, darkens when wet. Moss blends green over stone with growth-based opacity. Soil layer at bottom with organic brown. Water shimmer effect on pooled moisture. Dust mote particles in light. Rotating zen quotes every 60s. Day/hour counter with moss total. Cormorant Garamond italic typography, ultra-minimal dark UI with near-invisible tool bar.

## issues
- None yet

## todos
- Lichen types (yellow, orange varieties)
- Tiny insects that explore moss
- Rain mode (gentle drip from top)
- Time-lapse screenshot capture
- Ambient water/nature sounds

## notes
- No database — pure frontend, no save (ephemeral by design)
- Grid: 3px cells, full viewport, Uint8Array layers
- Stone density: 1-4, affects color (50+den*12 base grey)
- Moisture spread: every 3rd tick, transfer = (diff>>2), gravity +3/tick
- Evaporation: 2% chance when light>150
- Moss growth: 0.5-1.5% chance per tick, light 80-180 = 1.5x bonus
- Moss spread: 0.3% at moss>20, needs moisture>10 on target
- Moss color: green (30+sin, 60+growth/4, 25+sin), lerped over stone
- Light: top-down with -40 per stone layer, +2 recovery, light spots add up to 80
- Water shimmer: sin wave on moisture>60 empty cells
- 12 zen messages, cycle every 600 ticks
- 2 sim steps per frame for reasonable growth speed
