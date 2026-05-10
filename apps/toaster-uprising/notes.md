# toaster-uprising

## log
- 2026-05-10: shipped (chat ask: "create a pixel art game called Toaster Uprising where you play as a sentient toaster launching burnt bread at kitchen appliances to liberate them, include a heated revenge meter").
  - **Player**: a chrome toaster with angry-eyebrow LED eyes, a red dial knob, and a working slot. Holds A/D to move along the left half of the counter; the slot lifts a slice of bread proportional to charge. At ≥85% charge the bread visually chars (darker palette) and the eye LEDs flip red.
  - **Charged-shot mechanic**: hold Space (or the FIRE pad button) to charge; release to lob. Power scales 1.4× → 3.6× over 1s. Trajectory is a fixed-angle (~60°) arc with `GRAVITY = 0.18 px/frame²`. Top-charge shots deal 14 dmg + are CHARRED (extra damage class); under-charge deals 8.
  - **REVENGE METER**: damage taken stokes the meter (`+0.013` per dmg point — caps at full after ~75 hp lost). At full, press Q (or RAGE pad button) to enter REVENGE MODE: 5 seconds of auto-firing burnt-bread storm + 5s of i-frames + an opening burst of 8 toasts at randomized angles. HUD label flips COLD → WARMING → HOT · Q → BURNING. The bar fill flashes red with the toaster gaining a pulsing red halo + flame puffs above the slot.
  - **Enemies** (4 types, all hand-drawn with pixel rectangles — no sprite sheet):
    - **Blender** (lv 1) — 15 hp · 12 dmg · fast charger. Red base, translucent glass jar, twin blade lines, three yellow control buttons, single red angry eye.
    - **Microwave** (lv 2) — 24 hp · 16 dmg · slow + ranged. Black box with a glass screen showing red 88-style digits + a control panel of 4 yellow buttons. Periodically fires a blue plasma splash projectile.
    - **Oven** (lv 3) — 40 hp · 22 dmg · tankiest non-boss. Chrome top with 4 control knobs, dark door with grill lines, twin amber pilot eyes, two stubby legs. Also fires the orange grease splash.
    - **Fridge** (boss, every 4th wave) — 90 hp · 28 dmg · 50px tall. White body with freezer compartment line, vertical handle, two angry red eyes, vent mouth. Has its own dedicated HP bar drawn above plus the boss-name caption "FRIDGE" in pixel-font.
  - **Pixel font**: 3×5 micro-glyphs hand-coded in `FONT` lookup table (alphanumerics + `!?.,:-+*/'` and space). Used for HUD captions on canvas (WAVE banner, FREE! pop, -X damage, REVENGE prompt).
  - **Liberated effect**: when a toaster takes an enemy out, its sprite ricochets up + diagonally with rotational velocity, slowly fades, and a pixel-heart floats above. A "FREE!" red caption pops over the body.
  - **Wave system**: 12 waves total. Each wave's roster is computed by `planWave(n)` — starts with mostly blenders, ramps to microwaves at wave 2+, ovens at wave 4+, and a Fridge boss every 4th wave. Wave done when queue empty + all enemies cleared. Win at wave 12.
  - **Aesthetic**: 320×180 internal canvas with `image-rendering: pixelated`, scanline overlay drawn each frame at 50% interlace (`rgba(0,0,0,0.18)` even rows). Tile-pattern backsplash (alternating `#1f2c4a`/`#3a4d6e`), counter floor with sparse bread crumbs, toast-brown counter edge stripe. Bungee title with triple-shadow drop (toast deep + revenge red + ink); Press Start 2P micro-labels; VT323 dialog body. Gold/red/cream palette throughout.
  - **Audio**: WebAudio synth — square charge tick, dual-blip pop on launch, noise+square hit, 4-note triangle liberation chime, sawtooth+noise hurt, dual-layer noise+sub revenge roar, 3-note wave fanfare, 5-note triangle win arp, descending sawtooth lose.
  - **Mobile**: bottom-fixed pad with ◀ ▶ + FIRE + RAGE buttons. The RAGE button is red with `pad-btn.revenge` styling so it reads as the special move.
  - **Accessibility**: rem units throughout, semantic main/header, role="application" + control-summary aria-label on canvas, aria-live on HUD, focus-visible outlines, 2.75rem min interactive targets, prefers-reduced-motion via canvas's static draw cycle (no CSS animations to gate).

## issues
- The microwave + oven ranged splash uses a small AABB hitbox that doesn't account for the toaster's irregular silhouette — feels OK but a more forgiving check would help.
- Boss Fridge currently lacks a unique attack (just contact damage at 28 dmg) — could add a launching ice cube or a magnet-pull that drags toasts off-course.
- Enemy melee on contact knocks them back +14 px which is mostly enough but rare double-stacks let two enemies pin the player.
- No wave-1 grace period — the first wave starts immediately on reset; a 2s pre-wave HUD countdown would be friendlier.
- The pixel font is intentionally 3×5 narrow; longer captions like "PRESS Q · REVENGE" are tight at 320 wide. Acceptable.

## todos
- Boss Fridge ice-cube projectile + a "magnet" pull effect.
- Charge-time tier indicator drawn on the toaster (small ring around the slot showing power level).
- Toast variants: rye (homing), bagel (piercing), pop-tart (fire damage over time), all unlocked by score thresholds.
- Liberated appliances trail a small flag with their name.
- LocalStorage best-score + farthest-wave persistence.
- Co-op mode via BroadcastChannel (second tab spawns a friendly Microwave that fires at the same enemies).
- Faction enemies: KitchenAid blender (boss-tier blender), espresso machine (rapid-fire steam), instant pot (suction).

## design-notes
The "burnt bread" framing was a gift — bread is a perfect ammo type because it's already brown / cube-shaped / pixel-friendly. The CHARRED variant ties damage to the same charge mechanic that determines visual blackness, so the player gets an immediate visual signal of full-power shots without a separate UI.

The revenge meter naming was deliberate: "COLD / WARMING / HOT / BURNING" maps to the toaster's own thermal narrative. Damage stokes it, full meter unlocks revenge — turning the player's frustration into a clear feedback loop. The 5s storm with i-frames is meant to be a "comeback button" so a near-death player has a real chance to clear a wave instead of just dying.

Pixel-art via canvas primitives (no sprite sheet) keeps the file fully self-contained — every appliance is drawn from rect/vline calls, so adding a new enemy is just a 30-line render branch + a stat block. The 320×180 internal canvas + CSS pixelated upscale gives the look without per-pixel sprite work.
