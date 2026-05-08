# lean-sim

## log
- 2026-05-08: shipped — Lean-flavored theorem-proving puzzle game (chat asks bundled: "can we create a simulated Lean prover game" + "create a standalone math proof app called lean-sim where users must verify logic equations"). Hand-built engine: each puzzle is a sequence of `(tactic → next goal)` steps; click the right tactic in the right order and the proof state advances toward `no goals`. No real Lean kernel — just enough flavour to teach the rhythm of tactic-style proofs.
  - **7 hand-authored lemmas** escalating in difficulty: `add_zero` (rfl), `zero_add` (simp; not definitional in Lean's Nat), `add_comm` (omega — Lean's linear-arithmetic decider), `and_comm` (intro h, exact ⟨h.2, h.1⟩), `modus_ponens` (intros hp hpq, exact hpq hp), `double_neg_intro` (3-step proof through ¬¬p), `imp_self` (intro hp, exact hp).
  - **Tactic palette per puzzle**: each puzzle declares its own button list mixing the actual answer tactics with red-herring distractors (`rfl`, `simp`, `omega`, `ring`, `induction n`, `apply hpq`, `sorry`, etc.). Wrong picks fire puzzle-specific responses authored to teach why that tactic doesn't fit (e.g. for `zero_add`, picking `rfl` fires "0 + n = n is NOT definitionally true (recursion on the right argument)").
  - **InfoView panel** mimics Lean's interactive proof state — the goal renders in Fira Code with the `⊢` turnstile in burgundy, hypothesis names highlighted, and on QED swaps to a `★ no goals · QED ★` banner. The proof history below tracks every accepted tactic prefixed with two-space indent (Lean style). The statement banner formats keywords (`theorem`, `def`, `by`) and the lemma name in different colours.
  - **Aesthetic**: paper-white background card with Fraunces italic Lemma I-VII headers, EB Garamond body (academic feel), Fira Code for all Lean syntax. Page sits on a deep indigo+gold-glow CRT-paper backdrop with subtle grain overlay (multiply-blend repeating-linear noise). Score pill in gold, solved counter in green, mistakes counter in light rose.
  - **Score model**: +300 per puzzle solved, +100 perfect-puzzle bonus (no mistakes on that puzzle), -25 per wrong tactic, -50 per hint. End-of-match titles vary: `★ Q.E.D. perfecta ★` (all 7 with no mistakes), `★ Q.E.D. ★` (all 7 with mistakes), `session complete` (incomplete).
  - **Keyboard**: digits `1-9` apply tactic by palette index, `?` requests a hint. Suppressed when typing into form fields (none in this app, but defensive).
  - **3 Web Audio synths**: correct (660Hz triangle blip), wrong (180Hz sawtooth), QED (4-note triangle arpeggio C5-E5-G5-C6). Lazy-init.
  - **Accessibility**: rem units, `<header role=banner>`, `<section>` per panel, `aria-live="polite"` on stat pills, `aria-label` on every tactic button, focus-visible gold outlines, ≥2.6rem touch targets, skip link.

## issues
- Not a real Lean kernel — the tactic responses are hardcoded per puzzle. A genuinely correct alternate proof using a different tactic order will be flagged as wrong if it doesn't match the baked-in solution path. V1 trade-off; teaches the rhythm without needing the actual prover.
- 7 puzzles is small — enough for a tutorial, not a full Mathlib.
- `zero_add` accepting `simp` directly is a simplification; in real Lean you'd need `induction n; rfl; simp`. Could add a "purist" mode that requires the longer proof.
- No proof-term visualisation — only the tactic history. Real Lean can show the elaborated `⟨h.2, h.1⟩` term.

## todos
- More puzzles: associativity, distributivity, demorgan, negation laws.
- Branch puzzle (multiple correct paths), with the engine accepting any tactic that closes the current goal.
- Mathlib4-style auto-completion in the palette.
- Daily challenge: fixed seed → same 5 puzzles per day.
- Online leaderboard via Supabase.
- "Free tactic input" mode where the user types tactics instead of clicking palette buttons.
