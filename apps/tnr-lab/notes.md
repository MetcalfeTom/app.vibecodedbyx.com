# TNR Lab — notes

## log
- 2026-08-18 v1.0: researcher bench for token-numeric representation mechanics, in the
  sure-ish clinical instrument family. Transparent toy tokenizer (toy-v1, rules printed
  in-app AND in the export): words ≤8 chars whole, longer split into ≤4-char dashed
  subwords, digit runs numeric, each punct its own token, ids first-seen per session.
  Pipeline: tokenize → chips with ids (numeric purple, punct grey, over-budget outlined
  red past the ceiling) → 5 transformations (lowercase / strip-punct / mask-numbers →
  ⟨NUM⟩ / dedupe-adjacent / truncate-to-budget) + snapshot-based undo. Every step lands
  in the ledger: op, before→after, Δ colored, budget_used/budget with OVER flag;
  budget-change itself is a traced step. Export = full evidence chain JSON (instrument,
  rules, disclaimer, input, budget, trace[], final_tokens[], vocab size) with pretty-print
  pane, download blob, clipboard copy. Honest banner: NOT any production model's
  tokenizer, counts unfit for real cost estimates. IBM Plex Sans/Mono, paper-white lab.
  16/16 probe + screenshot.

## issues
- Probe-arithmetic lesson AGAIN (2× today, see crate-logic): 'extraordinary' = 4 subwords
  → 9 tokens, not 8. Compute expected fixtures by hand from the rules before asserting.

## todos
- Possible: side-by-side trace diff of two inputs; per-op token-level diff highlighting.
