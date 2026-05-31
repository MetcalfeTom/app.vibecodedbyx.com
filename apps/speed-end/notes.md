# speed-end · notes

## log
- 2026-05-20: v1 — **inverted-survival speedrun: drain HP to zero as fast as possible** with global leaderboard, per chat ask "create a game called Speed-End where you must navigate a gauntlet of hazards to lose all your health as fast as possible, include spikes, lasers, and a global leaderboard for the fastest deaths". Single-file ~36KB, Canvas2D 900×540, Supabase-backed leaderboard, anonymous auth.
  - **Core loop** · player spawns at arena center with 100 HP. Move with WASD/arrows to crash INTO hazards. Each hit deducts HP and grants 350ms of invincibility (iframes). DOTs (lava, poison) bypass iframes. HP reaches 0 → game over with rank + time + leaderboard submission.
  - **7 hazard types** procedurally placed (avoiding 70u-radius spawn safe-zone):
    - **Spikes** (14×) · static 8-point steel stars, 8 dmg contact
    - **Saws** (5×) · rotating 12-tooth gears (6-10 rad/s), 15 dmg contact
    - **Lava pools** (4×) · radial-gradient orange-yellow, 5 dmg every 200ms DOT, ignores iframes
    - **Lasers** (3×) · turret with sweeping barrel, 600ms charge telegraph (dashed red line) → 1.2s firing beam (white-cored red), 20 dmg per beam-segment hit
    - **Crushers** (3×) · ceiling-mounted blocks on dashed-line tracks that slam down vertically with `Math.pow(t, 2.4)` easing, 30 dmg only during the slam phase
    - **Bombs** (3×) · stationary, walk into 22u proximity ring → 420ms fuse with spark + expanding warning ring → 60u blast radius, 35 dmg. After detonation, bomb becomes a small residual lava patch (6 dmg DOT).
    - **Poison clouds** (2×) · 36u radial puff with wispy outer orbiters, 3 dmg every 300ms DOT, ignores iframes
  - **Death Wish mode** · toggle button (or `D` key) disables iframes entirely AND doubles DOT damage. Separate personal-best + leaderboard filter (`safe` vs `dw`). Ranks compete in separate buckets via filter chips.
  - **Ranking** — by time elapsed:
    - **S** < 4.00s (gold, glowing)
    - **A** < 6.00s (green)
    - **B** < 9.00s (blue)
    - **C** < 14.00s (pink)
    - **F** ≥ 14.00s (grey)
  - **Global leaderboard** · new Supabase table `speedend_deaths` (columns: `time_ms`, `handle`, `rank`, `death_wish`, auto `user_id` + timestamps, indexed on `time_ms`). Default RLS: anyone reads, only-owner writes. Anonymous auth via `signInAnonymously()` so any visitor can submit. Sidebar shows top 50 sorted by `time_ms ASC` with 3-way filter (ALL / SAFE / DW). Gold/silver/bronze positions for top 3. Your own submissions get a blood-red left border. ⚠ icon flags DW-mode entries. Auto-refresh every 30s.
  - **Submit flow** · death overlay shows rank + time + delta to personal best (in green if new PB, red if worse) + input field for `@handle` (persists to localStorage) + Submit button. Handle is required; submission deduplicates by `user_id` (one row per anonymous browser session). After submit, leaderboard refreshes and your entry appears highlighted.
  - **HUD** · top bar with:
    - "SPEED-END" title in Press Start 2P, blood-red with shadow
    - HP bar (gradient blood-red → warn-orange), turns critical-pulse-glow under 25 HP
    - Timer in Press Start 2P, ticks at full screen refresh (centiseconds precision)
    - DW toggle button (off-state outlined, on-state filled blood-red with glow)
  - **Visual feedback**:
    - On hit: 8-particle blood burst at player position, red flash on player sprite, screen shake (220ms keyframe animation on `.arena-wrap`)
    - During iframes: player sprite blinks at 80ms cadence + gold halo ring
    - Player sprite: small white circle with two black eyes + screaming open mouth (3×2.4 ellipse)
    - Lava: animated bubble dots at 0.003 rad/ms orbiting the surface
    - Poison: 6 wispy puffs rotating around the cloud's center at 0.002 rad/ms
    - Laser: dashed thin telegraph line during charge → bright 6px white core + 3px red layer + muzzle flash on fire
    - Crusher: dashed track line + ceiling anchor + teeth on the bottom of the block
    - Bomb: dashed proximity ring (dim, idle) → spark + bright warning ring (lit) → expanding orange explosion disc
  - **Overlays** · 3 modal overlays inside the arena: START (initial pitch + "▶ DIE" button), PAUSE (`P` key, "death will wait. it always does."), DEATH (rank + time + delta + submit row + retry).
  - **Keyboard** · WASD/arrows to move, `R` resets, `P` pauses, `D` toggles Death Wish.
  - **WCAG basics** · `<canvas aria-label>`, role="status" on inputs, focus-visible orange outlines on all interactive elements, prefers-reduced-motion kills shake + hp-critical + blood-pulse animations, ≥44px button targets.
  - **Mobile** · sidebar collapses below the arena at 880px (becomes a 220px scroll). Top bar wraps to 2 columns. Arena keeps 5:3 aspect.
  - **OG image** · Pollinations flux seed 666, "Top-down industrial gauntlet arena with red glowing spikes, lasers, buzz saws and a screaming pixel character rushing toward a crusher, synthwave red and black". No `referrer` per project notes.

