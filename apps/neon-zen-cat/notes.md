# neon-zen-cat

## log
- 2026-05-30: initial build. **Midnight zen garden dominated by a massive carved stone cat** (sphinx pose, center of screen) watching over a rakeable sand area where every line glows neon. Distinct from existing `/zen-garden` (cherry blossoms + pond + moonlit calm) — this one is moody synthwave temple energy.
  - **The cat** — drawn entirely in Canvas2D from primitives that scale with viewport. Sphinx-pose body = rounded trapezoid + linear gradient (#48424f → #1a1620), 2 front paws extending forward with toe-dividers, pentagonal head with two ears + inner-ear shadows + crack lines + jaw curve, subtle nose + mouth + sparse whiskers. Drop-shadow ellipse beneath on the sand. Procedurally-placed fractures across body/head sell the carved-stone surface.
  - **Glowing eyes** — vertical-slit cat-pupils inside cyan irises with `shadowBlur` halo (16-34px depending on purr level). Eyes track the cursor with a subtle (`eyeR * 0.55`) offset clamped inside the iris. Auto-blink every ~5-7s + manual "blink" button (`B` key). Iris hue shifts from cyan toward green as the purr meter rises (165→185 deg HSL).
  - **Purr meter** — accumulates from recent rake strokes (count in last 8s) + a small bonus from stones. Smoothly lerps toward target (0.02/frame). Drives: eye glow strength, iris hue shift, AND a soft radial cyan aura behind the cat that fades in at >5% purr. Petting button (♥ key P) gives an instant +25% boost.
  - **Neon raked sand** — each stroke is a 5-tine polyline (perpendicular offsets ±10px). Drawn twice per tine: outer 4px low-α with 14px shadowBlur for the neon halo, inner 1.4px crisp line using `lightenColor(c, 0.4)` for the bright core. 5 color swatches (cyan #3effc9 / magenta #ff5dc4 / amber #ffd066 / violet #a26dff / crimson #ff5d6c) — each picks the stroke color, full glow chromatically separate. Slow fade over time (down to 45% alpha) so the garden feels lived-in rather than overdrawn.
  - **Stones** — click in sand to place. Procedural irregular polygon (8-12 vertices with ±0.4 jitter on radius), radial-gradient shading, shadow ellipse. Stones physically curve rake lines around them: every rake point is pushed out of any stone-radius+4 via `adjustForStones(x, y)` before being added to the polyline. Smooth/erase tool removes both strokes and stones within radius.
  - **Atmosphere** — deep indigo void radial gradient (#0a0218 → #02000a). 110 subtle twinkling stars (top 55% only, varying sine speed × phase). 60 drifting motes (mostly cyan hue, some magenta/amber) with shadowBlur glow, slow upward drift with wraparound. Stage CSS adds corner-radial cyan + magenta tints and center-vignette. Subtle deterministic sand grain (`sandSeed(i, k)` returns reproducible noise so it doesn't shimmer per-frame).
  - **3 tools** via keys 1-3 — ⟂ rake / ◌ stone / ⌫ smooth. Color picker swatches with `aria-pressed` and scale-up + ring on selection. Action buttons: ✕ smooth all (clear rake), ✕ clear stones, ◑ blink, ♥ pet.
  - **Ambient koan rotation** — italic cream koan in top-right corner cycles every 18s with 1.2s fade transition. 10 hand-written koans ("the cat does not move. the sand remembers everything." / "the void is not empty. it is full of waiting cats.").
  - **Stats** — strokes count, stones count, purr % (live).
  - **Aesthetic** — kanji 神猫 (god-cat) in cyan with phosphor text-shadow + Major Mono Display lowercase "stone cat · garden" subtitle (magenta middle-dot) + Cormorant italic tagline. Shippori Mincho body. Buttons use Major Mono Display, transparent-bg with neon-cyan border + glow on hover, active state inverted (cyan bg + dark text).
  - **A11y**: rem-everywhere, semantic markup (`<main>`/`<header>`/`<section>`/`<nav>`/`<h1>` + `<button type=button>`), role=application + aria-label on canvas, aria-pressed on tools + swatches, role=status aria-live on stats + sr-only announcer for tool changes, focus-visible 2px magenta outline, 2.75rem touch targets, prefers-reduced-motion kills koan transition (lines themselves are essential to the app so kept).
  - **Mobile** @640px: smaller header padding, smaller koan + label, smaller buttons.
  - Single self-contained ~36KB HTML. No deps.

## issues
- The cat's eye-tracking is constrained to within the iris which means extreme cursor positions don't visibly change the look — by design (over-rotation looks goofy on a stone statue)
- Many rake strokes can compound shadow-blur cost; capped at 1 fade pass per frame but heavy use on weak GPUs may dip below 60fps
- Tool=stone clicks on existing stones are silently ignored; could add visual feedback or auto-pick-up-and-drag

## todos
- Drag stones to reposition (would require routing existing rake lines)
- A "moonlight" tool that drops a small bright glowing orb that slowly orbits the cat
- Save garden snapshots to PNG (canvas.toBlob)
- Ambient drone audio toggle (already have chord recipes in other apps)
- Cat blinks slowly increase if you pet it many times
- Mode toggle: stark/neon vs warm/incense aesthetic
