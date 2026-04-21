# Chroma Sort

Click color tiles in alphabetical order as fast as possible. 5 rounds per game, 9 difficulty levels.

## log
- 2026-04-21: **Letters mode** refined twice. (1) Now picks a random letter A–Z uniformly and samples up to 16 real color names from `COLOR_POOL` whose first letter matches — alphabetical sort puts them in order. (2) Rare letters (X, Z, Q, Y) fall through to a procedural padding path: take the real colors that exist, then fill the remainder with synthetic `${letter}${suffix}` names using a pre-sorted suffix pool (`Ash, Bloom, Coal, Dusk, Ember, Fern, Glow, Haze, Ink, Jade, Kelp, Lore, Mist, Noir, Opal, Plume`) and HSL-generated custom hues stepped around a random base hue (360/16 spread, 68–90% sat, 46–66% light). De-dupes synthetic names against real ones. (3) Gradients are **off** in Letters mode — tiles render flat solid hex via `tile.style.background = c.hex`, `::before` shine disabled, `background-image: none !important`. Font shrinks to clamp(13–24px) with `::first-letter` emphasis (1.6× bolder) so the shared leading letter pops. Order-pip in progress bar also goes solid in Letters mode. (4) New `.letter-banner` announces the target letter for 1.7s via `showLetterBanner(letter)` — fades in/out, accent-colored big letter, positioned below the nav bar.
- 2026-04-21: (previous) Added **Letters mode** (difficulty `letters` — 5 rounds, 4×4 grid, penalty 3). Initial version picked 16 random A–Z with rainbow-mapped hues and huge single-char glyphs. Superseded by the color-name version above.
- 2026-04-21: Added **Rainbow Spectrum palette** (`rainbowspec`) — procedural 26-hue pool at 78% sat / 56% light, alpha-named "Hue A" through "Hue Z" so alphabetical sort equals hue order. Built via IIFE with inline HSL→hex (avoids TDZ on the later `hslToHex`).
- 2026-04-21: When rainbow palette or rainbow difficulty is active the board gets `.rainbow-active` — each tile animates a hue-rotate drift (0→18°→0° over 4.5s, staggered delays via nth-child) and the ::before shine becomes a rotating conic-gradient for full spectrum shimmer. Letters board gets `.is-letter-board` for tighter letter sizing at 4-col.
- 2026-04-21: Vibrant gradient pass. Every tile now renders a 4-stop `linear-gradient(138deg, light 0%, base 38%, hue-rotated-28° 72%, dark 100%)` via new `tileGradient()` helper instead of a solid color — adds internal shimmer from a nearby hue. New `tileShadow()` stacks two outer glow rings (ambient + wide halo) + colored drop shadow + inset top highlight + inset bottom shade, with strength boosted for neon palettes. Added a `::before` glossy layer (radial white highlight top-left + 150° linear sheen) with `mix-blend-mode: screen`, and a hover state that scales to 1.035×, saturates 1.25×, and brightens 1.08× with the sheen expanding. Text wrapped in `.tile-txt` span with `z-index: 2` and text-shadow so it reads over the brighter surfaces. Tiles use `overflow: hidden; isolation: isolate`. Order-pip progress dots got the same gradient + glow. New color helpers: `hexToRgb`, `hexToRgba`, `shadeHex`, `rotateHue` (HSL conversion + hue rotation).

