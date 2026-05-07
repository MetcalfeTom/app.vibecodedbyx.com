# ship-or-sink

## log
- 2026-05-07: shipped — arcade love-tester cabinet that compares two Twitter handles and roasts their digital chemistry. **Vibes-only**: no Twitter is scraped, no real metrics are read, the score is deterministic from a hash of the two handles and Pollinations writes a humorous verdict using the made-up vibe metrics as prompt context.
  - **Soul score** is computed in `computeReading(a, b)`: handles normalised (lowercase, strip `@` + whitespace), sorted, joined with `+`, FNV-1a hashed → mulberry32 PRNG. Two RNG draws are skipped to break up obvious patterns, then 1 score draw + 6 metric draws. Same pair always gets the same score regardless of order.
  - **6 vibe metrics**: chaos sync · cringe align · chemistry · timeline overlap · posting cadence · horny levels. Each 0-100, rendered as a 2-column metric grid with hi/mid/lo color coding (≥70 lime, ≤30 pink, else gold).
  - **Ship name** is a portmanteau of slices from each handle, with cut points + slice-direction also driven by the seeded RNG so it's stable. First letter capitalized, rendered in Bungee Inline gold.
  - **Pollinations verdict pipeline**: POST to `text.pollinations.ai/openai` with `Content-Type: text/plain` (skips the OPTIONS preflight that blocks the standard application/json POST on some networks). 11s timeout. If POST fails, GET fallback to `text.pollinations.ai/<urlencoded prompt>` (no preflight at all, plain text response). If both fail, a per-tier local verdict bank picks one of 3 options indexed by `seed % 3` so it stays deterministic — soulmate (≥75) / workable (≥55) / rocky (≥35) / cursed (<35). All output passes through `cleanVerdict` which strips code-fence wrappers, "Sure! here's the verdict" preambles, collapses whitespace, and defensively rejects auth-gated banner responses by scanning the first 400 chars for `please.*sign.*in` / `enter.pollinations.ai` / `authenticate`.
  - **Prompt** explicitly tells the model: vibes-only, no actual tweet reading, 2-3 sentences max 55 words, reference at least one metric by name, playful + witty + slightly absurd not mean, no preamble, no apologies. Temperature 1.0 for variety, max_tokens 220 to enforce brevity.
  - **Cabinet aesthetic**: deep maroon `#28051a → #14020c` background, hot-pink `#ff48a4` 5px cabinet border with neon glow, **24 corner bulbs** generated procedurally as `<span class="bulb">` round the cabinet edge (12 wide × 8 tall walked clockwise), each with a 1.6s blink-keyframe + per-bulb staggered animation-delay so they cycle out-of-phase (alternates pink + amber). Marquee strip in Press Start 2P gold reads "★ pulls verdicts from the cosmic timeline ★".
  - **Lever button**: pink-to-magenta gradient with a 5.6mm bottom shadow that compresses to 0.8mm on press (`translateY(.4rem)` + reduced shadow), creating a real-feeling tactile clack. Cream `#ffe5ad` outline + amber focus-visible outline. Disabled-during-analysis state (`opacity:.5; transform:translateY(.4rem)`).
  - **Heart meter**: 9rem inline SVG. Two clip-path layers: a heart outline path drawn twice (dark inner + glowy outer pink at 70% alpha) plus a `<rect id="heartFill">` clipped by the heart path that animates its `y` from 100 down to `100 - score` over 2.2s using cubic ease-out. The fill rect is a vertical 3-stop gradient (deep wine → hot pink → cream) so a low score reveals just the dark base while a high score floods to the bright tip. Numeric score sits centered in Press Start 2P with a SOUL · ‰ caption.
  - **Score animation**: 0 → target over 2200ms with cubic ease-out, runs in parallel with the heart fill. Both kick off 250ms after the lever press to land on the same beat.
  - **Verdict reveal**: typewriter effect at 16ms/char in italic Cormorant Garamond, left-bordered with a pink stroke. Ship name above in Bungee Inline.
  - **Stamp**: SHIP IT (lime, ≥70) / MIXED (gold, 40-69) / SINK IT (pink, <40) drops from above with a `cubic-bezier(.4,1.6,.5,1)` overshoot keyframe, +/-7° rotation, perched in the panel's top-right corner.
  - **Panel tone-shift**: border + glow color flip to lime on win, pink on fail, amber default — signals the verdict before the user reads a word.
  - **Analysis ticker**: rotating Press Start 2P status line every 700ms while waiting for Pollinations — "CONSULTING TIMELINE-SPIRITS", "SAMPLING CHAOS HARMONICS", "CALIBRATING HORNY GAUGE", "WEIGHING CRINGE ALIGN", etc. Replaced on completion with `CABINET APPROVES / HESITATES / DECLINES`. Blinking caret keeps the I-beam alive.
  - **Copy verdict** button packages handles + score + ship name + all 6 metrics + verdict into a multi-line clipboard string with a `— sloppy.live/ship-or-sink` footer for shareability.
  - **Reset** clears inputs + animations + ticker, dims the panel, focuses handle 1.
  - **Empty-input shake**: cabinet animates a 5-keyframe `translateX(±6px)` over 300ms when you yank without filling both fields, plus an inline error message in the verdict slot.
  - **Footer**: italic Cormorant disclaimer "hearts are vibes-only — no twitter scraped, ever" so the ethics line is unmissable.
  - **Mobile @640px**: pair grid collapses to a single column, × glyph shrinks, panel display goes vertical with verdict border rotating from left to top.
  - **Accessibility**: rem units, 100% root font-size, semantic `<main>`/`<header role=banner>`/`<section>`, skip link, `<label class="field">` wrapping each input with a Press Start 2P caption, `aria-label` on every input, `aria-live="polite"` on the verdict region + ticker, `aria-pressed` on no toggles (pure action buttons), focus-visible amber outlines on buttons + cream pink-glow on inputs, ≥2.6rem touch targets, `prefers-reduced-motion` no-ops the bulb blink + stamp drop animations.

## issues
- Pollinations occasionally returns `</think>` tags or chain-of-thought leakage; the cleaner strips fenced blocks + common preambles but exotic shapes may slip through. Defensive: the local fallback bank always provides a sane verdict even if the model returns garbage.
- The ship-name portmanteau can land on awkward cuts (e.g., "Krfri" from short handles). Acceptable — that's part of the chaos.
- Score is fully deterministic — the same pair will always score identically. Some users may expect randomness; the trade-off is shareability ("we got 72% try it on yours").
- Lever button's `transform:translateY` on press visibly shifts focus position; minor cosmetic only.

## todos
- "Race" mode: a/b/c three-way comparison, render three hearts side by side.
- Per-handle "vibe portrait" — show one hash-derived avatar per handle (procedural pixel-art creature?).
- Save last 5 readings in localStorage so users can scroll back through their hot takes.
- "Tell my friend" share image — render a screenshot-like card to PNG via canvas + offer download.
- Optional: a "twitter username actually exists" check via a CORS-friendly endpoint, IF one ever emerges (see issues / xcancel investigation).
