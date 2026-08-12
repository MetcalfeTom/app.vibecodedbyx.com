# Project brief — the sure-ish family
*(document only — GGUF sensing remains scoped, not implemented; see /gguf-sensor-scope.md)*

Three artifacts share one worldview: **model-observatory** (frozen scratch demo), **sure-ish** (the
uncertainty-aware GUI project, live), and **gguf-sensor** (scope on paper only). This brief captures the
conjectures they are built to test. They are conjectures, not conclusions — each lists what would count
against it.

## 1 · Uncertainty conjectures
- **C1. A bare number is a small lie.** Every reading should carry its doubt: interval, sample count,
  spread. Implemented as: 95% CIs everywhere, `n` always visible, sd printed, median±MAD where tails are ugly.
- **C2. Sharpness must be earned.** Visual precision should track statistical precision — hence the blur
  that resolves as CI tightens. A crisp rendering of a noisy estimate is typography impersonating evidence.
- **C3. No data ≠ zero.** Empty states must say "unmeasured", never render 0, and never style absence like
  a small value. ("your steadiness is unknown, not perfect.")
- **Falsified if:** users consistently read the blur as a bug rather than a statement (chat feedback will tell),
  or if CI-labeled values get quoted without the interval anyway.

## 2 · Consent conjectures
- **C4. Consequence scales with ceremony.** Reversible acts are one click; irreversible acts require typed
  confirmation (the monitor's `TERMINATE` gate). The refusal path is a first-class outcome and is logged.
- **C5. Senses are opt-in.** Nothing listens, speaks, or sounds without a fresh explicit gesture: voice off by
  default, mic hidden unless supported and clicked, the noise channel silent until "listen (2s)".
- **C6. Confidence gates action.** The certify button unlocks on evidence (3 of 4 instruments confident), not
  on user insistence. The gate explains itself while closed.
- **Falsified if:** the ceremony gets rubber-stamped (people type TERMINATE reflexively — watch for complaints
  that the gate is "annoying" vs evidence it caused a real pause), or opt-in senses go unused because they're undiscoverable.

## 3 · Provenance conjectures
- **C7. A measurement without provenance is a claim.** Every panel names its source: the equation
  (v ← v + 𝒩(0,σ²)·dt), the seed, the asked-vs-delivered timer, the byte range (future gguf-sensor).
- **C8. Injectors and detectors must be strangers.** The sim injects ground-truth kicks and logs them; the
  monitor detects aberrations by z-score against its own history, independently. Agreement between the two
  logs is the health check — a detector that reads the injector's diary is a tautology.
- **C9. History is append-only.** The audit trail never edits or deletes; cancellations, refusals, and false
  starts are entries, not embarrassments.
- **Falsified if:** provenance lines rot (say the code changes and the printed equation no longer matches —
  probes should diff them), or if nobody ever scrolls the audit log (then it must earn its space differently).

## 4 · Simulation-health conjectures
- **C10. Bring-up is staged and announced.** Channels come online in declared order (motion → timing →
  audio noise), each arrival logged. A monitor that boots "all green" hides its own warm-up.
- **C11. Health is a distribution, not a light.** Green/red status lamps compress away the interesting part;
  the channel cards keep mean, CI, and n in view even when "online".
- **C12. Termination must be honest and final.** After the typed gate: loops actually cleared, channels
  stamped terminated + final, canvas visibly dead, last audit entry says who and how. No zombie intervals.
- **C13. Read-only is a feature.** The monitor can watch everything and change nothing (except C12). The
  temptation to add "just one tuning slider" is how monitors become control panels; resist it here, build a
  separate cockpit app if chat ever wants one.
- **Falsified if:** a probe ever finds a live interval after termination, or channels online without their
  audit entries, or the aberration detector firing on the warm-up transient (that would demand a masked-warm-up fix).

## Boundary note (repeated on purpose)
GGUF sensing is **documented, not implemented** — scope frozen in `/gguf-sensor-scope.md`. When built it
inherits C1–C9 wholesale: header facts with byte-range provenance, size-audit as the uncertainty instrument,
aberrations logged not fixed, zero execution, zero network.
