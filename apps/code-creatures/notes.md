# Code Creatures (V2)

## log
- 2026-04-26: **V2 fresh start.** Original 6,159-line app preserved at `/code-creatures-legacy`. New foundation built around a rock-solid storage system first, UI second. Storage = ONE key (`code-creatures-mini-v1`), ONE JSON array (the creature roster), ONE save fn (`save()`) coalesced into a microtask so a burst of mutations within one tick produces exactly one `localStorage.setItem`. `loadAll()` is defensively typed (try/catch + Array.isArray + filter). UI is intentionally minimal: type 3–32 chars of DNA into a single input → click `Hatch` (or press Enter) → procedural pixel-art creature spawned in the roster grid. Creatures show name + HP/ATK/DEF/SPD derived from DNA character classification (vowels/consonants/digits/ops/brackets/punct), with a small × button to release. Sprite: 16×16 deterministic blob (mulberry32 seeded by FNV-1a hash of DNA), filled with palette glyphs (palette picked from dominant char class), eyes overlaid. **Aesthetic**: Major Mono Display title `code creatures` with violet emphasis on second word, Silkscreen 11px tracked subtitles, JetBrains Mono body, deep violet bg w/ radial glows. Header link to `/code-creatures-legacy` for users who want the full feature set (firewalls, viruses, polyglot DNA, multiplayer garden, memorial wall).

## issues
- None yet — minimal foundation.
- Storage key intentionally namespaced (`-mini-v1`) so V2 cannot clobber the legacy app's saved data on the same origin.

## todos
- Add a wandering canvas garden where hatched creatures roam (the original's defining feature). Add carefully without breaking storage.
- Detail modal (click creature → stats + DNA breakdown).
- Hatch animation (egg crack).
- Optional Supabase multiplayer broadcast (later — copy carefully from legacy).

## design
- Palette: bg `#0d0420 → #1b0838`, ink `#f6e7ff`, dim `#8a76b8`, kw `#c986e0` (violet), str `#7ec97a` (green), fn `#5fc0e0` (cyan), op `#ff7e9a` (rose), num `#f5b362` (amber).
- Fonts: Major Mono Display (title), Silkscreen (small caps), JetBrains Mono (body).
- Single full-width column, max 880px, sections in glassy panels (rgba bg + 1px border + backdrop blur).

## code-shape
- Single-file index.html, ~290 lines.
- `KEY = 'code-creatures-mini-v1'` — namespaced so legacy data is untouched.
- `loadAll()` — defensive parse + filter.
- `save()` — microtask-debounced atomic write, single localStorage key.
- `fnv1a(s)` + `mulberry32(seed)` — deterministic PRNG from DNA.
- `classify(ch)` — vowel/cons/digit/op/bracket/punct.
- `statsFromDna(dna)` — derived HP/ATK/DEF/SPD.
- `nameFromDna(dna)` — 2-syllable hash-picked name.
- `paletteFromDna(dna)` — palette by dominant char class.
- `drawCreature(canvas, dna)` — 16×16 deterministic sprite renderer.
- `state = { creatures: loadAll() }` — single source of truth.
- All DOM bindings use optional chaining so missing markup can never halt boot.
