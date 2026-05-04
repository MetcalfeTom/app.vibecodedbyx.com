# dota-manager

## log
- 2026-05-04: shipped — v0.1, implementing **section § 1 of the spec (data model)** plus a basic dashboard. No transfer logic, no match sim, no DPC bracket yet.
  - **Data model implemented**:
    - Player: `{ id, handle, real_name, region, age, role_primary (1-5), role_secondary, contract:{salary_weekly, expires_at, buyout}, form, morale, fatigue, hidden_potential, scouted_potential, stats }`. Stats grouped exactly as specced: `mech` (lasthit/harass/micro/reaction), `sense` (map_awareness/decision/vision/draft_iq), `role` (farm_efficiency/tempo/space_creation/rotation/warding), `soft` (leadership/tilt_resistance/language_overlap).
    - Team: `{ id, name, region, season, day, budget, prestige, dpc_points, sponsors, coach_id }`.
    - Chemistry matrix: symmetric `{ "idA|idB": {value:-20..+20, games} }` keyed via sorted-id helper `chemKey(a,b)`.
  - **Dashboard layout**: gold-on-slate crest header (team mark from initials + season + day + 4 KPI tiles for budget/prestige/DPC/salary load — salary tile turns warn-amber > 70% of weekly budget, bad-red over budget) → starting roster grid → bench grid → chemistry matrix → footer with save status.
  - **Player cards**: role-coloured 4px stripe (Pos1 ember, Pos2 amber, Pos3 chartreuse, Pos4 teal, Pos5 violet, Bench striped grey). Header has gradient circle portrait with role-tinted radial fill, handle + region/age/real-name meta line, role pill + secondary-role pill on the right. Condition row (form/morale/fatigue) as 3 mini bars with traffic-light fill colour. Four stat groups stacked: Mechanical / Game Sense / Role · {role} (subset of 4 keys most relevant per position) / Soft. Each stat row is `[label] [thin gradient bar] [number]` with tier-S values gold-bright, A gold, D red. Potential block at bottom: scouted = visible number, unscouted = `???` in dim mono; ₵5,000 Scout button reveals a fog-of-war reading (true potential ±~4). Contract footer: salary/wk · buyout · days-to-expire.
  - **Random generation**: gaussian-skewed stat rolls with role-bias offsets (e.g. Pos5 gets +22 warding, +18 vision, +10 leadership, −14 lasthit, −12 farm_efficiency). Hidden potential roof drops with age. Salary scales by role tier (Pos1/2 ≈ 18k, Pos3 ≈ 14k, Pos4/5 ≈ 10k, gaussian noise 4.5k).
  - **Synergy matrix** rendered as a real `<table>` with diagonals dimmed, `+N` greens for positive chemistry, `−N` reds for negative, sub-line shows games-played count. Header row uses 8-char handle truncation to keep grid compact.
  - **Daily tick** (▶ Advance day): form drifts toward 50 with ±4 jitter, fatigue eases off ~3/day without matches, morale tracks form weakly. Every 7 days salaries debit from the team budget. No match resolution yet — that's § 2.
  - **Persistence**: full state to `localStorage['dota-manager-state-v1']` on every action. Schema-validated on load (must have `team`, `roster[]`, `chemistry`); falls through to fresh `genTeam()` on corruption. Migration step on boot adds chemistry entries for any new player pairs.
  - **Aesthetic**: Cinzel for headers + portrait initials + KPI numbers, IBM Plex Mono for stats/labels/contracts, Cormorant Garamond italic tagline, IBM Plex Sans body. Dark slate-purple bg with red + gold + warm radial glows + 45° diagonal hairline grain. Crest panel has a 6px red→gold→deep gradient ribbon down the left edge (knight-crest reference). Gold accent `#e6b34a` throughout, with role-coloured per-card chrome.
  - **Accessibility**: rem units, 100% root font-size, semantic `<main>`/`<header>`/`<section>`/`<article>`/`<footer>` + `<table>` for the matrix, role pills + KPI tiles labelled, `prefers-reduced-motion` no-ops the hover transitions, focus-visible 3px red outlines, 2.75rem min-height on every interactive control, skip link to the roster.

## issues
- No transfer market UI yet — § 3 of the spec. Free agency + negotiation + buyouts still pending.
- No match resolution — § 2. Form/fatigue ticks here are placeholder drift, not the spec's per-match update.
- Hidden vs scouted potential is a single value; the spec mentions "fog-of-war until scouted" — currently fully revealed once paid for. Real implementation should reveal one digit at a time or shrink the ±error band over multiple scouts.
- Chemistry matrix is read-only; doesn't update on match resolution because there isn't one.
- Stat synthesis lumps role_primary stats into the player even when irrelevant (Pos1 has a `warding` value). Display hides this, storage doesn't — fine for now, may bloat saves later.

## todos
- § 2: match-day resolution loop (draft phase + per-phase score sums + Elo upset variance).
- § 3: transfer window with free-agent pool + sealed weekly bids + negotiation sigmoid + buyouts + poaching guard.
- Add Coach entity (separate from players, modifies training schedule + draft_iq).
- Sponsor revenue ticking on the weekly salary cycle.
- DPC bracket / Major qualifier / TI seed UI.
- Player history panel (career arc — past teams, prestige earned).
- Persist scout reveals as multi-stage (3 scouts narrow the ±error from ±10 → ±5 → ±1).
