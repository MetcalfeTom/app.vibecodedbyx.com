# tickle-toy (Tickle Toy)

## log
- 2026-07-04: shipped (chat ask: "interactive tickle-toy app — feathers sweep across the screen, chat can poke or click to trigger reactions, pastel palette, soft floating physics"). NOTE: 16 tickle/feather apps already exist — checked the closest (tickle-feather = neon drag-blobs, feather-tickle-clicker = leaderboard clicker); this one is distinct: pastel + drifting flock + Twitch-poke.
  - **Feathers (9–16, screen-area scaled)**: canvas-drawn (spine + gradient vane + white barb hints), 8 two-tone pastel pairs. **Soft floating physics**: pendulum drift — horizontal sway `sin(t·2.2)`, rocking angle phase-shifted from the same oscillator (real falling-feather motion), slow fall, HEAVY damping on impulses (velocity ~0.35^dt, spin ~0.25^dt) so pokes puff feathers gently rather than launching them. Fallen feathers respawn at the top; sides wrap.
  - **Poke reactions**: click/tap = ripple ring + radial puff (within 170px, falloff), spin + wiggle, up to 3 pastel Gaegu giggle-pops ('hehe','tee hee','nyehe'…), gentle 1–3-note sine chime (unlocks on first tap per autoplay policy). Sweeping the pointer through feathers brushes them (throttled wiggle).
  - **Chat pokes**: anon Twitch IRC (#sloppy_ai) — every message pokes a random screen spot with the chatter's name as the big pop. HUD: connection pill + tickles + from-chat counters.
  - Pastel dreamscape gradient (blush/lavender/mint/cream), Gaegu handwritten + Sometype Mono. Reduced-motion: fall speed ~40%, impulses still damped (no flashing anywhere).
  - Verified: JS syntax OK, ids present.

## issues
- Chat pokes land at random positions by design (chat can't aim) — if chat wants aiming, a "!poke left/right/top" command parser is the next step.

## todos
- !poke <x> commands for aimed chat tickles.
- Rare golden feather that giggles musically when poked.
- Feather count slider in a tiny settings corner.
