# Tug of War

## log
- 2026-07-04: v1 — pitch-black void tug of war. Fullscreen canvas, total darkness with a cursor-following halo of light (110px radius) as the only way to see the rope, players, and knot. Rope drawn with 60-segment physics (sag + tension wobble), blue-to-red gradient, golden knot marker. P1 mashes A key or clicks left half, P2 mashes L key or clicks right half. 60-second timer, rope snaps at ±100 position for instant loss. Snap produces 30 particles + crack/thud/whip SFX trio. Position indicator bar + timer always visible (drawn outside the darkness mask). Hidden rubber duck easter egg randomly placed each round — cursor reveals it, hovering close triggers a quack sound. Darkness mask uses `destination-in` compositing with a radial gradient at cursor position. Touch support. Bungee + Azeret Mono + Instrument Serif.

## issues
- None yet

## todos
- Idle pullers (auto-pull upgrades purchasable with gold from clicks)
- Power-ups hidden in the darkness (find them with your cursor)
- Screen shake on snap
- Multiplayer via Supabase Realtime
