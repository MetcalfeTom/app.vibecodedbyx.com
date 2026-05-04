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

- 2026-05-04: shipped — **§ 3 transfer market**. Sigmoid acceptance + sealed bidding pool now wired end-to-end.
  - **Window state machine**: 30-day cycle with `window.open` toggling on each cycle. Resolve disabled when closed. Daily tick advances `daysLeft`, flips state, refreshes the FA pool and re-rolls rival bids when the window opens.
  - **Asking price exactly per spec**: `base_value(stats × age_curve × potential_factor) × form_multiplier (0.7–1.3) × scarcity (role_demand) × prestige_premium (1 + lastTeam.prestige × 0.005)`. Each multiplier is shown as a separate row in the bid modal's breakdown panel (base value · form mult · scarcity · prestige premium · ASK), so the spec formula is auditable visually.
  - **Acceptance probability exactly per spec**: `sigmoid((offer/ask − 1)×4 + 0.6×team_fit + 0.4×prestige_diff_norm − 0.5×remaining_years)`. Each component is rendered live as the user drags sliders, with positives in green / negatives in red and a final percentage. Live meter under the percentage slides red→amber→green as offer rises.
  - **Team fit**: region match (+0.45) or near-region EU↔EEU (+0.15), role-gap term (+0.5 if no starter at the role, −0.05 if 1 already filled, −0.25 if redundant), language-overlap nudge (±0.245). Clamped to [-1, +1].
  - **Sealed bidding pool**: 8–12 free agents auto-seeded on window open. Each FA card shows handle, role pill, region/age/form/potential, mini-stats (avg/mech/sense/soft), asking price, count of rival bids, plus a YOUR BID badge with live acceptance % when you've already submitted. **Submit Sealed Bid** opens a modal with three controls: weekly salary slider (40–180% of ask-derived baseline), 1/2/3-year toggle, signing-bonus slider (0–500k). Total offer value = `salary × 52 × years + bonus`.
  - **Escrow**: submitting a bid earmarks `signing_bonus + 4 × salary_weekly` from the team budget. Editing refunds the prior escrow first. Withdrawing fully refunds. Won bids deduct the actual signing bonus, keeping escrow consistent.
  - **AI rivals**: 5 fixed rival teams (EU/NA/CN/SEA/SA) each pick 1–3 FAs they like (heuristic on stat avg + region match) and post bids with prestige-scaled aggression (0.85–1.5× ask). Their bids show on each FA card as the rival count.
  - **Weekly resolution** (`Resolve weekly bids`): for every FA with bids, gathers all bidders (you + rivals), runs each through their team-specific sigmoid, sorts by acceptance probability with prestige tiebreak. Top bid that exceeds the **0.5 threshold** wins; below threshold, all bids carry over to next week. Winning bid moves the player onto the new team's roster (bench by default), seeds chemistry, drops them from FA, and refunds losing escrows. Window timer also advances by 7.
  - **Transfer log**: 30-deep activity feed with day stamp; gold for our wins, red for losses/expirations, ink-grey for ambient events (window open/close, rival signings).
  - **Buyout button on every player card**: `buyout = max(50k, remaining_salary × (1.5 − form/200))` per spec. Confirms, deducts, releases the player to the FA pool with a `_sticky` flag (so refresh doesn't drop them). Buyout cost replaces the previous static contract.buyout column for accuracy.
  - **Promote button on bench cards**: swap with same-role starter or fill empty slot, logged to transfer feed.
  - **Contract expiry**: when a roster player hits 0 days, they auto-release into the FA pool with a `fail`-tinted log entry — closes the loop with §3.
  - **Poach guard scaffolding**: `_poach` flag + 90-day check + −5 prestige + ₵50k fine logic exists for any future "approach a rival's player" UI; the flag isn't toggled yet (FA pool only for now).
  - **Persistence**: state shape extended with `window`, `free_agents`, `bids`, `rival_bids`, `transfer_log` — boot migration adds them if loading a v0.1 save.

- 2026-05-04: shipped — **§ 2 match resolution**. The core loop closes: signed players play, form/morale/fatigue/chemistry/DPC/prestige all move per match.
  - **Match Day panel** below the header. Five rival cards (Northern Edge / Sunset Saints / Hangzhou Volt / Manila Mosaic / Brujas Mexicas) showing region + prestige, plus a sixth crimson "? Random" card. Click to select (aria-pressed toggles the gold ring), press the giant red **Commence** button. Button auto-disables when starters < 5 or no rival selected; status line shows `5/5 starters · ready` or `3/5 starters · need 2 more`.
  - **Phase-by-phase score (per spec §2.2)**: per phase (lane / mid / late), a per-role stat subset is averaged for each player, then `score = avgStat × 1 × (1 + chemistry/100) × form/100`. Per-role stats by phase:
    - Lane: pos1 lasthit/farm/harass · pos2 lasthit/tempo/reaction · pos3 lasthit/space/tilt · pos4 rotation/harass/vision · pos5 warding/vision/harass.
    - Mid: pos1 farm/reaction/micro · pos2 tempo/decision/reaction · pos3 space/tilt/micro · pos4 rotation/vision/map · pos5 vision/map/warding.
    - Late: pos1 micro/decision/draft_iq · pos2 micro/draft/decision · pos3 micro/tilt/space · pos4 decision/leadership/map · pos5 decision/leadership/tilt.
  - **Form drag from fatigue**: effective form during the match = `form × (1 − fatigue/200)`. Maxed-out fatigue halves contribution — gives rest a real reason to exist.
  - **Rival rosters generated on-the-fly**: 5 starters whose stats are biased to a target average derived from the rival's prestige (38–82 mean), with their own internal chemistry seeded slightly higher than ours by default (rivals have been together longer). Disposable per match — keeps state lean and rivals fresh.
  - **Elo-style upset variance (per spec §2.3)**: σ = mean_score × (0.07 + prestige_diff/100 × 0.10). Verified empirically over 5,000 sims: equal strength → 50.2% us-win, +300 score & +30 prestige → 91.4% us-win, underdog (-300, -30) → 8.3% us-win. Big enough variance that every match feels alive; small enough that strength matters.
  - **Per-player KDA (per spec §2.4)**: each starter's K/D/A is biased by their per-phase contribution rank, role-typical baselines (carry K=9 d=4 a=9, hard-sup K=3 d=7 a=16), win/loss multipliers (winners +18% kills/assists, losers +18% deaths). MVP flag goes to the highest contributor on the winning side.
  - **Per-player effects (per spec §2.4)**: form `+4` win / `−3` loss / `+4` MVP, fatigue **+12 flat for all 5** (per spec), morale `+3` win / `−2` loss / `+2` MVP. Chemistry between every starter pair grows: `+0.5` win / `−0.15` loss with σ=0.4-0.5 jitter, games counter increments. Pair chemistries lerp into integers in [-20, +20] over many matches.
  - **Team effects**: win → DPC +25, prestige +1 (or +2 if upset over a stronger team), sponsor bonus ₵60,000. Loss → DPC −3 (clamped at 0), prestige −1 (or −2 vs weaker team).
  - **Match modal layout**: VS line at top → giant VICTORY/DEFEAT in green/red Cinzel → 3-row phase grid with our gold bar filling from the right ←, their red bar filling from the left → with phase winner indicator at the right edge → totals strip showing final scores side-by-side → KDA grid (one row per starter, role-coloured left stripe, MVP row gets the gold gradient + ★ MVP tag instead of the +12 fatigue note) → delta bar with DPC/Prestige/Avg form Δ/Sponsor bonus, positive in green, negative in red. Continue button closes the modal. Esc + click-outside also close.
  - **Activity log integration**: every match adds a line to the existing transfer log (`Match won vs Northern Edge · 1607–1503 · DPC +25` in gold, or `Match lost…` in red), so the history is unified with transfers.
  - **Day advances by 1** per match; weekly salary debit + window timer continue to use the existing daily tick.

- 2026-05-04: chat ask — "add a match history array to store KDAs and MVPs". Now `state.matches[]` persists every played match (capped at 100, newest first) with a complete record:
  - `{ id, day, timestamp, won, us_name, opponent:{id,name,region,prestige}, us_score, them_score, phase_scores:[{phase,us,them}], mvp_id, mvp_handle, kdas:[{player_id,handle,role,k,d,a}], deltas }`.
  - **Match History section** between Match Day and Roster: summary pills at top (record W-L, win rate %, most-MVPs handle + count, best single-game KDA), then a list of clickable `.history-row` cards with the W/L pill in green/red, day stamp `d042`, opponent name + region + prestige, score (gold–red), and MVP star + handle.
  - **Click any row → modal pops open with the full per-match breakdown** (phase bars, KDA grid, MVP highlight) — same modal as a fresh match, just rendered from the stored snapshot. Renderer was refactored into `renderMatchModal(view)` that takes a normalized `liveView(res)` or `historicView(rec)`. Historic view shows a "archive · day NNN · effects already applied" line in place of the deltas bar so retroactively-applied numbers can't mislead.
  - Wipe All wipe button on the section header (with confirm) clears the archive without touching player stats or DPC.
  - Boot migration adds `state.matches = []` to old saves so v0.3 sessions don't break.

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
