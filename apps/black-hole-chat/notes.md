# Singularity Chat (black-hole-chat)

## log
- 2026-04-22: Created. Cosmic black-hole chat — type a whisper into the void and watch it spiral, stretch, redshift, and vanish into the event horizon. **Scene**: fullscreen canvas with a radial starfield (`W*H/3800` count, per-star r=`pow(rand,3)*1.6+0.2`, hue 200–280, twinkle via `sin(t*twSpeed+phase)`). Black hole center-screen with three layers: outer radial gradient photon glow, **accretion disk** (38 arc segments rotating at 0.02 rad/s scaled to 1×0.42 for edge-on perspective, hue 18–52 ember→amber modulated by `sin(t*1.5 + i*0.42)`, alternating hot streaks with 6px glow overlay every 3rd), a top-arc **backlight** ellipse (warm gradient catching the far side of the disk), the pitch-black **event horizon** disk (radius `min(W,H)*0.055`), and a cyan **photon ring** (radius `*0.075`, shadowBlur 22). **Gravitational lensing**: each star within 2.4× lensing radius is displaced radially outward by `photonR * 0.9 * influence²` where `influence = 1 - r/(lensR*2.4)` — creates that classic Einstein-ring halo. Stars closer than `photonR` are hidden entirely (swallowed). **Messages** carry text through inverse-square gravity (`a = GM/r²` with GM=48000, clamped at `horizonR*0.9` so integrator doesn't explode). Spawn from random edge at `base*0.45` radius with tangential velocity 80–135 px/s perpendicular to radial vector (randomly cw/ccw) + 16–26 radial inward bias for guaranteed decay. Drag `0.993^(dt*60)` so spirals decay gracefully. **Spaghettification**: as `r` falls from `diskOuter*1.4` to `photonR`, stretch along velocity direction from 1× to 7.5× and squish perpendicular to 0.65×. Rotates to align with velocity via `atan2(vy,vx)`. Text rendered with `hsla(hue - prox*150, sat, light - prox*40)` so cyan/violet→red (classic redshift) and `shadowBlur = 14 + prox*30`. Ghost trail at `-stretch*0.45, 0` adds drag smear. When inside horizon, alpha→0, consumed once `alpha<0.02`. **Audio**: muted by default. Toggle `◯ drone` = 4-voice chord (55/82.4/110/164.8Hz, sine+triangle, per-voice LFO 0.07–0.19Hz via frequency modulation, 460Hz lowpass, linear ramp to 0.4 gain over 2.4s). Each sent message plays `playWhisper()` = 2 sines (base 180–400Hz + octave 0.51 fifth), bandpassed 620Hz Q=1.8, 40ms attack / 1.4s exp decay at 0.12 gain. **Seed ghosts**: 10 poetic whispers auto-spawn on load at 900ms stagger ("hello?", "is anyone there", "echo", "forever", "gravity", "i was here", "silence", "wait —", "light bends", "cosmic dust") so the scene breathes before any interaction. **UI**: "SINGULARITY" title in Unica One 0.3em-tracked cyan w/ violet shadow glow, Cormorant Garamond italic tagline "whisper · spiral · vanish" w/ amber bullets. Drifting/Consumed counter top-right. Composer bottom-center: rounded-36px pill input (Cormorant italic placeholder "whisper something into the void…", 140 char max, amber focus glow) + amber/ember gradient "send" button. Intro line center-screen "nothing escapes the horizon. not even your words." fades after first send. "drone" toggle bottom-right. Palette: void `#05020f` / photon `#b7f4ff` / amber `#ffb15b` / ember `#ff6a22` / crimson `#d61f4a` / violet `#8b5bff`. Unica One + Cormorant Garamond italic + Space Mono. Pollinations OG preview (swirling black hole with accretion disk).

## features
- Type any message, watch it spiral into a realistic-looking black hole
- Inverse-square gravitational physics with tangential spawn velocity
- Spaghettification stretch (up to 7.5×) aligned with velocity direction
- Redshift: cyan/violet → red as text approaches horizon
- Gravitational lensing distorts background starfield around BH
- Rotating accretion disk with hot/cool streaks, warm backlight arc
- Event horizon swallows stars and messages that cross it
- Ambient 4-voice drone chord toggle with LFO-modulated detune
- Whisper chime audio cue on send (bandpassed sine pair)
- 10 seed ghost whispers on load for instant ambiance
- Drifting/consumed counters, fullscreen responsive
- Mobile-friendly (composer + composer scaling, touch tap to focus)

## issues
- Very long messages (~140 chars) get extremely wide when stretched — sometimes wrap off-screen. Could clip or wrap. Keeping as-is; spaghettification reads best on short phrases.
- Near-horizon integrator still clamped — technically messages at exactly `horizonR*0.9` won't accelerate further. Visually fine.
- Lensing is a cheap radial displacement, not true relativistic ray tracing. The Einstein ring illusion works from a distance but close-up you can see individual stars "jump" as they cross influence threshold.
- On very wide monitors, the accretion disk can feel too small; scales with `min(W,H)` so portrait phones still look good.
- No persistence — messages are ephemeral. Intentional (they *are* lost to the void).
- Drone starts silent and ramps in over 2.4s, so users may toggle twice thinking it's broken.

## todos
- Actual gravitational lensing via shader (WebGL)
- Shader-based volumetric disk with Doppler beaming (front side brighter than back)
- Persistent ghost log: show recent consumed messages fading on the horizon edge as a "chorus"
- Multiplayer: broadcast messages via Supabase so other viewers see your whispers
- Supermassive mode: way bigger BH, slower spiral, denser disk
- Quasar mode: intermittent relativistic jets shooting out both poles
- Tidal disruption events: when two messages collide near the disk, they shatter into debris
- Hawking radiation: faint particles escape the horizon occasionally
- Color scheme presets (Kerr / Sagittarius A* / fictional)
