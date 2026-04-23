# Pixel Prowler

## log
- 2026-04-23: Created. Dark pixel-art stealth horror — sneak, steal, survive. 26×19 tile grid map (16px tiles → 416×304 internal canvas, CSS-scaled with `image-rendering: pixelated`). **Map**: 6 real golden relics (`$`) + 2 fake cursed relics (`F`) scattered across 4 rooms and open halls, with 1 patrolling guard. **Player**: 8×14px pixel thief sprite (cyan face in dark hood), WASD/arrows move at 72 u/s (42 sneaking), no collision with walls (AABB against 4 corners). **Guard**: 4-waypoint patrol rectangle `(16,12)→(22,12)→(22,6)→(16,6)`, moves at 38 u/s, pauses 0.8s at each waypoint while scanning (sinusoidal angle wobble `sin(t*2.4)*0.45` on dir). **Vision cone**: 80u range, ±0.45rad half-angle, raycast polygon (20 segments, walk ray outward 2u/step until wall hit) drawn as translucent yellow→red gradient. LOS check = 3u-step sampling between guard and player. **Alert system**: alert level accumulates at +1/0.55s while seen, decays at -1/1.1s when not; hits 1.0 → caught → **jumpscare + game over**. Alert flash red vignette at >0.35. **Fake relics**: indistinguishable at first — slightly more erratic pulse (0.55 vs 0.35 amplitude), tiny red pulsing core instead of white highlight, occasional 4%/frame red flicker glitch. Collecting a fake = jumpscare + -8s timer + +0.2 alert. **Horror audio stack** via Web Audio: **(1) Ambient drone** = 5-voice chord 41.2/55/82.4/110/164.8Hz (sine + triangle/saw, per-voice 0.03–0.11Hz detune LFO), routed through resonant lowpass (360Hz, Q 3.2) swept by 0.07Hz LFO (±160Hz), dry 0.6 + wet 0.45 convolver reverb (3.4s noise impulse). **(2) Proximity static** = bandpass-filtered noise loop (highpass 1200Hz + bandpass 2600Hz), gain `0.018 + proximity*0.18 + madness*0.05` where `proximity = clamp(1 - dist/180, 0, 1)` smoothed with 12% lerp. **(3) Scream** = simultaneous 0.65s bandpass-swept noise (1600→300Hz) + 0.55s distorted saw (900→70Hz through tanh waveshaper) + 0.36s high square shriek (2000→500Hz) + 0.5s sub thud (80→40Hz). **(4) One-shots**: pickup two-tone triangle bleep (good = 880→1320Hz, fake = 180→90Hz), footstep = 0.08s bandpassed noise (300Hz Q 1.5), alert 720Hz square blip, win = 523/659/784/1047Hz arpeggio. **Jump scare visual**: 64×64 pixel screaming face canvas (hollow black eyes with red pupils, jagged teeth top+bottom, blood tears, crack lines, red/black static specks) drawn fresh each trigger, overlaid with `scarePulse` keyframe (scale 0.5→1.15→0.96→1.05→1 with hue-rotate shifts) for 0.6–1s. Frame `shake` keyframe (6-step translate + rotate ±4px/±0.3°). **Madness meter**: `state.madness = realTaken / realTotal` (0→1 across 6 pickups), drives CSS var `--madness` which: (a) fills HUD dread bar with red gradient, (b) tints `.red-overlay` with radial `rgba(180,10,20, 0.15+0.7m)` + linear `rgba(140,6,12, 0.15m)`, (c) boosts `#static` opacity `0.35+0.25m`, (d) pulses outer frame shadow red `rgba(255,40,60, 0.12+0.6m)`, (e) amplifies tremor `madness*1.4 + alert*1.2` applied as random ±px translate per frame. **Canvas static overlay**: separate 96×72 canvas with `mix-blend-mode: screen`, every frame regenerates per-pixel noise `v = rand*255` with alpha `40 + (0.35 + prox*0.45 + madness*0.2)*180*rand`. **Torches**: 5 flame sprites (4 corners + 1 middle) with flickering radial gradient (amber→red-tinted, `0.8 + sin(t*11)*0.12 + rand*0.12`). **Scanlines** + **CRT vignette** + **alert flash** layers stacked via z-index. **HUD**: Press Start 2P title "PIXEL PROWLER", VT323 value readouts for Time/Loot/Alert, dread meter, audio toggle (♪ON/OFF, M key). **Controls**: WASD/arrows move, Shift tiptoe (also silences footsteps), P pause, R restart, M mute. **Mobile**: 140px d-pad bottom-left + 84px circular SNEAK button bottom-right, pointer events with preventDefault. Press Start 2P + VT323 + Silkscreen fonts. Pollinations OG.

## features
- Dark pixel-art stealth on 26×19 grid
- 6 real relics + 2 fake cursed relics (indistinguishable until you look close)
- Patrolling guard with raycast vision cone and LOS checks
- Sneak mode (Shift) — slower, silent, safer
- Proximity-driven static — louder as guard approaches
- Creepy 5-voice synth drone with reverb
- Jump scare on guard catch AND fake item pickup
- Screen goes increasingly red + distorted + screen-shake as you collect real loot
- Canvas TV static overlay
- Mobile d-pad + sneak button
- Audio toggle + keyboard shortcuts (R restart, P pause, M mute)

## issues
- Player hitbox is corner-sampled (4 AABB points) — tight doorways feel OK but a true SAT pass would be smoother.
- Guard patrol is fixed 4-waypoint rectangle — once you've seen the loop, timing becomes easy. Could randomize.
- Fake items are deliberately subtle — some players may never notice the tell and just die to them once per run. That's the point, but a "hint mode" toggle could be nice.
- Static audio + drone start on first `startGame()` and persist across restarts — by design (horror is relentless) but can be muted.
- Jump scare face is hand-drawn pixel art per trigger; keeps the file self-contained (no external images) but isn't randomized.

## todos
- Multiple guards at wave 3+ or endless mode
- Randomized fake/real placement per run
- Locked doors + keys for a longer heist
- Flashlight power-up that reveals which items are fake
- "Cursed mode": all items fake except 1 — pure horror
- Breadcrumb sound effect (own footsteps attract guard)
- Proper leaderboard via Supabase (fastest clean getaway)
