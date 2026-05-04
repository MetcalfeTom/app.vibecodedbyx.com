# electric-sheep

## log
- 2026-05-04: shipped — boids flock + lightning clouds + reactive synth drone (three chat asks combined).
  - **Generative art core (boids)**: 280-sheep flock by default (slider 40-500). Spatial-hash neighbour lookup keeps per-frame cost ~O(N) at large flocks. Standard separation/alignment/cohesion forces with sliders; cursor herds (gentle attraction) or scatters (recoil) via the CURSOR pill. ~4% of sheep are "alphas" — gold-glow, slightly faster, larger halo. Toroidal world wrap. Optional WOLVES toggle spawns 2 red predators that chase and "snack" on caught sheep (relocates to a random edge).
  - **Aesthetic**: Audiowide title "ELECTRIC SHEEP" with cyan halo + Cormorant italic "do androids dream?" tagline. Trail-fade overlay (~0.10 alpha) for soft motion blur. Sheep rendered with `globalCompositeOperation = 'lighter'` — radial-gradient halo + bright white core. Four palette presets (Halcyon cyan/magenta · Dusk violet/amber · Abyss teal/foam · Ember orange/red) — palette button re-rolls each sheep's hue from the new range.
  - **Lightning clouds (chat ask)**: 2-3 drifting puffy cloud blobs near the top of the canvas. Each cloud has its own zap cooldown (3-7s). When it triggers, the cloud picks the densest sheep cluster (or random sheep if scan finds none) and fires a jagged cyan-glow lightning bolt that delivers a HIGH-SPEED DASH to the target + nearby sheep within 90px (4× max speed for ~1.2s, electric-yellow flash). Pulsing gold "charge" dot under each cloud telegraphs the next zap. Click on a cloud to manually zap toward the nearest sheep; click anywhere else triggers the original scatter pulse + thunder.
  - **Reactive generative drone (chat ask)**: 4-voice oscillator stack (sine + triangle in fifths) through a `BiquadFilter` lowpass. Per-tick `updateGenerativeAudio(dt)` computes:
    - **Movement** = average sheep speed normalized to maxSpeed
    - **Density** = inverse of sheep bounding-box spread (sampled every 4th sheep — cheap)
    - **Dash energy** = % of sheep currently dashing
    - All three smoothed with exponential lerp.
    Outputs:
    - Voice pitches glide toward `chord[i] * (1 + movement × 0.18)` — faster flock = brighter
    - Bass voice swells with density; high voice swells with movement
    - Lowpass cutoff sweeps `220 → 220 + movement×1100 + dash×900` Hz
    - A separate sawtooth dash-pad layer fades in proportionally to dash count (so zaps audibly bloom into a chord)
  - **Chord rotation**: 4-step modal palette (Aeolian → Dorian → Mixolydian → Phrygian) cycles every 16s so the harmony never sits.
  - **Zap chord blossom**: every lightning strike triggers `zapSound()` which now also spawns 3 detuned sine voices tuned to the CURRENT chord (octave-up), swelling 0.04s and fading over 0.9s — zaps land musically inside the active harmony.
  - **HUD**: 4 pills (FLOCK count, FPS, CURSOR mode toggle, SETTINGS gear). Settings drawer slides up with sliders for herd size / separation / alignment / cohesion / trails / max speed + WOLVES + AUDIO toggles + 4-button palette swatch row.
  - **Keyboard**: Space pauses, M mutes, S toggles cursor mode, R reseeds flock, G opens settings.
  - **Loop**: fixed-step 1/120s w/ accumulator + spiral-of-death guard. 8-step cap drops backlog if browser falls behind.
  - **Accessibility**: rem units, 44px+ pill targets, semantic main, aria-pressed on toggles, role="radiogroup" for palette, prefers-reduced-motion kills drawer transition + hint fade, focus-visible outlines, role="application" canvas with control summary.

## issues
- 500-sheep at zero-trail-fade can flutter on phones (glow draws are alpha-heavy). The default trail of 0.10 + count of 280 is comfortable on most hardware.
- Wolves currently teleport "eaten" sheep — could feel jarring; could fade them out + respawn as a new sheep instead.
- Lightning clouds don't react to mouse cursor — they only auto-zap or respond to direct clicks. Could add proximity-based charge boost.
- Audio drone uses `setTargetAtTime` for glides; on some browsers (older Safari) the parameter won't smoothly track if too many cancellations happen. Should be fine in evergreen.

## todos
- "Storm mode" toggle that drops the drone tonality and adds a low rolling thunder loop.
- Slider for cloud count + zap frequency.
- Tap-and-hold a cloud to "charge" it (delayed but bigger zap radius).
- Clusters of dashing sheep could form a brief "comet" — multi-sheep velocity carry-over.
- Save current settings + palette to localStorage.
