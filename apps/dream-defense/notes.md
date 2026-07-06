# Dream Defense — notes

## log
- 2026-07-06: v1 — split-screen dream tower defense (chat ask; truncated "failed dreams" read as: failed crafts join the enemy — confirmed fun). **LEFT workshop**: CRAFT A DREAM button (2.6s rest between crafts) → 1 of 3 reaction minigames in the dashed box: ⚡ Catch-the-Spark (sine-bouncing dot, click inside the gold zone, 5s timeout), 💭 Pop-3-Bubbles (2.6s), 🌞 Wake-Tap (random 0.9–2.7s wait, tap within 750ms; early tap = fail). Win → weighted unit to the shelf (max 4): 📚 bookshelf (r95 d3 700ms), 💡 lamp (r62 d1 210ms), 🧸 teddy (AoE r72 d2 1.5s pulse ring), ⏰ clock (slow aura ×0.5 r85). **Fail → pendingFails++ → 💔 'failed' enemy queued into the NEXT wave** (hp 12+3w, sp 40). **RIGHT field**: 450×480 canvas, 10-waypoint S-path (segment-lerp walk, distToPath for placement), enemies wisp/blob/mare (mare from wave 3), bed 🛌 at end, 10 hearts (blob −2), endless waves (4+n, 700ms spawn cadence, 4.2s between), best wave persisted. **Drag**: pointerdown on shelf card → fixed-pos ghost emoji follows pointer → drop on canvas → validated (≥26px from path, ≥30px from towers, in bounds) — rejects say why; Enter/Space on a card auto-places near the path (keyboard a11y). Puff 💤 deaths, range circles, teddy pulse ring, animated dashed path. Grandstander + Comfortaa, midnight/gold/pink. WebAudio blips/chimes/womp. __dd() debug snapshot. **Tested**: bot won spark/bubbles/wake crafts (2 units), dragged teddy onto field, wave ran; deliberate ignored-craft fail → pendingFails 1 → 'failed' enemy verified marching in wave 2; zero page errors. Pacing bumped after test (blob 21→32 etc — original speeds made waves take >60s).

## issues
- Waves only advance when the field is CLEAR (spawnQueue+enemies empty) — a lone slow blob gates everything; consider overlapping waves if chat says pacing drags.
- Headless emoji = boxes (no emoji font); fine in real browsers.

## todos
- Chat may want: unit selling/upgrades, more minigames, boss nightmares, difficulty select, Supabase leaderboard for best wave, sound mute toggle (currently always on — add if asked).
