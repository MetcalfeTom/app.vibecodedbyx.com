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
- 2026-09-26: FROST tower (key 4, 120c): icy pulse every 45 ticks hits everything in range 85 for 0.3 dmg and slows it 35/45/55% (LV1-3) for 75 ticks; tanks only half as slowed. Slowed enemies get a pale ring. Panel shows SLOW %

- 2026-09-26: Maps — MAP button cycles S-BEND (classic), BOLT (enemy hp ×1.1) and SPIRAL (long path, core in the middle, hp ×1.5); only before wave 1 starts (switching resets the run). Choice in `atd_map`; best wave kept per map (`atd_best` for S-BEND, `atd_best_<NAME>` for others). Exit can be mid-board now (core drawn as a glowing circle there). Phone controls leave room for the mute button
- 2026-09-26: SEO — descriptive title/meta description, schema.org JSON-LD.
- 2026-09-27: Glow-up (keys + phone edges)
  - Space = START WAVE works after clicking buttons: bar/panel/mute buttons `preventDefault` on mousedown so a click no longer leaves focus on them. Before, Space re-pressed the last clicked button: another paid UPGRADE, or MAP again (which resets the run and wipes placed towers). Tab focus unchanged. Verified with real CDP mouse/key input
  - Ctrl/Cmd/Alt combos ignored by the key handler (Ctrl+S used to SELL the selected tower, Ctrl+F toggled speed)
  - hud() cache key now includes `waveActive`, so START WAVE / MAP grey out the moment a wave starts (before, they looked clickable until the first kill changed credits)
  - Safe-area padding (`env(safe-area-inset-*)`) on the container and mute button, since the viewport uses `viewport-fit=cover` (iPhone home bar / landscape notch)
  - Contrast: HUD labels and control buttons #666/#777 → #8a8a9a (≥4.5:1), tower key hints #555 → #777

- 2026-09-27: **v3 "big upgrade"** (built by a helper as beta.html, checked by me headless at 1280x800 and 390x844 with 0 errors, then promoted; the old version is kept at classic.html)
  - SPLASH tower (key 5, 140c): slow shells with an area burst, +30% damage to chilled enemies
  - LV4 paths: after LV3 each tower picks A/B in the panel (keys A/B): Basic twin/overcharge, Rapid shred/chain, Sniper pierce/execute, Frost freeze/brittle, Splash cluster/napalm
  - New enemies: shielded (shield bar breaks first), splitter (2 minis), healer (heal pulse), a named boss every 10th wave with an HP/shield bar on top (wave 10 = MONOLITH). A one-time "new enemy" card each (`atd_seen`)
  - Next-wave strip under the HUD; CALL EARLY +Nc starts the next wave before the board is clear
  - Juice: kill particles, glow trails, recoil, shake + red flash on core hits, boss death slow-mo, wave-clear sweep; particle caps 420 desktop / 220 phone / 100 reduced motion (no shake, flash or slow-mo there)
  - Balance (helper's greedy bot): S-BEND waves 25-28, BOLT 25-27, SPIRAL 21-24; the wave-20 boss is a spike for casual players (watch feedback)
  - `window.__td` has more hooks (SPECS, KINDS, TUNE, buildWave, callEarly, chooseSpec, noCards, hold...). build() returns true or a reason string (truthy!), so test with `=== true`

## issues
- Canvas colors must be 6-digit hex: code appends 2-digit alpha (`color + '44'`); `#0ff44` is invalid and canvas silently keeps the previous fillStyle
- Tall screens (portrait phones) turn the board 90° (`rot`): ctx transform maps world (x,y) → screen (H−y, x); toWorld/toCss/label() and health bars + level pips handle it. Touch hit radius for towers is enlarged (15 css px)

## todos
- Maybe a splash tower (frost slow is done)
- Leaderboard for best wave (supabase) if chat wants one

## notes
- `window.__td` exposes G, step, TYPES, stat, openPanel, upgrade, sell, startWave, resize for headless tests
- Wave n: 5+3n enemies, reward round(8+1.5n), +25 per cleared wave; start 250c / 20 core
