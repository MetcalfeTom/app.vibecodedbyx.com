# Macro HUD — notes

## log
- 2026-07-06: v1.1 — **theme customizer** (chat ask ×3): entire palette variable-ized (--acc/--acc2/--warn + RGB triplet vars for every rgba(), plus --panel/--keybg/--scan-a/--vig-a/--btn-ink — zero hardcoded palette colors left, verified by grep). 🎨 button in pad bar → THEME//CUSTOMIZER panel (docks beside pad, flips if offscreen): 3 presets — CYBERPUNK (cyan/magenta), TERMINAL (phosphor greens, heavier scanlines), RETRO LIGHT (cream paper, rust/blue accents, scanlines nearly off) — plus manual accent color picker (input type=color, live, overrides --acc+rgb; preset switch resets override; reset-accent button). Persisted in state.theme {name, accent} in the same localStorage blob (back-compat default cyberpunk). Esc closes; aria-pressed on preset buttons.
- 2026-07-06: v1 — floating translucent macro keypad HUD (chat ask). Cyberpunk desktop bg (CSS-only: dual neon radials, perspective-scrolling grid floor w/ mask fade, scanline multiply layer, vignette, SYS://DESKTOP watermark). **Pad**: glassmorphism panel (blur 10, cyan border + magenta echo ring), draggable by its bar (pointer capture, viewport-clamped, position persisted) AND keyboard-movable (focus bar → arrows, shift=32px). 12 keys (4×3): label + hot chip; press = neon pulse + per-index square-blip (pitch by grid position) + clipboard copy of the key's macro text (toast COPIED ▸ / EMPTY / BLOCKED). **Hotkeys**: global keydown match (skips inputs), fire the key. **Edit mode** (⚙, amber dashed): click key → editor panel (auto-positions beside pad, flips side if offscreen): label (14ch), macro text (500ch), hotkey capture (press any key, esc = none, conflicts stolen from other channels), save/clear/close. All state in localStorage['macro-hud-v1'] {x,y,keys[12]}. Defaults: 10 prefilled chat macros on hotkeys 1-0 + 2 empty. Fonts: Zen Dots + Chakra Petch + Share Tech Mono (new combo for this repo). prefers-reduced-motion kills grid scroll. Pollinations OG (seed 2077, naturally).

## issues
- Clipboard API needs a user gesture + https; falls back to a BLOCKED/UNAVAILABLE toast — nothing crashes.
- The pad doesn't sit over the user's real OS desktop (browser sandbox); the app ships its own desktop.

## todos
- Possible: multiple pages/banks, import/export JSON, per-key color picker, size slider, sound toggle.
