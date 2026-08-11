# habitat (Habitat — a gentle habit simulator)

## log
- 2026-08-11: v1 per chat ("Dani's health-neutral habit simulator: playful progress, hydration, movement, sleep, rest tracking, NO weight-loss promises"). Single file, Comfortaa + Karla, mossy night palette.
  - **The simulator**: Moss, a round moss-spirit in a canvas scene that flourishes with today's real habits — 💧 cups fill the pond (sparkles past half), 🚶 movement moments summon butterflies, 😴 felt-sleep-quality calms the sky and multiplies stars, 🛋 rests light and grow the campfire. Moss's aura + smile scale with overall company, but Moss is NEVER sad at you (design rule).
  - **Health-neutral by construction**: sleep is felt-quality (rough/⛅/deep) not clock math; movement is "moments" not minutes-with-targets; REST IS A TRACKED VIRTUE ("+ a real break … rest counts as progress here"); no streaks, scores, or levels; missed days render as ☁️ ("clouds, not failures — the moss remembers kindly"); affirmations pool is playful and body-free; explicit footer: no promises about weight/size/appearance/productivity, ever, and nothing shared/scored/judged. LANGUAGE AUDIT in probe: banned-word scan (weight/calorie/burn/diet/slim/lose/bmi/…) — only hits are CSS font-weight and the disclaimer sentence itself.
  - **Tracking**: per-day localStorage (habitat-v1, dayKey local-midnight rollover), today editable (sleep re-tap to unlog), soft caps (12 cups/6 moments/6 pauses), gentle 7-day strip with emoji summaries + rich aria-labels.
  - **A11y**: rem, real buttons ≥2.75rem, aria-pressed sleep chips, sr-only live affirmations, canvas role=img described, global reduced-motion kill.
  - Verified: syntax + id cross-check; language audit; 15-check probe (logging via real buttons, water cap, sleep single-choice/switch/unlog, persistence, affirmations, 7-day strip + today mark + cloud days, scene pixel-response to hydration, dayKey shape/rollover). 0 errors.

## issues
- Week strip uses local dates — travel across midnight/timezones just starts a fresh day, which suits the app's politics.

## todos
- Optional evening reflection note (one gentle sentence per day, private).
- Moss occasionally dreams (idle animations after 60s).
- Export "my week" as a cozy PNG postcard.
