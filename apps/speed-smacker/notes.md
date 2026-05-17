# speed-smacker · notes

## log
- 2026-05-17: v1 — **a button that teleports away whenever the cursor gets too close · 30s time attack** per chat ask: "create a game called speed-smacker where a button teleports away whenever the cursor gets close." Single file ~22KB, lives at `/speed-smacker`.
  - **Core dodge mechanic**: window-level `pointermove` listener tracks the cursor every frame; if the cursor center is within `state.dodgeRadius` (starts 110px, grows 3px per hit up to 220px) of the button center AND the last teleport was >200ms ago, the button **snap-jumps** to a random new viewport position. No CSS position transition — the snap IS the chaos. Each teleport plays a quick descending-bandpass-noise `sndWhoosh` (2400→400Hz over 100ms).
  - **Smart placement**: `pickRandomPosition()` does up to 12 attempts to find a spot ≥240px from the cursor (so chat has a fair pursuit window) within safe-zone bounds (60px from viewport edges, 140px below the top HUD strip, 90px above the bottom hint). Falls back to the farthest candidate if no valid spot found. Resize-aware — on viewport change, re-rolls the button into bounds.
  - **Hit registration**: pointerdown on the button itself = a clean hit (cursor must be ON the button when pressing, not just nearby). `hitPow` keyframe (scale 1→1.4→0.4 + brightness flash, 300ms) plays before the post-hit silent teleport 220ms later. Each hit triggers `sndSmack` = 80ms 380Hz bandpass-noise burst + 180Hz square punch + 90Hz sine sub-thud.
  - **Difficulty ramp**: per hit, the button shrinks 1px (`buttonSize` min 40px, starts 100) AND the dodge radius grows 3px (max 220). So your 30th hit is fighting a 70px button with a 200px dodge radius — late-game is genuinely twitchy.
  - **Combo**: each hit within 2 seconds of the previous = +1 to combo (cap 8). Score multiplier = `1 + floor(combo / 2)` so ×2 at combo 2, ×3 at 4, ×4 at 6, ×5 at 8. Base 10 points × multiplier. Every 3rd combo milestone fires `sndComboTier` (660/990/1320Hz triangle+sine) + a lime "×N combo!" floating text. Combo card on the HUD flips lime + pulses (`.fire` class) at ×3+.
  - **Floating text** for every hit: `+N` in Bungee, lime for combo-fire hits, amber otherwise, with `floatUp` keyframe (1s: scale 0.6→1.1 → fade upward by 110% with `translate(-50%, -160%)`). Multi-color spark burst (8 sparks at combo 1, 16 at combo ≥3) — 5-color cycle (pink, amber, cyan, lime, white) with `sparkFly` keyframe (translate to random angle 80-220px + scale-down + fade, 950ms).
  - **Button visual**: 100px-diameter perfect circle with 4px ink border, radial-gradient fill (light-pink → magenta → deep-magenta), chunky 14px bottom-offset shadow + 22px atmospheric shadow + 4px pink outer-glow ring. Inside: a face emoji + Bungee text label, both `pointer-events: none` so they don't intercept clicks. **The face evolves with score** — `['🙃', '😈', '😏', '😎', '🥸', '🤪', '👻']` cycles every 100 points (the button gets visibly smugger as it dodges you). Label text also evolves: `['smack', 'catch me', 'too slow', 'try me', 'nope', 'lol', 'imp.']`.
  - **HUD** (3 fixed cards at top-centre, 30 z-index): score (pink with pink glow), combo (amber → lime + bump animation at ≥3), time (cyan, → amber warn at ≤10s, → red+pulse danger at ≤5s). All in Bungee with tabular-nums for the values.
  - **Pre-game overlay**: amber-cream panel with 4-color gradient title, smug Caveat sub "the button does **not** want to be smacked", short rules, big magenta "smack ’em up" button with 6px hard-drop shadow + 22px pink glow.
  - **Post-game overlay**: lights up after the 30s timer expires. Tiered flavor text by score: ≥800 "the button has filed a complaint", ≥400 "solid smacking · the button respects you", ≥150 "acceptable smacking", else "the button is smug". Stats panel shows final score (lime "NEW" badge if it beat the high score), best ever, smacks landed, longest combo, smallest button size you forced it down to. localStorage `speed-smacker-best` persists.
  - **Audio**: lazy `ensureAudio()` on first interaction (start button). All synthesis: `tone()` for plain oscillators with exp-decay envelopes; `noiseBurst()` for short bandpass-filtered noise. 4 sounds total: smack / whoosh / combo-tier / game-over.
  - **Aesthetic**: warm cream-to-apricot bg gradient (#fff3d4 → #ffd8a8) with 3 radial accent glows (pink top-left + cyan top-right + lime bottom-right). Title in Bungee with pink→amber→cyan 3-stop -webkit-background-clip gradient + 4px drop shadow. Caveat italic for sub-text. Fredoka sans for body. Bottom Caveat hint "approach quick · click before it bolts" fades after first hit.
  - **Touch support**: `pointermove` fires for touch-drag too, so dragging your finger toward the button on mobile makes it bolt — same dodge logic. Tap = click = hit. `user-select: none` + `overscroll-behavior: none` on html/body so the game doesn't fight scroll/swipe.
  - **WCAG**: rem units everywhere, semantic main/section, `role="dialog" aria-modal="true" aria-labelledby` on both overlays, `role="status" aria-live="polite"` on the score HUD, `aria-label` on the button + start/retry buttons, `aria-hidden="true"` on decorative emojis + the arena div, `:focus-visible` 3px amber outline 3px offset, ≥44px (2.75rem) min-height on all interactive controls, `prefers-reduced-motion` kills all keyframe animations + transitions + transforms (the game still plays — you just don't get the visual juice).
  - **OG image**: Pollinations flux seed 31313.

## issues
- Button can land partially under the HUD on very tall narrow viewports if 140px-from-top doesn't clear all 3 HUD cards (they stack via flex on desktop only). On mobile portrait, the HUD card height is ~2.4rem ≈ 38px each, fits within the 140px buffer.
- Some users will hit the button by chance during the post-hit-silent teleport (220ms cooldown) — that's intentional, but it can feel "spongy" on first play. Could increase to 350ms for more breathing room.
- The dodge-radius can grow large enough late-game (~200px) that the button practically becomes uncatchable on small screens. Difficulty curve might need a soft cap based on viewport size. v1 keeps it pure.
- No mode select (easy/hard/insane). Single 30s round only.
- No accuracy stat — easy to compute (hits / cursor-clicks-fired) but currently I don't track misclicks. Would require window-level pointerdown listener + counting.
- The `face` evolution is based purely on `score / 100` (every 100 points = next face), so a lucky combo burst can advance you 2 faces in a row. Funny but not a graceful curve.
- Resize during play snap-relocates the button (could be jarring if you happened to be hovering it). Acceptable trade for keeping it in bounds.

## todos
- Difficulty modes: easy (no shrinking, smaller dodge radius), hard (button starts at 60px and shrinks faster), insane (5s rounds, score x10)
- Misclick tracking → accuracy stat in the game-over panel
- "Boss button" mode: occasional 200px golden button that takes 5 hits to smack but pays out 500
- Leaderboard via Supabase (anon)
- Twitch chat integration: each chat message triggers a phantom click attempt at a random position (so chatters can collaboratively smash)
- Multiplayer co-op: 2 cursors visible, same button, race to smack first
- Sound: a satisfied "OK" voice line every 10 smacks (Web Speech)
- Trail: a fading dot trail behind the cursor for the "speed" feel
- Daily seed challenge: same teleport sequence for everyone today
