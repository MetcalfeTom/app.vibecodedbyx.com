# ChipDeck — notes

## log
- v1.0 (2026-09-11): NSF-inspired 4-channel player per chat ("standalone NSF-inspired player, local demo tracks, Web Audio synthesis, channel controls, responsive UI" + a follow-up "continue: demo tracks, responsive controls, verify deployment"). Not a real NSF parser (that would need a 6502 emulator + copyrighted ROMs) — a 2A03-flavoured live synth: two pulse channels with selectable duty (12.5/25/50/75% via Fourier-built PeriodicWaves — 50% provably kills even harmonics), triangle bass an octave down like the real chip, and 15-bit LFSR noise (taps 0,1) rendered into a looped buffer pitched by a 16-entry period table. FOUR ORIGINAL tracks baked in as text sequences (no Nintendo melodies, said so on the page): POWER ON (C major, pulse-2 echo +3/16 ×0.4), SPRINT (F, 16th arps), CAVERN (Am, 12.5% duty + 6-step echo + rumble), BOSS RUSH (Dm 16th riff, 4-step echo, double-time kit).
- Engine is a pure `<script id="eng">` block (dual export): parseSeq text notation (`c4:2@12`, `r:4`, `x6:2@11`, `|` cosmetic; bad tokens throw naming the token), echoSeq/repeatBars helpers, compile() that REFUSES a channel whose length ≠ song length (each bar arithmetic error becomes a loud compile error — this caught nothing because the node suite runs compile on all 4 songs).
- Playback: 40ms lookahead scheduler (0.18s horizon) per channel with loop counters; per-note envelope nodes; mute/solo/volume via per-channel gains (solo = anyone-solo silences non-solos); duty override live per pulse channel; VU bars scheduled at note time; master scope canvas timer-driven (not rAF).
- Keys: space play/pause, 1–4 mute, ←/→ track. Audio starts only on the PLAY tap (mobile WebAudio rule).
- Famicom cream/crimson shell, Micro 5 + Fragment Mono. GLYPH LESSON (again): ▶/⏸/⏮/⏭ are tofu in Micro 5/Fragment Mono — transport buttons use plain PLAY/PAUSE/<< />>. WCAG: aria-live well, aria-pressed everywhere, 44px targets, reduced-motion kills VU+scope.
- Verified: engine node suite 39/39 (parser incl. explicit errors, Fourier duty properties, LFSR balance, echo-shift structural proof mod loop, all 4 songs compile with sorted in-loop events + sane pitch/period ranges); browser probe 27/27 at 1200/390/320 (all four channels schedule within 2s, scope ink, mute→gain ~0 measured, solo silences rest, slider/duty state, track switch while playing, pause freezes scheduler, keyboard, no overflow); screenshots at both widths.

## issues
- Headless scope screenshots under --virtual-time-budget show a flat line (analyser data race) — the probe's ink check is the real assert.
- Triangle channel ignores note velocity by design (the 2A03 triangle has no volume control) — only the channel slider scales it.

## todos
- A 5th track slot chat can vote on; maybe a tiny pattern editor ("write your own cartridge").
- Optional vibrato/pitch-slide effect syntax (`~` tokens) if chat wants fancier leads.
