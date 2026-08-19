# Giggle Box — a laugh soundboard

## log
- 2026-08-19: v1.0 — built per two chat requests landing together. Seven laughs, EVERY ha synthesized live in Web Audio (sawtooth/square/triangle syllables through bandpass formants + sine sub + noise breaths — zero recordings, zero external assets). Pads: 🤡 cartoon chuckle (bouncy square hyuks, formant 1250), 🦹 villain (slow mwa + four rising-volume descending has + big final HAA), 😂 CONTAGIOUS giggle (8 accelerating hees, then a second voice at +0.6s a fourth higher, a third at +1.15s lower — the room joins in), 🎅 belly (round ho ho ho, formant 480), 😏 snicker (tss noise + nasal triangles), 🤖 robot (three identical square HAs, bend=1), and the full-width 🪶 SIGNATURE TICKLISH laugh per the follow-up request: 5 jitter-gapped wheezes, a gasp (noise + UPWARD bend-1.5 triangle squeak — scheduler learned bend>1), 7 accelerating higher hihis, a squeak, and a trailing sigh. STOP control (button + S/Esc): every scheduled node is tracked in ACT[] with onended pruning; stopAll() hard-stops them, clears pad pulses, narrates "stopped, mid-ha." VOLUME slider persisted (giggle-box-v1), mute with aria-pressed, REPLAY last laugh (R). Keys 1-7. A11y: every pad has a full descriptive aria-label + shortcut, status aria-live, focus-visible, reduced-motion kill, 44px+ targets. Probe 14/14 first run — event-shape checks from data (villain descends & swells, giggle has late voices, ticklish has upward bends + breath + sigh), stop drains ACT to zero, volume persistence, full keyboard map. Count-from-data pattern: build() returns pure event arrays, so probes never race the (starved) headless audio clock.

## issues
- none.

## todos
- a "laugh track" mode (random laugh every N seconds), per-pad pitch slider, if chat asks.
