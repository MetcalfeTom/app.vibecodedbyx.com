# consultant-dashboard

## log
- 2026-05-06: pivoted to **expert-matching interface** with a skills-radar chart. Originally shipped as a live-transcript consultant dashboard; chat asked to redirect the app's purpose. Title is now "Expert Match", path stays at `/consultant-dashboard` so existing links keep resolving.
  - **Two-column layout** (≥920px): left rail = brief textarea + ranked match list, right pane = selected expert detail. Single-column stack on mobile.
  - **8 hand-curated experts**, each with a 6-axis skills profile (strategy / execution / domain depth / communication / velocity / storytelling), 6-8 topic anchors, and a one-paragraph bio in the editorial Crimson voice. Personae span common consulting beats — Mara Voss (strategy & market entry), Theo Chen (operations), Sarah Meek (brand storytelling), Felix Naranjo (finance & unit economics), Ravi Khoury (product discovery), Tess Lindgren (cloud architecture), Nora Park (org design), Akira Sato (data & experimentation).
  - **Skills radar (hand-rolled SVG)**: 6-axis regular hexagon. Concentric rings at 25/50/75/100% with a slightly stronger outer ring stroke. Axis lines from center, axis labels positioned outside each axis end with quadrant-aware `text-anchor` alignment (`start` on the right half, `end` on the left, `middle` top/bottom). The expert's stat polygon is drawn as a translucent teal fill + solid stroke + stat dots at each vertex. The expert's "peak" axis labels (within 4 of their max) are bolded for emphasis.
  - **Match algorithm**: tokenize the brief and each expert's topic phrases; an all-tokens-hit phrase scores +2.5, any-token-hit scores +1. Topic score caps at 1 (4 hits ≈ saturated). Final fit = `avg_competence × 0.55 + topicScore × 100 × 0.45`. Rounds to integer 0–100. With a blank brief, fit reduces to a competence baseline so the list ranks by all-around ability instead of going empty. Verified empirically: blank → tied around 41, "go-to-market pricing" → Mara 86, "scale operations" → Theo 84, "brand narrative" → Sarah 86.
  - **Match list rows**: 2.4rem avatar (initials) + name + role + big fit numeral. Active row gets a 3px teal inset border + filled-teal avatar. Click switches the detail pane.
  - **Detail pane head**: 3.6rem teal-gradient avatar + Crimson 1.55rem name + IBM Plex Mono role line + a giant Crimson `fit · /100` block in teal on the right.
  - **Detail body** (2 columns ≥720px): radar block on the left with the SVG + a 2-column "stats-row" grid showing all 6 axes with peak axes in teal, bio block on the right with About / Topics (chip-styled, brief-matched ones get a warm-orange background) / Why this match (3-line bullet list with diamond bullets) / Connect + Send brief actions.
  - **Why-this-match reasons** are auto-generated: how many topic anchors overlapped + what the strongest two axes are + a composite competence score; if the brief is blank, prepends `Surfaced by all-around competence — add a brief to get topic-aware ranking.`
  - **Live re-ranking**: 200ms debounce on the textarea so the list reshuffles as you type. Enter without shift commits immediately, the Rank button does the same.
  - **Persistence**: `localStorage['consultant-dashboard-v2']` saves the brief text + the selected expert id. Old `v1` key from the first iteration is left alone (won't be read).
  - **Aesthetic**: paper bg `#f4f1ea` with an 11° fiber-grain repeating-linear noise. Crimson Pro for the name + section heads + bio text. IBM Plex Sans for body. IBM Plex Mono 0.18em-tracked for all metadata. Teal `#2c5f5d` (consultant) + warm `#c66e2e` (highlights / matched topics) + sage `#5a8c5a` accents. Subtle box-shadows everywhere stay flat-and-editorial rather than glassy.
  - **Accessibility**: rem units, semantic `<header>`/`<aside>`/`<main>`/`<nav>`, role-labelled regions, `aria-live="polite"` status, match-list rows are real `<button>`s with focus-visible teal outlines, ≥2.4rem touch targets, `aria-label` on the radar SVG, skip link to the match list, `prefers-reduced-motion` no-ops the radar polygon transition.

## issues
- The ranking is keyword-only (no semantic embedding). A brief that uses synonyms not in the topic anchors (e.g. "ICP" vs. "segmentation") under-ranks the right expert. Could be augmented with a richer keyword map per expert without going to embeddings.
- 8 experts is just enough for the demo to feel populated. Adding 50+ would push the match-list scroll deeper, but the layout already supports it.
- Connect / Send brief buttons are demo alerts — no real backend is wired.
- The blank-brief baseline still produces ties that rank by source order. Consider tie-breaking by composite competence + a tiny skill-diversity bonus.

## todos
- Compare two experts side-by-side: overlay the second polygon in warm orange.
- Per-expert availability indicator (avail this week / Q2 / waiting list).
- Save shortlist (multi-select with star toggles, persisted).
- Weighted skill axes — let the user dial up which axes matter for their brief, ranking re-weighted accordingly.
- Mock "engagement history" timeline under the bio (last 4 engagements with outcome scores).
- Pollinations-backed natural-language brief parser to extract topics implicitly when keyword overlap fails.
