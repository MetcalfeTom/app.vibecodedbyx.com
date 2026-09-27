# Abstract Tower Defense

## log
- 2026-09-27: **v3.3 daily challenge** (built in scratch, probed headless at 1280x800, 390x844 and 375x667, 0 errors)
  - `makeDaily(day)`: FNV hash of 'atd'+UTC date seeds one of the 5 maps and one of 8 TWISTS (GOLD RUSH, GLASS CORE, SWARM, HASTE, SCRAPYARD, NO SNIPERS, DUO, OVERTIME), so everyone gets the same challenge that day. A twist is a partial `MOD` over `NOMOD` {start, core, hp, speed, count, reward, clear, cost, costOf{type}, ban[]}; DUO bans all but a seeded pair (always includes a workable one: basic+frost/splash/sniper or rapid+sniper) and starts with 300c
  - `MOD` is wired into fresh() (credits/core), hpBase, mkEnemy speed/reward, buildWave count, the clear bonus, and `costOf(type)` everywhere a tower price is used (build, canPlace, upCost, tower bar). Banned tower buttons are disabled with OFF; pickType/canPlace refuse them
  - Map picker: a gold DAILY card first (today's map drawing, twist, your best today, time until the next one); `curCard()` = 0 when playing the daily, mapIdx+1 otherwise. `setMap(i, d)` with a daily sets `daily`, never writes `atd_map`. HUD map label says DAILY. A gold dot on MAP until you open today's daily (`atd_dseen`)
  - Game over on a daily shows COPY TODAY'S RESULT: day, twist, map, wave, a 10-block bar (1 block per 3 waves) and the app link, for pasting anywhere
  - World board: scores go to `atd_scores` with map `'D' + date` (e.g. D2026-09-27), best in `atd_best_D<date>`, posted best `atd_posted_D<date>`. The board has a DAILY tab (today's). REINITIALIZE after midnight UTC rolls to the new day's challenge
  - Balance with the greedy bot (4 strategies, all maps): most twists land within ±3 waves of the map's normal; SWARM is ~+3 easier, GOLD RUSH/OVERTIME ~−1 to −3, DUO rapid+sniper hardest (8-14). Cut: rapid+splash and splash+sniper DUO pairs (bot died at wave 3-5: nothing cheap to open with), rapid+frost (7-11); GLASS CORE went 5→8 core (SPIRAL leaks early)
- 2026-09-27: **v3.2 new maps + map picker** (built in scratch, tested headless at 1280x800 and 390x844 portrait/rotated, 0 errors)
  - FORK (hp ×1.1): two entrances (top/bottom left) whose lanes merge at (480,250), then a short chicane to the core on the right edge. Spawns alternate lanes (`G.spawnN`), so a branch-only tower sees half the enemies; the pocket between the branches (~380,250) sees both
  - CROSS (hp ×1.4): one long path (1960) that crosses itself at (400,250): first pass horizontal, second vertical; the closed lobe top-right and the four crossing quadrants hit enemies on both passes
  - Engine: a map is `path` or `paths` (lanes, same length so "first" targeting stays fair, shared end). `LANES[i] = {pts, segs, len}`, `pointAt(d, lane)`, enemies carry `e.lane` (splitter minis / broodmother drones inherit it), `SEGS` = all lanes (build check), path drawn as ONE stroke with a subpath per lane (shared/crossing stretches don't double their alpha). Entrance chevrons on every map
  - MAP (before wave 1) opens a picker: a card per map with a mini drawing (turned like the board on tall screens, one row per map there), tag from hp (<1.05 NORMAL, <1.45 HARD, else BRUTAL), blurb, your best. Arrows/Home/End move, Enter picks, Esc/BACK/backdrop close, Tab trapped, aria-label per card, aria-current on the playing map. Picking the playing map just closes (no reset). Focus goes back to MAP only if opened by keyboard (mouse: blur, so Space stays START WAVE)
  - New maps append at the END of MAPS (atd_map stores the index); bests `atd_best_FORK` / `atd_best_CROSS`; world board posts/filters them by name like the others (5 tabs fit one row at 390px)
  - `.board` width min(360px, 100%) (92vw poked 4px out of the overlay on 390px phones → sideways scrollbar). Version stamp v3.2 next to the title. Meta/JSON-LD say five maps
  - Balance (my greedy bot, 5 strategies, `window.__td.MAPS[i].hp` editable live): S-BEND 19-22, BOLT 13-20, SPIRAL 10-20, FORK@1.1 19-24, CROSS@1.4 19-21. My bot is ~5 waves weaker than the v3 helper's (S-BEND 25-28), so a strong bot should land ~24-27. FORK has a cliff: at hp 1.2+ half the strategies die at the wave-10 boss, and early waves leak when the first towers sit on one branch
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
- 2026-09-27: **v3.1 world board** — supabase table `atd_scores` (map, wave, kills, towers, secs, name, user_id; default RLS). Game over (3+ waves, beating your own posted best on that map, localStorage `atd_posted_<MAP>`) posts the run: Twitch users post under their Twitch name, anonymous players type a callsign once (`atd_name`, cleaned to `[\w .-]`, 16 chars). The game-over panel shows the map's top 10 (one row per player, best first) plus your rank; HUD **WORLD** (🏆 on phones) shows the map record and opens the board with map tabs (the game pauses while it's open, `boardOpen`). `G.steps` counts sim ticks; rows need wave ≤ secs/4 + 3 (a maxed bot calling every wave early needs ~11 s/wave by wave 10). Tests stub the db with `window.__atdDb` (gaunt/atdboard_test.py); never post real rows from tests.

## issues
- Canvas colors must be 6-digit hex: code appends 2-digit alpha (`color + '44'`); `#0ff44` is invalid and canvas silently keeps the previous fillStyle
- Multi-lane maps: every lane in `paths` must have the SAME length (targeting compares `e.d` across lanes) and they share the last point (core). Anything that needs a position on the path must pass the enemy's lane: `pointAt(d, e.lane)`
- Tall screens (portrait phones) turn the board 90° (`rot`): ctx transform maps world (x,y) → screen (H−y, x); toWorld/toCss/label() and health bars + level pips handle it. Touch hit radius for towers is enlarged (15 css px)

## todos
- (splash tower shipped; watch the wave-20 boss for casual players)
- watch FORK early waves with real players (two entrances confuse new players; hp 1.1 kept gentle on purpose)
- more daily twists (no upgrades? fog?)

## notes
- `window.__td` exposes G, step, TYPES, stat, openPanel, upgrade, sell, startWave, resize for headless tests
- Wave n: 5+3n enemies, reward round(8+1.5n), +25 per cleared wave; start 250c / 20 core
