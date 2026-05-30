# pngtuber-maker

## log
- 2026-05-30: initial build per inisso's request. **In-browser PNGTuber bundler with mic-react preview + JSZip export**. Zero backend — everything happens client-side. Single self-contained HTML + 1 CDN dep (JSZip 3.10.1 from jsdelivr).
  - **4 pose slots**: `idle` (mouth closed · eyes open), `talking` (mouth open · eyes open), `blink` (mouth closed · eyes shut), `talking-blink` (mouth open · eyes shut). Each slot is its own card with drag-drop area, file picker, "copy from idle" shortcut, clear button, filename + size readout. Slot card border turns dashed→solid + accent color when populated.
  - **3 ways to fill a slot**:
    1. **Upload** — drag PNG/WEBP onto the slot OR click thumb / upload button → hidden `<input type=file>` picker. Validates mime/ext + 4MB cap per slot, surfaces "only PNG or WEBP" / "file too big" errors via toast.
    2. **Copy from idle** — instantly clones the idle slot's blob into any other (saves time when you just want a single-pose tuber).
    3. **AI generate via Pollinations** — sidebar prompt + radio target selector + ✨ generate button. Builds `image.pollinations.ai/prompt/...` URL with flux model, 512×512, random seed, auto-appends "transparent background, isolated subject, no background" if not present, and pose-specific hints ("mouth open talking" / "eyes closed blinking") based on the target slot. Fetches → Blob → File → routed through `acceptFileForSlot()`. Button disables + shows "⏳ generating…" during fetch.
  - **Live preview** with state machine: `currentState()` → `applyState()` swaps the active `<img>` by toggling `.active` class. Fallback chain: `talking-blink → talking → idle → blink`, `talking → idle`, `blink → idle`. Pose pills (idle/talking/blink/talk+blink) light up accent-pink to show current state. Checker bg behind avatar (4-way 18px grid) makes transparency obvious. Subtle 2px translateY + 1.012 scale when talking.
  - **Auto-blink** — `scheduleAutoBlink()` triggers a 160ms blink every 2.5–7s while a blink frame exists.
  - **Two test modes**:
    - ▶ auto talk — toggles random talking flicker (`Math.random() < 0.65` every 80–320ms) to demo the swap without your mic.
    - 🎤 use mic — `getUserMedia({audio: {echoCancellation, noiseSuppression}})` → `AudioContext` → `MediaStreamSource` → `AnalyserNode` (fftSize 1024, smoothing 0.45). Per-frame `getByteTimeDomainData` → RMS → `level = min(1, rms * 3)` drives a gradient meter bar (cyan→pink→amber) and triggers `isTalking` when level > 0.07 threshold (marked on the meter). Stop button releases mic + closes context.
  - **Metadata panel**: name (≤60ch), author (≤40ch), description (≤280ch). Slug-derived from name for "export as named" button (`sanitizeName()` → lowercase, dash-separated, ≤40ch).
  - **Bundle export (JSZip)**: ⬇ export .zip → bundles all loaded slots + auto-generated `manifest.json` (format: 'pngtuber-bundle/v1', name, author, description, created_at ISO, source url, per-pose file/mime/size mapping, pose notes) + `README.txt` (file list, fallback chain explanation, how-to-use for veadotube-mini/kbtuber/OBS browser sources). DEFLATE compression level 6. Two export buttons:
    - `pngtuber-bundle.zip` (generic name, folder `pngtuber/`)
    - `<your-slug>.zip` (name-derived, folder is the slug)
  - **Keyboard**: 1-4 opens picker for that slot, T toggles auto-talk, B manual blink, E exports ZIP.
  - **Stats header**: live `loaded/4` slot count + total cumulative byte size of staged blobs.
  - **Aesthetic** — synthwave/vtuber dashboard vibe: deep indigo `#07051a` bg with pink + cyan + amber corner radial glows, panels at `#1a1330` with `#3a2a64` borders, Bricolage Grotesque 800 h1 with pink→cyan gradient on "Maker", Space Grotesk body, JetBrains Mono for all labels/numerals/code. Primary button = pink-to-cyan diagonal gradient with glow on hover. Mic meter has gradient fill + amber tick at 35% (threshold marker).
  - **A11y** per project directive: rem-everywhere, semantic markup (`<main>`/`<header>`/`<section>`/`<aside>`/`<h1-3>` + `<button type=button>`), aria-pressed on every toggle (test-talk, mic, ai-target, sort), role=status + aria-live on stats + toast + sr-only announcer, file picker hidden but triggered programmatically with focus preserved, focus-visible 2.5px accent outline, 2.75rem touch targets, prefers-reduced-motion kills talking-scale transform + toast animation. Drop-zones have `role=button tabindex=0` + Enter/Space keyboard handlers.
  - **Mobile** @920px: preview stacks above slots, sidebar moves below; @540px: slots stay 2-col but tighten.

## issues
- Pollinations transparent-bg is best-effort — flux often produces "white background, isolated subject" which still works on stream but isn't true alpha. Users should run through remove.bg or similar if they want clean cutouts (TODO: add a one-click bg-removal proxy)
- 4MB per-slot cap means no super-high-res sprite sheets; tradeoff for snappy ZIP gen
- Mic threshold 0.07 may be too sensitive/insensitive for some setups — no slider yet (TODO)
- Bundle format `pngtuber-bundle/v1` is ours — no existing pngtuber tool reads it. The PNGs are usable in any tool but manifest.json is for archival/portability, not auto-import

## todos
- Sensitivity slider for mic threshold + "calibrate" button that takes a 1.5s ambient sample
- One-click bg removal proxy (small free API or wasm-based remove-bg)
- Drag to reorder slots if a user wants custom states
- Add 4 extra optional slots (sleeping, surprised, dancing, drowsy) for richer rigs
- Save/load drafts to localStorage (slug + metadata + dataURLs)
- Direct OBS browser-source URL that loads from a saved bundle URL (would need backend hosting)
- Spritesheet export (single 2×2 grid PNG instead of separate files)
- Animated GIF preview export

## libraries
- JSZip 3.10.1 (https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js) — MIT, ~95KB minified, zero deps
