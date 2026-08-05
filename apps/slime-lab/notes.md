# Slime Lab

## log
- 2026-08-05 v1: initial build per chat request — slime creation lab with recipe-driven soft-body physics + synthesized sounds.
  - **Recipe model**: 4 glues (white/clear/pearl/glow → alpha, gloss, damping), 3 activators (borax=snappy/stiff/high-pitch, contact=stretchy/soft/low-pitch, starch=bouncy), dose slider 0–100% (cure), 6 pigments, 3 add-in chips (glitter, foam beads, charms). `derive()` maps recipe → P: {stiff, damp, stretchMax, slump, bounce, wobbleK, pitch, wet, ...}. All controls apply instantly (small wobble pulse); MIX button re-pours a fresh batch from the top.
  - **Physics**: center particle (gravity 1500, wall/floor bounce by activator restitution) + 30 perimeter points spring-bound to `center + dir(ang)·r·(sx,sy)` with neighbor cohesion, per-frame damping `P.damp^(dt·60)`, droop gravity `·slump` on points. Squash/stretch (sx, sy) modeled as underdamped springs (wobbleK from cure) → jello wobble on impact; grounded idle slumps toward puddle `(1+slump·0.55, 1−slump·0.38)`. Undercured = droopy sticky puddle, overcured = stiff rubber ball.
  - **Interactions**: drag inside blob = grab (gaussian-weighted pull on points near grab angle, center follows weakly); pull past `stretchMax·r` → grip SLIPS (auto-release + snap sound + wobble impulse) — stretchMax is the recipe differentiator (contact+low dose ≈ 3.3r+, borax+high dose ≈ 1.2r). Quick tap = poke (radial dent + squish). Fling on release (smoothed pointer velocity ×0.75). R = re-mix, M = mute.
  - **Sound (Web Audio, all synth)**: sSquish = bandpass noise sweep, f0 = (240+420·pitch), wet recipes add 1–3 sine bubble squelch blips; sSnap = square osc drop at 170·pitch·(1+i) + highpass tick; sCrunch (beads only) = 5–9 staggered highpass noise ticks; continuous stretch bed = looped bandpass noise, gain from drag speed; sMix = swirl sweep. Pitch derives from dose × activator → borax high dose literally snaps higher.
  - **Render**: quadratic-Bézier through point midpoints, radial gradient (light→pigment→dark) with glue alpha, glow glue = shadowBlur 34, gloss highlights scale with glue gloss, clip-path inclusions (twinkling glitter squares, foam bead dots, emoji charms) ride the (sx,sy) deformation. Mat + wall + dotted lab backdrop on canvas.
  - **A11y**: aria-pressed on all toggles, role=status readout, role=application canvas w/ control summary, focus-visible, 44px targets, rem sizing, prefers-reduced-motion kills twinkle.
  - Fonts: Slackey + Varela Round + Space Mono. Sticker/craft-bench aesthetic (cream grid bg, ink borders, hard offset shadows).

## issues
- No live curl verification at build time — sandbox had zero HTTP egress (curl 000 to sloppy.live AND localhost). Verified via node parse + $()-vs-id cross-check only. Re-verify in browser when possible.
- Meters (STRETCH/SNAP/WOBBLE/CRUNCH pips) are derived heuristics — tune the normalizations if chat says they look wrong.

## todos
- Possible: two slimes to compare side-by-side; scent add-in (visual only); stretch strings visual when grip slips on wet recipes; save/share recipe codes.
- Chat may want: more glue types (metallic, clear-red), inflate/blow bubble mechanic, slice with scissors.
