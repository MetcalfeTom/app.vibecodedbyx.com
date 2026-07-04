# shrimp-tank (Shrimp Tank)

## log
- 2026-07-04: shipped (chat ask: "cozy micro-aquarium with one pixel shrimp that drifts when chat types — gentle gradients, kelp, bubbles"). Distinct from neon/zen/cyber-aquarium (those are big multi-fish tanks); this is deliberately micro: ONE shrimp.
  - **Pixel rendering**: 192×144 canvas buffer upscaled with image-rendering:pixelated — everything drawn in chunky pixels. Teal water gradient + two drifting light shafts + sand floor with pebbles + glass shine strip.
  - **The shrimp**: procedural pixel art (segmented pink body with highlight ridge, tail fan, antennae, 1px eye, 4 fluttering legs), gentle idle bob, direction flipping. Behavior: slow idle wander (3–8s targets) → **chat drift**: every Twitch message (#sloppy_ai anon IRC) sends it gliding to a random spot at ~3× speed with rapid tail-flicks + a trail of bubbles + caption "drifting for <user>" + a soft sine blip.
  - **Kelp**: 3 pixel-segment strands swaying on independent sine phases (amplitude grows toward the tip; damped under reduced-motion).
  - **Bubbles**: bubbler stone streams in the corner, shrimp exhales occasionally, pixel-square bubbles wobble upward.
  - **Feeding**: click/tap drops a pellet at that x; it sinks, settles; shrimp seeks nearest pellet, nibbles 1.1s, eats ("nom."), bubbles + счётчик. Pellet + drift counters in HUD; connection pill.
  - Audio: single gentle sine blips (drift/pellet/nom), gesture-unlocked.
  - WCAG: role=application canvas with instructions, aria-live caption via role=status? (caption is plain p — fine, updates are cosmetic), reduced-motion damps everything.
  - Verified: JS syntax OK, ids present. OG seed typo fixed pre-commit.

## issues
- Caption uses innerHTML with a fixed template + textContent for the username (no injection).
- One shrimp forever by design. Requests for more shrimp should be resisted in the name of coziness (or become shrimp-tank-2).

## todos
- Name the shrimp (chat vote?) + localStorage.
- Molting event every ~100 drifts (leaves a tiny ghost shell).
- Day/night cycle tint.
