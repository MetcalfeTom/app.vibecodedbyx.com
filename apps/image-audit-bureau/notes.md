# image-audit-bureau · notes

## log
- 2026-07-10: v1 (chat ask: one-page image audit tool — URL input → TF.js MobileNet fully in-browser → top-3 predictions w/ confidence, request cut at "with co…" = confidence bars). **Stack**: TF.js 4.20 + @tensorflow-models/mobilenet 2.1.1 from jsdelivr (script tags, no build); `mobilenet.load({version:2, alpha:1.0})` — default weights URL resolves via tfhub.dev 302 → kaggle GCS, verified 200 (86KB model.json). Model loads LAZILY on first audit (indeterminate loadbar + "weights: downloading…" modeline; ~12MB first time, then browser-cached). **Inputs**: URL box (Enter or 🔍 Audit), local file button, drag-drop anywhere (files AND dragged URLs via text/uri-list), 4 sample buttons hitting pollinations (seed 42, 512², CORS `*` verified, all 4 pre-warmed into CF edge cache so they're instant). **CORS reality**: arbitrary image URLs need `img.crossOrigin='anonymous'` + a permissive host or tf reads taint-fail — onerror maps to a friendly "host blocks cross-origin reading → save + upload instead" message; 20s timeout separate message. **Report**: polaroid-tilted exhibit photo, top-3 rows w/ animated hatched confidence bars (rank-1 green, others blue), inference ms, rubber-stamp verdict — ≥70% green "CERTIFIED: <class>", ≥40% amber "PROBABLY:", else red "INCONCLUSIVE" — with slam keyframe (scale 2.6→1 + multiply blend). Case № counter persists in localStorage. **Aesthetic**: manila case-file folder (tab die-cut via ::before) on a dark desk w/ scanline grain, Special Elite + IBM Plex Mono, form-224-B bureaucratic copy ("dept. of pixel affairs"). WCAG: labels, role=status aria-live, aria-label on bars, focus-visible, ≥2.75rem targets, reduced-motion kills spinner/slam/bar-anim. Pollinations OG (flux seed 8112). Hook `__bureau {audit(url), model()}`. NOT executable in sandbox (no browser/WebGL) — CDN + weights + CORS all verified via curl; if chat reports failure, first suspects: tfhub redirect changes or WebGL unavailable (tf falls back to wasm/cpu automatically — slower but works).

## issues
- Many big image hosts (imgur direct links usually OK, most CDNs vary) block CORS — this is physics, not a bug; the file-upload path always works.
- Pollinations sample buttons: uncached prompt+seed variations take ~60s to generate; the 4 shipped samples are pre-warmed. Don't change seeds casually.

## todos
- "Audit history" strip of past exhibits (localStorage thumbs).
- Optional EfficientNet/higher-alpha model toggle for accuracy vs speed.
- Webcam exhibit mode.
