# Tubbyland

## log
- 2026-04-23: Created. Horror Teletubbies parody — 960×540 canvas, **4 unsettling tubbies** (Tinky Winky plum `#6a2d94` / Dipsy sickly-green `#4a8a32` / Laa-Laa jaundiced-yellow `#d9b82c` / Po blood-red `#c22a24`), each with unique pitch (110/155/210/260Hz), roam speed (48/44/42/56), chase speed (88/84/78/118), and antenna silhouette (triangle/straight/curl/round). **Baby sun** `#fbb447` at top-left with **pupils that track the player** (both eyes offset proportionally to player position). **Blood moon** `#7a1a1a` top-right with crater circles. **Rotting field**: dark-olive gradient ground, 18 flowers with blinking eye-centers (each `sin(t*rate)` gates pupil visibility), 140 grass tufts, 70 twinkling stars. **8 custard-eye bowls** scattered around field (beige bowl w/ amber custard w/ sclera+pupil on top, pulsing slightly). **Tubbytronic Superdome** at (900, 170) — curved dome rendered w/ radial-gradient + dark triangular entrance (the escape goal). **Player**: small pixel figure (WASD/arrows 120u/s, Shift tiptoe 72u/s), 10px radius, 60s timer to collect all 8 + reach dome. **Tubby AI**: roam in 180-radius home circle with wander-angle changes every 1.2–3.2s; detection radius 96u (58u while sneaking); on detect → state flip to `chase` for 4.2s at `chaseSpeed`, then returns to roam with 2s cooldown. Per-tubby `voiceCD` timer (4–9s) triggers `tubbyBabble` (or 15% chance `tubbyGiggle`). **Alert system**: proximity-weighted alert level (accumulates when any tubby within 130u, +1/0.6s; decays -1/1.0s); at 1.0 → caught. **Contact catch**: if `dist < 24 + playerR - 4` → caught → `jumpScare` + game over. **Formant babble audio**: `tubbyBabble(pitch)` synthesizes "eh oh" using sawtooth fundamental at `pitch` → two bandpass filters stacked (Q 8–10) at F1/F2 formants (530/1840 for "eh", then 570/860 for "oh"), 0.15s each, vibrato LFO at 5.5Hz ±4Hz via GainNode modulation on detune. **Giggle**: 5 rapid 80ms bandpass-square bursts at `pitch * [1.1, 1.3, 1.15, 1.35, 1.1]` through 2000Hz Q=6 bandpass (playful-but-wrong). **Heavy breath**: 1.3s lowpass-filtered (380Hz Q=0.8) noise w/ slow attack/release envelope, triggered near player. **Music box**: sparse triangle+sine pings (random 2–6s) from A3 minor scale through 2.4s reverb, occasional detune for wrongness. **Proximity static**: bandpass-noise loop gain = `0.012 + (1-nearestDist/180) * 0.14` smoothed 12% lerp. **Ambient drone**: 4-voice chord 41/55/82/110Hz sine+triangle through LFO-swept 420Hz lowpass + 3s convolver reverb. **Scream**: 4-layer synth — noise 1600→300Hz bandpass sweep + distorted saw 900→70Hz through tanh waveshaper + high square shriek 2000→500Hz + sub 80→40Hz thud, plus overlaid 8-burst `tubbyGiggle` high-pitched (pitch 420). **Jump scare visual**: 300×300 tubby face drawn on top canvas — tubby bodyColor hue-shifted darker, hollow black eyes w/ red pupils, jagged teeth rows top+bottom, blood drips from eyes/mouth, bleeding cracked antenna, face cracks, VHS noise specks. Scaled up to 80% viewport + `scarePulse` keyframe (0.5→1.15→0.96→1.05→1 w/ hue-rotate shifts, 0.8s) + shake keyframe on frame. **Darkness meter**: `dread = caughtItems / 8`, drives CSS `--dread` which: (a) tints `.red-overlay` w/ radial `rgba(120,8,8, 0.1 + 0.5*d)`, (b) boosts `.static` opacity `0.2 + 0.2*d`, (c) pulses frame shadow blood-red `rgba(140,10,10, 0.1 + 0.4*d)`, (d) tilts baby-sun-eye saturation (eyes darken as you approach dome — sun "sees you winning"). **Static overlay canvas**: 128×72 regenerated per-frame w/ `rand*255` alpha-modulated pixels, `mix-blend-mode: screen`, z-index above game. **Chromatic aberration**: 2 offset red/cyan `mix-blend-mode: screen` rectangles over frame, opacity scaled by `0.02 + dread*0.08`. **HUD**: Nosifer "TUBBYLAND" title w/ `titleGlitch` keyframe (dual-color shadow chromatic-split ±2px), Shrikhand italic "again, again" subtitle, Press Start 2P value readouts for Timer/Eyes/Caught-By, VT323 tubby-proximity dots (4 small colored circles fade in when each tubby is close). **Controls**: WASD/arrows move, Shift tiptoe, R restart, M mute, P pause. **Mobile**: 140px d-pad bottom-left + 84px TIPTOE button bottom-right w/ pointer events + preventDefault. Fonts: Nosifer + Shrikhand + Press Start 2P + VT323 + Silkscreen. Pollinations OG image (no `referrer`).

## features
- 4 unsettling teletubby stalkers with unique AI speeds + pitches
- Formant-synthesized "eh oh" babble + sinister giggles
- Watching baby sun with player-tracking pupils
- Blood moon + rotting field + eyed plastic flowers
- 8 custard-eye bowls to collect + Tubbytronic Superdome escape
- Jump scare on catch with custom-rendered tubby face
- Proximity static + ambient drone + music box
- Screen progressively darkens + tints blood red as you collect eyes
- VHS chromatic aberration + scanlines + canvas static overlay
- Sneak mode (Shift) for slower detection
- Mobile d-pad + tiptoe button
- Mute/pause/restart keys

## issues
- Tubby AI is simple wander+detect+chase; no pathfinding, so you can slip past them in gaps once you learn their home radii.
- No level variation — same scene each run. Could randomize eye positions + tubby homes on restart.
- Formant bandpass has a noticeable "vowel" quality but is still clearly synthetic; real Teletubbies vocals are protected IP so this is deliberately abstract.
- Audio drone + static start on first `startGame()` and persist across restarts (horror relentlessness); mutable with M.
- Jump scare face is drawn per-trigger each time; keeps file self-contained but doesn't animate beyond CSS scale/rotate keyframe.
- Baby-sun eye-tracking is intentional (unsettling) but may look buggy at first glance — the sun literally follows you.

## todos
- Night/day cycle — sky slowly dims as timer counts down
- Tubby "noo-noo" vacuum monster as a random scripted event
- Tubby-babble lore subtitles that scroll at the bottom during chase
- Randomized eye/tubby placement each run
- Endless mode w/ respawning eyes + escalating tubby speed
- Multiple escape points that lock after first use
- Leaderboard (fastest clean escape) via Supabase
