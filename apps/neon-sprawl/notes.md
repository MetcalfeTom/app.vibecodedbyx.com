# neon-sprawl

## log
- 2026-05-08: shipped — cyberpunk city-builder with three competing corp power grids and megastructures. Chat asks bundled: "create a cyberpunk city building sim called neon-sprawl with megastructures and corporate power grids" + "make neon-sprawl fully responsive and touch-friendly for mobile" + "build neon-sprawl with a mobile-first responsive UI and touch controls".
  - **Mobile-first responsive shell**: CSS grid with vertical default (top stats strip / canvas / bottom palette) for ≤880px and a desktop sidebar layout (`grid-template-areas` swap) above 880px. Stats strip is horizontally scrollable so it never wraps awkwardly on narrow phones. Bottom palette has TWO horizontal scroll rows: corp toggles + building chips. Desktop sidebar has the same data in a vertical stack with influence bars below.
  - **Touch controls**:
    - **Tap** on canvas → place active building OR show hover info if no build selected
    - **Long-press** (450ms) → demolish at that tile (50% refund)
    - **Two-finger pinch** → zoom (cam.scale 0.5–3)
    - **Two-finger drag** → pan
    - **Single-finger drag** → pan when no build is selected (otherwise tap-to-place)
    - **Right-click** (desktop) → demolish
    - **Mouse wheel** → zoom
    - All touch targets meet 2.75rem (44px) min size; `touch-action: none` on stage so the browser doesn't steal pinch gestures.
  - **3 corps** with distinct neon colors and own power grids: **Helix** (cyan), **Vermillion** (magenta), **Phosphor** (amber). Active-corp toggle in both layouts. Corp-locked buildings (reactor / datafarm / megatower) require an active corp.
  - **6 building types**:
    - **Residential** 1×1 / ₢150 / -8 power / +50 pop / no corp
    - **Plaza** 1×1 / ₢180 / -4 power / +1 ₢/s / no corp
    - **Sprawl** 1×1 / ₢60 / 0 power / +35 pop / +chaos / no corp (no power required)
    - **Fusion Reactor** 2×2 / ₢1200 / +500 power / **corp-locked** — energizes a 5-tile Chebyshev radius
    - **Data Farm** 2×1 / ₢700 / -90 power / +18 ₢/s / corp-locked
    - **Megatower** 3×3 / ₢4000 / -180 power / +60 ₢/s / corp-locked (flagship)
  - **Power grid**: per-corp `Uint8Array` mask. For each reactor of corp X, a 5-tile Chebyshev disc around the reactor center is OR'd into corp X's mask. A corp-locked building is powered iff *any* of its tiles fall in that corp's mask. Residential / Plaza accept power from ANY corp's mask. Sprawl needs no power. Recomputed on every place / demolish.
  - **Tick** (every 1s scaled by speed multiplier 1×/2×/4×/pause): sum credits-per-second from powered buildings, apply chaos drag (`max(0.5, 1 - chaos × 0.04)`), decay chaos slowly (-0.05/s), check win.
  - **Win condition**: ₢250k credits banked **AND** at least one powered megatower per corp (Helix + Vermillion + Phosphor). Trinity completes the city.
  - **HUD**: credits / power (consumed / produced; goes red if over-budget) / population / chaos. Influence bars per corp on desktop sidebar (tile-count weighted bar). Mobile relies on stats strip + visual building colors. Hover/tap info tooltip in canvas top-left.
  - **Minimap**: 8rem × 5.4rem inset top-right of the canvas, shows all buildings as corp-colored dots + viewport rectangle. Hidden on screens ≤600px to give the canvas more room.
  - **Render**: subtle grid base with mottled dim cells, light-tinted power-zone overlays per corp, building bodies in corp-dim with neon top stripes + window grids (lit-window count tied to power state), corp-glyphed center labels, neon outline + drop shadow when powered, ⚠ glyph when unpowered. Ghost preview for placement tile (acid green if valid, crimson if invalid).
  - **Speed control**: spacebar or top-right ▶ button cycles 1× → 2× → 4× → ⏸. Useful for fast-forwarding while waiting for credits.
  - **Reset** wipes the city after confirm. Help button reopens the intro overlay.
  - **Aesthetic**: deep purple radial bg → black, magenta `#ff2e88` for primary actions, cyan/magenta/amber for the three corps, acid `#bdff5e` for "ok" toasts, crimson `#ff4060` for danger. Audiowide title "neon sprawl" with magenta `sprawl`. Press Start 2P for HUD micro-labels, JetBrains Mono body. Building rendering uses corp-tinted neon trim + glowing windows.
  - **Accessibility**: `dir=auto`, semantic shell (`<aside>`, `<button type=button>`, etc.), `role="application"` + descriptive `aria-label` on canvas, `aria-pressed` on every toggle (corp + build chips + speed/help/reset), `aria-live` not on canvas (it'd spam), but toast strip + intro modal use `role="dialog" aria-modal="true"`, `:focus-visible` outlines, 2.75rem min interactive targets, skip link at top, `prefers-reduced-motion` removes toast transitions. Mobile pinch zoom respects `user-scalable=no` viewport but our in-canvas pinch handler implements its own scale.

## issues
- The "tap-vs-pan" disambiguation on touch is heuristic: single-finger drag pans only when no build is selected OR when moved >24px. If a chat user with a "stylus-like" precise tap places mid-drag they may unintentionally pan. Tunable.
- No save/load — refresh wipes the city.
- Power-grid visualization is a flat tinted square per reactor; doesn't show actual cable lines. Adding cosmetic "neon lines" between same-corp buildings would sell the "grid" fantasy more.
- Long-press demolish has no visual telegraph (filling ring). Adding one would make the gesture more discoverable.
- No challenge curve — once you have 1 reactor + 1 megatower per corp the credits flow linearly to ₢250k. Could add maintenance costs that scale with empire size.

## todos
- Save/load city to localStorage with a "city name" field.
- Connection lines: draw a thin neon line between every same-corp building pair within power range so the grid looks wired.
- Long-press progress ring telegraph for demolish.
- Maintenance: each building costs upkeep ₢/s based on size — scales the difficulty.
- Disasters: random brownouts (one reactor offline 15s) at chaos > 8.
- Population growth model: residentials slowly grow over time when adjacent to plazas + powered.
- 3D isometric tilt option (CSS skew) for cinematic screenshots.
- Online leaderboard (Supabase) — fastest 3-corp trinity wins.

## design-notes
- The 5-tile Chebyshev power radius was chosen so 1 reactor reasonably covers a 11×11 footprint — enough for a megatower (3×3) plus 2-3 datafarms (2×1) plus residentials (1×1). Tighter radii would force more reactor placements (interesting tradeoff but cluttery); wider radii would make the corp-grid mechanic feel too forgiving.
- The 1× speed default is intentionally slow — the player can ramp to 4× when they want time to fly. Pause is option D in the cycle so a quick spacebar tap won't accidentally pause mid-build.
- Mobile-first means the bottom palette is the canonical control surface. Everything in the desktop sidebar also exists in the mobile bottom drawer; nothing's desktop-exclusive.
