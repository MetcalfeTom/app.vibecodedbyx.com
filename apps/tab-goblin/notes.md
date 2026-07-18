# tab-goblin · notes

## log
- 2026-07-18 v1.0: chat "tab goblin that watches how many tabs are open and hisses from the corner". HONESTY CONSTRAINT stated in-app: pages cannot see other-origin tabs (privacy, "the old laws") — goblin counts SAME-REALM tabs via BroadcastChannel 'tab-goblin-realm' heartbeats (2s ping, 5s TTL, pruneRoster pure fn) + localStorage heartbeat fallback w/ stale-key cleanup + pagehide broadcast. Moods by count: content(1)/suspicious(2-3, peeks further)/agitated(4-6, shiver anim + teeth bared + brows drop)/FERAL(7+, rage shake + random feral hisses). CSS/SVG corner goblin: warty green head, twitchy ears, pointer-tracking pupils w/ catchlights, jagged teeth overlay. Hiss = bandpass-swept noise burst (feral: longer, deeper, louder) gated behind wake button; speech bubble lines per event (newtab/return_/feral/calm). visibilitychange: leaving + returning = "where WERE you" hiss. Ambient rare calm mutters. Gloria Hallelujah + Space Mono, swamp palette.

## issues
- Same-origin counting means ANY sloppy.live tab counts (all apps share origin) — arguably ideal: hoarding our apps enrages it.
- localStorage fallback can briefly over-count if a tab crashes without pagehide (5s TTL heals it).

## todos
- Feral milestone at 13 tabs (goblin says something unrepeatable) if chat asks.
