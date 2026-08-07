# laughometer (The Laughometer)

## log
- 2026-08-07: **named tiers + rat attorney at 100** (missmeowd's milestone round). TIERS: 0 dead silence → 1 a chuckle → 10 giggle fit → 25 the good wheeze → 50 cackling → 100 comedy gold → 250 dying (positive) → 500 lungs collapsed → 1000 transcendent kek. Tier label under the big number (tierpop anim + sr-only announce on tier-up, replaces the old bare MILESTONES). At exactly 100 the rat attorney (shrimp-comedy-club/pixl-pal cameo lineage) rises center-bottom — "objection: emotional damages. billing all of you hourly." — takes a falling HA to the head (ratdropfall → ratBonk squash), leaves after ~5.5s; singleton-guarded, re-triggers on re-crossing 100 after reset. Probe 10/10: boundary math (0/1/9/10/99/100/5000), 99-no-rat vs 100-rat, pop anim, one-rat guard, bonk + damages text, reset back to dead silence. 0 errors.
- 2026-08-07: v1 per chat ("live laugh counter that counts every hahahaha per session, real-time"). Single file, comedy-scoreboard aesthetic (Luckiest Guy + IBM Plex Mono, acid yellow on black + hot pink).
  - **Detection** (pure, 24 checks): LAUGH_RE catches hahaha/ha ha ha/hah, hehe, lol/lolol/lolz, lmao/lmfao, rofl, jaja, kek/kekw/keklol, lul, omegalul, xd, 😂🤣💀 — boundary-safe (trolol/lullaby/haberdasher stay unfunny). `haUnitsOf` measures laugh intensity (capped 60, min 1) → drives fly-HA size/count + blip pitch.
  - **Board**: big session counter with bump anim, laughs/min (rolling 60s window via sorted timestamp tail-scan, 3s refresh), ha's harvested, unique laughers, top laugher. Leaderboard top-8, 40-line fresh-ha ticker (textContent-only, hashed name colors). Milestones (10/25/50/100/250/500/1000) → sr-only announcement + double HA burst.
  - **Sources**: anonymous Twitch IRC (repo-proven pattern: justinfan + JOIN + PING/PONG + generation-guarded exponential backoff 3.5→30s), channel persisted + auto-reconnect on return visits (only if previously connected, wsGen===0 guard); try-box for local testing (rejects non-laughs with a hint).
  - **A11y**: rem everywhere, semantic sections, sr-only aria-live for milestones/reset (big number itself is aria-hidden to avoid spam), role=log ticker with aria-live off, ≥2.75rem targets, focus-visible pink, prefers-reduced-motion kills fly-HAs + bump.
  - Verified: syntax + id cross-check, 24/24 pure classifier checks, 10/10 headless behavior probe (counts, dedupe of non-laughs, DOM stats, leaderboard, try-box accept/reject, reset), 0 errors.

## issues
- Laugh lexicon is EN/twitch-centric; extend on request (pixl-pal's classifier is the sibling reference).

## todos
- Persist all-time laugh total (localStorage) alongside session.
- ?overlay=1 OBS mode: transparent bg, just the big number.
- Laugh streak detector: N laughs in 10s → "COMEDY GOLD" banner.
