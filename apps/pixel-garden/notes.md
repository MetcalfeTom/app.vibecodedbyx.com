# pixel-garden

## log
- 2026-05-31: initial build. **Neon pixel-art gardening mini-game** with water + data-fertilizer as dual resources, 6 unlockable flower species, persistent coins economy. Single self-contained ~38KB HTML. Distinct from /neon-garden, /neon-bonsai-garden, /neon-flower (those are decorative/zen — this is a tight click-to-grow game loop).
  - **Grid**: 6×4 = 24 plots, rendered on a HiDPI canvas with `image-rendering: pixelated`. Tile size auto-fits container. Each plot has independent state: stage (0-5), species (0-5), moisture (0-100), data (0-100), progress (sec in current stage), wilt (0-100), bornAt.
  - **Stages**: empty → seed → sprout → bud → bloom → wilted. Growth-stage thresholds in seconds: seed→sprout = 4s, sprout→bud = 6s (now needs data too), bud→bloom = 8s. Total time-to-bloom = ~18s under good conditions.
  - **Dual resources** with bar meters in the header:
    - **water (💧)**: each spray costs 6, refills +30 moisture per tile, passive regen +4/s up to 100. Bar pulses red when <30.
    - **data (◆)**: each sprinkle costs 8, refills +30 data per tile, same regen. Bar pulses pink when <30.
    Both also drain from plants at 8/s (moisture) and 6/s (data). Plants need moisture >28 AND (data >25 from stage 2+) to grow. Both low for too long → wilt accumulates 8/s; once wilt >100, plant dies (stage=5).
  - **6 species** (rainbow neon palette + escalating sell price + unlock cost):
    1. **GLOW** cyan #5effff — free unlock, sells 1◆, free to plant
    2. **MAGENTA** #ff5dc4 — unlock 10◆, sells 2◆
    3. **LIME** #8cff5e — unlock 28◆, sells 3◆
    4. **VIOLET** #a26dff — unlock 60◆, sells 4◆
    5. **AMBER** #ffaa3a — unlock 120◆, sells 6◆
    6. **ROSE** #ff5d8a — unlock 220◆, sells 9◆
    Non-free species cost 1◆ per plant. Steady progression: GLOW→MAGENTA→LIME→...
  - **5 tools** with keyboard 1-5: ⌇ seed, 💧 water, ◆ data, ✦ harvest, ✕ uproot. Each tool has a distinct color (lime/blue/pink/gold/rose) with matching box-shadow, active state inverted. Drag-apply works for water + data (110ms throttle) so you can sweep multiple plots in one stroke.
  - **Procedural pixel-flower rendering**: each stage gets a unique sprite drawn from raw pixel rects (no images). Sprout = stem + 2 leaves. Bud = taller stem + closed bud with color hint inside. **Bloom** = animated swaying stem (sin per row, sway amplitude × s/totalH gives natural arc) + radial-petal flower head (sp.petals count varies 5-10 per species) with bright cream core + species-color pip + slow rotation (sin(now/1200+id)) + drop-shadow halo (shadowBlur 14 + species glow). Wilted = drooped brown stem.
  - **Particle FX**:
    - Water spray on water tool: 6 cyan drops with downward gravity
    - Data drop on data tool: 4 falling glyph-text particles ("◆", "01", "0x", "✦"...) in magenta/violet
    - Harvest burst: 14 species-colored sparks in radial pattern + floating "+N◆" gold text rising
    - Bloom sparkles: every 6 frames, 30% chance for a small sparkle near the flower head
  - **Wet/data tile sheens**: plots with moisture>30 get a cyan tint overlay; data>30 adds magenta tint. Visible feedback that the resources are in place.
  - **Hover outline**: live tile cursor in current tool's color with shadowBlur glow.
  - **Persistence**: full state to `pixel_garden_v1` localStorage (debounced 400ms). Survives reloads. Plots + resources + coins + unlocks + active seed.
  - **Day cycle**: every 30s real-time = 1 day (cosmetic counter in the almanac panel).
  - **Sidebar**: seed packets grid (click to select OR pay-to-unlock locked ones with current coins, with toast feedback), almanac stats (blooms grown / harvested / wilted / day), how-to-grow legend with keyboard ref.
  - **Audio-free** — purely visual+haptic feedback through CSS toasts (color-coded good/bad/coin) + sr-live announcements.
  - **Aesthetic**: dark void bg with cyan + magenta corner radials, Press Start 2P 3D-shadowed title (rose+violet offsets), Silkscreen for tool buttons + species names, DotGothic16 body + tag, JetBrains Mono for numerals. Chunky 2-3px ink-bordered tool buttons with hard 3px offset shadow + press-into-shadow on click. CRT scanlines via repeating-linear-gradient.
  - **Keyboard**: 1-5 tools, SPACE = spray-water-all (stops when water runs out), Tab/R = cycle through unlocked seeds.
  - **A11y per directive**: rem-everywhere, semantic markup (`<main>`/`<header>`/`<section>`/`<aside>`/`<nav>` + `<button type=button>`), role=application + descriptive aria-label on canvas, aria-pressed on every tool, role=status + aria-live on HUD + toast + sr-only announcer, seed cards role=button + tabindex=0 + Enter/Space handlers, focus-visible 3px rose outline, 2.75rem touch targets, prefers-reduced-motion kills meter-pulse + scanlines.
  - **Mobile** @540px: padded down, smaller tool buttons.

## issues
- 24-plot grid can fit comfortably on desktop but feels crowded on phones — TILE auto-sizes to viewport so it's playable, but the sprites get a bit small
- Currently no way to fast-forward time; players must wait ~18s per flower (intentional but might want a "speed up" power-up later)
- Resource regen at 4/s means you're rarely truly out — could tighten difficulty by lowering regen or adding higher-tier flowers that drink faster
- No actual sound (DotGothic16 + Silkscreen feel chunky-arcade enough without it for now)

## todos
- Sound effects: water splash, data chirp, bloom chime
- "Seasons" mode: cycle through day/dusk/night palettes every N days
- Pests that target wilting flowers (need to click to swat)
- Compost: uproot a wilted plant → +1 data resource
- Synthesis: combine two harvested species into hybrid (RGB-mix sprite)
- Supabase global leaderboard for total blooms harvested
- Achievement toasts (first bloom, full garden, etc)
