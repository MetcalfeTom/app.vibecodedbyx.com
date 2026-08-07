# corgi-machine (Corgi Machine)

## log
- 2026-08-07: v1 per chat ("corgi generator with a sassy husky that roasts the user before each fetch"). Single file, dog-show ribbon aesthetic (Ranchers + Short Stack, cream/rosette-red/gold, SVG husky "BLIZZARD · QA DEPT." at the front desk).
  - **Roasts**: 30 hand-written husky roasts (safe/playful, self-deprecating husky lore included), no-repeat guard, fired INSTANTLY on fetch so the sass covers pollinations latency; separate 5-line delivery-verdict pool on success; distinct failure/timeout lines ("corgi oven is down").
  - **Corgis**: pollinations flux, prompt = corgi + pose×outfit×scene from 6×6×6 pools with DETERMINISTIC seed per combo (1000+pi*100+oi*10+si → exactly 216 unique URLs so the CDN cache warms permanently; no referrer param per repo note). Names: Sir/Lady × Biscuit/Waffles × the Third/Esq. Loading overlay with pacing 🐾 + rotating wait-quips (6s), 95s give-up timeout, onerror fallback with 🐕 emoji + husky apology, token-guarded against stale loads.
  - **Gallery**: session strip (10 cap), click a thumb to re-feature that corgi.
  - **A11y**: rem, semantic, bubble role=status aria-live, sr-only fetch/arrival announcements, alt text describes the generated corgi, ≥3.2rem fetch button, focus-visible, prefers-reduced-motion stills paw/snark-pop.
  - Verified: syntax + id cross-check, 10/10 pure checks (roast count, combo determinism, URL shape/no-referrer/seed, 216 combos), LIVE pollinations 200 in 0.77s (seed-1000 combo pre-warmed), headless SUCCESS path 10/10 (roast→lock→wait→real image arrival→caption→gallery→verdict→unlock) and ERROR path 4/4 (blackholed DNS → apology, button freed, fallback shown). 0 errors.

## issues
- Cold combos take 30-90s first time (pollinations generation); wait-quips + 95s timeout cover it. Combos self-warm as users fetch.

## todos
- "roast me again" button (husky roasts without spending a corgi).
- Download/share button per corgi.
- Rare shiny corgi (1/50: golden crown combo + husky begrudging respect).
- Warm the remaining 215 combos with a background trickle... or let chat do it organically.
