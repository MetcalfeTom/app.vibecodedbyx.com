# Beatbox Booth

## log
- 2026-04-17: Created. 16-step sequencer with 6 synthesized percussion rows (Kick/Snare/HiHat/OpenHat/Clap/Bass) using Web Audio (oscillators + filtered noise) and a 7th VOCAL row driven by SpeechSynthesis. Per-step custom syllables on the vocal row. 8 notation presets (Boots & Cats, Hip-Hop Boom Bap, Trap, Dubstep, DnB Amen, Reggaeton, House, Beatbox Cypher). BPM 60–160, swing 0–40%, voice picker, rate/pitch sliders. Live notation strip below grid (B/K/t/ts/X/F + custom vocal text). Save/load to localStorage. Bungee + Space Mono typography, tape-deck cream/red/orange palette.

## issues
- TTS scheduling uses setTimeout offset from AudioContext.currentTime — not sample-accurate, will drift slightly especially on Chrome where SpeechSynthesis cancels in-flight utterances. Cancel-then-speak each step keeps it tight but means rapid vocal steps may swallow each other.
- Some browsers expose no voices until user interacts — voice list refreshes via onvoiceschanged.
- speechSynthesis quality varies wildly across OS; iOS Safari often only has system voices, Chrome desktop has many.
- Mobile must tap something to unlock AudioContext (ensureAudio() on cell click + play).
- Notation row only shows first 2 layered sounds per step to avoid wrapping.

## todos
- Per-row volume + mute/solo
- Save multiple named patterns
- Export pattern as text notation (copy to clipboard)
- More TTS chips (regional beatbox vocab)
- Optional Supabase shared loops leaderboard

## design
- Palette: paper #f3ead4, ink #0e0d0c, tape red #cf2a1f, tape orange #f7a319, voice orange #ff6b00
- Per-row colors: kick=red, snare=blue, hat=green, open=purple, clap=pink, bass=black, voice=orange
- Notation: kick=B, snare=K, hat=t, open=ts, clap=X, bass=F, vocal=user syllable (or V)
