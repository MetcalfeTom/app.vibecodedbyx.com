# Neon Snake

Classic snake game with neon glow aesthetics.

## log
- 2026-05-13: **Trail effects overhaul + audio + visual polish.** Chat asked for "neon snake with trail effects" — already existed, iterated rather than duplicated. New trail system runs three layers simultaneously: (1) **Head ribbon trail** — every distinct head pixel position is recorded with timestamp into `state.headTrail`, pruned at 900ms, drawn as a 3-pass glowing polyline (outer cyan halo width 0.95×CELL/blur 22, mid blue 0.62×CELL/blur 14, white core 0.32×CELL/blur 6) with per-vertex alpha fading by age. Head leaves a literal phosphor smear behind it like a Tron light cycle. (2) **Frame-fade overlay** — every render frame paints `rgba(6,0,10,0.22)` across the whole canvas instead of clearing, so anything previously drawn (sparks, ribbon, sometimes ghost segments) burns in and decays over ~6 frames; food and snake redraw on top each frame so they stay bright. (3) **Per-segment spark emission** — every game tick, each body segment has a 50% chance to emit a small color-matched spark (0.32-0.52s life, low velocity, gravity-free) so the whole snake constantly sheds neon dust. **Speed lines**: once tick speed drops below 100ms, 5 cyan streak-lines render opposite to direction-of-motion behind the head, intensity scales with how fast the player is going. **Eat juice**: 22 pink/gold particles + expanding-ring shockwave (kind:'ring' particle that grows 320 u/s with stroke fade). **Death**: 18px screen shake (×0.88/frame decay) + red full-screen flash (0.6 alpha ×0.92 decay) + every segment explodes into 6 sparks. **Audio** (Web Audio synth, mute toggle): eat = 3-note rising triangle+sine arpeggio with frequency scaled by score, move = ultra-quiet 110Hz square click per tick, die = 440→60Hz sawtooth through 1.1kHz lowpass + 400ms noise burst. **Visual chrome**: title in Audiowide with rainbow cyan→lime→magenta gradient text + glow, Cormorant italic subtitle "eat the dot. *burn the trail.*", HUD stat cells (Score gold / Hi magenta / Spd lime) in tabular Rubik Mono One, canvas gets cyan border + cyan/magenta drop-shadow + inset vignette. Background: void with cyan/magenta radial glows + screen-blend scanlines. Mobile d-pad rebuilt as a CSS grid (cleaner cross layout). New M (mute) and R (restart) keyboard shortcuts. Preserved: hi-score `localStorage['neonSnakeHi']`, swipe gestures, 28×28 grid, classic 3-segment start position. Fonts swapped from Orbitron → Audiowide + Rubik Mono One + Share Tech Mono + Cormorant Garamond italic.
- 2026-03-19: Initial build. 28x28 grid, responsive cell sizing. Rainbow gradient snake (green→cyan→blue→purple→magenta) with glow trails on tail removal. Pulsating food with concentric glow rings and halo. Head has eyes tracking direction. Speed increases with score (120ms→55ms). Wall and self collision. Death burst particles. LocalStorage high score. Mobile: d-pad buttons + swipe controls. WASD/arrow keys. Orbitron + Share Tech Mono typography. Dark background with subtle grid.

## issues
- Frame-fade overlay technique relies on rgba alpha — on very long sessions there can be a faint residual film in the deepest void color, but it's below visual threshold and the radial vignette covers any banding.
- Speed-lines kick in below 100ms tick; if user disables auto-speedup via prefers-reduced-motion (which is respected for CSS transitions but not gameplay), they'll never see them. Acceptable.
- Per-segment spark emission scales with snake length — at 200+ segments could thrash the particle list. In practice game-over usually arrives well before that.
- Audio context unlocks on first input — silent until then.

## todos
- Wrap-around walls mode toggle
- Multiple food types (bonus points, speed boost)
- Leaderboard (Supabase)
- Bonus mode: chromatic-aberration accent at high speed (split RGB on the snake)
- Power-ups: phase-through-self briefly, slow-mo, double-trail

## notes
- No database — pure frontend, localStorage for hi score
- Speed formula: max(55, 120 - score*1.5)
- Snake colors lerp through 7-color rainbow array
- Trail particles fade on tail removal for glow trail effect
