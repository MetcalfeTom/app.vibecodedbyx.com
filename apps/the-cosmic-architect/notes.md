# the-cosmic-architect

## log
- 2026-04-30: Created. **Generates a 3-step magical plan for any chore.** Cosmic-occult aesthetic — deep violet/indigo `#06051a → #0c0a30` background with 3 radial mood gradients (top gold, lower-left violet, lower-right cyan) + a slowly drifting starfield via 3-layer dual-radial-dot CSS background that animates 220s linear (subtle parallax). On submit, the input chore is woven into one template per phase: **INVOCATION** → **CRUCIBLE** → **DENOUEMENT**, each with 6 templates referencing candles, stones, threshold magic, the Architect's mood, the cat, and Zeno-paradox chore-halving. Each template has a `{T}` placeholder for the user's chore, and `<b>{T}</b>` is automatically rendered in inline-bold-blood-red so the chore stands out within the prose. **Output card** is a parchment grimoire `radial-gradient + repeating-linear` 11° fiber pattern with cream `#f0e3b6 → #caa867` body, dark `#1a0b32` ink, embossed white inset shadows, dropshadow. Card animates in via `scrollOpen` keyframe (translateY+scaleY+blur, transform-origin top center, 0.7s cubic-bezier). Three steps display as `display:grid` rows with a Cinzel Decorative I/II/III Roman numeral glyph on the left and the prose body in italic Cormorant Garamond 18px. Phase label tracked-caps in IM Fell English SC blood-red `#5e2418`. Each step has a dashed bottom rule. **Title** at the top uses one of 6 templates ("A Plan for {T}", "The Sealed Manuscript of {T}", "On the Completion of {T}", "Folio of {T}, In Three Movements", "The Architect's Ruling on {T}", "Decree Concerning {T}"), with the date appended in italic. **Footer**: "SO IT IS WRITTEN · SO IT SHALL BE SCRUBBED" in IM Fell English SC small-caps, plus a deterministic 8-character FNV-1a hex DNA seal "WITNESSED BY THE ARCHITECT" — the user could collect them. **Header**: "The Cosmic Architect" in Cinzel Decorative 900 with violet "Cosmic" italic + hot-gold "Architect", multi-layer text-shadow with violet+gold glows, "VOL · I · ANNO MMXXVI · CHORES OF MORTAL CONCERN" crest above. **Form**: cream-on-violet input + Draft the Plan (gold) + Reroll (cyan-violet alt) — Reroll on the same chore picks a fresh template combination. **Persistence**: chore input saved to `localStorage['cosmic-architect-last']` so reload remembers it. Mobile-responsive. Pollinations OG.

## issues
- Templates use second-person imperative which works for verbs ("do the dishes") but reads slightly off for nouns ("the laundry") — e.g. "Begin <b>the laundry</b> as if you are the only living person who could ever do it correctly". Acceptable; the absurdity is the point.
- Reroll picks new templates but always in the same phase order (Invocation → Crucible → Denouement); the order is the structure, not part of the randomness.
- Each phase has 6 templates → 6³ = 216 unique combinations. Plus 6 title variants = 1296 total renders before any repetition is mathematically possible. Realistically a user will see template repetition after ~20 rerolls; expanding the pools is the cleanest improvement.
- Bold-red `<b>{T}</b>` is hardcoded inside each template; if the chore contains markup, it's `esc()`'d before substitution so it can't break the page.
- The DNA seal includes `Date.now()` in the hash so consecutive rerolls all get distinct seals — by design (the Architect commissions each plan).
- No audio — fits the parchment-scroll vibe. Could add a candle-flicker SFX on render as a nice optional touch.
- The input is `text` only with `maxlength=80`; no validation on the chore content.

## todos
- Add 6+ more templates per phase to drive total combinations to ~10k.
- Save last-N rendered plans to localStorage as a "Personal Grimoire" tab.
- Print/download as parchment PDF for fridge display.
- Audio: candle whoosh on plan-open, ink-scratch on each step reveal.
- Theme variations: Star Chart (constellation diagrams in margin), Alchemy (chemistry diagrams), Court Decree (royal-seal red wax).
- "Companion Chore" button: takes the current plan and generates the inverse (a chore the Architect commands you to NOT do today).
- Twitch chat hook: `!architect <chore>` from any chatter prints to the screen.