## issues
- Hazards are procedurally placed each game with rejection sampling — occasionally two crushers can spawn on overlapping vertical tracks and look weird. Minor.
- The DOT damage cadence (lava 200ms, poison 300ms) is intentionally NOT reset by movement — staying in lava chains DOT ticks until you leave, even with iframes from other sources. That's a feature, not a bug, for routing optimization.
- The arena uses `aspect-ratio: 5/3` which can letterbox the canvas on extreme viewport sizes. Acceptable.
- No mobile touch controls (joystick); on touchscreens you can't move the player. Could add a virtual stick + tap-to-dash later.
- The handle field is free-text — no profanity filter. Standard moderation via RLS-deleted rows if needed.
- Bombs becoming "residual lava" after detonation is a deliberate cheese option: chaining one bomb explosion + the lava-DOT residue is a known speedrun route. Worth balancing if S-rank becomes too easy.

## todos
- 🎵 SFX: spike-prick, saw-grind, laser-charge whine, crusher-slam thud, bomb-tick + boom, lava-bubble pop.
- 🎵 Background drone that crescendos as HP drops.
- ⚙️ Difficulty preset chooser (FEWER / NORMAL / NIGHTMARE) that varies hazard counts.
- 📱 Mobile virtual joystick + dash button.
- 🌀 "Lethal" mode: every hit deals 50 dmg + no iframes — 2-hit death runs.
- 🏆 Daily seed: same hazard layout for all players on a given day; separate daily leaderboard.
- 🎥 Replay system: record your death route and let leaderboard entries replay their run.
- 🔁 Auto-restart on death (toggle): respawn instantly to grind for S rank.
- 🤖 "Ghost runner": render a translucent copy of your previous best run.
- 🎯 Achievements: "S Rank on DW", "Killed only by lava", "Survived 30 seconds (the loser ending)", "1-shot bomb skip".

## design notes
- The "iframes that DOT ignores" rule is the central balancing decision. Without iframes, single spikes would let you die in 1.5s (12 spike hits × 0.1s movement). With iframes only, you'd hit the same spike every 0.35s and the game stretches. DOTs ignoring iframes give the lava/poison routes a different rhythm — sit in them for sustained drain vs sprint between iframe-eating contacts.
- The crusher only damages during its DOWNWARD slam (`Math.cos(phase) > 0`) AND in the bottom 15% of its travel — encouraging timing-based contact rather than just sitting under it.
- Bomb fuse + ring telegraph gives the player a half-second to lean in or out. Bombs are the highest single-hit damage (35) so they're worth routing around.
- Per windows-11-recall-nightmare debugging session: NO `transform-box: fill-box` anywhere. Screen shake uses a plain CSS keyframe on the parent wrap; canvas redraws every frame. All hazard rotations done via canvas `ctx.rotate()`, not SVG transforms.
- Ranking thresholds chosen by playing the game ~20 times solo and tuning so S-rank feels achievable with a clean route but not trivial. F-rank exists for players who run AWAY from hazards (the wrong way to play).
- Used the inverse of the standard survival-game design: every visual cue in genre games says "danger, avoid!" — here you have to mentally override that and SEEK them. The screaming mouth on the player sprite is the only acknowledgment that they're aware they're doing this wrong.
