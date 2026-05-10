# banana-slip

## log
- 2026-05-10: shipped initial cut (chat ask: "create a browser game called Banana Slip where you play as a sentient fruit salad escaping a blender" — credit: **8eios**). Side-view physics platformer set inside a kitchen blender's glass jug. Climb the slippery walls, grab fruit teammates, escape the rim before the blender blends you.
  - **Player**: hand-drawn banana on canvas (curved primitive arc body + green stem + brown tip + tracking eyes that watch your velocity + mood-shifting mouth: smile / worried zigzag / open scream during pulse). Bobs on idle. I-frames flash after a hit.
  - **Movement**: low friction (220 px/s² — slippery world), 1100 px/s² gravity, 240 max horizontal speed. Jump impulse -460 px/s with 120ms coyote + 120ms jump-buffer. Wall-grab: holding direction toward a wall damps `vy *= 0.55^(dt*8)`. Wall-jump pushes 280 px/s away from the wall.
  - **Jug geometry**: inverted truncated bell. `halfWidth(y)` interpolates topHW (36% of W) → bottomHW (26%) with a small belly bulge `sin(t·π) × 1.8% W` for visual organic curve. Wall normals computed by sampling adjacent half-widths. Top opening is the win zone (player y < jugTop + 4).
  - **Blender state machine**: IDLE 5s (no blades) → WARMUP 5s (blades spin slowly + 0.3 suction) → ACTIVE (blades full speed, 0.55 suction). During ACTIVE, **PULSE** events fire every 5–9s: 700ms of max-omega blade-spin, +22 screen shake, expanded death zone (any contact within ±60u of blade is fatal), red vignette tint, and the player + all fruits get pulled hard toward the blade hub.
  - **Suction**: continuous gravitational pull from blade center toward all dynamic objects (player + fruits) scaled by `blender.suction`. Trivializable while idle, dangerous once active.
  - **Fruits** (8 to collect): strawberry / grape / orange / kiwi / cherry — each rendered with bespoke canvas primitives (heart-strawberry with seeds + leaf-cap, segmented orange, kiwi cross-section with seed ring, paired cherries with bezier stems, glossy grapes). They wander randomly, ricochet inside the jug, and get pulped if the blender pulses near them (turns to 18-particle pulp burst + lost forever — incentive to grab them early).
  - **HP**: 3 hearts. Blade contact during ACTIVE = -1 + knockback away from center + 1.2s i-frames. Pulse contact = -1. HP=0 → PULPED.
  - **Score**: +25 per fruit, +500 escape bonus, +100 per remaining heart on win.
  - **HUD**: 4-card row (Score / Salad N/8 / Hearts / Blender state+timer). Blender card flashes "PULSE!" red on pulse, "WARM Xs" amber, "ON Xs" red countdown to next pulse, "IDLE Xs" green.
  - **Aesthetic**: tropical kitchen — cream tile counter bg with subtle checker pattern + horizon shadow, glass jug with cyan tint + measurement-cup ticks ("6C 5C 4C…") + gloss highlight strip on the right + bold ESCAPE arrow telegraph above rim, chrome 4-blade rotor with motion-blur ring at high omega. Bungee title rotated -2.4° with triple-layer banana/pink/black drop shadow. Bowlby One SC banner toasts ("blender warming up…", "BLADES SPINNING!", "★ PULSE!"). VT323 monospace HUD numerics.
  - **Audio**: WebAudio synth — triangle jump bleep, two-note collect chime, sawtooth+noise hurt, low sawtooth warmup growl, 700ms noise+sub pulse roar, 5-note triangle win arp, descending sawtooth lose.
  - **Controls**: ← → / A D move, Space / W / ↑ jump. Mobile: 5.4rem floating circular pad (◀ ⤒ ▶) bottom-fixed, only on coarse-pointer devices. R restart, M mute.
  - **Accessibility**: rem units throughout, semantic main/header/section, role="application" on canvas + control-summary aria-label, aria-live on HUD, focus-visible outlines, 2.75rem min interactive targets, prefers-reduced-motion kills the title rotation.

## issues
- Wall-grab feels strong on mobile — holding the directional pad toward a wall keeps you stuck almost indefinitely if you don't move. Acceptable for v1 but might need a stamina-style timeout.
- Suction during ACTIVE phase can pull the player off a wall mid-grab if you're near the bottom. Could clamp the suction force when wall-grabbed.
- Fruit AI is just damped random wander + suction. Could add more interesting behaviors (orbit, schooling).
- No "best escape time" persisted to localStorage yet.
- Pulse death zone is generous (±60u), making PULSE genuinely scary near the bottom — might need a telegraph.

## todos
- Pulse warning: 0.6s pre-pulse flash on the blade with countdown sound.
- Best-time leaderboard via Supabase realtime broadcast (no DB writes).
- Power-up fruits: pineapple = full heal, coconut = brief shield, lime = double-jump 8s.
- Multiple jug shapes (Vitamix tall, smoothie cup short-fat, glass canister tall-thin) as level select.
- Co-op via BroadcastChannel (local 2-tab — second player controls a strawberry teammate).
- Cinematic intro: blender lid coming down before the run starts.

## design-notes
The "slippery walls" pun was the target sensation. Friction is intentionally low (220 px/s² vs the typical 800+) so the player coasts even when not pressing — every move requires anticipation. Wall-jumping is the primary climb mechanic since the jug narrows going up; you can also chain wall-grabs to take the slow safe route.

Pulse events are the panic source. They're random within a 5–9s window so the player can't perfectly time them, and the blade death zone temporarily expands to ±60u (vs the ±28u steady-state) so you can't safely camp near the blades during a pulse. The audio cue (low noise burst + 70Hz sub) lands ~50ms before the visual, giving a tiny reaction window.

Banana mood-mouth is a small touch but does a lot of personality work — smile in IDLE, worried zigzag in ACTIVE, open scream during PULSE. Costs ~6 lines of code, sells the "sentient fruit" framing.
