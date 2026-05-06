# daily-affirmation-generator

## log
- 2026-05-06: shipped — soothing watercolor affirmation generator with a spawn button.
  - **Aesthetic**: cream paper bg with **5-stop SVG watercolor wash** (large blush / dusty-blue / sage / lavender / peach / soft-gold ellipses behind a 40px CSS blur filter at 55% opacity). Layered over: angled paper-grain noise via `repeating-linear-gradient` with multiply blend, soft radial corner glows. Centerpiece thought in italic Cormorant Garamond at clamp(1.6rem, 4.6vw, 2.6rem) with a balanced text-wrap and decorative hairline rules above + below. Brand line in Fraunces italic ("a small kindness, on demand"), eyebrow in IBM Plex Mono 0.32em-tracked, with the date + part-of-day ("Tuesday, May 6 · afternoon") under it.
  - **Hand-curated pool of 60+ affirmations**, all standalone declarative sentences, none of them corporate-feel. Anti-repeat memory (last 12 picks).
  - **Spawn button**: pill-shaped pink-peach gradient with white-radial highlight + soft pink shadow + 1px white inset rim. Italic Fraunces "Spawn a fresh thought" with a `✿` glyph. Hover lifts 1px and brightens the shadow; active depresses; focus-visible 3px gold outline.
  - **Crossfade transition** between thoughts: 320ms leave (opacity → 0, translateY -6px) → text swap → 500ms fade-in from translateY +8px. `prefers-reduced-motion` no-ops both keyframes.
  - **Save / Copy / Favorites** action row: ♡ Save toggles favorited state (heart fills, label flips to ♥ Saved + faved-pill style with rose tint); ⎘ Copy writes to clipboard with toast confirmation; ★ Favorites toggle reveals a panel listing every kept thought with a relative date and a ✕ remove button. Up to 60 saved.
  - **Toast** anchored bottom-center, dark ink pill with paper text, slides up briefly on save / copy actions.
  - **Audio**: a soft 3-note bell (F♯5 + A5 + C♯6 sine cascade with 1.2s exponential decay) plays on every spawn.
  - **Persistence**: `localStorage['daily-affirmation-v1']` tracks favorites, recent indices (per pool — see below), serial number, and the current mode.
  - **Keyboard**: Space / Enter spawns; F toggles favorite; C copies. Honored only when no input is focused.
  - **Accessibility**: rem units, semantic `<main>`/`<section>`/`<footer>`, `aria-live="polite"` on the affirmation host so screen readers announce each new line, ≥2.6rem touch targets, focus-visible gold outlines, skip link to the affirmation, decorative hairline rules implemented as `::before/::after` so the AT only sees the text.

- 2026-05-06: chat ask — added a **sarcastic / absurd-humor toggle**. The earnest watercolor experience stays default; one click on the new ◐ Sarcastic chip flips the entire app into ink-noir + acid-lime mode and swaps the affirmation pool.
  - **POOL_SARCASTIC**: ~60 hand-written deadpan one-liners that punch at fate, never at the reader. Tonal range from genuinely funny to lovingly unhinged ("Today you will encounter exactly the right person to ignore." / "Confidence is just memory loss with better marketing." / "Your inner critic has been temporarily reassigned to filing." / "Today's affirmation is sponsored by spite and a really good sandwich.").
  - **Anti-repeat memory is per-pool** (`state.recent` for earnest, `state.recentSarcastic` for sarcastic) so each side gets its own 12-pick anti-repeat without the modes interfering.
  - **Mode toggle visual switch** (`body.sarcastic{ ... }`): re-tints all CSS custom props in one block. Paper goes `#0e0e16` (deep ink), ink goes warm cream `#e9e8d8`, the watercolor wash flips to `mix-blend-mode: screen` so the same SVG ellipses now glow against the dark instead of bleeding into cream. Spawn button becomes acid-lime stroked with a faint inner glow on a charcoal-gradient body. Mini buttons get cream text on translucent charcoal. Toast inverts to lime-on-ink. Brand subtitle word switches to peach.
  - **Spawn-button label + glyph also flip per mode** (`✿ Spawn a fresh thought` ↔ `✺ Spawn an unhinged thought`) so the click affordance signals what you're about to summon.
  - **Mode persists** in the same v1 save key so the user's preference survives reloads. Boot calls `setMode(state.mode, { silent:true })` so the visual class applies before the first affirmation lands. Toggling immediately spawns a new thought from the new pool so the tonal shift is instantly visible.
  - **One pool stays a kindness**, one stays a wink — both are valid reasons to come back.

## issues
- The sarcastic pool deliberately stops short of cruel; it punches at situations / fate / "the universe", not at the reader. If chat asks to push edgier later, the curation stays mine to keep it from drifting.
- Favorites carry the saved text + date but don't currently note which mode they came from. Could add a `mode` tag per fave entry so the favorites panel shows a small ◐ / ☉ marker.
- Pollinations integration was considered for "infinite" affirmations but skipped — the curated pool is instant, offline-friendly, and tonally consistent. Could be added later as a third "✨ AI surprise" mode for unpredictability.

## todos
- Per-mode favorites filter / tag (✿ vs ✺ marker on each saved row).
- Optional Pollinations "AI surprise" mode that calls `text.pollinations.ai/openai` for a fresh line, with a fallback to the local pool on failure (use the safeImportJs / sanitised banner-detection pattern from forest-rally).
- Share image: render the current affirmation onto a 1080×1080 watercolor canvas for a one-tap social-share PNG download.
- Daily-locked mode: optionally pin one affirmation per calendar day so refreshing doesn't reroll, with a lock icon.
- More sarcasm registers (deadpan / chaotic-good / cosmic-doom) selectable from the mode chip.
