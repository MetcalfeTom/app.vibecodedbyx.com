# Code Creatures

## log
- 2026-04-24: Created. Virtual pet game where DNA = your typing. **3 views**: Hatch / Stable / Breed. **Hatch flow**: pick from 4 starter egg styles (cosmic/ember/pixel/glyph), type into the textarea — every character (32 chars total) seeds the egg's DNA. Egg canvas animates: binary `0/1` glyphs orbit the shell at the start, crack lines spread as DNA fills, on full DNA a `crack-burst` keyframe pops the egg open and spawns the creature. **DNA→Stats**: `classify(ch)` maps each char to one of 6 classes — `vowel` (HP+3, charm+1), `consonant` (HP+1, atk+1), `digit` (atk+2, spd+1), `op` (atk+3, def-1), `bracket` (def+3), `punct` (spd+2, charm+1), space ignored. Final stats = base+sum, then × `levelMultiplier` per stage. **Stages**: hatchling (xp 0–29) → adolescent (30–99) → adult (100+). Stat scale 1.0 / 1.4 / 1.9. **Procedural creature renderer**: canvas-drawn, deterministic per-DNA. `dnaSig(dna)` = FNV-1a hash → mulberry32 PRNG seeds all rolls. Body shape from class dominance: vowel-heavy → blob, digit-heavy → hex, bracket-heavy → diamond, op-heavy → diamond/cube, balanced → oval. Body color = HSL pulled from dominant class palette + PRNG hue jitter. **Decorations** (all driven by DNA char-class counts): `bracketCount` → antennae stems on top, `opCount` → tail wiggle (sine-driven anim), `punctCount` → dot speckles, `digitCount` → side stripes (by adolescent+) and leg count, eye count = clamp(letter-count/8, 1, 4) with whites + tracking pupils. Adult stage adds rotating aura ring + extra accent ring. **Naming**: `generateName(dna)` picks 2 syllables from per-class pools (e.g. vowel pool: "ae","io","ua"…) seeded by hash → "Aelyn", "Voxim", etc. **Stable**: scrollable grid of all hatched creatures, each card = mini-canvas + name + stage + xp bar + 5-stat strip + ✕ release button (with confirm). Click card → opens detail/feed view. **Feed**: textarea above creature → every typed char awards XP via `xpForChar(ch)` (vowel/consonant 1, digit 2, op 3, bracket 2, punct 1) + floating CSS-class-colored "+N" sprite floats up from char position. Stage-up triggers re-render with new shape/aura + level-up flash. **Breed**: pick 2 parents from stable → preview card showing crossover DNA + child name + child stats. `crossover(a, b, mutationRate=0.05)`: zip-walks 32-char DNA arrays, picks each slot from random parent, rolls mutation per char (5%) replacing with same-class character (preserves trait shape). "Hatch this child" → sets `state.pendingDna` + switches to Hatch view with egg pre-filled. **Storage**: `localStorage['code-creatures-v1']` = JSON array of `{id, dna, name, xp, born, parents:[a,b]}`. **Aesthetic**: VS Code dark+ palette (`--bg:#0d1117 --kw:#c986e0 --str:#7ec97a --num:#f5b362 --fn:#5fc0e0 --op:#ff7e9a --comment:#6a7480`) on void backdrop with subtle radial accents + 1px grid texture. Title "Code · Creatures" in Major Mono Display 800 with `Creatures` in keyword purple gradient. Subtitle Fraunces italic. Body JetBrains Mono. Stat readouts in Silkscreen for that retro gauge feel. Egg canvas 320×320, creature canvas 360×360, both HiDPI via DPR. Class-tagged characters in the typing input get color-coded as you type (live syntax-highlight effect). Footer hint shows a small DNA preview map (32 colored squares = char classes seen so far). Tab nav top: HATCH / STABLE / BREED with active underline. Mobile @720px: nav becomes pills, creature canvas shrinks, breed picker stacks. Pollinations OG.

## features
- DNA = your typing. Every char shapes hp/atk/def/spd/charm.
- 6 char classes (vowel/consonant/digit/op/bracket/punct) → 6 different stat affinities
- 3 evolution stages with stat multipliers and visual upgrades (legs, aura, accent ring)
- Procedural creature renderer (canvas) — each DNA = distinct visible body
- 4 starter egg styles (cosmic/ember/pixel/glyph) with different binary glyph palettes
- Live syntax-highlight on the typing input — see your DNA classify in real time
- Naming generator (2-syllable, class-pool seeded)
- Genetic crossover breeding with 5% same-class mutation
- localStorage persistence (release pets to free slots)
- VS Code dark+ aesthetic with a typography-forward UI

## issues
- DNA cap is 32 chars. Longer inputs get truncated. Could expose a "lineage size" upgrade later.
- Breeding always picks the SAME parents → child outcomes vary only by mutation roll. Re-rolling preview button could let you reseed without leaving the breed view.
- Adult creatures look quite different across DNA but the aura ring is a bit subtle on dark bg — could pulse it harder.
- localStorage has no slot cap; could fill up if user breeds endlessly. Add a soft max (e.g., 30) with FIFO release prompt.
- Stat multipliers per stage are hardcoded (1.0/1.4/1.9) — not visible in UI. Could show a tooltip.
- Mobile keyboard covers the egg canvas while typing — works but UX is awkward. Could add a sticky mini-egg preview.

## todos
- Sound: typing clicks (per-class pitch), egg crack, hatch chirp, level-up chime, breed swirl
- Stat-driven battles: pet vs pet auto-battler using HP/ATK/DEF/SPD; winner gets XP
- Daily quests: "feed 50 vowels", "breed two punct-heavy pets" → reward stat-boost items
- Trait genes beyond the 6 classes — emoji DNA, hex literals, snake_case syllables
- Shareable creature codes (export DNA + lineage as a string)
- Cross-app: "creature pet" widget that shows your top creature on other Vibespace apps
- Multiplayer breeding via Supabase broadcast — pair eggs across viewers
