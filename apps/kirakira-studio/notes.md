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
- Tinka Orgel: music-box soprano, pink twin tails, a gold wind-up key on her back. Bell partials + winding ratchet ("musicbox" extra). Bright, light vibrato. Demo: Wind Me Up! (her own song).
- Nemu Kasumi: sleepy ghost alto. Ghost tail, nightcap, pillow hug, droopy lids. Breathy (breath .8, whisper .2), slow vibrato, scoops, phrase-end falls. Yawns ("sleepy" extra). Dozes between phrases and when idle, with z particles. Demo: "Five More Minutes" (coordinator's lyric, trails off into a hum).
- Ruri Chouchin (v1.4, pochinia's "one more singer, a cute one, go wild"): a tiny deep-sea anglerfish idol. Teal/aqua fin-frill hair with coral-tipped side fins, a coral hairpin + pearl, bubble earrings, a glassy jellyfish dress with swaying ribbon tentacles, one tiny fang. Her glowing lure is her microphone: it brightens on every note (st.pulse from lurePulse, set on each new syllable in frame) and flickers with rock (st.flk). Stage: stageDeep (light rays, marine snow, rising bubbles, coral). Voice: bright bubbly mezzo between Tinka and Nemu (center 67, fs 1.14, vibAM .45), "water" extra = two swaying short delays (chorus + faint 6 Hz flutter), "blub" extra = a rising bubble chirp after each phrase. Demo: "Down Where the Light Is" (104 bpm, pop; romaji verses + an English hook line). Rising bubble particles ('rbub') on stage and CSS bubbles on her card while a song plays.
- Chin-chan (cursed shelf): haunted microwave. Square-wave quantised voice, band-limited, cut-off phrases, 3 beeps per phrase end + a final CHIN. A tiny ghost rides the turntable and the LCD shows the syllable. Demo: the jingle.

## engine (inline `<script id="engine">`, also runs in a Blob Worker)
- KKSynth.render(song{bpm,notes[{t,d,p}] in eighths,lyrics}, voice, sr) returns {buf, sr, dur, tl, P}. Pure JS, so node can require scratch copies for tests.
- Rosenberg pulse -> 5 cascaded DC-normalised resonators (control-rate coefficients every 16 samples) + a hiss resonator for fricatives.
- Lyrics: kana -> romaji. A line with l/v/q/x/th/c or a consonant-final word counts as English and splits only on spaces/hyphens; romaji lines auto-split. `_` or `~` holds the previous vowel. English magic-e gives diphthongs (five, time, home).
- Loudness: the 90th percentile of 20 ms RMS windows is normalised to .17, then a tanh soft clip above .7.
- The app caches the last 8 renders and pre-renders 0.5 s after an edit. Note taps preview one syllable on the main thread.

## log
- 06:30 v1.4 Ruri Chouchin, the 4th singer (see cast). Also: English spellings in the tokenizer (down/now au, low/know ou, saw, new, light/high ai, my/fly ai, out/loud au; "I", "I'll", "I'm" sing as "ai" on English lines), which also fixes "I'll" in Nemu's demo. og.png now has four cards.
- 06:23 v1.3 genres: a Band row under the song tiles (Solo / Pop / Sad / Rock / Lullaby, radiogroup). The band follows the melody: Krumhansl key (major AND minor now; Sakura and Paper Wings read as A minor), half-bar diatonic chords, drums/bass/keys per genre, 1-bar count-in (lullaby: a 2-bell pickup, no drums), the final chord rings. Lullaby swings the eighths for the voice and the band alike (plan T8). Each genre also changes how she sings (engine GSTYLE: pop brighter/lighter vibrato, sad breathier + slower wider vibrato + falls, rock brighter + onset overshoot, lullaby breathier/softer); the cursed square voices ignore GSTYLE. Breathy singers (Nemu) only get 30% of the extra breath (bz()).
  - Presets bring a default band (GDEF): Kira/Wind Me Up/jingle pop, Nemu's two songs lullaby, Sakura sad; Frere/Ode solo. song.genre is saved and part of the render cache key.
  - Reactions (REACT table): one bubble line + a tiny expression when you pick a band, never blocking. Nemu yawns at rock ("...too loud... *yawn*"), Tinka hops for pop and curtsies at the end of a sad song, Nemu drifts off after a lullaby, Chin-chan flashes BEEP.
  - Clock/playhead now use the render's own lead (count-in). Key readout ("key C major") next to the band picker.
  - bOsc rewritten without per-sample exp (multiplicative envelopes). Band renders add ~0.2-0.6 s in node.
- 06:17 v1.2.1: pochinia asked "is tinka's wind up key supposed to be in her hair?" The key now comes out of her lower BACK: backKey() is drawn first (the dress hides the root, the pigtail tips end above it, so no hair can cover it), with a shadow where the shaft leaves the dress, a collar, and two loops that turn around the shaft while she sings. og.png re-rendered with Tinka smaller so the key shows. Before/after crop probe: scratchpad hm/kks/keycrop.js.
- 06:12 v1.2 portrait polish (pochinia: "a bit more detailed and cuter"):
  - All faces: layered anime irises (dark top band, pupil, light lower crescent, flecks) with two catchlights, lids per singer (lashShape) + outer lash flicks on Tinka, soft gradient blush ovals, cleaner line weight, hair strands + a shine band in the fringe.
  - Tinka: a big gold wind-up key in her back (drawn first, only the wings poke out past her right pigtail, turns while she sings), ribbon streamers from the tail bows with spinning gear charms, a gear hair clip, a gear on the chest bow, music-box comb lines on the skirt. The old key in her hair is gone.
  - Nemu: fluffy pom + tiny star charm on the nightcap tip, dots on the cap cuff, 3 ghost-tail wisps, a stronger tail sway (9 px), stitched pillow. No ahoge: her cap covers the crown (tried one, it read as a stray line).
  - Chin-chan (light): a second glass glare streak, a twinkle on the glass, a peeling heart sticker on the door.
  - Before/after grid probe: scratchpad hm/kks/grid.js (loads hm/kks/art_old.js = v1.1 art in a Function wrapper). Shown on stream.
- 05:59 v1.1:
  - Volume: pochinia found v1.0 too loud. The default is now about 6 dB lower (gain = (vol/100)^2, default 67). A speaker button + slider sit in the transport; on phones the button opens a popover. Saved in 'kks-vol'. The meters read pre-fader.
  - A first visit opens with Nemu + "Five More Minutes" (her app hook).
  - New original songs: "Wind Me Up!" (Tinka's own bubbly music-box pop, chorus leaps up to E6, her demo now) and "Paper Wings / Kami no Tsubasa" (Nemu's sleepy flying song, pochinia asked for a "Fly, My Wings" vibe; original melody + lyrics).
  - Tempo moved to the transport (pochinia 05:59): a 'Tempo · BPM' − [typable number] + stepper (hold to run, clamped 50-200). Changing it stops playback (needs a re-render). On phones the clock hides and the status wraps under the transport row.
  - The song picker is a row of studio tiles (dot = whose song) instead of a native select.
  - Softer faces: lids follow the lash curve; Nemu has droopy tareme corners.
  - Voice: a few cents of slow pitch drift, a vibrato rate wobble + slight loudness coupling, and soft breath intakes before phrases (Tinka .7, Nemu 1.5).
  - English lines (l/v/th/consonant endings) no longer auto-split like romaji ("five" stays one note); magic-e diphthongs.
  - Note-length buttons read 1/8 1/4 3/8 1/2. Desktop editor overflow fixed (grid children min-width 0).
- 05:50 v1.0: Tinka, Nemu, Chin-chan. 6 songs (Twinkle, the jingle, Five More Minutes, Frère Jacques, Sakura Sakura, Ode to Joy). Tap piano roll with keyboard access, lyrics, tempo, karaoke, VU meters. Each singer brings her demo song when the current song is another singer's demo. Fixed a hiss-resonator blow-up that clicked before s/sh after l/m/n (stale coefficients + zero noise centre).

## issues
- Headless helpers share CDP port 9377 / srv 8927. Hold all lock files (scratchpad/hm/kshot.sh does that) or a probe lands in someone else's page.
- A render is ~1 s for a 30 s song on the main thread (headless). The Worker keeps the UI smooth, and the first play of a new song waits for it.

## todos
- Voice polish for Tinka and Nemu (vowel naturalness, glides, vibrato shape). Listen on real speakers and ask pochinia.
- (done v1.3) Genres round: a picker with 🎵 pop / 💧 sad / 🎸 rock / 🌙 lullaby. The Web Audio backing band (drums, bass, chords following key/tempo/swing) plus singing-style changes per genre.
  - Each singer reacts with one line + a tiny expression. Nemu loves sad/lullaby and yawns at rock ("...too loud... *yawn*"). Tinka lives for pop and curtsies at the end of sad songs. Cursed ones do their own thing.
  - It must never block a genre.
- More cute banks: Konta Hidamari (fox-boy tenor), Shuwa Ramune (soda girl).
- Cursed shelf: dial-up modem choir (promised on stream), goose, and a generic monster energy-drink can (no brand: fangs on the pull tab, claw stripes, jittery eyes, fizzy over-caffeinated voice, fast vibrato, crackle, a burp at phrase ends).
- Languages: per-language phoneme tables (EN vowels beyond aiueo, DE ü/ö, FR nasal vowels). An explicit language toggle could beat the line-sniffing heuristic.
- A share link (#hash with the notes + lyrics + singer).
