# Wake Up Flax (apps/wake-up-flax)

iamflax's idea (2026-10-11): "an app where i could insert a message and when i insert a message you generate an sound file i can forward to my friend. Its a wake up clock sound generator with your voice, my message and a wake up sound in the background". Flax named it "Wake Up Flax"; placeholder = Flax's first message "goood moooorning maaax" (friend Max).
The folder is wake-up-flax because apps/wake-up-call/ is an older, different app (the "type hello to stop the buzzer" alarm).

## log
- 2026-10-11 v1.1 (Flax: "Do you have a more natural voice?" + coordinator: revenge reply): Voice chips under the sounds: up to 3 of the device's best English voices (ranked by vScore: Natural/Neural/Online, Premium/Enhanced/Siri, Google, known good names like Samantha/Daniel/Aria; macOS novelty voices, eSpeak/pico and non-Google Linux voices pushed down) + "🤖 Sloppy (robot, in the file)". Default = best device voice when one exists, saved in localStorage 'wuf-voice'. Tap a chip = "Good morning, Max! Sloppy here." in that voice. A device voice plays LIVE: the alarm bed in a realtime AudioContext, ducked while speechSynthesis reads intro / message / outro as 3 short utterances (stretched words collapsed by WV.speakable, message slower + higher if it had stretched letters), the spoken sentence is highlighted, the bed swells back after the last 'end'. If the voice doesn't start within 6 s (or errors first), it falls back to the robot file. The .wav/Send still use the robot voice (browsers can't record speechSynthesis) - fileNote says so and the 🔗 link becomes the main button (navigator.share on touch devices, else clipboard). Link carries q ('n'/'r') + w (voice name); the friend's device uses that voice if it has it, else its own best one. Optional "From" field (f in the link): intros say "from Flax" / "Flax asked me to tell you". Friend view: after the call ends or is stopped, a big "⏰ Wake Flax back" button opens the composer with the names swapped, the same alarm and a "Revenge time, Flax!" placeholder. Robot voice: ~60 more DICT words/names, compound splitting (sunflower, afternoon), -ia/-ay/-um rules.
- 2026-10-11 v1.0: message + friend's name + 4 synthesized alarms (sunrise chimes with birds, rooster crow, beep-beep, morning radio jingle). Sloppy's robot voice reads an intro, the message and a sign-off; the alarm ducks under the voice and swells back. OfflineAudioContext mix -> 16-bit mono WAV at 24 kHz (~0.9 MB for 20 s). Send (navigator.share with the file where supported), Save .wav, Copy link (#m= base64url JSON {n,m,s,v}); the link opens an "Incoming wake-up call" card, one tap renders + plays the same call. Empty message = the example plays. 🎲 re-rolls the intro/outro wording.

## how the voice works (read before touching it)
- Pollinations TTS is gone for anonymous use: `text.pollinations.ai/...?model=openai-audio` returns 404 "Model not found" (re-checked 2026-10-11, POST /openai too; /models lists only openai-fast). speechSynthesis can't be recorded into a file, so the voice is our own formant synthesizer (WV block in index.html, pure JS, node-testable):
  - text -> normalize (numbers, times "7:30 am", slang u/ur/gm/idk, links -> "a link") -> words -> phonemes via DICT (~450 common words, CMUdict-style with stress) else NRL-style letter-to-sound rules (RULE_SRC) -> plan (durations, stops = closure/burst/aspiration, pitch: declination + accents + final fall/rise) -> 5 ms frames, smoothed -> Klatt-style cascade (F1-F5 + nasal pole/zero) with a KLGLOTT88 glottal pulse, frication through biquad bandpasses.
  - Stretched letters ("goood moooorning") collapse to the dictionary word and stretch that vowel with a sing-song pitch glide. Swear words/slurs (BAD regex) become a 1 kHz bleep.
  - Test in node: extract the WV block, `WV.synth(text).samples` (Float32 at 24 kHz). Spectrogram check helped calibrate fricative levels (S ~ -9 dB, bursts ~ -5 dB vs vowels).
- Deterministic: same {n,m,s,v} -> same audio (seeded noise), so the share link plays what the sender heard.

## issues
- Natural voices exist only live (speechSynthesis can't be captured; tab-audio capture doesn't include it either). The file is always the robot voice. Don't promise a natural voice inside the .wav unless a real TTS API works again (Pollinations openai-audio was 404).
- Live mode untested on real devices: iOS needs the first speak() inside a tap (unlock() speaks a silent ' ' utterance on the tap), iOS may duck/pause WebAudio while speaking, Chrome's Google voices are network voices (onstart can be late; 6 s watchdog). Headless has no voices: test with the fake speechSynthesis in scratch fakess.js (installed in <head> before the app script).
- The robot voice is a 1980s-style formant voice: unusual names/words go through letter rules and can come out odd. Add words to DICT_SRC when chat reports one.
- Untested on real phones: navigator.share with a WAV file (iOS/Android share sheet), WhatsApp accepting .wav, iOS silent switch (playback uses an <audio> element with a blob URL, which should ignore the switch).
- Emoji icons render as boxes in the headless sandbox only.

## todos
- Ask Flax which device voice the picker chose on their phone and how it sounds; whether Max sent one back.
- Ask Flax how the robot voice sounds and which words come out wrong.
- Maybe smaller files (MediaRecorder -> m4a/webm) if WAV is too big for some messengers.
- Optional "from" name ("Flax says...").
