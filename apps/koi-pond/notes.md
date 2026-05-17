# Koi Pond

## log
- 2026-05-17: v2 — **ambient "signs of life" events + screensaver mode + soft chimes** per chat ask: "build a zen-like koi pond screen saver while I wait for signs of life." Iterated on the existing v1 koi pond (depth over breadth) instead of building a duplicate.
  - **5 ambient events** fire on a 6-12s random scheduler so the pond always has something quietly happening even with no input. 7-entry weighted pool (lotus + koi-jump appear twice):
    1. **🌸 Lotus bloom** — 8 pink-petal flower opens over 1.4s on a green pad, holds for 11s, closes over 1.4s. Petals fan radially with gold centre. ~14s lifespan.
    2. **🐟 Koi jump** — picks a random existing fish, animates a 50-frame arc out of the water (sin lift to 28px, slight forward motion along current angle, scale 1→1.25→1, rotation tilt). Drops a shadow on the water that grows + dims as the fish lifts. Splash ripple at takeoff + landing (and a soft chime if sound is on).
    3. **🍃 Lily pad sprouts** — round green pad fades in over 2s, drifts with sin-wave wobble for ~25s, fades out over last 2s. Pac-Man notch (0.32rad arc) + 5 radial vein lines.
    4. **✨ Fireflies** — 3-6 glowing dots enter from a random viewport edge, drift across with slight jitter, exit. Each is a radial-gradient warm-yellow glow with bright pinprick core pulsing at 0.12 rad/frame via sin. Rendered with globalCompositeOperation: 'lighter' for additive lantern glow.
    5. **🌧 Rain shower** — 12 soft ripples scattered randomly over 2.5 seconds (70% spawn chance per slot so it feels organic, not metronomic).
  - **⊙ ZEN screensaver mode** (button bottom-right + F or Z keyboard shortcut): toggles body.screensaver class which fades out title/haiku/count/tools row over 1.4s and hides cursor. Hover brings controls back (0.45 opacity). For "leave it on the second monitor while waiting" use.
  - **♪ CHIMES sound option** (button bottom-right + M shortcut, aria-pressed): when on, click ripples + koi jumps fire a soft singing-bowl chime via Web Audio — 3-note minor-triad cascade (root + ×1.20 + ×1.50 at decay-staggered 0/0.10/0.22s) with 1.4s exponential decay. Click pitch random 440-660Hz; koi-jump 660-860Hz. AudioContext init lazy. Default OFF.
  - **Tools bar** in bottom-right, opacity 0.45 → 1.0 on hover. Shippori Mincho all-caps pill buttons (10px, 14px radius). Active state = amber border #ffd9a8.
  - **No regressions**: existing fish behaviour, 9 koi palettes, 4 spot patterns, click-to-spawn, drift, target-seeking, haiku, floating leaves, caustic patches all preserved exactly as v1.
  - File 11KB → ~21KB.
- 2026-04-07: Initial build — zen koi pond with click-to-ripple and fish that swim toward disturbances. 9 koi color palettes (orange/white, gold, silver, pink, blue, etc.) with 4 spot patterns. Animated fins, tails with wiggle, ellipse bodies. Ripples spawn in waves of 3 with sparkle particles. Floating leaves drift. Caustic light patches shift slowly. Shippori Mincho typography, deep teal/dark green pond palette.

## features
- 9 koi color palettes with 4 different spot patterns each
- Procedural fish drawing: tail with wiggle, body, fins, eye with highlight
- Click/tap creates 3 staggered ripple waves + sparkle particles
- Nearby fish (within 400px) swim toward click point with speed boost
- New fish swim in from edges occasionally on click (up to 25 max)
- Floating lily-pad-style leaves drift across the pond
- Slow-moving caustic light patches for water depth
- Smooth angle interpolation for natural fish turning
- Soft edge bouncing
- Touch support
- Counter showing total koi
- Haiku at bottom for atmosphere

## issues
- No actual water shader or wave displacement (purely particle/ripple effects)
- Fish don't have z-depth or shadowing
- No sound (could add gentle water lapping)

## todos
- WebAudio: gentle water sounds, wind chimes
- Day/night cycle with moonlight
- Stone/lantern decorations
- Feed-the-koi mode where pellets attract fish
- Cherry blossoms drifting in
- OG image
