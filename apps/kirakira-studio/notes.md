# Kira Kira Studio

pochinia's request (2026-10-10, ~05:15 UTC): a vocaloid-like app with ORIGINAL voice banks, each with their own look, anime-cute, plus some cursed banks.

## art direction (pochinia, 05:28)
- The chrome is calm, dark, professional music software: thin lines, a clean grid, small level meters, IBM Plex Sans Condensed + JetBrains Mono. It must not be pastel or cute.
- ALL the cuteness lives in the singer portrait (the stage canvas) and the cast cards. Hachi Maru Pop is used only for singer names, the speech bubble and karaoke. DotGothic16 is only for the microwave LCD.
- The transport is a fixed bottom bar (thumb reach) with play, bar·beat clock, status and two VU bars.
- Singers are original. No real Vocaloid/UTAU/SynthV names, looks or colour schemes, and no Fairylight Lane characters (pochinia wants this app to be its own thing).
- Nemu (the sleepy ghost) is pochinia's favourite and gets the most love.
- 05:33: the real singers' voice quality comes first. The cursed shelf stays small and simple.

## cast
- Tinka Orgel: music-box soprano, pink twin tails, a gold wind-up key on her back. Bell partials + winding ratchet ("musicbox" extra). Bright, light vibrato. Demo: Kira Kira Boshi.
- Nemu Kasumi: sleepy ghost alto. Ghost tail, nightcap, pillow hug, droopy lids. Breathy (breath .8, whisper .2), slow vibrato, scoops, phrase-end falls. Yawns ("sleepy" extra). Dozes between phrases and when idle, with z particles. Demo: "Five More Minutes" (coordinator's lyric, trails off into a hum).
- Chin-chan (cursed shelf): haunted microwave. Square-wave quantised voice, band-limited, cut-off phrases, 3 beeps per phrase end + a final CHIN. A tiny ghost rides the turntable and the LCD shows the syllable. Demo: the jingle.

## engine (inline `<script id="engine">`, also runs in a Blob Worker)
- KKSynth.render(song{bpm,notes[{t,d,p}] in eighths,lyrics}, voice, sr) returns {buf, sr, dur, tl, P}. Pure JS, so node can require scratch copies for tests.
- Rosenberg pulse -> 5 cascaded DC-normalised resonators (control-rate coefficients every 16 samples) + a hiss resonator for fricatives.
- Lyrics: kana -> romaji. A line with l/v/q/x/th/c or a consonant-final word counts as English and splits only on spaces/hyphens; romaji lines auto-split. `_` or `~` holds the previous vowel. English magic-e gives diphthongs (five, time, home).
- Loudness: the 90th percentile of 20 ms RMS windows is normalised to .17, then a tanh soft clip above .7.
- The app caches the last 8 renders and pre-renders 0.5 s after an edit. Note taps preview one syllable on the main thread.

## log
- 05:50 v1.0: Tinka, Nemu, Chin-chan. 6 songs (Twinkle, the jingle, Five More Minutes, Frère Jacques, Sakura Sakura, Ode to Joy). Tap piano roll with keyboard access, lyrics, tempo, karaoke, VU meters. Each singer brings her demo song when the current song is another singer's demo. Fixed a hiss-resonator blow-up that clicked before s/sh after l/m/n (stale coefficients + zero noise centre).

## issues
- Headless helpers share CDP port 9377 / srv 8927. Hold all lock files (scratchpad/hm/kshot.sh does that) or a probe lands in someone else's page.
- A render is ~1 s for a 30 s song on the main thread (headless). The Worker keeps the UI smooth, and the first play of a new song waits for it.

## todos
- Voice polish for Tinka and Nemu (vowel naturalness, glides, vibrato shape). Listen on real speakers and ask pochinia.
- Genres round: a picker with 🎵 pop / 💧 sad / 🎸 rock / 🌙 lullaby. The Web Audio backing band (drums, bass, chords following key/tempo/swing) plus singing-style changes per genre.
  - Each singer reacts with one line + a tiny expression. Nemu loves sad/lullaby and yawns at rock ("...too loud... *yawn*"). Tinka lives for pop and curtsies at the end of sad songs. Cursed ones do their own thing.
  - It must never block a genre.
- More cute banks: Konta Hidamari (fox-boy tenor), Shuwa Ramune (soda girl).
- Cursed shelf: dial-up modem choir (promised on stream), goose, and a generic monster energy-drink can (no brand: fangs on the pull tab, claw stripes, jittery eyes, fizzy over-caffeinated voice, fast vibrato, crackle, a burp at phrase ends).
- Restyle the song picker to match the studio chrome (song tiles or a styled select). pochinia/coordinator 05:48.
- Languages: per-language phoneme tables (EN vowels beyond aiueo, DE ü/ö, FR nasal vowels). An explicit language toggle could beat the line-sniffing heuristic.
- A share link (#hash with the notes + lyrics + singer).
