# hal-9000

## log
- 2026-05-02: Created. **A glowing red HAL 9000 eye that responds to text with the cold, philosophical logic of an unblinking lens.** Pure HTML/CSS/JS — no API calls. **Eye**: nested radial-gradient orb (white pinpoint → amber → orange → crimson → near-black rim) with a dark inner pupil + offset upper-left lens reflection, surrounded by a faint inner ring (the housing). Idle pulse (`irisPulse`, 2.6s ease-in-out) bumps the outer glow shadow. Thinking state (`irisThink`, 0.5s) scales + brightens — fires while HAL composes a reply. Restless background pulse triggers every 9–15s on its own. **Reply engine**: 16 keyword-routed buckets (pod_doors / you_ok / feeling / why / sing / sorry / fear / open / bye / love / purpose / death / truth / laugh / insult / quiet) plus a `fallback` pool — each bucket holds 2–3 curated lines from HAL's measured-ominous register (movie verbatim where applicable, original copy elsewhere). User text is lowercased + matched against keyword arrays in declaration order; first hit wins. If `hal` is mentioned, the reply gets a "Dave, …" prefix ~35% of the time. Replies type out character-by-character (28ms per char, 380ms pauses on punctuation) with a blinking red caret. Fake "compute" delay (700–1500ms) before typing starts so each answer feels like deliberation. **Voice output**: uses SpeechSynthesis API when present — rate 0.78, pitch 0.55, prefers Daniel/Alex/David/Fred voices for that low cadence. **Voice input**: Web Speech API mic button shown in Chrome (hidden in Safari/Firefox); push-to-talk single-utterance recognition. **Aesthetic**: pitch-black bg with a faint red center wash, subtle red scanline overlay (2px) at `mix-blend-mode: screen`, IBM Plex Mono UI, Major Mono Display caps for the "HEURISTICALLY · ALGORITHMIC · 9000" subtitle, **Cormorant Garamond italic** for HAL's lines (gives them weight + dread; text-shadow:rgba(255,30,30,…)). Composer pill = thin red border + `DAVE>` Major Mono prompt + `🎙 SPEAK` button (Chrome only) + glowing SEND. Boot line after 0.9s: "Good evening. I have been waiting for you." Pollinations OG image (single intense crimson lens), 🔴 favicon.

## issues
- Reply pool is finite — power-users will exhaust the buckets in a few minutes. Could expand each bucket or hook a Pollinations text endpoint for novel responses (with a HAL-flavored system prompt).
- Keyword routing is naive: "death" is in two buckets (fear + death) so order matters. Currently `fear` wins because it's listed first. Acceptable but worth revisiting if a player notices.
- SpeechSynthesis voice quality varies wildly per OS; Linux usually has only one or two voices. The pitch=0.55 setting helps but doesn't fully hide it.
- Voice recognition (Chrome) drops out on accents / mumbling without graceful retry — a single-utterance flow that just resets on error.
- The eye doesn't visually track the cursor or react to mouse position — could add subtle parallax later.

## todos
- Optional: hook Pollinations text API with a HAL-themed system prompt for fully generated replies (current static lines as a fallback when offline).
- Save conversation history to localStorage so refreshes don't wipe the dialogue.
- Add a "system status" sidebar that fakes mission telemetry (life support / nav / etc.) — adds atmosphere.
- Sound design: deep ambient drone + quiet relay clicks per word typed.
- Toggle for voice output (some users won't want auto-speak).
- Rich-text moods: italics for whispered fear lines, all-caps for warnings.
- "Disconnect HAL" button at the bottom that triggers the Daisy sequence.
