# Chroma Sort

Click color tiles in alphabetical order as fast as possible. 5 rounds per game, 9 difficulty levels.

## log
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
- 9 difficulty levels (6/9/12/16/36/49/100/200/400 tiles)
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
