# do-not-redeem · notes

## log
- 2026-05-12: shipped v1. Satirical phone-scam roleplay where the player is the scammer and Harold is the scam-baiter. 5 acts × 3 dialogue options, branching by 3 stats (pressure / suspicion / frustration). Each player choice has a tone (calm/lie/panic/auth/greedy/cave) and Harold has 3 response variants per choice keyed by his suspicion bucket (<30 / 30-59 / 60+). SpeechSynthesis voices: low pitch + slow rate for Harold ('old' profile), faster brighter pitch for the scammer. Web Audio synth dial tones (DTMF-ish), ring cadence (440+480Hz, 2s on / off pattern), hangup tone (350+440Hz). 6 ending paths based on stat thresholds; the canonical 'do not redeem' ending requires pressure ≥ 90 AND suspicion < 40. Strong educational disclaimer in both the intro and end overlays — every ending lesson teaches a real anti-scam principle. Aesthetic: beige rotary-phone plastic + dim call-center wall + green CRT transcript with scanlines + amber LCD on the phone. Fonts: VT323 + Special Elite + IBM Plex Mono. Keyboard 1/2/3 picks options, M toggles mute.

## issues
- TTS depends on browser voice availability — Chromium/Firefox have decent EN voices, some Linux/embedded browsers ship with none. Voices array is populated async via `onvoiceschanged`; first speak() after page load may use the default voice while voices warm up.
- `speechSynthesis.cancel()` on mute means in-flight utterance is cut hard. Acceptable.
- The 'cave / confess' branch in Act 4 is the only one that drops pressure to 0 in a single click (effect = -100). That's intentional — it routes to the most humane ending.
- Typewriter speed is 22ms/char; long lines (~140 chars) take ~3s. Don't shorten without checking that Harold's quips still land.

## todos
- Add a few more "random callback" voicemails — Harold's daughter, the cat
- Optionally: Pollinations AI dialogue spice for Harold's free-form jokes between acts
- Add per-act ambient (clock tick, cat purr, distant fax machine)
- Achievement-style end screen tracking how many runs got each ending

## design intent
This app is parody. Playing the scammer makes them look ridiculous — every successful path either fails outright, gets recorded by Harold for his memoir, or ends with the player confessing. The "do not redeem" ending is the meme payoff. Disclaimer copy is non-negotiable: it has to read as awareness, not as a how-to.
