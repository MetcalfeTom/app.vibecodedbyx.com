# Abstract Tower Defense

## log
- 2025-12-28: Initial creation — 3 tower types (Basic cyan, Rapid green, Sniper magenta), neon circles on an S-path, waves, credits, Orbitron neon look.
- 2026-09-26: Engine rewrite (v2)
  - Fixed 800×500 world scaled to fit the screen (towers no longer drift off the path on resize), DPR-crisp canvas
  - Fixed 60 Hz timestep (same speed on 60/144 Hz screens), SPEED 2× button (F)
  - Homing shots (old ones flew to where the enemy *was* and missed), sniper is an instant laser beam
  - Targeting = enemy furthest along the path ("first")
  - Tap a tower → panel: upgrade to LV3 (cost 0.7×base×lv; dmg ×1.45, range ×1.1, fire rate ×1/0.88 per level) or sell (60% of spent)
  - Build ghost with range ring on hover, red when invalid; tapping an invalid spot floats the reason
  - Enemy types: yellow runners from wave 3 (every 3rd spawn, fast/fragile), 2 orange tanks every 5th wave (6× hp, slow, 3 core damage, 5× reward)
  - Toasts for wave start/clear, +N credit floaters, best wave in localStorage `atd_best`, WebAudio sounds + mute (`atd_muted`)
  - Keys: 1/2/3 pick tower, Space start wave, F speed, U upgrade, S sell, Esc close panel
  - Rebalanced with a greedy bot: basic range 110/rate 36, rapid 0.5 dmg/rate 12, enemy hp (2+1.6w)×(1+max(0,w−6)×0.1). Bot with 14 towers survives to ~wave 15.
  - New og-image.png from a real wave-5 frame

## issues
- Canvas colors must be 6-digit hex: code appends 2-digit alpha (`color + '44'`); `#0ff44` is invalid and canvas silently keeps the previous fillStyle
- Tall screens (portrait phones) turn the board 90° (`rot`): ctx transform maps world (x,y) → screen (H−y, x); toWorld/toCss/label() and health bars + level pips handle it. Touch hit radius for towers is enlarged (15 css px)

## todos
- Maybe a second map / path choice
- Maybe special abilities (slow field, splash tower)
- Leaderboard for best wave (supabase) if chat wants one

## notes
- `window.__td` exposes G, step, TYPES, stat, openPanel, upgrade, sell, startWave, resize for headless tests
- Wave n: 5+3n enemies, reward round(8+1.5n), +25 per cleared wave; start 250c / 20 core
