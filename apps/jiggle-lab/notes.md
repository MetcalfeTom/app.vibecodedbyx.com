# Jiggle Lab — springy molecular sandbox

## log
- 2026-08-18: v1.0 per chat ("safe molecular sandbox: temperature control, springy bonds, particle motion, clear reset, educational visual feedback"). Single file, canvas 520×440, Tektur + Atkinson Hyperlegible (a11y font, deliberate) + Space Mono, navy lab w/ cyan/pink/amber atoms.
  - **Physics**: Hooke springs (per-bond k + rest), soft-disk repulsion between all pairs, 2 substeps; Berendsen-ish thermostat scales velocities toward targetKE = T²·1.9 (quadratic dial: gentle low end); deep-cold drains, zero-KE reseeds jitter. Walls reflect. Drag = critically-damped spring to pointer.
  - **Bonds snap** past 62% strain (toggleable "bonds can snap") → SNAP! canvas stamp + caption + tally. Strain colors bonds green→amber→red (teaches spring strain visually).
  - **Templates**: crystal (4×3 lattice, diagonal bracing k=70), chain (7-atom polymer), ring (hexagon), bent trio (two strong 180-k bonds + weak 45-k angle-keeper spring between the outer pair — the honest way to fake a bond angle), gas puff (no bonds, hot start). Tap = drop selected; default lab = crystal + bent + ring.
  - **Education**: live phase hint (solid/melting/gas wording keyed to T + bonded fraction, aria-live), stats row (atoms/bonds/avg jiggle/snapped), collapsible "what am I actually seeing?" with Hooke's law + an explicit *this-is-not-quantum* honesty note. Deep-freeze button.
  - Suite jl-probe 18/18: thermostat truth (dial 12→85 multiplies measured KE >4×; freeze <10), spring restoration to rest length, snap + tally + caption, unbreakable protection, hot-lab really loses bonds over 6s, wall containment, phase-text divergence, template arithmetic, pointer drag, tap-to-drop, pause, reset, honesty note, a11y+stamp.
  - Probe lesson #4 today (count from data): displacing one LATTICE atom past 62% snaps several attached bonds, not one — assert the specific bond died, not the count.

## issues
- Thermostat clamps rescale to 0.94–1.06/frame — very large sudden T jumps take ~a second to equilibrate (visually nice, numerically honest).
- Emoji tofu in headless screenshots only.

## todos
- Energy graph over time (KE/PE split — great teaching)
- Charge-flavored atoms with attraction/repulsion pairs
- Save/share little molecule builds
- 2026-08-18 (2): v1.1 — WATER PHASE TRANSITIONS + pro visuals per chat.
  - **Water demo** (🧊 button): 9 bent trios; O atoms are w-tagged. Two-tier bonding: strong intra-molecular coils (snap 62%) vs **weak inter-molecular bonds** (k=16, rest=50, snap at 50% strain, drawn dashed cyan) that FORM dynamically when cool O atoms come within 62px (≤3 per O). Plus a gentle long-range attraction (52–150px, T<45) — the van-der-Waals cartoon that makes condensation physically happen (without it, drained-cold steam froze in place scattered; the suite caught it at 3 re-formed bonds).
  - Result: real phase loops — cold knits ICE (phase line names it), warm melts weak bonds first with "that's melting, not breaking molecules" captions, hot boils to intact flying molecules, cooling condenses + refreezes. Suite measured 11 weak bonds cold → 0 hot → re-formed on cooling.
  - **Pro rendering**: offscreen bg layer (vignette + faint grid + frame), strong bonds drawn as actual coils (amplitude tightens with strain — a stretched spring LOOKS stretched), weak bonds dashed, atoms as radial-gradient shaded spheres w/ rim + speed glow.
  - Education: new info paragraph (strong-inside vs weak-between; why ice melts long before molecules break; the attraction note). Phase hints water-aware (ICE/LIQUID/STEAM).
  - Suites: water-probe 9/9, core jl-probe 18/18 regression. v1.1 stamped.
- 2026-08-18 (3): v1.2 — CO₂ + SUBLIMATION + quips + real-world lines per chat.
  - **CO₂ template** (◎ chip): O=C=O with amber carbon carrying the weak-bond site; straightness enforced by the same keeper-spring trick as the bent trio, but full-span (probe measures ≤30° off 180 after settling — the info panel contrasts "bent vs dead straight").
  - **Sublimation is engineered honestly**: WEAK gained per-substance `formT` ceilings (h2o 45, co2 14) gating BOTH bond formation and the condensation attraction. CO₂'s glue (k=6, snap 0.22) neither re-knits nor gets attractive help above T=14, so heating dry ice jumps solid→gas with no liquid band. Measured in-suite: at T=30, CO₂ weak bonds ≤2 while water holds ≥4 (its liquid stage) — the "no liquid stage" claim is a tested number, not copy.
  - **Collision quips**: 6 rotating physics one-liners (momentum, pressure, heat diffusion, sound, smell diffusion) fired by >320-speed impacts, 6s cooldown, never clobbering an active caption (probe drains the caption first — that suppression is by design).
  - **Real-world lines** (#realworld italic under the phase): freezer/-18°C, cold-glass condensation, kettle plume, stage-fog −78.5°C, freeze-drying, soda fizz, tire pressure, absolute zero. Mapped from phase text on change.
  - Dry ice demo button (9 CO₂ at T=4). Phase hints substance-aware (dominant site tag). refreshUI exposed in seam (probe needed it — rAF hadn't ticked between sim and assert).
  - Suites: co2-probe 10/10, water 9/9, core 18/18. Probe fixes this round: inverted angle assert (164° IS straight), missing UI refresh, caption drain before quip test.
