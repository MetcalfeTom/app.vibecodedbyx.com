# KlearSplit

## log
- 2026-07-31 v1: chat asked (twice) for "KlearSplit — clean expense tracker with groups, multi-currency, equal or custom splits, contacts, simplify-debts algorithm". Local-first design (no login friction; you keep the ledger for your group like real-world Splitwise usage): **contacts** roster shared across **groups**, each group has a base currency + member chips (add from contacts; removal blocked while on the ledger). **Money is integer cents end-to-end.** Multi-currency: 12 currencies with editable USD-pegged rates (details panel, honest "ballpark, not bank truth" note — no external FX API per security policy); per-expense currency with ≈conversion shown on the ledger. **Zero-sum guarantee**: the payer is credited with the sum of the *converted shares* (not the converted total), so rounding can never unbalance the ledger — displayed as "ledger sums to 0.00 — balanced ✓". Equal splits distribute remainder cents deterministically (first members get the extra cent); custom splits must sum exactly to the amount (live sum meter goes red otherwise). **Simplify debts**: greedy largest-debtor↔largest-creditor matching → exact settlement in ≤ members−1 transfers, rendered as "Ana pays → Ben 23.40 EUR" cards. Seed demo group (Trip to Lisbon, 3 members, mixed EUR/USD expenses incl. a custom split) so it demos instantly. Familjen Grotesk + Spline Sans Mono, warm paper/emerald/coral fintech look. WCAG basics throughout. 14/14 checks green: zero-sum under mixed currencies + odd cents, 34/33/33 remainder, conversion math, settle-plan exactness (applying transfers zeroes everyone, ≤n−1), custom-split rejection/acceptance, persistence, group/contact flows, rate edits.

## issues
- Rates are manual by design (no external API calls allowed) — if chat asks for "live rates", explain the sandbox policy and point at the editable rates panel.
- `tab-splitter` app exists but is a single-bill tool; KlearSplit is the persistent multi-group ledger. Don't merge them.
- Changing a group's base currency re-derives balances from stored per-expense currencies (nothing is baked), so it's always safe.

## todos
- Settle-up "mark as paid" button that records a settlement expense.
- Per-member spending stats / monthly totals.
- Export ledger as CSV/markdown.
- If chat wants true shared groups: Supabase table with RLS caveats (own-rows-only writes), needs a design pass first.
