# Neon Pinball

## log
- 2026-05-19: V3 — **electric Web Audio synth SFX** per chat ask "build a high-speed neon pinball game with glowing physics and electric sound effects". v2 already had the glowing physics + paddles + bumpers + slingshots + gravity well; the missing piece (per the existing todo list `Sound effects (WebAudio)`) was sound. Added the full audio engine without touching physics.
  - **11 distinct SFX** wired to every existing collision/event hook: `sndBumper(hue, speed)` (pitched triangle ping mapped to bumper hue, harder hits louder), `sndSling()` (square-saw clack + bandpass noise), `sndTarget(hue)`, `sndPaddleSwing()` (rising-edge flick on paddle activation, L+R independent), `sndPaddleHit(active, speed)` (deeper saw thwack when paddle is actively swinging vs passive bounce), `sndCharge(level)` (chuggy buzz tick every 70ms while plunger charges, pitch rises with tension), `sndLaunch(power)` (saw upward sweep + noise burst + low square thud, dynamic from charge level), `sndDrain()` (4-note descending sad arp), `sndComboPing(combo)` (sine + triangle ping pitched up the chain on combo tier change only — not every hit), `sndJackpot()` (5-note major arpeggio + noise sparkle on all-targets-cleared bonus), `sndClack(speed)` (subtle wall bounce, gated to >25% speed so quiet rolls stay silent).
  - **Engine** · single AudioContext, master gain, small noise-impulse ConvolverNode for ~0.6s wet reverb so SFX feel like they're inside a glowing cabinet. All sounds go dry + wet through master. Lazy-init on first user gesture (browser autoplay policy) via `ensureAudio()`. Per-sound helpers `_osc(type, freq, gain, dur, attack, sweep)` + `_noise(gain, dur, lp, q)` keep each SFX a 1-3 line composition.
  - **Mute** · ♪ toggle button in the top-right of #ui (next to combo display) + M key. Persists to `localStorage['neon_pinball_muted']` so the choice survives reload. Muted state greys the button and crosses the note glyph.
- 2026-03-25: V2 — Spring plunger launcher (hold to charge, release to fire). Heavy tension feel with vibration at max charge, red charge bar. Deep radioactive violet gravity well with inner pulse. Supabase leaderboard UI (neon_pinball_scores table needs creation via MCP). Name persistence in localStorage.
- 2026-03-25: V1 — Neon pinball with magnetic beam paddles, gravity-distorting orb. 6 bumpers, 5 lane targets, 2 slingshots, combo scoring up to x5. Distortion grid warps around ball based on gravity well charge. Orb shifts from cyan to violet as gravity builds. Touch controls, keyboard (A/D, arrows, space). Orbitron + Fira Code typography.

## features
- Magnetic beam paddles with field line animations and pull physics
- Gravity well: ball distorts the playfield grid, bumper positions shift toward it
- Orb color shifts cyan -> purple as gravity charge builds
- 6 bumpers (100-150 pts), 5 lane targets (200 pts, bonus for clearing all), 2 slingshots (50 pts)
- Combo multiplier up to x5, decays after 2s
- 3 balls, high score in localStorage
- Screen shake on impacts, particle explosions

## issues
- Physics can occasionally allow ball to clip through paddle at high speed

## todos
- Multiball power-up
- Ramps / orbit lanes
- ~~Sound effects (WebAudio)~~ ✅ V3
- Leaderboard table creation: needs `neon_pinball_scores` table via MCP (columns: id, score, display_name, user_id, created_at)
- Ambient drone / background music (separate from SFX)
- Different bumper hum based on bumper hue (currently only the hit ping differs)
