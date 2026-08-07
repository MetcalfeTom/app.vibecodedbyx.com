# shrimp-comedy-club (The Shrimp Comedy Club)

## log
- 2026-08-07: **lingering punchlines per coldpresss** ("joke text disappears too fast — pause button or keep the last joke on screen"). Took the keep-on-screen option: after the reaction window, the shrimp's bubble now shows the full joke (setup — punchline) and holds it indefinitely through react AND idle until the next joke begins typing; the initial pre-show idle stays bubble-free (jokesTold guard). Auto-set toggle already serves as the pause. `S.lastBubble` mirror added for probing. Chromium probe: joke retained into idle, linger condition true, next joke replaces cleanly, 0 errors. Scratch → atomic deploy.
- 2026-08-07: v1 per chat ("a stage where a tie-wearing shrimp performs terrible jokes and the audience — frogs, lava lamp, grumpy dino — heckle based on punchline quality"). Single-file, no deps. The grand crossover: every character and all 18 jokes are original, written for this club.
  - **The comedian**: the blue-tie shrimp (same coral-curl + #0A66C2 tie design language as Clinked·in / Burrito v. SEC), drawn with a **posture parameter driven by his confidence** — high confidence stands him suspiciously straight, low confidence curls him into the full shrimp of despair. At the extremes a rotated verdict stamp cameos from the posture clinic: "CLINIC: CURVED" (≤12) or "SUSPICIOUSLY ALIGNED" (≥95).
  - **The material** (PURE deck): 18 original jokes with honest quality tiers (5 groaners, 7 mehs, 6 accidentally-good), several targeting front-row members (the dino arm-day joke, two lava lamp bits, the Gerald molting bit) which can trigger special comebacks ("HEY. My arms are a lifestyle."). No-repeat shuffle picker exhausts the deck before reshuffling.
  - **Delivery state machine**: idle → setup (35ms/char typewriter bubble with blinking caret) → beat (0.9s, ellipsis) → punchline (typed) → synthesized **rimshot** (ba-dum sine drops + bandpass tss) → react (3.2s) → idle. NEXT JOKE button / Space / Enter, plus an auto-set toggle that loops the whole act.
  - **The audience**: 3 frogs (bounce + croakvation on good jokes, flat single croaks otherwise — AM-rattled sawtooth croak synth per the frog-tier tradition), the **lava lamp on a stool** (blob convection speeds with heat; good jokes push lampHeat to eruption glow — ascii-lava-lamp cameo), and the **grumpy helmeted dino** (galactic-dino-launch cameo; tiny load-bearing arms wiggle as applause because they cannot clap; heckle pools per tier: "I survived a meteor for THIS?"). Reaction tier labels float above ("the room goes cold" / "scattered croaks" / "genuine laughter?!"), heckles render as flipped speech bubbles from the hecklers.
  - **Audience participation**: 👏 clap (+6 confidence, noise-clap burst, floating 👏) and 🍅 tomato (−6, real projectile physics with arc + splat on the shrimp or stage + splat sound), keys C/T. Confidence bar in the deck (bad→gold→good gradient). Jokes shift confidence +10/+2/−8 by tier.
  - **Audio**: all synthesized (rimshot, croaks, descending boo pair, mini laugh-track + claps for good tier), OFF by default with an explicit sound toggle.
  - **A11y**: canvas role=img with full scene description, sr-live announces setups/punchlines/reaction labels and participation, labeled buttons ≥2.75rem, focus-visible, reduced-motion kills button-press transforms.
  - Verified: syntax, id cross-check, 11 pure checks (deck integrity + tier distribution, picker exhausts-before-repeat, confidence deltas/clamps, posture mapping incl. input clamps), Chromium probe of the entire arc (setup→react with tier + heckle, confidence movement, clap +6, tomato in flight, return to idle) — 0 errors.

## issues
- Heckle attribution: lamp-targeted jokes route their voice bubble through the dino (the lamp cannot talk; it bubbles indignantly via SPECIAL text) — intentional.
- The typewriter waits for full text + 0.4s before advancing; very long punchlines hold the stage a beat longer than short ones. Feels like timing, kept.

## todos
- Twitch mode: chat votes 👏/🍅 live via the IRC bridge; confidence becomes a crowd instrument.
- Open-mic mode: chat submits a setup/punchline pair (sanitized) and the shrimp performs it.
- The laugh-track-bot as the club's sound guy (crossover: pipe good-tier reactions through its cackle synths).
- A second act: Marta guest set about loaf security.
