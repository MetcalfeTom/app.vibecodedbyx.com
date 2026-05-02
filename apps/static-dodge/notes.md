# static-dodge

## log
- 2026-05-02: Created. **Glitchy CRT/VHS dodge game where particles invert your controls on hit.** Single-file canvas. **Movement**: WASD or arrow keys, 220 u/s constant speed, clamped to 640×480 canvas. **Inversion mechanic**: each hit sets `invertUntil = now + 5000ms` (max-extends on subsequent hits within the window), and during the window WASD axes flip. Visual cue: acid-green tint overlay + cyan/magenta border edges + animated INV pill in HUD. **Enemies**: glitchy particles spawn from a random edge with a base speed `60 + min(180, elapsed*2.5)` u/s, drift toward opposite edge with random perpendicular drift; 30% are sin-oscillators that wiggle perpendicular to velocity, 10% are gentle homers that pull toward the player. Color rolled magenta/cyan/acid-green/warn-yellow weighted. Render: per-frame jittered + RGB-split square + occasional horizontal glitch streak behind. **Spawn cadence**: starts 1/sec, accelerates to 0.18s minimum at long survives. **HP**: 3 hits = game over. 1.0s i-frames + flicker render after each hit so you can untangle from a particle. **Aesthetic**: VHS/CRT — Major Mono Display title with `text-shadow: -2px hot, 2px cool` chromatic abberation + steps(1) glitch-keyframe animation, layered scanline ::before (2px+4px), corner-vignette ::after, dim radial backdrop, neon hot-pink + cyan + acid-green + warn-yellow palette. Per-frame static-noise dots scattered + rolling color-bar tracking lines + RGB-split canvas border + chromatic player (magenta/cyan offset circles + white core). **Audio**: Web Audio synth — bandpass noise burst on hit + sawtooth thud, square blips on spawn, multi-tone arpeggio on game start, descending sawtooth on death. **HUD pills**: TIME, HP, BEST (localStorage), INV (counts down). **Banner** announces "SIGNAL HIT · controls inverted · 5s" each hit. Title overlay with TUNE IN button, end overlay with NEW HIGH SIGNAL / SIGNAL LOST title + RETUNE button. Pollinations OG, 📺 favicon.

## issues
- Inversion stack only max-extends — getting hit twice in a row doesn't extend by 10s (it sets to whichever is later). That's by design but could be confusing.
- Homing particles can corner-camp the player if many spawn at once. Consider capping homer count.
- No sound mute toggle yet.
- Mobile: no touch controls; the keyboard-only setup makes it desktop-only.

## todos
- Power-ups: occasional "purify" pickup that clears inversion + grants 1 HP.
- Boss particle every 30s — bigger, slower, takes 2 hits to break, drops a heart.
- Mobile virtual joystick.
- Mute toggle.
- Score multiplier that scales with current inversion duration (risk-reward).
