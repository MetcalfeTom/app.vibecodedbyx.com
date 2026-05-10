# ripple-step

## log
- 2026-05-10: shipped (chat ask: "create a minimalist music step-sequencer where notes trigger colorful ripples on a digital pond" + immediate follow-up "add verse and chorus structure blocks to the sequencer").
  - **Core**: 5 rows × 16 steps grid (rows = A G E D C in pentatonic C major, top→bottom high→low). Click any cell to toggle the note on/off. Playback walks the column at 16th-note resolution, triggering any active notes per step. Each triggered note plays a synth tone AND drops a colored ripple on the pond above.
  - **Verse/chorus + song structure**: Two parallel 16-step patterns (`patterns.verse` and `patterns.chorus`). Section-pill toggle above the grid (italic Fraunces "verse" / "chorus" pills, yellow/coral tinted respectively) selects which one the grid currently EDITS — switching repaints the cells from the appropriate pattern. Below the grid sits an 8-block **song structure** bar: V V C V V C C C by default. Each block is a click-cycle button: verse → chorus → rest → verse. Playback walks the structure block-by-block (16 steps per block), automatically swapping which pattern feeds the playhead at each block boundary. "Rest" blocks remain silent but still consume their 16 steps (creates breathing-space gaps between sections). The currently-playing block gets a white outline + lifted shadow; the structure index `3 / 8` and the block kind ("verse" / "chorus" / "rest") render as Fraunces italic in the upper-right of the pond canvas with a color-coded glow.
  - **Editor-playhead policy**: the head highlight (the lit column the sequencer is currently on) only shows in the grid when the section currently *playing* matches the section currently *being edited* — otherwise the column would jump around an unrelated pattern, which reads as confusing. The section badge on the pond handles the "where am I" feedback for when they're out of sync.
  - **Audio** (WebAudio synth): sine fundamental + triangle 2nd-harmonic ×2.01 detune through lowpass (2.4kHz Q 1.4), 8ms attack / 1.8s exp decay, dry + 0.45 wet send into a convolver-reverb with synthesised 2.4s noise impulse. Compressor-free for now. Ambient pad bus: 3-voice low chord (C2 E2 G2 sine) with per-voice 0.08-0.14Hz LFO detune through the reverb, fades in to 0.05 over 4s after first audio context start — gives the whole pond a soft tonal "below the surface" hum.
  - **Pond visualizer**: dark teal vertical-gradient base (#163949 → #0d2230 → #0a1820), 22 ambient sin-blink drifting motes (slow x/y drift, wrap on edges, 0.4±0.3 alpha pulse), faint horizontal surface lines with sin-wobble offset to suggest still water. Each note drops 2 ripples: a primary expanding ring (6→90-150px over 2.4-3s) with `globalCompositeOperation = 'lighter'` additive blend, a concentric thinner second ring at 62% radius, plus a soft center radial-gradient disc that fades in 0.4s. Note color drives the ring color — pale yellow (A), peach (G), coral (E), lavender (D), sky-blue (C). Overlapping ripples bloom together because of the additive blend.
  - **Click-the-water**: tapping anywhere on the pond directly drops a free-form ripple at that exact point + plays the corresponding pitch based on Y position (top = high A, bottom = low C). Independent of the sequencer playback — pure expressive layer for clicking along with a beat.
  - **Controls**: ▶ play / ■ stop (Space), clear (C), seed (S — fills BOTH sections with a verse/chorus pair), BPM slider 60–160 (default 96, displays as the current value), scale picker pent/hira/dor pills. Section pills: verse/chorus (1/2 keys, or Tab to swap).
  - **Aesthetic**: minimalist dark teal pond — Fraunces italic display ("ripple · step" with coral middle dot, 300 weight) + JetBrains Mono for UI/labels. Lots of negative space, no decorative chrome on the cells (just rounded-corner squares at 4% alpha with 8% beat-marker accent every 4 steps). Section pills are pill-shaped italic buttons. Structure blocks are 8 wider rounded squares each showing a single italic letter (V / C / —) plus a tiny corner index "1"..."8" in mono. Footer: italic "a pond is just memory · click the water to drop a stone" with a pulsing sky-blue middle dot.
  - **Accessibility**: rem units throughout, `role="img"` + aria-label on the pond canvas (it's purely decorative, not interactive UI for keyboard users), `aria-pressed` on every toggle (section pills, play button, scale chips, structure blocks, every step cell), `aria-label` per cell ("A step 4"), `role="group"` on the section + scale + structure clusters. Focus-visible coral outline at 2px on every interactive element. 2.75rem min target on the main buttons, 2.2rem on chips. `prefers-reduced-motion` zeroes the footer pulse + the cell scale transitions.

## issues
- The Tab keyboard shortcut to swap sections also captures the standard focus-traversal Tab — could be annoying for keyboard-only users. Could change to Shift+Tab or use `Q/W` keys instead.
- Hira scale notes (E5 D5 C#5 A#4 A4) and dor scale (A5 G5 E5 D5 C5) are roughly placeholder — the labels on the row left (`A G E D C`) only reflect the pentatonic mapping. When switching scales, the labels DON'T update. Minor visual inaccuracy.
- 8-block structure is fixed at 8. Can't extend to longer song forms. Could add +/− buttons but the 8-block grid is intentionally simple.
- No save/load of patterns — refresh wipes everything. Could persist to localStorage.
- The "click the pond" feature plays a note but doesn't honor the playback — independent layer. By design, but could be annoying if a user expects it to add to the grid.
- Active cells across BOTH patterns drop ripples while playing, but the visual rate is fine even with dense chorus blocks.

## todos
- localStorage persistence (patterns + structure + bpm + scale).
- Bridge section (a third pattern slot, B in the structure cycle).
- Variable structure length (4-16 blocks).
- Velocity / accent per cell (long-press to increase accent).
- Drag-to-paint cells instead of click-each.
- Touch-friendly verse/chorus swap gesture (swipe left/right on the grid).
- Export pattern as a shareable URL hash.
- Per-row octave shift buttons.
- Different visualizer modes (drift mode, growth mode, pixel-art mode).

## design-notes
The pond is the whole point of the app — the sequencer is just the input device that drives it. Every design choice in the sequencer is to keep the cognitive load low so the pond gets your attention: monochrome cell backgrounds, italic Fraunces labels, no border-radius gymnastics, no boxed sections, no excessive contrast. The pond gets the bright accent colors + the radial vignette + the section badge.

Verse/chorus is solved at the *song-structure* level rather than as a checkbox per cell — there are two parallel patterns, and a separate 8-block bar that tells the sequencer "play verse for 16 steps, then chorus for 16, then verse for 16" etc. This mirrors how human composers think about song form, and keeps the grid uncluttered. Adding a "rest" option in the cycle (verse→chorus→rest→verse) gives the song room to breathe — a silent block between repeats is a real compositional tool, not just an absence.

The dot-color identity per note row is load-bearing: each color has to stay distinct as ripples overlap (additive blending), so the palette is intentionally a warm-spectrum spread (yellow → peach → coral → lavender → sky) with no two adjacent rows sharing a hue range. The lavender + sky-blue rows in particular needed to stay cool against the warm trio for the overlap to read as a "color chord."
