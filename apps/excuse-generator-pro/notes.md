# excuse-generator-pro · notes

## log
- 2026-07-15 v1.0: chat ×2 "Excuse Generator Pro — Apple Glass transparent design, tone picker, probability needle, fake supporting timeline, no network". Glassmorphism: pastel gradient wash (fixed attachment) + frosted cards (backdrop-filter blur 18 saturate 1.5, hairline white edges, inset top highlight). Engine (pure, rng-injectable): 8 situations × 4 incidents each w/ base plausibility (22–82) × 5 tones w/ believability modifiers (professional +12 … mystical −26) + jitter ±7, clamped 4–96. Needle: semicircle SVG (red/amber/green arc zones), −90°+p·1.8°, spring ease. Fake timeline: 3–5 chronological beats (calm→contact→escalation→mitigation→aftermath) with drifting timestamps, evening start for party/date. Copy + reroll. Satire disclaimer under the timeline ("honesty is still the premium feature"). Zero network APIs. Albert Sans + Plex Mono.

## issues
- Excuse innerHTML uses engine-authored <b> only (no user input in the string) — safe as-is; if user-supplied text ever gets added, esc() it.

## todos
- "Severity" dial (white lie → felony) if chat asks.
- Share-as-image card (canvas render, still local).
