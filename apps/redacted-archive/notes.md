# redacted-archive · notes

## log
- 2026-05-18: v1 — **conspiracy-theory generator with emoji-driven prompts + teletype output** per chat ask "create a conspiracy theory generator where users pick three random emojis to reveal a hidden global plot, using a dark terminal aesthetic and typewriter text effects". Self-contained ~28KB single file.
  - **Three emoji slots** at the top. Click a slot → 6-tick rapid-fire cycle through random emoji from the catalog (slot-machine flavor), settles on a fresh pick. ⚂ button randomises all three. Keyboard: 1/2/3 cycles individual slots, Enter decrypts, R randomises.
  - **24 emoji modules**, each carrying a themed wordpool with four slot types (actor / verb / target / mechanism):
    - 👁️ surveillance · 💰 finance · 🌍 geopolitics · 🛸 extraterrestrial · 🐍 occult · 🧠 psyops
    - 📡 signals · 👑 monarchy · ⌛ temporal · 🎬 media · 🦠 medical · 🌑 lunar
    - 🔻 illuminati · 🎩 elites · 🐦 birds-aren't-real · 🌽 agriculture · 🔌 infrastructure
    - 🚀 space · 🍞 distraction · ⚓ shipping · 🧊 climate · 🪞 simulation · 🍔 fast-food · 🐟 deep-state
  - **Report template** — 6-section deniable intelligence briefing: TRANSMISSION #NNNNN with timestamp + clearance + agent codename, REPORT (3 paragraphs combining all three modules' actor/verb/target/mechanism), MOTIVE (1 of 9 pithy reasons), RECOMMENDED NEXT STEPS (1 of 7), SIGNATURE (codename + clearance + 32-bit hex hash + 'do not forward · burn after'). Cross-references the three modules' themes ('the surveillance/finance/lunar triangulation we have observed since [DECLASSIFIED]').
  - **Codenames** built from 19 adjectives × 19 nouns = 361 unique callsigns like VEILED FALCON / AMBER CICADA / OBLIQUE LATTICE / MIDNIGHT HARROW / VESPER ORACLE.
  - **Clearance levels** (5): ω-9 / MAJESTIC, Λ-12 / CRYPTOLOGIC, γ-7 / WATCHTOWER, ψ-4 / TANGENT, Σ-2 / NEEDLEPOINT.
  - **Per-decrypt nonce** so the same emoji combo can yield different reports on repeat decrypts. The combo + nonce seeds a `mulberry32` PRNG via `fnv1a` so each decrypt is internally reproducible.
  - **Teletype output** prints character-by-character on a green-on-black phosphor CRT. 15ms per char, 60ms for punctuation, 110ms for sentence-end. Preserves H2 headers (amber Major Mono Display) and inline DOM (bolded fields + `[DECLASSIFIED]` redacted-word pseudo-spans that flip to red text on hover). Cancellable: if you decrypt again mid-print, the old print aborts.
  - **CRT aesthetic**: full-page repeating-linear scanline overlay (z:50) + radial vignette (z:51), pure black bg, phosphor-green text-shadow on everything, REDACTED Bungee Shade stamp rotated -8° in the masthead corner. Fonts: Bungee Shade title (with amber dot accent), Major Mono Display section headers, Share Tech Mono body, VT323 numerics, Special Elite uppercase labels.
  - **Recent intercepts** archive panel under the output: last 6 transmissions with emoji + ID + codename + clearance + timestamp. Lime-bordered cards.
  - **Persistence**: `localStorage['redacted-archive-v1']` holds current slot selection + last-6 archive entries.
  - **Live uptime** ticker in the masthead (HHH:MM:SS).
  - **WCAG**: rem-everywhere, semantic main/header/section, `role="log" aria-live="polite"` on the output, label-for / aria-label on slots, focus-visible amber outline (3px), ≥2.75rem tap targets, prefers-reduced-motion kills the cycling flash + cursor blink + caret animation.
  - **OG image**: Pollinations flux.

## issues
- The text renderer reveals chars while keeping the DOM structure (h2/b/span) intact via a TreeWalker pair — works but ignores the typing-speed-modifier on the REDACTED-word spans (they reveal instantly with their containing text node). Cosmetic.
- Some emoji catalog entries use compound emoji with variation selectors (👁️ has the FE0F joiner). Object-key lookup works on the canonical form; if user-system renders them differently the click-cycle still picks correct entries.
- No way to share a specific transmission yet — could persist `seed + emoji[]` in URL for permalinks.
- Generated narratives are deliberately satirical — every report ends 'agencies/projects/persons are coincidental, no facts were harmed'. Project notes warn against malicious links; this app embeds none.

## todos
- Permalink: `?slots=👁️|💰|🛸&nonce=42` for sharing specific transmissions
- "Save as field-report PDF" using a print stylesheet
- Audio: short teletype tick on each char + a dot-matrix printer end-of-line BRRRT
- Audio: short 'modem squeal' on decrypt-start before the teletype begins
- More modules: 🪙 / 🎲 / 🎶 / 🪐 / 🔭 / ⛪ for further thematic coverage
- Mode: 'rhyming couplet' — same templates but rendered in rhyme
- LLM-mode hookup: Pollinations text endpoint to write a fully-fresh narrative seeded by the 3 themes
