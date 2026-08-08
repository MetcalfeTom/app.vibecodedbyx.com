# no-roots (No Roots — The Mycelium Collective)

## log
- 2026-08-08: v1 per chat ("new app called no-roots with an interactive CD jewel case layout"). Concept: debut album by The Mycelium Collective — fungi have no roots, hence the title; ties into the fungi-friends universe. Single file, Unica One + Overlock, wooden-shelf dark scene, teal/violet glow palette.
  - **Jewel case (CSS 3D)**: perspective scene; hinged lid (rotateY -130° on .case.open, left-edge origin) with plastic sheen + mycelium-thread SVG cover art front / cream liner-notes page on its inner face; tray with hub + iridescent conic-gradient disc (label text, spindle hole rings). FLIP CASE rotates the whole case 180° to a paper back-card with the tracklist + ℗ fine print. State note line narrates each stage.
  - **Flow gates**: disc click does nothing until the lid is open; loading the disc reveals the player panel + starts the spin animation.
  - **Generative audio (no real music, synthesized per play)**: 6 tracks each = {root, scale, bpm, personality}: Spore Drift/The Oregon Giant (drift: sparse random-walk triangle notes, long decays), Wood Wide Web/Fruiting Body (pulse: denser stepped arps), Foxfire/Decomposer Suite (glow: sine + occasional octave shimmer, brighter filter). Shared bed: two detuned saw pad voices (root+fifth) through lowpass, compressor on master. One track at a time; STOP kills interval + ramps oscillators out.
  - **A11y**: lid is role=button + tabindex + aria-expanded + Enter/Space, disc is a real button with label, aria-live sr announcements, ≥2.75rem controls, focus-visible, reduced-motion kills spin + case transitions.
  - Verified: syntax + id cross-check, 5 pure checks (noteHz octave math, track shapes), 12-check headless probe (closed-lid gating, open state + aria, disc load, both tracklists, play/highlight/nowplaying, single-playing switch, stop, flip, keyboard lid) — 0 errors.
  - Same-day sibling change: windows-11-recall-nightmare gained puffball.lnk → /fungi-friends/.

## issues
- Track "durations" are cosmetic liner-note flavor — generative tracks play until stopped.

## todos
- Disc drag-to-player gesture (real pull-out motion) instead of click-to-load.
- Cassette side-B easter egg (flip disc → lo-fi filtered versions).
- Booklet page 2 with per-track "recording notes".
