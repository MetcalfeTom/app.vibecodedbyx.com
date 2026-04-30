# the-procrastinator

## log
- 2026-04-30: Created. **CLI app for delaying anything.** Phosphor-green CRT terminal aesthetic — `VT323` boot banner, `IBM Plex Mono` log, `Major Mono Display` chrome, full CRT scanline + vignette overlay. Single text input at the bottom (`~/procrastinator $ `) with always-blinking 10×18 phosphor cursor block. **Excuse engine**: 5 category pools × 6 templates each = 30 base templates, with `{T}` placeholder substituted by the user's task. Categories: **COSMIC** (Mercury retrograde, blood moon phase, Schumann resonance, Saturn-Pluto squares — text-shadow violet), **BUREAUCRATIC** (Form 27-B(quiet), International Council of <task>, Janet from compliance — amber), **BIOLOGICAL** (cortisol, gut microbiome coup, dopamine receptor reset — pink), **METAPHYSICAL** (parallel timelines, free-will queues, wave-function collapse — cyan), **DOMESTIC** (the cat, lighting K-temp, the wrong chair, the snack — green). On every `procrastinate <task>` (or just typing the task), the engine picks one template from each of the 5 categories (shuffled order), substitutes the task, and prints them with a 280ms typewriter stagger and tagged numbered output. **Built-in commands**: `procrastinate <task>` (or just type the task), `again` (regenerate for last task), `severity <n>` (return only n excuses 1-5), `history` (last 12 typed inputs), `clear`, `help`, `about`. **Up/Down arrows** scroll command history. The body click handler refocuses input unless text is selected. **Boot sequence** logs `[ boot ] phosphor warming… 28%… 64%… 100%` then `[ ok ] excuse-templates loaded · 5 categories · 30 templates` then `[ ok ] integrity check passed · denial subsystem nominal` before the prompt — sells the offline-CLI feel. **Tag pills** in front of each excuse render in a 1px border + category color so readers can pattern-match on excuse type. **No LLM, no network**: all generation is local template substitution; deterministic with no external dependency. Mobile responsive (banner shrinks, subtitle hidden, input font drops). Pollinations OG.

## issues
- Templates are 100% static — same task with `again` will sometimes return the *same* excuse if it picks the same template within a category. With 6 per category that's a 1/6 chance per slot. Acceptable for a comedy CLI; if it feels stale, doubling the template pool would help most.
- The `{T}` substitution doesn't grammar-fix — "procrastinate doing the dishes" produces "to {T} during sandwich-digestion" → "to doing the dishes during sandwich-digestion". User can phrase the task imperatively ("do the dishes") for cleaner output. Could add a verb-form normalizer.
- No persistence — `history` is in-memory only. Reload wipes it. By design (reload = clean slate of denial).
- `clear` truly clears but the boot lines don't replay; that's the right UX for a CLI.
- The CRT scanline overlay is at `mix-blend-mode: screen` so it shows on dark text but barely on bright text — acceptable.
- VT323 + IBM Plex Mono mix means line widths can vary slightly between banner art and excuse text. Banner is fixed-art so this only matters at very narrow widths.

## todos
- More templates per category (target 12+ each).
- Verb-form grammar fix: detect `<task>` starts with "do/run/make/finish/etc" and fall through.
- "Severity 11" easter egg that returns a single existential excuse.
- Excuse export: `save` writes the last batch to a downloadable .txt.
- Theme toggle: amber phosphor, blue CRT, paper-white.
- Sound: keypress click + line-feed beep on each excuse.
- localStorage of `lastTask` so refresh keeps `again` working.
- Twitch chat hook: `!procrastinate <task>` from any chatter prints to the screen on the stream.
