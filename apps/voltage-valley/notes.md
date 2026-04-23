# Voltage Valley

## log
- 2026-04-23: Created. Simplified single-player-vs-2-AI web version of Power Grid. **Standard node map** (not hex) — 14 named cities as SVG nodes (Summit, Ironcrest, Stormridge, Ashpoint, Windmere, Emberford, Coalpit, Oilspring, Hollowgate, Riverbend, Solarfield, Voltage Bay, Circuit Harbor, Geotherm Hollow) connected by 26 edges with 3–12₴ connection costs. Each city has **3 slots** at 10/15/20₴; multiple players can share cities. **Phases**: Auction → Fuel → Build → Power, repeating until someone powers 6 cities in the Power phase. **Auction**: click a plant in the current market (top row of 4) to open bidding at plant.id (its number = min bid). AI opponents counter-bid up to a computed value (`cap*12 + eco/uranium/trash bonuses + early-plant bonus - current_round adj`). Overlay modal shows current bid + leader; human enters bid via number input or passes. **Plant deck** (20 plants, ids 3–35): coal, oil, trash, uranium, and eco (no-fuel) with cap 1–4 cities. Deck reveals 8 at a time (4 current + 4 future). Max 3 plants per player; buying a 4th scraps the lowest. **Fuel market**: click a resource (Coal/Oil/Trash/Uranium) to enter "stocking mode", then click one of your plants that accepts that fuel. Prices scale with supply (coal 1–8₴, oil 2–8₴, trash 3–7₴, uranium 5–20₴). Plants hold up to 2× their fuel cost. **Build**: human clicks glowing cities; route cost = Dijkstra over edges from any owned city + the slot fee. First city is just the slot fee (no edges). Edges used by a player are drawn as colored wires (p0 gold, p1 crimson, p2 steel blue), with parallel offset when multiple players share an edge. **Power**: click your plants to fire them; they consume `plant.fuel` resources and light up to `plant.cap` cities (capped at cities wired). Income table `[10,22,33,44,54,64,73,82,90,98,105,112,118]₴` by cities powered. **AI**: fuel phase greedy-fills to capacity keeping 8₴ reserve; build phase targets cheapest-path cities prioritizing uncontested slots; power phase fires eco first, then by cap desc. **Turn order** recomputed each phase: fewest cities + least cash first (so leader pays fuel/builds last). **Replenishment**: coal+4, oil+3, trash+2, uranium+1 per round, scaled ×(1 + round/3). **Aesthetic**: industrial blueprint — deep navy bg `#0f1218`, copper `#d68b3a`/gold `#f5c453` accents, repeating 28px grid, scan lines on header. Oswald 700 title "VOLTAGE VALLEY" (Voltage in copper), Special Elite subtitle "▲ POWER · AUCTION · WIRE ▲", IBM Plex Mono body/stats. Cities render as 13px circle nodes with Oswald name labels + player slot dots arranged in triangle. Edge cost labels in IBM Plex Mono 10px. Action hint always visible in bottom panel, phase pill top-right shows current phase. Help button (?) opens phase reference. Log panel shows all plays. Pollinations OG.

## features
- 14-city node map with Dijkstra path-costing for network expansion
- 20-plant deck with 5 resource types (coal/oil/trash/uranium/eco)
- Dynamic resource market with supply-scaled prices
- Real auction flow with AI counter-bidding + pass option
- 2 AI opponents with distinct play (greedy fuel, cheapest-city build, prioritized firing)
- Turn order recomputed each phase by cities + cash
- Shared cities with 3 slots (10/15/20₴ escalating)
- Parallel wire rendering when players share an edge
- Keyboard/phase guidance in always-visible hint panel
- Help overlay with full phase reference
- Mobile-responsive layout (stacks at 900px, compact stats at 640px)

## issues
- 6-city win target is aggressive for a short game — might tune up to 7 if it plays too fast.
- AI auction valuation is rough; a human who knows to bid up plants they don't want can drain AI cash. Intentional for now.
- Fuel stocking is a two-click flow (click resource → click plant) and the "stocking mode" state isn't super obvious; the hint bar calls it out but a visible highlight on eligible plants would help.
- No handling for "plant completely useless because no fuel left" edge case — if coal sells out, a coal-only player stalls. Replenishment usually catches up but late-game uranium can get scarce.
- AI always tries to build ≥1 city per round; on tight cash they may skip building. Not currently skipping on purpose — they just can't afford it.
- No "Step 2" / "Step 3" escalation from real Power Grid — just one continuous phase. Consider adding a Step 2 trigger that opens a second slot per city.
- Plant scrap (4th plant forces discard of lowest) happens silently at auction close; should probably let human choose which to scrap.

## todos
- Let human pick which plant to scrap when forced to 3
- Add "Step 2" that enables 2nd slot / removes cheapest plant from market at 4-cities milestone
- Hybrid plants (coal OR oil) — deferred for simplicity
- Visual animation on firing (pulse cities, sparkle edges, coins floating up)
- SFX: bid gavel, build click, plant fire hum, cash ring
- Difficulty setting (easy/normal/hard tunes AI valuation constants)
- Seed-based matches for shared challenges
- Leaderboard for fastest-to-6-cities win via Supabase
