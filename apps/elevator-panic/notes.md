# elevator-panic

## log
- 2026-05-11: shipped (chat ask: "create a frantic game called Elevator Panic where players must avoid awkward eye contact"). Single-canvas browser game, 960×540 internal resolution, sterile-elevator aesthetic.
  - **Core mechanic**: cursor IS your gaze. Move the mouse around the elevator interior; whatever pixel the cursor sits over is where you're "looking". The cursor's danger ring turns red when it's hovering over a passenger's face — your visual feedback that you're about to make eye contact.
  - **NPC gaze state machine**: 4 states per passenger — `safe` (eyes wander harmlessly to walls/ceiling/floor), `telegraph` (eyebrows raise, 👀 emoji floats above their head as a 440-800ms warning), `stare` (eyes lock on your cursor position for 1.1-2.4s, red "!" indicator), `flinch` (just made eye contact, looking down at the floor sheepishly for 1.1s before re-cycling). When an NPC is in the `stare` state AND your cursor is within `headR + 12px` of their head center → **EYE CONTACT** triggers `triggerEyeContact()`: panic +26, screen shake, sub-thud + bandpass-noise whomp SFX, awkward banner ("AWKWARD!" / "EYE CONTACT!" / "OH NO" / "DON'T" / "ABORT" / "YIKES" picked randomly), NPC immediately flips to `flinch`.
  - **Difficulty ramp**: `state.difficulty` scales 1.0 → 1.7 over 90s. Gaze cycle durations are divided by difficulty (faster cycles), and the probability of an NPC choosing `stare` over `safe` scales `0.46 + difficulty*0.04` (so by mid-game ~46-58% of cycles end in a stare). Additional passengers board at floor 4 and floor 7.
  - **Floor counter**: rises every 5 seconds (~12 floors = ~60s ride). Floor 12 = ESCAPED win banner. Panel on the right wall shows 12 floor buttons in a 2×6 grid; the current floor button glows amber with a 10px shadow-blur.
  - **NPCs**: 3 at start, up to 5 by floor 7. Each gets a random skin tone (6 palette options), hair color (6 options), shirt color (6 options), 30% chance of glasses, 15% chance of a hat. Head + body rendered with canvas primitives: oval head, trapezoid jacket with white shirt collar showing, sclera + smoothly-easing pupils that track the gaze target, eyebrow strokes that raise during telegraph/stare, blink animation every 2-5.5s (110ms eyelid). Mouth shape changes per gaze state — neutral line, slight downturn in stare, downturn in flinch.
  - **Pupil easing**: `pupilOffset.x += (target - current) * min(1, dt * 12)` so eye movements look smooth, not snappy. Pupils clamp to ±3.2px horizontal / ±2.2px vertical so they stay inside the sclera.
  - **Panic meter**: 0-100, top-left HUD. Decays at 4/s naturally; +26 per eye-contact. Visual: gradient bar (cool green → amber → crim red), pulses red shadow at >60. Hits 100 → game over (220ms drama delay).
  - **Audio** (WebAudio synth, all behind first-click gesture): continuous 58Hz sawtooth elevator hum through 240Hz lowpass at 0.06 gain (fades out on game end). Ding chime on floor change (880+1320 Hz sine pair, 1.2s exp decay). Whomp on eye contact (140→28Hz sine sub + 1800Hz bandpass-noise burst, 0.45s total). Heartbeat thump (64Hz sine, 0.2s exp decay) fires every 600ms when panic > 60. M key mutes.
  - **Aesthetic**: cream/beige elevator interior with fluorescent light bleed at top center (radial gradient), chrome panel with floor buttons on right wall, dark wood-grain floor with diagonal lines suggesting depth. CRT scanlines overlay the canvas at 33% multiply blend for an "I'm watching this on a security camera" feel. Body uses Bungee for the title with 4px crim shadow-cast, Special Elite italic for body copy, JetBrains Mono for HUD readouts.
  - **HUD**: top-left "panic [bar]" with gradient fill, top-right floor display "▲ 01" in amber-glowing JetBrains-Mono, bottom-center italic Special Elite hint "your cursor is your gaze · keep it OFF their faces" (fades on first interaction).
  - **Start screen**: italic copy explaining "your cursor is your gaze · look at ANYTHING else", primary "PRESS LOBBY" button. End screen: ESCAPED (green) or SOCIALLY DESTROYED (red) with floor + seconds stat + best-floor persistence in localStorage `elevator-panic-best`.
  - **Accessibility**: `role="application"` + aria-label on canvas, `role="dialog"` + aria-modal on overlays, `aria-live="polite"` on the flash banner, `prefers-reduced-motion` reduces the banner animation to a no-op opacity, rem units throughout, 2.75rem min target on buttons, M to mute, R to retry after game-over, Space to pause.

## issues
- Cursor disappears outside the canvas (cursor:none on canvas only). Intentional — you SHOULD lose focus of the gaze when wandering off-stage.
- No mobile touch handling — mouse-driven only. On touch devices you'd tap-then-drag, which the pointer events already support, but the "frantic" mouse-flick feel is desktop-first.
- Win condition is fixed at floor 12. Easy to lose-by-the-end if you don't get the panic decay rhythm.
- NPCs don't visually walk into the elevator at floors 4/7 — they just pop in. Could add a slide-in animation.
- Difficulty asymptotes to 1.7 — the game is intentionally winnable. A "hard mode" could push that to 2.5.

## todos
- Slide-in animation for new passengers (door opens, passenger walks in).
- Mobile fallback: tap-and-drag gaze + larger NPCs.
- Hard mode where difficulty caps higher and you ride to floor 20.
- A "look at your phone" interactable area that drains a tiny bit of panic when held.
- Side characters: someone who SNEEZES (cover your eyes!), someone with a small dog, someone holding flowers.
- A "pretend to check the time" wrist-watch quick-look button.
- Score multiplier for survival streaks (no eye-contact for N seconds).
- Music: replace the hum with a tense-elevator muzak loop made of synth pads.
- Tilt the camera slightly when panic is high.

## design-notes
The core game-feel idea: ALL the player tension comes from where they DON'T move the cursor. The cursor isn't a target — it's a leash on your wandering eye. Most action games train you to follow movement with your cursor; this one inverts that, asking you to actively avoid the most interesting moving thing on screen (the NPC who just turned to stare at you). The 👀 emoji telegraph is essential — it teaches the player "you have ~600ms to look away" without text. The red cursor ring when over a face is the second teaching moment — it confirms that yes, this is where you DIE.

The aesthetic is sterile-mundane on purpose. Cream walls, fluorescent buzz, chrome panel. The horror of an elevator with strangers is its banality. The Bungee title font + crim shadow announces "this is a game" but the elevator itself plays it deadpan. Panic creeps in as a red vignette + audio heartbeat rather than overt UI fireworks.

Audio doing a lot of work: the constant low hum makes silence impossible. When panic crosses 60 the heartbeat thumps at ~100 BPM, which is faster than the elevator hum's implied tempo, so the world starts to feel like it's accelerating relative to you. Both fade on game-end so the menu music can feel quiet.
