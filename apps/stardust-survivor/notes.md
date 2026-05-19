# stardust-survivor · notes

## log
- 2026-05-19: v1 — **perk balancer + Monte-Carlo survival simulator** for the (fictional) horror game Stardust Survivor, per chat ask "create a perk balancer app for a horror game called Stardust Survivor, allowing users to input cooldowns and visualize survival odds". Single-file ~28KB, localStorage persistence, zero deps.
  - **Perk model** · 4 categories, each with distinct activation logic:
    - **defensive** — fires reactively on threat, absorbs up to `strength` damage off the next hit
    - **offensive** — auto-casts when off cooldown, pre-empts the next incoming threat
    - **heal** — auto-casts when HP < 50%, restores `strength` HP
    - **utility** — auto-casts when off cooldown, reduces incoming threat rate by `strength * 5%` for 8s
  - Each perk: name, cooldown (1-60s), strength slider (HP for defensive/heal, % for utility, fixed 1× for offensive), removable, addable. 4 sensible defaults pre-loaded (Aegis Shield, Pulse Blast, Stim Injector, Phase Cloak) so chat lands on a working sample.
  - **Simulation** · 200ms ticked Monte-Carlo, 1,000 default runs (slider 100-5000). Per match: cooldowns count down; utility/offensive/heal perks auto-fire on their own triggers; threats land at Poisson-like per-tick probability (rate × utility-modifier); each landing threat tries defensive perks in order, otherwise damage = `threatDmg ± 5`. Returns survival rate, mean alive time, mean HP-end, mean threats-faced, per-perk usage counts + per-perk uptime (% of ticks each perk was off cooldown).
  - **Live visualisation** · 4rem `Major Mono Display` survival % with colour-coded glow (green ≥70%, amber 40-70%, red <40%). 2×2 stat grid (alive, HP-end, threats, deaths). Death-time histogram on a 380×160 canvas — 30 bins with magenta→violet gradient bars, plus a single green "LIVE" bar at the right edge for the survival fraction. Per-perk: animated uptime bar that fills 0-100% with cat-colour→cyan gradient + label showing "X% · Y.Y uses/match".
  - **Recompute on change** · 90ms-debounced re-sim on every slider/input change. Default loadout (HP 180, 11 threats/min, 120s match, 30 damage) lands in the amber 60-70% zone so chat sees the gauge move both directions as they tune.
  - **State persists** · entire perk loadout + scenario sliders → `localStorage['stardust-survivor-v1']`. Reload = same loadout.
  - **Aesthetic** · deep cosmic black (`#04030f`) bg with violet/cyan radial glows + 10-star CSS starfield. Major Mono Display title with magenta/cyan chromatic-aberration glow ("STARDUST·SURVIVOR"). Cormorant Garamond italic tagline ("tune your loadout · let the void decide if you live"). JetBrains Mono for all data. Panels are translucent + backdrop-blurred.
  - **WCAG basics** · semantic main/header, role-appropriate inputs, focus-visible cyan outline, ≥2.4rem button hit areas, prefers-reduced-motion kills transitions, mobile breakpoint stacks at 920px.
  - **OG image** via Pollinations flux (no `referrer` per project notes).

## issues
- The simulator's threat model is a single damage bucket — real horror games have varied attacks (light/heavy/grab) that would need separate counters.
- No "trinket" or "passive" perks yet (e.g., +20% HP, faster cooldowns) — would need a different category that modifies the global scenario.
- The Pulse Blast (offensive) "strength" slider is locked to 1× since the pre-empt mechanic doesn't scale — could let strength control duration of the pre-empt buffer.
- 5000 sim cap keeps even slow devices under ~50ms per recalc; sim is single-threaded JS, no worker.
- No way to A/B compare two loadouts side by side yet.

## todos
- Loadout presets dropdown (Tank / Glass Cannon / Stealth / Balanced).
- Side-by-side A/B comparison (two columns of perks, two survival curves).
- Export loadout + scenario as a shareable URL hash.
- Multiple threat types with separate counter affinities.
- "Cost" budget per perk (cooldown × strength = points; total budget cap).
- Per-perk usage timeline replay (a single sample match's events as a gantt).
- Web Worker for the sim so >5k runs don't block the UI.
