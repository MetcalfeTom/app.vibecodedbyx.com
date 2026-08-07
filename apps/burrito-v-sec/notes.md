# burrito-v-sec (Burrito v. SEC)

## log
- 2026-08-07: v1 per chat ("burrito SEC game where you dodge subpoenas and the final boss is a tie-wearing shrimp"). Single-file arcade dodger, no deps, all-original satire.
  - **Premise**: you are a burrito charged with three counts (unregistered guacamole derivative $GUAC; describing yourself as "fully wrapped" without audit; insider filling). Court-document intro overlay with a SERVED stamp.
  - **Structure**: three 25s "fiscal quarters" of escalating dodge waves, then the final quarter: the **Enforcement Director** — the blue-tie shrimp (cross-app cameo, same coral-curl + #0A66C2 tie design language as Clinked·in) — and you win by outlasting the **45s statute of limitations**.
  - **Threats**: SUBPOENA papers (straight, aimed at your position at spawn, edge-spawned), homing envelopes (speed-preserving steer), gavel drops (0.95s dashed telegraph ring → 🔨 slam AoE), briefcase interns (🧑‍💼 walkers, Q3+). Boss adds: subpoena fans (aimed spreads, denser in phase 2 below 20s), **ClamMail missiles** (fast, hard-steering, blue envelopes — "you'll hear from my office"), and the **tie-whip**: a *adjusts tie* tell + blue screen tint, then a full-width sweep line you dodge vertically. Boss strafes on a sine, bobs, and speaks in a drawn speech box.
  - **Player**: 3 appeals (🌯 hearts), 1.4s i-frames with flicker, screen shake on hit. Pickups: 🫑 loopholes (+50) and rare 🥑 guac (restores an appeal, only offered when down). Score = 10/s + pickups + quarter bonuses; best in localStorage.
  - **Endings**: win = green CASE DISMISSED stamp ("the $GUAC token moons responsibly"); lose = Consent Decree ("You neither admit nor deny being delicious. Your filling is placed in receivership.").
  - **Aesthetic**: legal-pad yellow with ruled lines + red margin, court-document overlays with double frames and rotated stamps, Titan One + Courier Prime (both first-use). Burrito is hand-drawn canvas (tortilla wrap seams, exposed filling, worried eyes, anxious mouth); papers render as tiny lined SUBPOENA sheets.
  - **Controls**: WASD/arrows + pointer-drag (touch). WebAudio synth SFX (whooshes, gavel thud, boss sting, dismissal fanfare) with mute toggle; audio unlocks on start.
  - **A11y**: canvas role=application + control summary, sr-only live region narrating quarter changes/hits/boss arrival, HUD aria-labels, focus-visible, ≥2.75rem buttons, court overlays focus their action button.
  - Verified: 13 pure-logic checks (collisions incl. tangent, aim normalization + zero-distance NaN guard, steering speed-preservation + convergence, quarter escalation, boss statute), id cross-check, and a real-Chromium probe driving the WHOLE game via manual step(): quarters progress → boss arrives → statute survived → DISMISSED shown, plus the 3-hit lose path → DENIED. First probe run had the test burrito die honestly in Q1 (no immunity, standing still) — the game defended itself; probe re-run immortal.

## issues
- The tie-whip checks only the player's y against the sweep line — a fully horizontal attack. Intentional (dodge is a clean vertical read), but it means camping top corners is safe-ish from whips; the fan aim + mail homing punish camping in practice.
- Interns never stop chasing until their 12s lifetime ends; two on screen in Q3 can pincer. Tuned as the intended Q3 spike.

## todos
- Post-boss endless "appeals court" mode with rising difficulty + leaderboard (Supabase).
- A second boss: the compliance rat from ClamMail review.
- "Objection!" parry: tap at the right moment to shred one subpoena (cooldown).
- Cameo whisper if you win with 3 hearts: the shrimp offers you a job at the clinic.
