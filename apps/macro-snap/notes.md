# Macro Snap

## log
- 2026-04-22: Created. Photo-to-macros tracker — upload/capture a plate, Pollinations vision model estimates calories + protein/carbs/fat grams, log to today's journal. **Flow**: file input (`accept="image/*"` + `capture="environment"` for mobile camera) → client-side resize via Canvas2D (max 1024px, JPEG quality 0.82) → POST to `https://text.pollinations.ai/openai` with OpenAI-compatible messages payload (system + user with `[{type:'text'}, {type:'image_url', image_url:{url: dataUrl}}]`), model `openai`, `jsonMode: true`, `referrer: 'sloppy.live'`. **Prompt** demands strict JSON: `{name, portion, calories, protein_g, carbs_g, fat_g, confidence (0-1), notes, is_food}`. Non-food photos return `is_food:false` with friendly message. Response parser tries direct JSON.parse → fenced code block → first `{...}` slice as fallbacks. Result normalized (ints, 0-80 char clamps, 0-1 confidence clamp). **Display**: big serif calories number (Fraunces 300 weight @78px), stacked-bar kcal split (protein-sage/carbs-ochre/fat-tomato) with legend, 3-column macro grid (P/C/F grams + kcal subtotal), confidence bar (gradient tomato→ochre→sage), optional observation note in italic Fraunces, Save/Re-read actions. **Journal**: localStorage `macro-snap-log-v1`, 60-entry cap, saved with thumbnail (dataURL), entries grouped to today by local date key `YYYY-MM-DD`. Entry cards show thumb + time + dish name + P/C/F grams + kcal badge; hover reveals × delete. Today's totals row (protein/carbs/fat/kcal) in Fraunces numerals. **Aesthetic**: editorial cookbook — cream/bone palette (`#f4ece0` / `#fdf7ec`), sage green (`#667b5a`), tomato red (`#c64a2e`), ochre (`#c58a2f`), ink charcoal (`#1f1a15`). Masthead with "Vol. I" / "№ 001 · date" gutter, Fraunces italic variable display at `opsz 144` (title clamp 58–128px, "Snap" in tomato semi-bold non-italic), IM Fell-adjacent editorial feel. Dashed drop zone with "bring a plate" italic call. Multiply-blend repeating-linear paper grain overlay. Responsive breakpoint 820px → single-column stack. Pollinations OG via image API (no referrer param per notes warning). Fraunces + IBM Plex Sans + IBM Plex Mono.

## features
- Take photo with phone camera (capture=environment) or upload/drop file
- Auto-resizes client-side before upload (1024px max, JPEG q=0.82) — keeps payload small
- Pollinations vision model (OpenAI-compatible endpoint) returns strict JSON macros
- Calorie hero number + proportional kcal bar + P/C/F grid
- Confidence meter from the model's own self-rating
- Dish name + portion line + observation note
- Handles non-food photos gracefully
- Today's journal with thumbs, auto-totals, delete entries
- localStorage persistence, 60-entry cap
- Mobile + desktop responsive; drag-and-drop on desktop

## issues
- Vision models guess, sometimes wildly. Confidence % and "Observation" caveat make this clear; also framed as "field guide," not medical.
- Pollinations free tier can be slow or occasionally rate-limit — loading spinner + descriptive error on failure
- `toDataURL('image/jpeg', 0.82)` + 60-entry journal can push localStorage toward ~5MB cap on some browsers; entry cap mitigates
- JSON extraction has 3-layer fallback (direct parse → fenced → brace slice) since models sometimes wrap output

## todos
- Portion adjustment slider (½×, 1×, 1.5×, 2×) without re-querying the API
- Daily target rings (e.g. 2000 kcal goal) with progress
- Multi-day calendar view
- Export journal as CSV
- "Retake" button that re-prompts camera directly
- Streak counter / weekly macro average
- Optional "water" quick-add button (0-kcal rows)
