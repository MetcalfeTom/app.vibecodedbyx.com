# bangaranga · notes

## log
- 2026-05-17: v1 — **tropical Gen Z branding kit with 10 ideas across 10 categories** per chat ask: "build a Gen Z branding app called Bangaranga with tropical energetic vibes for short videos and memes, include 10 examples per category." Shipped at `/bangaranga`. Single file (~25KB), no backend, fully client-side.
  - **10 categories × 10 examples = 100 ideas total**:
    1. **🥥 Names** (handles): bangaranga, mango.exe, sunburnt.babe, coconutCEO, papaya patrol, aloha archives, mai tai meltdown, riptide ritual, coral cult, frosted lime
    2. **🌶️ Taglines**: "vibes only · receipts later" through "delusion: tropical strength"
    3. **🪝 Hooks** (first 3 seconds): "tell me you're [thing] without telling me…" + 9 more with `[bracketed]` slots to swap in specifics
    4. **💬 Captions**: "no thoughts, just heat 🔥" + 9 more
    5. **#️⃣ Hashtag stacks**: 10 bundles of 5 hashtags each (fyp / aesthetic / softlaunch / tropicalcore / genz / cleanbeauty / pov / manifest / miamicore / lifehack stacks)
    6. **🎨 Color palettes**: 10 hand-picked 4-color combos (Mango Crush / Coconut Lime / Sunset Riptide / Coral Reef / Tropic Tech / Papaya Funk / Cabana Sky / Espresso Beach / Sunburn Y2K / Mai Tai Mist), each rendered as a swatch row with hex values printed on swatches (auto-flipped to dark text when luminance > 0.55)
    7. **🔤 Font pairs**: 10 display + body pairings, ALL rendered in their ACTUAL fonts via Google Fonts CSS link. Bagel Fat One / Anton / Lilita One / Climate Crisis / Bungee / Caprasimo / Fraunces / Big Shoulders Display / Rubik Mono One / Caveat × matched body fonts. Each card displays the font name in the display face + "The quick tropical fox vibes over the lazy palm tree — 0123 ✦" sample in the body face + a short vibe descriptor in mono.
    8. **🩴 Slang drops**: 10 sprinkle-able phrases ("it's giving [thing]", "delulu is the solulu", "ate · left no crumbs", etc)
    9. **🌅 Visual themes**: 10 one-sentence moodboards (Mango Hour, Cabana Pop, Riptide Y2K, Coconut Tech, Sunburn Glitch, Espresso Beach, Aloha Office, Salt Air Brutalism, Papaya Funk, Reef Bloom)
    10. **✿ Bios**: 10 profile-bio templates with `[bracketed]` slots
  - **Interactions**:
    - **Click any card** = copies that item to clipboard (whole-card click target + dedicated copy button with `stopPropagation` so the button click doesn't double-fire). Keyboard-accessible (Enter / Space).
    - **🔀 shuffle** button = Fisher-Yates shuffle of the current category's display order
    - **📋 steal all 10** button = copies entire category as a numbered list with a `BANGARANGA · CATEGORY` header — useful for grabbing the full kit in one go
    - **Toast** (`role="status" aria-live="polite"`) bottom-centre confirms every copy/shuffle with `✓ copied` / `🔀 shuffled` / `📋 all 10 copied`, 1.7s display
  - **Aesthetic — TROPICAL JUICE**:
    - **Body**: layered radial gradients (hot pink top-left, cyan top-right, lime bottom-right, mango bottom-left) over a #fff5e1 → #ffe2c8 vertical cream gradient
    - **Title**: `BANGARANGA` in Bagel Fat One at clamp(3rem, 11vw, 6.4rem) with a 7-stop horizontal gradient (#ff5e7a → #ff9a3c → #ffd54a → #b8ff5a → #3cffd9 → #3cd0ff → #ff3ccc) via `-webkit-background-clip: text` + drop-shadow filter for chunky lift
    - **Tagline**: Fraunces italic with `<em>` highlighting the keyword in Bagel Fat One pink
    - **Header chips**: rounded JetBrains Mono pills hinting at categories
    - **8-color rotating accent palette** (`--coral / --mango / --lemon / --lime / --mint / --sky / --pop / --grape`) — each card cycles through them via `displayIdx % 8`, set as `--accent` CSS var. Card has a 4px hard offset shadow IN the accent color, hover lifts it to 8px, active snaps to 2px (snappy tactile feel).
    - **Card** uses a soft accent-tinted radial overlay via `color-mix(in srgb, var(--accent) 18%, transparent)` in `::before` for color personality without overwhelming text contrast.
    - **Tab nav**: horizontally scrollable pill row, active pill flips to deep ink (`#1d0f3d`) with white text + pink halo ring (`box-shadow 0 0 0 4px rgba(255, 60, 204, 0.20)`)
    - **Big juicy ink-on-white buttons** with 4px hard drop shadow that lifts on hover, snaps on active — toy-like feel
  - **Typography stack**: Bagel Fat One (display), Bricolage Grotesque variable (body), Fraunces italic 9..144 (accents), JetBrains Mono (chips/labels). Font-pair category additionally loads Anton, Manrope, Lilita One, Outfit, Climate Crisis, Newsreader, Bungee, Caprasimo, DM Sans, IBM Plex Mono, Big Shoulders Display, Plus Jakarta Sans, Rubik Mono One, Sora, Caveat — so every font-pair card renders in its real typeface. All from Google Fonts in a single preconnect+stylesheet link.
  - **WCAG-AA per project convention**: 100% root font-size + rem everywhere, semantic main/section/header/nav/footer/h1-h2, `role="tablist"` on tab nav + `role="tab" aria-pressed` on each tab, `role="button" tabindex=0` + Enter/Space keyboard support on cards, `role="status" aria-live="polite"` on toast + grid region, `:focus-visible` 3px hot-pink outline at 3px offset, ≥44px min-height on all interactive targets (tabs / buttons / cards), `prefers-reduced-motion` kills all transitions and hover transforms.
  - **Mobile**: tabs auto-scroll-snap, hero h1 clamps down, grid auto-fills to minmax(15rem, 1fr), actions row stretches to full width below 28rem with btns flex-basis 8rem.
  - **OG image**: Pollinations flux seed 70707.

## issues
- No persistence — refreshing the page resets shuffle order. Could store `orderMap` in localStorage but the "shuffle to discover" feel arguably benefits from fresh shuffles each visit.
- "Steal all 10" includes the BANGARANGA header — if a user wants pure copy-paste of items only, they have to delete the header. Could add a toggle, but the brand bump is intentional viral juice.
- Font-pair cards depend on Google Fonts being reachable; if blocked, fallback `system-ui, sans-serif` keeps the page legible but defeats the typography preview.
- Captions/hooks/slang include placeholder `[brackets]` — users need to know to substitute. A subtle "fill the [brackets]" note appears in the category blurb but it could be more obvious per-card.
- 100% client-side, no analytics on what categories or items get copied most. Could be useful for refining content later.
- Tab nav scrolls horizontally on narrow viewports — discoverable but could add fade-edge hints.

## todos
- "Generate a brand kit" button that picks 1 random item from each category and presents it as a unified mini-brand (name + tagline + palette + font pair + bio + 1 hashtag stack)
- Light/dark mode toggle (dark mode = sunset-lit night vibes, neon glow)
- Export as PDF / PNG moodboard
- More categories: sound trends, transition cuts, thumbnail layouts, CTA endings
- Submit-your-own form (would need backend / supabase)
- Localization: same kit in Spanish / Portuguese for global creators
- Per-card share link (copy a URL that opens the app to that exact item highlighted)
- Trending bar at top with daily-rotating "today's drop" picks
- Sound: subtle pop on copy
- Confetti burst on "steal all 10" click
