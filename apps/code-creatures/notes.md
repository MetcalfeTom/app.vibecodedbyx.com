# Code Creatures (V2)

## log
- 2026-04-26: **Full legacy restoration → V2.** Chat asked five times in escalating fashion to bring back the floating glitch lore, memorial wall, syntax bar, food/binary/guard toolbar, breed modal, eggs, firewalls, hazards, multiplayer broadcast, and every atmospheric detail. After successive partial ports, swapped V2's lean 866-line build for a verbatim copy of `/code-creatures-legacy/index.html` (6,163 lines). Legacy already runs unified atomic storage at `code-creatures-state-v2` (the same hardening V2 introduced) so the original "creatures vanish on refresh" risk is already addressed — no re-work needed. The `/code-creatures-legacy` URL stays as a backup mirror in case we ever need to roll back. The minimal V2 storage / wandering-garden architecture (atomic single-key save with verify-after-write + pagehide flush) was a worthwhile experiment but chat overwhelmingly preferred the full app.
- 2026-04-26: **Legacy CSS port (light).** Pulled palette + typography + sharp panel style from `/code-creatures-legacy` into V2 without porting the heavy bits (no glitch background overlay, no tabs, no garden grid render, no syntax bar / error blocks / memorial sidebar). Kept: VS Code dark+ palette (`--bg:#0a0e14 --kw:#c986e0 --str:#7ec97a --num:#f5b362 --fn:#5fc0e0 --op:#ff7e9a`), JetBrains Mono body, Major Mono Display brand mark with tri-color letters (`code`=purple · `·`=cyan · `creatures`=pink), Fraunces italic tagline, 1px scanline overlay via `repeating-linear-gradient`, sharp 2px-radius panels (`rgba(20,28,40,0.7)` + `1px solid rgba(120,180,220,0.18)`), legacy `.btn.primary` cyan-gradient hatch button, syntax-highlight on roster stats (`HP/ATK/DEF/SPD` keys in num-orange). Header uses legacy two-row layout: brand + tag on left, ghost-style "legacy build →" link on right. Garden swapped from violet→navy gradient to legacy dark-teal `#08111c → #122236` w/ green soil halo. Storage + garden agent loop untouched.
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
