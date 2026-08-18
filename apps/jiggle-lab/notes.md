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
