# Quantum Notes — serious QC explainer + 2-qubit simulator

## log
- 2026-08-19: v1.0 — built per chat, then restructured mid-build to marcipopsis's exact outline: opening TL;DR (5 bullets), bold headings Core premise / Initialization / Manipulation / Measurement / Bottlenecks-with-caveats, concise bullets, short paragraphs. Structure is PROBED (h2 order, TLDR first, ≥18 bullets, ≥3 caveat boxes).
- ENGINE (the part that must never be wrong): 2-qubit statevector, complex [re,im] pairs, H/X/Z as 2×2 matrices applied via bit-pair indexing (A=high bit), CNOT as |10⟩↔|11⟩ swap, Born sampling. PHYSICS PROBED: H|0⟩=(1/√2)(|0⟩+|1⟩); H·H=I; X flips; **H·Z·H|0⟩=|1⟩** (the honest interference demo, stated in the prose and proven in the suite); Z inert on |0⟩; Bell amplitudes exactly (R2,0,0,R2); norm preserved through a 10-gate arbitrary circuit; 800-shot Bell stats: zero 01/10, ~half/half.
- UI: θ-slider state prep (real-meridian caveat stated), single-qubit tally histogram vs Born-rule ticks, circuit builder (chips on wires, Bell preset, undo/clear), amplitude bars WITH PHASE NEEDLES, 500-shot histogram. Honesty throughout: superposition ≠ "both at once", no-speedup-from-superposition-alone, pseudo-randomness disclosed, 2^n scaling explains why 2 qubits, "not faster general-purpose computers".
- Zero external assets (grep-probed, data-URI favicon, Georgia+system-mono). Probe 16/16.
- CORRUPTION LOG: mid-write CJK stray AGAIN — 'function近(a,b)' materialized in the probe (4th incident: �putation/astonishment/ココ/近). The CJK-block sweep assert (r'[一-鿿]') is now standard for probe files too.

## issues
- none yet. If extending: any new gate MUST come with a matrix-level probe truth (e.g. S·S=Z) before it ships.

## todos
- S/T phase gates + a phase-kickback demo; 3rd qubit + GHZ, if chat wants depth.
- 2026-08-19 (2): typography per chat — Georgia serif → clean system sans (-apple-system/'Segoe UI'/'Helvetica Neue'/Arial) EVERYWHERE including all 7 canvas ctx.font sites (dial, both histograms, amplitude labels). Layout untouched, no-external-assets holds (system stack, no font CDN). Full 16/16 re-run.
- 2026-08-19 (3): BEGINNER PASS per chat — kept marcipopsis skeleton + all physics, added: numbered STEP 1–5 chips on section headings (TL;DR stays chipless — probe asserts exact heading text), italic "in plain words:" opener per section, simpler Core-premise bullets (bit=switch, qubit=dial), and FOUR ORIGINAL INLINE SVG DIAGRAMS (no external assets): bit-switch vs qubit-dial; X/H/Z before→after dials (Z shows the hidden sign as a dashed mirror needle); measurement funnel (two bars → meter → one bar + dice); bottleneck cluster (noise squiggles → many physical qubits → brace → one dependable qubit). Each diagram role=img with a real descriptive aria-label (probe requires >40 chars). Suite grew to 21 checks: 4-diagrams, 5-step-chips, 5-plain-lines, longest-paragraph<340 chars, diagrams-have-alt + full physics regression. 21/21. Screenshot reviewed; |0⟩ pole label nudged off the diagram caption.
