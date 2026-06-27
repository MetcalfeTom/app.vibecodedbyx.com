# water-or-yeet (Water or Yeet?)

## log
- 2026-06-27: shipped (chat ask: "one-button micro-game where press duration determines the outcome — slow hold waters a plant, fast tap yeets it out a window, show the personality result at the end"). Self-contained canvas game, zero deps.
  - **One button**: press/hold anywhere on the canvas OR hold Space. `pressStart` on down, duration on release. Phases: intro → idle → charge → resolve → (next | end).
  - **Duration → outcome** (`categorize` ms): <160 `yeet` (pot launches out the window) · <450 `splash` · <1400 `water` (sweet spot) · <2600 `soak` (big bloom) · ≥2600 `over` (drowned/wilted). Auto-resolves at MAXHOLD=3500.
  - **Live telegraph**: vertical zone meter on the right (YEET/splash/WATER/SOAK/OVER colored bands) with a rising marker, plus live text showing the current band + elapsed seconds and the watering can tilting further as you hold — so intent is readable before release.
  - **Resolve animations**: water = can pours droplet particles + plant lerps to target growth (procedural stem/leaves/flower, more leaves + a 6-petal bloom at higher growth) + grow chime; yeet = pot flies up/out spinning, window cracks, 14 glass shards + whoosh+tinkle SFX; over = plant wilts (droop + browned). Italic Fraunces result label.
  - **Personality verdict** after 5 plants from the cat distribution + avg hold: Defenestrator (≥3 yeets) / Drowning in Love (≥2 over) / Commitment-Phobe (≥3 splash) / Devoted Gardener (≥4 nurture, 0 yeet) / Zen Master (≥3 perfect water) / Wildcard (fallback). Shows emoji + Caveat verdict + stats (avg hold, plants saved, yeets).
  - **Audio**: Web Audio — continuous bandpass-noise pour (gain scales with outcome), yeet whoosh + glass tinkle arpeggio, grow chime, win result arp. Unlocks on first press; ♪ mute.
  - **Aesthetic**: cozy cottagecore windowsill — wall + framed window (sky gradient, sun, cloud, mullions), wooden sill, terracotta pot, watering can. Fraunces italic display + Caveat verdict + Space Mono. Round pips up top.
  - **WCAG**: canvas role=application + full control-summary aria-label, Space + pointer both work, overlay buttons with focus-visible, aria-pressed mute, ≥2.9rem targets, rem units, prefers-reduced-motion drops particle spawns. 600×760 internal, CSS-scaled.
  - Verified: inline script syntax OK; categorize/resolve/endGame/draw* all present.

## issues
- `ctx.roundRect` used for the can — modern browsers only (Chrome 99+/Safari 16+/FF112+).
- Depth/intent is pure timing (no pressure API) — the meter + live band text make it learnable.
- Each plant gets exactly ONE press (single-shot outcome), by design — no mid-press correction beyond release timing.

## todos
- Combo/streak flair for a perfect run (all sweet-spot waters).
- More outcome flavor: a cat knocks the pot, a bird steals a seed, rare golden bloom.
- Shareable verdict card / localStorage best "plants saved".
- Difficulty: shrinking sweet-spot band, or a moving target band.
