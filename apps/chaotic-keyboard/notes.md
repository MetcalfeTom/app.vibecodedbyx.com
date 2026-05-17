# chaotic-keyboard · notes

## log
- 2026-05-17: v1 — **every key press releases a random animal sound (Web Audio synth) + huge emoji + 8-14 emoji-confetti burst** per chat ask: "create an app called chaotic-keyboard that plays random animal sounds on key presses." Lives at `/chaotic-keyboard`. Single file ~30KB, no external audio assets, no library.
  - **16 beasts** with hand-tuned Web Audio synthesis (no sample files needed):
    1. 🐶 **Dog · WOOF!** — sawtooth burst 250→180Hz + 80ms bandpass-noise transient (1500Hz Q=5)
    2. 🐱 **Cat · MEOW!** — sine pitch sweep 800→1100→650Hz over 0.5s with 6Hz vibrato LFO (±22Hz)
    3. 🐄 **Cow · MOOO!** — fundamental 120Hz sine + 60Hz sub, slow descending tail to 110Hz, 3Hz wobble LFO (±3Hz)
    4. 🐔 **Chicken · BAWK!** — 3 short bandpass-noise clucks (800→1200Hz) at 85ms spacing, then a rising "buk-AWK" sawtooth from 600→1100Hz
    5. 🦆 **Duck · QUACK!** — sawtooth 380→240Hz through dual vowel-formant bandpass stack (800Hz Q=8 + 1200Hz Q=8)
    6. 🐷 **Pig · OINK!** — 2 low sawtooth grunts at 200→140Hz, 160ms apart, through 800Hz lowpass
    7. 🐑 **Sheep · BAAAA!** — buzzy sawtooth at 320Hz with strong 11Hz pitch vibrato (±38Hz) + 22Hz amp tremolo
    8. 🐸 **Frog · CROAK!** — lowpass-filtered noise (340Hz Q=3) with 28Hz amplitude tremolo
    9. 🦉 **Owl · HOOO-HOO!** — two soft sine pulses at 330Hz, 340ms apart
    10. 🐺 **Wolf · AWOOOO!** — long sine 400→520→330Hz over 1.25s with 4.5Hz vibrato (the only ~1.3s beast)
    11. 🦁 **Lion · RRROAR!** — sawtooth 80Hz through tanh waveshaper (`tanh(x * 4)`) + 600Hz bandpass-noise grit layer
    12. 🐝 **Bee · BZZZZ!** — sawtooth 200Hz with 65Hz amplitude modulation (sine multiplier on gain.gain)
    13. 🐎 **Horse · NEIGH!** — 4 descending sawtooth blips (620, 540, 460, 380Hz), each 80ms, lowpass at 1200Hz
    14. 🐧 **Penguin · SQUAWK!** — sawtooth 460Hz + 1200Hz bandpass-noise layer, 0.2s
    15. 🦅 **Eagle · SHREEK!** — highpass noise 3000Hz + 3800Hz bandpass + descending 2400→1600Hz sine whistle
    16. 🐘 **Elephant · PAAARP!** — sawtooth 200→260→220Hz with bright lowpass sweep (600→1600→900Hz), 0.65s
    - Every beast gets ±4-6% per-press pitch jitter via `jitter(f, pct)` so two presses of the same animal sound subtly different (chaos within chaos).
  - **Trigger model**: window-level `keydown` listener on ANY key (alphanumerics, modifiers, arrows, function keys — all of them). 40ms throttle (`FIRE_THROTTLE_MS`) caps super-spam so OS key-repeat doesn't melt the audio bus. Anti-repeat: when picking, filter out the immediately-previous beast so consecutive presses always swap.
  - **Pointer interaction**: tapping anywhere on the centre stage card also fires a random beast (touch / mouse-only / phone users not left out). Each beast tile in the menagerie grid also acts as a "summon this specific beast" button (click or keyboard Enter/Space).
  - **Visual chaos**:
    - **Big-emoji stage**: massive (5-9rem) bouncing emoji thumps in with a `thump` cubic-bezier(.34,1.40,.50,1) keyframe (scale 0.5→1.15→1 + rotate -12°→4°→0°). Below: ono-glyph in the beast's accent colour with strong text-shadow glow + Caveat-italic name and × count. Bottom: monospace "key: X" chip showing what was pressed.
    - **Emoji confetti**: 8-14 fliers spawn from the centre stage on each press, flying outward at random angles (120-380px distance), rotating ±720°, sized 1.6-3.0rem, animated via `fly` keyframe over 1.6s (translate + rotate + scale down + fade), auto-removed after 1.7s. Each flier is the beast's emoji so the screen fills with the animal that just released.
  - **Menagerie grid** (auto-fill 5.4rem cards): 16 beast tiles with emoji + lowercase name + Space-Mono press-count. Last-summoned beast gets a pink-glow `.recent` highlight ring. Click any tile to summon that specific beast (overrides the random pick — useful for chat tests). Keyboard-accessible (Enter/Space).
  - **HUD stats** (`role="status" aria-live="polite"`): 3 chips — 🐾 total presses · 🦁 unique unleashed (N/16) · ⌨️ most-chaotic key (key + ×count). Recomputed after every release.
  - **Controls**: 🔊 sound on / 🔇 muted toggle (aria-pressed), 🐾 release all (fires every beast in sequence at 95ms spacing — a 1.5s stampede), ↺ reset stats (clears all counters + restores the press-any-key prompt).
  - **Aesthetic**: deep-purple synthwave bg (#1d0f3d → #3a1a6a) with 3 radial accent glows (gold top + lime bottom-right + pink bottom-left). Title in Bungee at `clamp(2.4rem, 8vw, 5rem)` with pink→gold→lime→cyan 4-stop gradient via `-webkit-background-clip: text`. Tagline in Caveat. Stats chips in Space Mono. Stage card on a 0.30-alpha black panel with gold rim. Three animated `<span class="e">` emojis in the title that bobble between ±6° rotation on a 2.6s loop.
  - **Audio init**: lazy via `ensureAudio()` on first user gesture (any keypress or pointer). Resumes if suspended. Mute toggle short-circuits all audio without breaking the visual chaos.
  - **WCAG-AA per project convention**: rem units, semantic main/header/section/footer/h1, `role="status" aria-live="polite"` on stats chips, `role="list"` + `role="listitem"` on the menagerie with each beast tile keyboard-focusable + Enter/Space activated, `aria-label` on each beast tile + the controls, `aria-pressed` on the mute toggle, `aria-hidden="true"` on decorative emojis (big stage emoji + confetti root), `:focus-visible` 3px gold outline, ≥44px (2.75rem) min-height on all interactive targets, `prefers-reduced-motion` kills the bobble + thump + fly + transitions but the audio + state still works.
  - **OG image**: Pollinations flux seed 2424.

## issues
- Synthesised animal sounds are approximations — recognisable as the right vibe but not photorealistic. The chaos value comes from the rapid swapping + the ono-glyph reinforcing the species, not from perfect bark fidelity.
- 40ms throttle is intentional but can feel slightly laggy if you're trying to fire 25 presses/second. Could be relaxed but audio quality degrades with overlap.
- Modifier combos (Ctrl+R, Cmd+T, etc) still trigger animal sounds before the browser handles the shortcut — by design (chaos), but might surprise users trying to reload.
- The wolf howl is 1.35 seconds — longest beast in the menagerie. If the user is mashing keys, multiple howls can overlap. Web Audio handles this gracefully but it can get loud.
- No localStorage persistence of stats — closing the tab resets everything. Could persist `state.perBeast` + `state.perKey` if chat asks.
- No leaderboard or sync across users. Single-player chaos for now.
- Confetti DOM elements (8-14 per press) at high press rates can grow the DOM briefly — auto-cleanup at 1.7s caps it but you'll see momentary load on rapid mashing.
- Mute toggle clears audio but the stage still flashes — so a silent observer can still see chaos happening on a streamer's monitor. Could add a "stage-only" mode that suppresses both.

## todos
- Persist stats + recent-beast across reload via localStorage
- Per-key consistent mapping mode ("Q always = cow") toggle
- Add a "stampede" mode that auto-fires beasts on a timer
- More beasts: dolphin, donkey, rooster crow (separate from chicken cluck), goat (different from sheep), turkey, kangaroo, parrot
- Combine 2+ beasts at once with Shift+key for combos
- Twitch chat hook: each chat message fires a beast deterministic on `fnv1a(username)` → like neon-aquarium pattern
- A "find the beast" mini-game — game says "find the cow!" and player must press until they get one
- Optional reverb/delay master bus for room ambience
- Visual: paint persistent emoji trails on a background canvas instead of fading confetti
