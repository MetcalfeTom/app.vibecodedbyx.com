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
- 2026-08-18 (4): v1.3 — QUANTUM CORNER + BEGINNER MODE (three stacked chat requests verified together).
  - **Quantum corner** (new tab): real 1-D time-dependent Schrödinger via the Visscher scheme (ψ split into R/I Float64Arrays, N=240, dt=0.05, hard-wall box, ħ=m=1). Gaussian packet w/ sliders for Δx₀ (4–20), k₀ (0.2–1.2), barrier height (0–1.1). Renders |ψ|² as the filled cyan wave + faint pink Re(ψ) + amber barrier. Live readouts: left/right probability, Δx now, Δx₀·Δp₀ (Gaussian saturates ħ/2 exactly — displayed). 📏 measure! samples x from |ψ|² and collapses to a narrow packet (labeled as the classroom cartoon; info notes measurement is "philosophically deeper than any button").
  - **Physics lessons learned in test**: (1) barrier was 10 cells wide → T≈e⁻¹⁶≈0; thin 4-cell barrier + E=0.36 vs V=0.45 gives honest few-% tunneling, with the caption announcing the odds; (2) probe impatience — group velocity ħk/m means t=20 to travel 14 cells, wait for it. (3) **BOOT-ORDER BUG caught before deploy**: setMode ran before `var Q={}` assignment executed (hoisted declaration, unassigned) → IIFE died on load; all five suites silent. Boot mode-init moved after the quantum engine. Lesson: function declarations hoist, var ASSIGNMENTS don't — boot calls go last.
  - **Beginner mode**: default for newcomers (persisted 'jiggle-lab-mode'), green "🌱 beginner — just one dial" vs purple "🔬 advanced — the whole lab". body.beginner CSS hides labtabs/molecules/stats/hint/all buttons except reset (computed-visibility probed); tag + info gain the one-sentence version ("that one sentence is most of thermodynamics"); quips still fire; toggling to beginner forces the springs room.
  - Suites: quantum 11/11, beginner 9/9, co2 10/10, water 9/9, core 18/18 (57 checks).
