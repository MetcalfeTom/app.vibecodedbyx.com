# market-mayhem

## log
- 2026-05-09: **Wall-collision fix** (chat asks: "fix the collision in Market Mayhem so enemies can't get stuck in walls" + "fix the wall collision in market-mayhem so enemies don't get stuck at the edges"). Three coordinated fixes:
  1. **Axis-separated movement** — new `tryMoveEnemy(e, dx, dy)` helper that mirrors the player's pipeline: apply dx, resolve, apply dy, resolve. Replaces the old single-step `e.x += vx*dt; e.y += vy*dt; pushOutOfRect()` pattern. The big payoff is for fliers (cereal / egg / fish / milk-jug) who recompute their heading every frame from the player's position — under the old code, after being pushed out of an aisle they'd immediately walk right back in next tick. With axis-separated movement the entity slides along the wall instead.
  2. **Velocity flip in `pushOutOfRect` is now direction-aware** — was `vx = -Math.abs(vx)` which always forced a leftward flip regardless of which side resolved. Now reads "if you were moving INTO the wall on this axis, flip; otherwise leave the velocity alone." Bouncers + chargers now reflect cleanly off both arena walls AND aisle rectangles.
  3. **Stuck-detector backstop** — every frame, each enemy compares its position to last-tick's. If `moved < 0.4u` AND the entity is still overlapping an aisle, accumulate `stuckT`. After 0.5s of stuck-state, try four cardinal nudges of `2r` (sorted by which lands closest to the player) and teleport to the first clear one. Bouncers re-roll their heading after the nudge so they don't immediately ricochet back into the same wall.
- 2026-05-09: shipped — top-down wave-survival arena (chat ask: "create a game called Market-Mayhem where you survive waves of sentient grocery items like flying cereal boxes and rolling watermelons, gaining powerups in the produce section"). 1280×720 logical canvas with checkered linoleum floor + 6 purple shelf-aisles + a green produce-section pad on the right. WASD to move, mouse to aim, click to shoot.
  - **7 enemy kinds**:
    - 🥣 **Flying Cereal** — slow chaser, splits into 2 cereal-bits on death
    - · **Cereal bits** — fast micro-swarm
    - 🍉 **Watermelon** — fast charger, locks heading every 1.5s, big damage
    - 🥖 **Bread Loaf** — bouncer that ricochets off walls + aisles
    - 🥚 **Egg Carton** — slow flier, splits into 6 yolks on death
    - · **Yolks** — fast micro-swarm
    - 🐟 **Fishstick** — fast lateral swarmer
    - 🥛 **Milk Jug Boss** — wave-12 boss, slow, periodically pours a milk slick (damaging particle pile that lingers 4s)
  - **6 produce powerups** spawn in the right-side produce pad every 7-11s (cap 4 simultaneous). Walk over them to grab:
    - 🍎 Apple → +25 HP (instant heal)
    - 🍌 Banana → +30% movement speed (10s)
    - 🍓 Strawberry → +50% fire rate (10s)
    - 🥑 Avocado → −40% damage taken + green jacket tint (15s)
    - 🍇 Grapes → tri-shot (10s)
    - 🌶 Pepper → explosive bullets with 70u AoE (10s)
    - Active buff icons stack above the player's head with a per-buff time-remaining ring.
  - **Player visual**: shopper with a small grocery cart pushed BEHIND them (cart-direction = opposite of facing). Cart fill-bar grows green as you bank kills (scaled to score). Body tints green when avocado armor is active. Yellow muzzle flash on every shot.
  - **HP ring** painted around the player as a continuous arc — drains as you take damage, color-shifts lime → gold → crim at 50%/25% thresholds.
  - **Arena physics**: 6 aisle rectangles + 4 walls block both player and enemies + bullets. Bouncers reflect off impact. Fliers and chargers push out of overlap on contact.
  - **12 waves** of escalating mixes — wave 1 is 6 cereal boxes; wave 12 is the milk-jug boss + 30 fish + 16 cereal in a final flurry. Wave clear bonus: +50 HP + +100 score. +25 HP per wave clear keeps the run sustainable if you grab apples too.
  - **Audio**: WebAudio synth — square shoot bleep, triangle hit, kill arpeggio, sawtooth+noise hurt + boom, triangle pickup chime, fanfare on win, descent on lose. Mute toggle + audio-context lazy-create on first input.
  - **Aesthetic**: pastel grocery-store look — cream linoleum, purple shelves with tiny white "stocked items", produce pad as a green-yellow gradient with a dashed border + "★ PRODUCE ★" label. Bungee title "MARKET·MAYHEM" with pink/gold drop-shadow. Fredoka body font (rounded sans), Press Start 2P micro-labels, JetBrains Mono kbd hints, VT323 numeric counters. All buttons get a hard 3px ink shadow that compresses on press for chunky feel.
  - **Accessibility**: rem units, semantic main/header, `role="application"` + descriptive `aria-label` on canvas, `aria-pressed` on the mute toggle, `aria-live="polite"` on the HUD, `:focus-visible` outlines, 2.75rem (44px) min interactive targets, skip link, `prefers-reduced-motion` removes toast transitions.

## issues
- Bouncer (bread loaf) doesn't reflect off aisle rectangles cleanly — `pushOutOfRect` just nudges out without a velocity flip; visually fine but the loaf can briefly slide along an aisle wall instead of bouncing.
- Fishsticks have no animation — they're a static emoji. A sprite-sheet swim wiggle would help.
- The milk slick is rendered as particles which are circles; doesn't quite feel "slick" — a single fading puddle polygon would look better but cost a draw call per slick.
- No high-score persistence yet.

## todos
- Boss telegraphs (milk jug pre-rotates before pouring).
- Cart upgrades — once cart fills, "checkout" event teleports you to the produce section + grants a free random powerup.
- More enemies: 🍞 baguette spear (flies straight + heavy melee), 🥩 steak (regen tank), 🧀 cheese block (slow projectile thrower).
- Co-op via BroadcastChannel (local multi-tab).
- Local-best score saved to localStorage.
- Mobile virtual joystick + auto-aim toward nearest enemy.
