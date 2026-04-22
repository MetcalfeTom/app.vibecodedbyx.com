# Flip

## log
- 2026-04-22: Created. Simple text flipper with gradual viewport rotation. **Input/output panes**: left textarea (input) → right read-only pane (flipped output, live-updated). Flipping uses a curated unicode upside-down character map (`FLIP` object) covering a–z, A–Z, 0–9, and common punctuation ( . , ' " ; ? ! ( ) [ ] { } < > & _ ). Each line is reversed character-by-character (via `reverse()`) and the *order of lines* is also reversed, so multi-line text stays geometrically consistent when rendered upside down. Reverse mappings auto-populated (`FLIP[v] = k` for each entry that lacks a back-ref) so double-flipping round-trips. **Viewport rotation**: `#stage` wrapper at `inset: 0` uses a rAF-driven `transform: rotate(Xdeg)` where X goes 0 → 180° over 42 s (`DEG_PER_MS = 180/42000`). Can pause/resume via flipBtn, reset via resetBtn. End state shows "fully inverted 🙃" and disables the button. At 180° the flipped unicode chars visually align back to normal reading (flip + rotate cancel), so user sees their text return to legibility. **UI**: paper card (`#fffaf0` bg, charcoal border, 10px 10px 0 ink shadow) on a peach/cream gradient viewport with repeating-linear grain. Fraunces italic display (`<em>flip</em>` in accent orange + spinning ↻ emoji), IBM Plex Mono for input/output/labels. Controls row: progress bar (accent→accent-2 gradient), angle readout ("37°"), reset (ghost button), primary "begin rotation" button. Copy button on output (writes to clipboard, shows "copied ✓" for 1.2 s). Clear button on input. Footline shows keyboard hints: `[space]` toggle, `[R]` reset. Keyboard handler guards against triggering while textarea is focused. Seed text on load: "hello, upside-world!\n\ntype anything here\nand watch it flip.\n\npress begin rotation ↓". Mobile breakpoint @ 720px collapses panes to single column, shrinks typography, stacks controls. Palette: cream `#f3e3ca` / paper `#fffaf0` / ink `#221812` / accent `#ff6a3d`. Pollinations OG.

## features
- Live text-to-upside-down unicode conversion as you type
- Entire viewport gradually rotates 0° → 180° over 42 s
- Pause / resume / reset rotation controls
- Progress bar + live angle readout
- Copy flipped text to clipboard
- Clear input button
- Keyboard: space toggles rotation, R resets
- Round-trip safe (flipping flipped text returns original)
- Responsive (single-column under 720 px)

## issues
- A handful of unicode flipped glyphs render slightly narrower or off-baseline in some fonts (e.g. `ᴉ`, `ꓭ`). Acceptable — part of the charm.
- At 90° the card extends beyond viewport vertically on shorter screens; user can't scroll because `overflow:hidden` on body. Mitigated by `max-height: 92vh` on the card.
- Reverse mapping in `FLIP` collision check means some chars may map oddly if the flipped glyph is visually similar to another letter (e.g. `n → u` and `u → n`). This is intended — both make sense.
- Very long input lines won't wrap mid-word when flipped because `word-break` rules differ for the unicode glyphs. `word-wrap: break-word` helps.

## todos
- Adjustable rotation duration slider (10s–2min)
- Auto-start rotation after N seconds of idle typing
- Share button: copy URL with `?text=` query param so flipped text can be shared
- Preset starter phrases
- Mirror mode (horizontal flip instead of rotate)
- Sound: soft tick per degree, or a "thunk" at 180°
- More chars: Greek, Cyrillic, accented letters (é, ñ, ü)
- Save to image / PNG export
