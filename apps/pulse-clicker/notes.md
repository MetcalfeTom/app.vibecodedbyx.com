# pulse-clicker

## log
- 2026-05-06: shipped — neon-drenched idle clicker. Every pointer-down spawns one or more procedurally drawn geometric fragments that drift, rotate, pulse, and bounce off the viewport edges before fading.
  - **Fragments**: 8 procedural shapes (`triangle`, `square`, `hexagon`, `diamond`, `ring`, `cross`, `starburst`, `sparkle`) drawn live to a single full-window canvas with `globalCompositeOperation = 'lighter'` so colors stack into bloom-like neon glow. Each fragment carries `{x,y,vx,vy,rot,rotV,scale,pulsePhase,shape,color,life,maxLife,auto}`. Velocities damped 3% per frame, rotation at ±2.5 rad/s, scale modulated by per-fragment `pulsePhase` plus a global beat pulse for synchronization. 6-color palette (pink/cyan/lime/violet/gold/orange).
  - **Click flow**: pointerdown anywhere on the canvas → spawns `fragMul` fragments at the cursor in random directions (upward bias), adds `clickPower × combo` pulses to the bank, ticks the click + total counters, fires a procedural "+N" popup that floats up with damped gravity, and triggers a small synth blip whose pitch scales with the combo. First click also unlocks audio + dismisses the central click hint.
  - **Combo system**: `combo` floats from 1.0 to 12.0; each click adds `0.04 + glowPower × 0.05` to the multiplier; passive decay is `0.8 × comboDecayMult` per second. Combo readout is lime when active, dimmed when idle. The score-band "PPS · total · clicks" sub-line stays visible across the whole session.
  - **Idle / Auto-Pulse**: each level grants `+0.4 PPS`. A fractional accumulator buys 1 pulse at a time; each auto-pulse spawns a cyan fragment drifting in from a random screen edge so the world keeps moving even when idle. Auto-fragments pass through walls (don't bounce) and just fade off-screen on the far side.
  - **6 upgrades** in the right rail, all priced with exponential scaling so progression doesn't stall:
    1. **Click Power** — base 12, ×1.6 — flat +1 pulse per click.
    2. **Fragment Density** — base 60, ×2.2, capped at L10 — +1 fragment per click.
    3. **Auto-Pulse** — base 35, ×1.45 — +0.4 PPS, edge-drifting cyan fragments.
    4. **Lingering Glow** — base 90, ×1.7, capped at L8 — +25% fragment lifetime.
    5. **Combo Banking** — base 140, ×1.55, capped at L8 — combo decay −20% per level.
    6. **Bloom Power** — base 220, ×1.6, capped at L10 — +18% glow shadow blur, faster combo earn.
  - Each upgrade card shows `Name [Lx]`, description, dynamic cost, and turns lime when affordable. Buying it: deducts pulses, fires a 14-fragment lime ring at screen center, plays an ascending two-tone chime, refreshes affordability, and saves.
  - **Beat metronome** at 120 BPM (0.5s interval). All on-screen fragments expand by ~6% on the beat for a subtle world-pulse feel. Bass thump fires on the beat once any Auto-Pulse level is unlocked.
  - **Audio (Web Audio synth)**: every click → square blip 360-600 Hz with combo-driven pitch shift; combo 4+ has a 30% chance to layer a 1 kHz triangle sparkle; upgrade purchase → 820 → 1240 Hz triangle pair; insufficient pulses → low sawtooth growl 180 Hz; beat thump → 80→40 Hz sine. Toggleable via the bottom-left ♪ button; auto-unlocks on the first click.
  - **Persistence**: `localStorage['pulse-clicker-v1']` — pulses + total + clicks + upgrade levels. Auto-saves every ~1.5s of active play and on every upgrade. Reset button (with confirm) wipes the save and brings the click-hint back.
  - **Aesthetic**: deep purple-black bg with 3 corner glows (pink/cyan/violet) + a synthwave horizon grid (CSS-only, masked to fade upward). Title in Audiowide with cyan + pink chromatic shadows; pulses readout in Audiowide gold; combo in Orbitron lime; upgrade names Audiowide; descriptions IBM Plex Mono; tagline Cormorant italic. Right rail glassmorphic with backdrop-blur. Click hint pulses in the center until the first click.
  - **Mobile (≤720px)**: rail collapses to a 42vh bottom drawer; horizon grid hidden; canvas keeps `touch-action: none` to capture pointers cleanly.
  - **Performance**: fragment cap of 280 (oldest dropped on overflow); per-frame motion-blur fade overlay (`rgba(7,2,26,0.18)` fillRect) instead of full clear so trails decay naturally; HUD text updates throttled to 80ms. Combo / popups / particles all run in the same rAF loop.
  - **Accessibility**: rem units, semantic `<canvas role="application">` with full control-summary aria-label, score-band `role="status" aria-live="polite"` so screen readers hear pulse changes, upgrade list rendered as real `<button>`s with focus-visible cyan outlines, ≥2.4rem mini-button targets, `prefers-reduced-motion` kills the click-hint bob animation, skip link to canvas.

## issues
- The fragment cap at 280 is intentional but on a 4K display with sustained spam-clicking + max Fragment Density (L10), you can saturate it within a second and the oldest get culled visibly. Could scale the cap with viewport area later.
- Auto-Pulse fragments drift in from edges and pass through walls — meant as a "border life" cue. Could become disorienting if Auto-Pulse is leveled past L10 with multiple per second; currently 0.4 PPS per level gates that pace.
- The combo readout is purely cosmetic feedback for the multiplier — there's no separate "combo broke!" telegraph yet.
- No keyboard click — pointerdown only. Space-to-click would help streamers + accessibility.

## todos
- Space / Enter to click (with cursor target = screen center).
- "Pulse storm" prestige: spend a level-cap upgrade + reset for a permanent ×N click multiplier.
- Beat-synced shape preferences (each shape associated with a different beat fraction; spawning on-beat awards bonus pulses).
- Particle "trails" — every Nth frame the fragment leaves a smaller decaying ghost.
- Premium currency on every total-pulses milestone for cosmetic palette swaps (hot, cool, gold-only, mono).
- Small floating-handle clicker bots that wander the canvas at high Auto-Pulse levels.
