# bot-smacker · notes

## log
- 2026-05-17: v1 — **whack-a-mole arcade with neon mallets and exploding URL fragments** per chat ask: "create a bot-smacker arcade game with neon mallets and exploding links." Shipped at `/bot-smacker`. 60-second pickup-and-go round, full-viewport canvas, mouse + touch, single-file ~32KB.
  - **4×3 grid of portal holes** (12 total), positions recomputed on every resize so it scales from phone to desktop. Each hole is a flat ellipse with a magenta radial outer-glow, a cyan ring stroke, a dark interior, and a faint cyan shimmer band — reads as a neon stage portal, not a dirt patch.
  - **4 bot types** with cumulative-time difficulty curve:
    - **🤖 Scraper** (cyan #5ec2ff · 1HP · 1.5s up · +10pts) — basic chaff
    - **⚡ Crawler** (amber #ffba1a · 1HP · 0.9s up · +25pts) — fast, ducks before you swing
    - **🛡️ Tank** (magenta #ff2db4 · 2HP · 2.2s up · +50pts) — has a white HP pip in top-right that disappears after the first hit; bot flashes white for 220ms on partial damage, "CRACK!" float spawns
    - **🐋 Whale** (lime #b8ff5a · 1HP · 1.1s up · +150pts) — bonus target, ~3-6% spawn rate, has a pulsing white outline rim. Smacking one fires `sndBonus` (4-note arpeggio 523→1047Hz) and spawns 22 fragments instead of 14.
  - **Difficulty curve** via `difficultyAt(t)` where t = elapsed/60s: spawn cadence drops from 850ms → 250ms; type weights shift from `scraper:70/crawler:20/tank:5/whale:3` to `30/50/17/6` so the late game gets faster + meaner. Cadence floor 220ms keeps it physically smackable.
  - **Neon mallet** follows pointer. On click: 180ms swing keyframe — cocks back 0..0.45 of duration (rotation -0.35 → -0.98 rad + scale 1.0→1.25), snaps down 0.45..1.0 (-0.98 → +0.27 rad + scale 1.25→1.0). 180ms cooldown between swings. Drawn as: chunky 44×28 magenta head with cyan-pink highlight stripe + dark face plate + 4 amber rivets + cyan handle shaft, all with shadowBlur glow (18-22px). On impact during the strike half of the swing, an amber expanding shock ring (18→54px radius, alpha 1→0) renders briefly.
  - **EXPLODING LINKS** (the chat's hook): every successful smack spawns 14 (or 22 for whales) URL/code fragment particles from a 44-entry pool — `'http://'`, `'.io'`, `'/api'`, `'<script>'`, `'404'`, `'GET'`, `'%20'`, `'rm -rf'`, `'$('`, `'0x4c'`, `'undef'`, `'pwn'`, `'eval('`, etc — chosen for grimy bot-spam-flavor + obvious URL hints. Each fragment:
    - random outward velocity (220-580 u/s) + initial -120 u/s vertical kick
    - 480 u/s² gravity, ×0.985^(dt·60) horizontal damping
    - per-particle rotation + angular velocity (±4 rad/s)
    - 50/50 chance: take the bot's own color, OR a random pick from the full 4-color neon palette → reads as multicolor explosion confetti
    - size 11-19px JetBrains Mono bold with 10px shadowBlur glow in own color
    - life 1.0, decays 0.78/s, fades + culls when life ≤ 0 or y > viewport
    - max 240 active fragments at once (oldest culled), keeps perf flat on long combo chains
  - **Combo system**: each successful kill +1 combo, expires after 1.8s of no hits OR on any whiff. Combo decay timer is reset on every hit. Score multiplier = `1 + floor(combo / 3)` so ×3=2x, ×6=3x, ×9=4x. Every 5th combo milestone fires the `sndCombo` 3-note arpeggio + a `×N COMBO!` lime label + bigger screen shake (12px). Combo HUD card shifts to lime + pulses at combo ≥5.
  - **Screen shake** — 6px on regular smacks, 12px on combo milestones, decays at 30/s. Applied via canvas translate inside the render save/restore block.
  - **Floating text labels** (+score / WHIFF / CRACK! / ×N COMBO!): float upward, fade 0.9/s. Drawn with shadowBlur glow in their accent color, Bungee bold.
  - **WHIFF penalty**: clicking with no bot in range = `state.combo = 1`, +1 miss counter, `sndMiss` plays (low-band noise burst + 120Hz sine), and a "WHIFF" label spawns at cursor if combo was already > 1.
  - **Tank/Whale escape penalty**: if a tank or whale falls back without being killed, combo drops by 1 (not reset). Regular scrapers/crawlers expiring is free — keeps focus on the high-value targets.
  - **Synthwave background**: gentle perspective grid floor — 18 horizontal scrolling pink lines that compress at the horizon, 25 cyan vertical perspective lines fanning out from `H * 0.42`. Animated via `(t/12000)*4` so the grid scrolls toward you, 22% opacity so the bots stay readable. Body bg is layered radial accent glows (magenta top + cyan bottom-right + lime bottom-left) over a deep #07021a → #150538 vertical gradient.
  - **CRT scanline overlay**: full-viewport `body::after` repeating-linear at 4px period with `mix-blend-mode: multiply`, ~10% opacity per stripe — gives the arcade cabinet feel without nuking contrast.
  - **HUD**: 3 fixed top cards — score (magenta), combo (amber default, lime when ≥5, pulse keyframe), time (cyan default, red + pulse when ≤10s). VT323 numerals with shadowBlur glow.
  - **Web Audio synth** SFX: `sndSmack` (bandpass-noise 380Hz burst + 180Hz square punch + 90Hz sine sub thud), `sndMiss` (low-band noise + 120Hz sine), `sndPop` (per-bot-spawn 440-520Hz triangle tick), `sndCombo` (660/880/1320Hz triangle+sine), `sndBonus` (4-note arpeggio for whales), `sndOver` (descending 440→330→220Hz sawtooth).
  - **3 overlays**: START (legend with all 4 bot types + colored dots + point values + keyboard hints + big magenta "SMACK SOME BOTS" button), END (round-over with NEW badge if a high score, accuracy %, longest combo, per-type kill counts in 2-col layout), PAUSE (toggled with P key).
  - **localStorage** `bot-smacker-best` persists high score across visits.
  - **Pause** with P key; pause-aware `startedAt` shift so the round timer doesn't lose seconds while paused.
  - **Cursor**: hidden during gameplay (`body { cursor: none }`) so the mallet IS the cursor; restored to default on pause / overlays.
  - **WCAG-AA per project convention**: rem units everywhere, semantic main/canvas with `role="application" aria-label`, `role="dialog" aria-modal="true"` on overlays with descriptive `aria-labelledby`, `role="status" aria-live="polite"` on HUD cards, ≥44px touch targets on buttons, `:focus-visible` 3px amber outline, `prefers-reduced-motion` kills pulsing animations + transitions + hidden-cursor.
  - **OG image**: Pollinations flux seed 80808.

## issues
- Mobile: the mallet's `cursor: none` is irrelevant since touch has no cursor, but tap-to-swing works fine. The mallet renders AT the last touch position which can briefly look "stuck" between taps. Could fade out the mallet a few frames after release, but the current behavior is recognizable enough.
- Tank bots don't get a partial-points award when only their first HP is taken. Could split scoring to half-pts per HP, but DBD-ish "all-or-nothing" feels more honest for the combo chain.
- 12 holes is a fixed grid — on ultra-wide displays the grid stretches with big margins inside cells. Could go 6×3 or auto-fit grid count to aspect ratio in a future pass.
- Whale spawn rate (3-6%) is intentionally bursty so they're a small treat — but variance means some rounds get no whales at all. Could enforce min 1-2 whales per round.
- No "magnet" power-up or other variety beyond the 4 bot types. Easy follow-up area.
- The scanline overlay slightly dims the bot-color glow. Acceptable for the cabinet aesthetic but could be made user-toggleable.
- Audio inits on first pointerdown — if a player only uses keyboard, audio never inits. (P press doesn't trigger audioCtx). Could move ensureAudio into the start-game button click handler too.

## todos
- Power-ups (drop from rare bots): freeze time 2s, mallet-radius doubler, score 2x for 5s, auto-aim assist
- More bot types: cloaked bot (semi-transparent, harder to see), splitter (spawns 2 mini-bots when killed), boss bot at end of round
- Leaderboard via Supabase (anon)
- Mute toggle visible in HUD
- Chat-driven mode: Twitch chatter names get attached to bots, smacking them shows the username in the explosion ("@user popped!")
- Mallet variants unlocked at score thresholds (laser sword, glitch hammer, anvil)
- Daily seed challenge — same bot pattern for everyone today
- Mobile haptics on smack (navigator.vibrate)
