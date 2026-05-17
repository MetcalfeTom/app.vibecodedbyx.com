# memory-dispenser · notes

## log
- 2026-05-17: v1 — **haunted vending machine** per chat ask "create a haunted vending machine app called memory-dispenser where users trade memories for cursed items". Self-contained ~24KB single-file.
  - **Machine front panel**: cream cabinet body w/ deep-blood trim, faint blood-drip CSS pseudo-elements down the trim, neon "OPEN 24 HRS" sign at the top with a dead H (steps-keyframe flicker). Glass display behind a teal frame shows a 4-col grid of 12 dim/blurred catalog emojis (7th slot empty for "out of stock" effect) — actually decorative, never the *real* dispensed item.
  - **Phosphor LCD**: 4-line `VT323` green-on-black with scanlines, blinking caret, glitch keyframe (translate-shudder) during processing, ERR mode (red text-shadow) for too-short memories. Status messages walk through the trade: `PLEASE INSERT A MEMORY` → `▼ MEMORY ACCEPTED · INDEXING…` → `░▒▓ CROSS-REFERENCING CURSE INDEX ▓▒░` → `▓▓▓ FILING UNDER PERMANENT RECORD ▓▓▓` → `THANK YOU FOR YOUR MEMORY · PLEASE COLLECT YOUR ITEM`.
  - **Input**: 280-char textarea on cream paper styled with `Special Elite`, blood-red focus ring. Minimum 12 chars (below that → ERR + nudge). Ctrl/Cmd+Enter submits.
  - **Dispense tray**: blood-red top edge (the "slot opening"), inset shadow. On dispense the item card animates in with a `dispense` keyframe (translateY -3rem + rotate -8deg → overshoot scale → settle). Item shows: 2.4rem emoji + Bungee Shade name + Cormorant italic description + curse rating in skulls (1–5 💀).
  - **CURSED CATALOG · 32 items**, each `{glyph, name, desc, curse rating 1-5}`. Hand-written, e.g. "📞 a phone receiver, cord severed · still warm. when you hold it up someone is breathing on the other end. · 💀💀💀💀💀", "📼 VHS · DO NOT WATCH AT NIGHT · the case is warm. the label is in your own handwriting, but younger. · 💀💀💀💀", "🦷 a milk tooth, slightly damp · wrapped in a napkin from a restaurant that closed in 2003.", "👁️ a glass eye that tracks the cursor".
  - **Picker**: `fnv1a(memory.toLowerCase()) % 32` — fully deterministic per memory so the same memory always yields the same item (the machine "remembers" the trade) but small wording changes get different items.
  - **Receipts**: paper-stock cards with `Special Elite`, torn-bottom via radial-gradient mask, slide-in keyframe. Shows trade timestamp, trade #, item received, first 60 chars of memory, "filed permanently · no refunds · no copies kept by you". Last 5 receipts displayed.
  - **Inventory**: grid below masthead, auto-fill 13rem-min columns. Each card: emoji + name + skull rating. Empty state: "the shelves of your apartment are still ordinary. for now."
  - **Persistence**: `localStorage['memory-dispenser-v1']` stores `{items: [...], muted: bool}`. Items persist across reloads.
  - **Audio (Web Audio)**: low 58Hz + 116Hz sine drone with 0.18Hz LFO tremolo on gain (the machine hum), 90Hz square clunk on insert, 1.4→0.38kHz bandpass-noise sweep during processing, 140→38Hz triangle thud + C5-Eb5-G5 sine arpeggio chime on dispense. Muted by default; ♪ toggle in the button row. Hum only runs while audio is on.
  - **Exorcise everything**: bottom-right button wipes localStorage + inventory + receipts with confirm. LCD message: "SHELVES PURGED · MACHINE RETAINS WHAT IT TOOK".
  - **Aesthetic**: cream/oxidised-teal/blood/phosphor/neon-pink/bone palette. Fonts: Bungee Shade (machine wordmark + item names), Cormorant Garamond italic (descriptions + tag), Special Elite (receipts + input + labels), VT323 (phosphor LCD + tiny meta), JetBrains Mono fallback. Body grain via repeating-linear-gradient overlay at 2% alpha mix-blend overlay.
  - **WCAG**: rem-everywhere, `<main>`+`<header>`+`<section>` semantic, `aria-live="polite"` on LCD + tray, label tied to textarea via `for`/`id`, focus-visible neon-pink outline on all buttons, `prefers-reduced-motion` kills all animations + transitions, ≥2.75rem tap targets, mute button has `aria-pressed`.
  - **Mobile**: ≤540px shrinks padding, drops the stock grid to 3 cols, inventory grid to single col.
  - **OG image**: Pollinations flux (no referrer per project notes — that endpoint rejects it).

## issues
- The "stock display" is purely decorative — the dispensed item is independent of what's shown behind the glass. Some chatters may expect the visible items to be the actual inventory.
- Web Audio context starts on first interaction (mute toggle or insert button). If a user submits without ever toggling mute, no audio plays — by design (muted on first boot).
- The textarea sets `maxlength="280"` — long memories get truncated. Acceptable; vending machines should reject overly verbose inputs.

## todos
- "Curse depth" mode: stack memories for a single dispense to roll a higher-curse-rating item
- Daily seed: a "today's featured item" that everyone gets for the day's first trade
- Sharing: copy-to-clipboard a generated receipt as text
- More items: ~20 more entries would let the catalog feel less repetitive across many trades
- Maintenance mode easter egg: type "REPAIR" into the memory slot → machine opens up and you can see your filed memories scroll past in the LCD
- Item rarity: gold-trim border + rare animation on a 1/32 "legendary cursed item" that only appears for specific memory hashes