- 2026-04-12: Added 5 new palettes — Synthwave (48 hot pink/cyan/purple 80s neon), Gemstone (44 rich jewel tones), Toxic (48 acid green/hazard yellow/radiation), Candy (48 saturated sweets), Neon Gradient (48 full-spectrum neon progression). Neon glow box-shadow effect on tiles for neon/synthwave/toxic/neongradient/abyssal palettes. Total 19 palettes now.
- 2026-04-11: Added Prismatic Void mode — 16 procedurally generated shades from a single random hue with tiny lightness/saturation differences. Sort by lightness (dark→light). 3 rounds, penalty 5. Uses hslToHex helper for procedural color generation. Extreme difficulty since shades are nearly identical.
- 2026-04-10: Added Supabase global leaderboard integration — dual Global/Local tabs, dynamic import of supabase-config.js, sbInit/sbLoadGlobal/sbSaveScore functions, submit saves to both local and Supabase, graceful fallback when Supabase unavailable. Table chroma_sort_scores needs to be created (schema.sql ready). Also added Abyssal Glow palette (48 bioluminescent blues/purples/cyans) and Mold palette (45 fungal greens/blacks/whites).
- 2026-04-10: Added 5 new palettes — High Contrast (43 WCAG-friendly colors with max distinguishability), Earth (45 natural/organic tones), Retro (48 80s computing colors), Grayscale (43 shades of gray — ultimate challenge), Sunset (45 warm gradient colors). Total 12 palettes now.
- 2026-04-10: Added God Mode — 400 unique colors in a 25x16 grid, 1 round, penalty 12. Expanded color pool from 200 to exactly 400. Added cols-25 CSS grid. Intensity level 4 — maximum audio aggression: death chord wall (root+tritone+fifth+octave+double octave through dist=70), dual opposing hellfire sirens (rising saw + falling square through dist=95), grinding noise floor (distorted low-pass rumble), 32nd-note blast beats (8 hits per beat), feedback screech bursts (random 2-6kHz through dist=100). +65 BPM over base. 8 machine-gun kicks, 60% clang chance, 55% glitch rate, 8 notes per beat. Melody regenerates every 4 beats.
- 2026-04-10: Legendary gets intensity level 3 — unique music layers: war siren sweeps (distorted 200-2000Hz oscillator), feedback drone (beating detuned saws through dist=90 + resonant LP), blast beat snare fills (16th-note noise bursts), octave-doubled melody through dist=50. +45 BPM over base. Machine-gun kicks on every bar (6 hits), 45% clang chance, 40% glitch rate, 6 notes per beat. Melody regenerates every 6 beats. Shake Well shoutout in difficulty selector.
- 2026-04-10: Added Legendary Mode — 200 unique colors in a 20x10 grid, 1 round, penalty 10. Expanded color pool from 100 to exactly 200. Added cols-20 CSS grid with tiny-tile responsive sizing. Legendary gets max intensity music.
- 2026-04-10: Complete music engine overhaul — dark industrial aesthetic inspired by Ultrakill. 5 new tracks (Blood Price, Machine Wrath, Iron Psalm, Slag Furnace, Terminal Nerve) using phrygian/locrian/harmonic minor/diminished scales. Detuned sawtooth synths through WaveShaperNode distortion, industrial noise percussion, metallic clang hits, acid screech filter sweeps, rising noise tension sweeps, machine-gun kicks, power chord stabs, descending breakdown arpeggios, glitch stutter. DynamicsCompressor as limiter on master chain. Intensity system: Ultra adds double kicks, 16th hats, power chords, countermelody, 8th-note chugs. Disaster maxes everything.: Neon Rush (140bpm major), Cyber Pulse (128bpm minor), Pixel Bounce (150bpm pentatonic), Chroma Wave (135bpm dorian), Glitch Grid (160bpm mixolydian). WebAudio synth with bass, kick, hi-hat, melody, and arpeggio layers. Toggle button in header, long-press/double-click/shift-click to skip tracks.
- 2026-04-10: Added Disaster Mode — 100 colors, 10-column grid, 1 round, penalty 8. Expanded color pool from 61 to exactly 100 unique named colors. Added cols-8/9/10 CSS grid support with responsive sizing for tiny tiles.
- 2026-04-10: Added arcade-style 3-letter name entry leaderboard. localStorage-based, top 10 per difficulty. Scrollable letter slots (A-Z, 0-9, space) with arrow controls. Remembers last entered name. Gold/silver/bronze rank styling. Shows on game over if score qualifies, always displays existing scores. Leaderboard updates when difficulty selector changes.
- 2026-04-10: Initial build. 28 color pool, 4 difficulties: Easy (6/3-col), Medium (9/3-col), Hard (12/4-col), Insane (16/4-col). Score = base + speed bonus + streak bonus - mistake penalty. Progress bar with color pips showing target order. Timer per round, total time tracked. Rising pitch SFX on correct sequence. Tile clear animation with pop + fade. Anybody + DM Mono typography, dark with accent pink aesthetic.

## features
- 400 named colors in pool
- 10+ difficulty levels (6/9/12/16/36/49/100/200/400 tiles + special modes)
- Score with speed bonus, streak bonus, time bonus
- Visual progress bar with color pips
- Per-round timer
- Tile pop/fade animations
- WebAudio SFX
- Mobile-friendly tap targets

## issues
- No color-blind assist (names are on tiles though)
- Fixed 5 rounds per game
- Supabase leaderboard code is in place but table `chroma_sort_scores` not yet created (no service role access). Falls back to local leaderboard gracefully.

## todos
- Create chroma_sort_scores table in Supabase (run schema.sql with service role access)
- Endless mode with escalating difficulty
- Color-blind mode with patterns
- OG preview PNG
