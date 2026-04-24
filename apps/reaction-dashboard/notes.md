# Reaction Dashboard

## log
- 2026-04-24: Created. 16-button reaction soundboard with emoji rain. **4×4 button grid**: Fire/RIP/Based/Party, Clap/LMFAO/Eyes/Send-It, Goat/Slay/Clown/Praise, Brain/Nope/Tea/Boo. Each button has: gradient fill (c1→c2), rounded 22px border, 6px bottom drop-shadow for tactile depth, hover lift (translateY -2 + scale 1.02), press (translateY 4 + scale 0.96) with pulse-ring keyframe (shadow 0→40px expand + fade 0.6s), emoji with drop-shadow, Silkscreen label, corner key hint (Q/W/E/R…), per-button hit counter that persists in-session. **Keyboard layout** mirrors the grid: 1-2-3-4 top row, Q-W-E-R, A-S-D-F, Z-X-C-V. Space = random button. M = mute. **Emoji rain**: DOM elements with `fall` keyframe (starts -20vh, sways ±70px, spins 0-960deg, ends 120vh, 2.6-4.8s duration with 0-0.35s random delay). `float` direction variant for rockets/ghosts/praise — starts at 80vh and floats up to -20vh. Each reaction spawns 26-38 emojis from its pool (e.g. Party = 🎉🎊🥳🪅🎁, Fire = 🔥🧨✨). 240-drop cap, trims oldest on overflow. **Audio synth** (Web Audio, 16 custom sounds):
  - `whomp` (FIRE): sawtooth 200→45Hz exp drop 0.5s + bandpass-noise 1800Hz crackle
  - `sadtrom` (RIP): 4-note G-F-Eb-Db descending sawtooth slide with lowpass 950Hz
  - `arp` (BASED): 5-note triangle arpeggio C-E-G-C-E at 60ms spacing
  - `party`: bandpass-swept noise cheer (1400Hz Q=1) + 5-note sine bell cascade
  - `clap`: 3 bandpass-noise bursts (2300Hz Q=1.8) at 35ms spacing
  - `lol`: 6 alternating 360/440Hz square blips through 1100Hz bandpass (haha-haha rhythm)
  - `boing` (EYES): sine 900→200Hz exp drop 0.35s
  - `rocket` (SEND IT): bandpass-swept noise 500→3400Hz whoosh + 140→40Hz sine boom
  - `goat`: 380Hz square with 16Hz vibrato LFO + 22Hz tremolo envelope for bleat
  - `slay`: triangle 523→1047→932→1175 diva flourish + sine harmony
  - `honk` (CLOWN): 420→330Hz square pair at 130ms spacing
  - `praise`: 5-note sine major chord swell (523/659/784/1047/1319 linearRamp attack + exp release)
  - `brain`: 5-note high sine sparkle 1047→2637Hz + highpass 3500Hz noise shimmer
  - `fart` (NOPE): 110→70Hz sawtooth with 9Hz LFO pitch wobble (depth 50Hz)
  - `pop` (TEA TIME): 8 randomly-timed square blips 520-1420Hz within 0.55s (popcorn)
  - `ghost` (BOO): 180→420→220Hz sine swell + detuned shadow oscillator 2Hz off
  
  **Aesthetic**: dark indigo/magenta bg with radial glows + 1px-3px scanline overlay. Title "REACTION DASHBOARD" in Bungee with animated rainbow gradient (pink→yellow→cyan→lime→pink, 8s loop via background-position shift, -webkit-background-clip text, drop-shadow). Subtitle in JetBrains Mono 11px 0.45em-tracked. Footer: keyboard hint pills, hit counter, ♪ mute toggle. **Fonts**: Bungee + Silkscreen + JetBrains Mono + Space Mono. **Mobile** @640px: grid collapses to 2 cols, compact buttons 44px emoji, smaller footer. Touch works via click (no separate touch handler needed — button click fires). Pollinations OG.

## features
- 16 custom sounds, zero audio files (100% Web Audio synthesis)
- 16 unique emoji rain palettes
- 2 rain directions (fall for most, float-up for rockets/ghosts/praise)
- Keyboard layout mirrors visual grid (top-left = 1/Q/A/Z)
- Space = random reaction (good for dragging your finger across the keyboard)
- Per-button hit counters + global hits display
- Tactile button press with pulse-ring keyframe
- Animated rainbow gradient title
- ♪ mute toggle, M key shortcut
- 240-drop cap prevents memory/perf issues from button-mashing

## issues
- Emoji rendering varies by platform (Apple vs Android vs Windows). Fallback font stack loads Apple, Segoe, Noto emoji sets but Linux Chrome may show monochrome emoji.
- Rain uses DOM with CSS animations — fine for 30-40 drops per press but if someone mashes all 16 buttons in under a second there could be ~500 concurrent drops briefly; cap handles this but may look abrupt.
- Mobile browsers sometimes delay first audio by ~100ms until user interaction unlocks AudioContext; `pointerdown` once listener handles this.
- Keyboard doesn't work if focus is on the mute button (Enter would re-trigger it); likely fine, but could `blur()` after click.
- No visual feedback for mute state beyond button color change — could add a subtle bar or dim sound indicator.

## todos
- "Soundboard mode" where pressing a button also records it for playback as a sequence
- Long-press to continuously rain (held button)
- Custom reaction editor (pick emoji + sound + label, save to localStorage)
- Multiplayer mode via Supabase broadcast — press a button, all viewers see the rain
- Stream overlay mode (transparent bg) for use with OBS
- Mobile haptic feedback on press
- Achievement: hit all 16 in under 10 seconds → confetti explosion
- Per-reaction particle burst at button location, not just top-of-screen rain
