# ramen-rater (Ramen Rater)

## log
- 2026-07-03: shipped (chat ask: "ramen-rater as a retro journal with region picker, broth sliders, and a slurp-o-meter").
  - **Retro journal aesthetic**: two facing paper pages on a dark diner-wood bg — ruled-line paper (repeating-linear), red margin rule, Caveat handwriting for names/notes, Yuji Syuku brush title ("RAMEN 拉麺 RATER"), IBM Plex Mono metadata. Entries are tilted paper cards (±1.4° via seed) with an animated red "RATED" rubber stamp (`stampIn` scale-slam keyframe on save).
  - **Region picker**: 9 rotated stamp-look toggle buttons (aria-pressed): Sapporo·miso / Hakata·tonkotsu / Tokyo·shoyu / Kitakata / Korea / China·lamian / Thailand / Vietnam / Instant Aisle. Optional (entries can be UNSTAMPED).
  - **Broth sliders**: 4 ranges with bipolar labels — assari↔kotteri (rich), mild↔volcanic (spice), whisper↔ocean (salt), subtle↔fifth-taste-god (umami). Dashed-ink tracks, broth-gold droplet thumbs. Values render as mini bars on each journal card.
  - **Slurp-o-meter**: SVG half-dial (needle + red arc fill via stroke-dashoffset) scored 0–10 by **holding the ズルズル SLURP button** — fills ~2.4s to max with sinusoidal wobble; release locks. **Live slurp audio while held**: looped noise → bandpass (freq rises with score, 11Hz LFO wobble = the slurp texture), plus a satisfied 400→180Hz exhale on release. Keyboard: hold Space/Enter on the button. Pointer events with leave/cancel guards.
  - **Journal**: localStorage (`ramen-rater-v1`), newest-first, hover/focus ✕ delete, empty state ("the journal hungers"), bowl counter. Save validates name + a slurped score.
  - WCAG: labels on all inputs, role=group stamps with aria-pressed, aria-live status, slider aria-labels with pole names, focus-visible, ≥2.4rem targets, prefers-reduced-motion kills the stamp slam. Single-column ≤820px.
  - Verified: JS syntax OK, all static getElementById ids present (sl-* dynamic), head/OG/favicon.

## issues
- Slurp score requires holding — discoverable via button label + hint line, but if chat finds it confusing, add a tap-cycles-score fallback.
- Entries are per-browser (localStorage). A shared community wall would need a Supabase table (read-all/write-own, derived counts — see repo lessons).

## todos
- Community mode: shared bowls wall + "slurp seconded" reactions.
- Photo slot via emoji picker (🍜🥟🍥) per entry.
- Export journal as text.
- Sort by score / region filter chips.
- 2026-07-03 (3 stacked chat asks, same feature refined): **Trident Noodles stamp + wet slap + brand presets**. (1) New 🔱 TRIDENT NOODLES region stamp; selecting it plays `sndWetSlap()` — 0.22s decaying noise through a 320→140Hz bandpass sweep + 240→52Hz sine body + a delayed 700→280Hz droplet (a slap that has clearly been in the broth). All other stamps got a soft `sndThunk`. (2) **7 brand presets BELOW the sliders** (final placement per follow-up): Cup Noodles / Maruchan / Nissin / Shin Ramyun / Indomie / Samyang Buldak / Top Ramen. Tapping one: tags the bowl (shown on the journal card meta), **prefills all 4 broth sliders** with that brand's typical profile (e.g. Buldak spice=10, Maruchan salt=8), **auto-stamps its home region** (per third ask "so JimBoNZ doesn't have to" — Shin/Buldak→Korea, Nissin→Tokyo, rest→Instant Aisle; region buttons gained `data-region` for programmatic select), and fills the bowl name if empty. Status line confirms "preset applied — tweak to taste." Old entries without `brand` render fine (guarded).
