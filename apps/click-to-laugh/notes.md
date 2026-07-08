# CLICK TO LAUGH — notes

## log
- 2026-07-08: v1 — laughing button game (2 near-identical chat asks; 2nd added the snort progress bar). Giant candy-red CLICK TO LAUGH button (3D press w/ shadow drop); each click bursts 2–10 physics laugh-particles (gravity, spin, fade; 90 cap) with generated ASCII laughs — syllable pool (ha/HA/hee/kek/bwa/snrk/KYA…) × elongation × tails (~!!/?!/xD), 6 chaotic fonts (Bungee, Rubik Bubbles, Caveat, Special Elite, Bowlby One SC, Gloria Hallelujah), 8 pop colors; intensity (combo) scales size/speed/syllables. Combo ≥5 shows escalating fit banners (GIGGLE FIT → FULL CACKLE → UNHINGED → CALL A DOCTOR → LAUGHING FIT ×N), decays after 1.2s idle; every 10th combo = body shake. Randomized giggle synth per click (2–4 pitch-bent blips, intensity raises pitch). **LEGENDARY SNORT**: progress bar fills over 50 laughs → giant animated SNRRRK—!! (4 variants, spin-in keyframe), 34-laugh full-screen eruption, bandpass-swept nose-noise + saw honk, shake, SNORTS stat; bar resets. LAUGHS/BEST FIT/SNORTS persisted (localStorage). Reduced-motion kills shakes. Verified: 12 clicks → combo 12 + FULL CACKLE + 52 particles + 24% bar; click 50 → snort fired, bar reset, snorts 1; zero errors.

## issues
- Laugh particles are DOM nodes (fine at 90 cap); if chat wants thousands, move to canvas.

## todos
- Mute toggle if asked, share-my-best-fit image, konami = infinite snort mode.
