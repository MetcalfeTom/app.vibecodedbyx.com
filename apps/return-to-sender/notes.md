# Return to Sender

## log
- 2026-09-26 v1.0: built on stream for gamehandsdotnet ("a mobile game like Temple Run with an unexpected twist and a different theme"). Theme: a late mail carrier, Pim, running through a city that runs BACKWARDS (the voice's pitch: rewinding city, see the ghost of an obstacle before it arrives).
  - 3 lanes; swipe (touch or mouse drag) or arrows/WASD/space: left/right lane, up jump, down slide (a slide in mid-air fast-falls).
  - Obstacles: barrier (jump), striped awning (slide), delivery cart (switch lanes). Rows are generated so there is always a way through; an autopilot in the scratch test ran 60 seeds × 150 s with zero crashes.
  - TWIST 1, ghosts from the future: anything beyond GHOST_S=2.4 s ahead is invisible; from 2.4 s → 0.8 s its pieces drift together as a cyan additive ghost; at 0.8 s it snaps solid (engine `phase(z)`).
  - TWIST 2, rewind instead of death: a crash costs a stamp and rewinds ~2.2 s of road (history snapshots every 0.1 s). Pickups/deliveries/erasures after the snapshot are undone. The obstacle you hit comes back as a RED ghost. 3 stamps, up to 5 (rare stamp pickups). Out of stamps = game over.
  - TWIST 3, mailboxes: letters are collected in lanes (some arc over barriers). Be in the edge lane beside a mailbox to post one: +100, and the next obstacle row ahead (beyond solid range, within 70 m) UN-HAPPENS (pieces fly apart).
  - Look: sky goes from sunset back up to golden afternoon over ~3 km; rain falls up; buildings ahead rise out of the ground (un-demolishing); toon materials; Bowlby One SC + Special Elite; postal red/cream/ink.
  - Hitstop (0.38 s) + flash on crash, VHS "◀◀ REWIND" overlay + sepia/teal filter during rewind; WebAudio sfx with a mute toggle; best score in localStorage; one-time contextual toasts.

## issues
- Headless screenshots work (swiftshader) with a probe that runs in the load handler; fonts/emoji are blocked in headless, so don't trust glyphs in probe shots.

## todos
- Chat ideas welcome: leaderboard (supabase), more obstacle types (a clock hand sweeping across lanes, pigeons flying backwards), power-ups, Pim's "you're fired" letter as a story beat.
- Performance pass on low-end phones if anyone reports stutter (pixel ratio already capped at 1.5 on narrow screens).
