# waddling-penguin-sim · notes

## log
- 2026-05-17: v1 — **top-down ice-rink sandbox where a penguin waddles with slippery physics and slap-attacks objects with a fish in its flipper** per chat ask: "build a waddling-penguin-simulator with slippery physics and a fish-slap mechanic." Single file ~32KB. Full-viewport canvas, localStorage best-score persistence.
  - **Slippery ice physics**: penguin acceleration = 380 u/s² on WASD/arrow press. Per-frame friction `0.985^(dt*60)` = very gentle damping (≈3%/sec drift loss), so the penguin keeps sliding long after you release keys. Hold **Shift** to brake (`0.92^(dt*60)` instead — sharp stop). Max self-propelled speed 220 u/s, but slap-knockback can punt you faster. Below 0.5 u/s velocity snaps to 0 to prevent jitter. Wall bounces preserve 40% energy for satisfying corner caroms.
  - **Waddle animation**: body rotates ±8° via `sin(waddlePhase) × clamp(speed × 0.0008, 0, 0.14)` — at full speed (220 u/s) you tilt about ±10°. Flippers wave at 2× phase via `sin(phase × 2) × 0.10`. Phase advances at `4 + speed × 0.05` rad/s so faster waddle = faster sway. Ice trail dots drop every 60ms while moving > 30 u/s (cap 80 dots, fade over 1.25s).
  - **Fish-slap mechanic** — the chat's headline ask:
    - **Trigger**: Space / click / tap on canvas / on-screen "🐟 SLAP" button (mobile-only via media query).
    - **Facing**: snaps to mouse direction (desktop hover), OR to current velocity direction (when fast-moving / touch). Locks for the duration of the swing.
    - **Animation**: 280ms total. Fish swings in an arc from `facing - SLAP_ARC*0.7` → `facing + SLAP_ARC*0.7` (≈ ±110°). The fish *extends* outward 28 → 66px via `28 + sin(sweepT × π) × 38` so the slap visually reaches further at peak. During 0.40 → 0.80 of the swing, a 5-trail amber motion-blur swoosh renders behind the fish — peak slap looks like a real WHACK.
    - **Hit window**: 0.45 → 0.85 of slap duration. Hit-test = each object within `SLAP_REACH + obj.r` (≈ 70-86px) and within `SLAP_ARC` (≈ ±55°) of facing direction.
    - **Knockback**: hit objects get `+(420-640) px/s` velocity in the slap direction + random spin ±16 rad/s. They rocket across the ice and bounce off walls.
    - **Scoring**: object value × combo multiplier (`1 + floor(combo / 2)`). Combo +1 per hit (cap 10), decays after 2.2s of no hit. Combo card flips red + pulses (`bump` keyframe) at combo ≥4.
    - **Slap spam guard**: in-flight slaps can't be re-triggered (no spam-pressing).
  - **4 ice-rink objects** with weighted random spawn (every 1.4s, cap 14 active):
    - ⚪ **Snowball** (w=50, value 5, 14px) — white circle with thin blue ring + 2 speckles
    - 🟦 **Ice cube** (w=28, value 10, 16px) — light-blue rounded square with frosty highlight bar
    - 🟠 **Tiny fish** (w=16, value 25, 14px) — orange oval body + tail triangle + black eye
    - 🐧 **Pal penguin** (w=6, value 40, 18px) — mini black penguin with white belly + amber beak + tiny eye dots
    - Each object: drifts in from random viewport edge with 18-48 u/s initial velocity, gentle 0.99 friction, ±2 rad/s initial spin with friction decay, wall-bounces at 60% energy.
  - **Object physics**: penguin collision push-out moves overlap apart, transfers 60% of penguin velocity along normal to the object (so just bumping a snowball nudges it).
  - **Penguin sprite** (top-down): drawn from primitives — black body oval (`#1a2540`), white belly oval (`#fff8e8`), 2 white sclera circles with black pupils, amber beak triangle, 2 amber teardrop feet peeking past body bottom, 2 dark flippers on sides (curved out with rotation + wave). Soft elliptical ground shadow.
  - **Held fish** drawn outside the penguin in the facing direction at 28px rest distance. Orange `#ffc066` ellipse body + triangle tail + black eye + white shine highlight. Rotates with facing angle.
  - **HUD** (top-right, 3 stacked cards on glass-blur white): score (pink Bungee), combo (amber → red+pulse at ≥4), best (cyan). Header centred above with "waddling penguin simulator" in Bungee with 3px pink offset shadow.
  - **Controls**:
    - **WASD** / **arrow keys** — waddle
    - **Shift** — brake (high friction)
    - **Space** / **click on canvas** — fish-slap
    - **Mouse hover** — aim slap direction
    - **Mobile**: 7rem touch joystick bottom-left (drag the stick to set velocity vector, 42px max radius) + 6rem pink "🐟 SLAP" button bottom-right. Both auto-show via `@media (hover: none) and (pointer: coarse)`.
  - **Atmospheric extras**:
    - 70 falling snowflakes (1-3px radial dots with twinkling opacity sin wave, drift 10-30 u/s vertical + ±4 u/s horizontal, viewport-wrap)
    - 6 faint ice-crack lines drawn as poly-lines on the background each frame
    - Sliding ice trails behind the penguin (fading dots)
    - 8-particle ring burst at every hit, coloured by the object's ring colour
    - Floating `+N` score numbers in Bungee per hit (pink default, red at combo ≥4)
  - **Audio** (lazy `ensureAudio()` on first interaction, mutable via 🔊/🔇 toolbar toggle):
    - `sndSlapStart` — 2200Hz noise burst + 420Hz triangle blip
    - `sndSlapHit(combo)` — bandpass noise 380Hz + combo-scaled square punch (140 + combo×30Hz) + sub sine + combo arpeggio at combo ≥3
    - `sndSlapWhiff` — soft noise + low 180Hz sine
  - **Sandbox mode** (no timer): score accumulates persistently in-session. Best score saved to `localStorage['waddling-penguin-v1']` alongside mute preference. Reset button wipes session score + objects + recenters penguin + spawns 6 fresh objects.
  - **Aesthetic**: pastel pale-blue ice palette (#e3f2ff → #c8e3ff) with 3 radial accent glows (pink top-left + lime top-right + cyan bottom-right). Title in Bungee with 3-layer drop shadow (pink offset + black ambient). Caveat italic tagline. Glass HUD cards with backdrop-blur. Chunky white-pill buttons with cyan/pink hard-offset shadows + active snap.
  - **WCAG**: rem units, semantic main/canvas with `aria-label` describing controls, `aria-live="polite"` on score + toast (via implicit role=status), `aria-pressed` on mute button, `:focus-visible` 3px pink outline 3px offset, ≥44px (2.75rem) min-height on all buttons, `overscroll-behavior: none` on body/html so swipes don't pull-to-refresh, `touch-action: none` on canvas + joystick, `prefers-reduced-motion` kills all transitions + hover transforms (game still plays).
  - **OG image**: Pollinations flux seed 80808.

## issues
- The penguin's "facing" auto-snaps to velocity direction when moving fast — feels right but can be unexpected if you're trying to slap behind you while still drifting. Workaround: brake first, then slap.
- Mouse-aim only works when hovering inside the viewport; if cursor leaves the page the last position sticks. Touch users rely on velocity-direction snap which feels good once you adapt.
- The joystick uses pointer events but on iOS Safari sometimes the first touchdown doesn't register `pointerdown` cleanly — second-touch works fine. Acceptable for v1.
- Pal penguins (40-pt) are the rarest spawn but they don't visually react when slapped beyond the standard knockback + particle burst. Could add a "wak!" floating text or a hop animation.
- No timer / no end state — pure sandbox. Some players want a goal; could add a 60s mode toggle.
- Wall bounce at 40% energy on the penguin means sliding into a corner-pocket while at speed can hold you wedged briefly. Acceptable physics quirk.
- Combo decay is 2.2s — generous. At max spawn rate (every 1.4s) you can easily hold ×10. Could tune later.

## todos
- 60-second arcade mode with timer overlay + post-round leaderboard
- Different fish: trout (longer slap reach), herring (multi-target arc), salmon (knockback ×2)
- Penguin colour customisation (king / emperor / chinstrap palettes)
- Sliding belly mode: press X to dive-belly-slide (huge speed boost + invincibility frames + can't slap)
- Igloo doorway target — knock objects through it for combo bonus
- "Hockey" mode: 2 nets at opposite ends, score by slapping fish into either
- Twitch chat integration: each chat message spawns a snowball at a random edge with the chatter's username
- Multiplayer 2-player co-op (Supabase Realtime broadcast) — both penguins on the same rink
- Mobile haptics on slap hit (navigator.vibrate)
- Random "fish stream" event every ~30s where 10 fish slide across the rink at high speed
- Background music: ambient drone with slap-synced cymbal-y hits
