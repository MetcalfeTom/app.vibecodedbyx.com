# sub-zero · notes

## log
- 2026-07-15 v1.0: chat "paste bank statement text → parse recurring charges, list them, generate cancel-request templates to copy. Ca[…truncated — likely 'Call it X']". PRIVACY IS THE PRODUCT: 100% in-browser parser, zero fetch/XHR in the code, nothing stored, banner says so; sample statement button so nobody has to paste real data to try it. Parser: per-line amount extraction (US 1,234.56 vs EU 1.234,56 disambiguated by last separator), date sniffing (ISO/slash/dot/mon-dd), merchant normalization (strips PAYPAL*/POS/SEPA/ref numbers, 40+ known-brand table). Recurring = ≥2 same-merchant hits w/ amounts within max(1.5, 18% of median), OR ≥3 hits, OR known brand once ('likely'). Cadence from median day-gap (weekly/biweekly/monthly/yearly), monthly-cost normalization, sorted by burn. Templates per sub: merchant cancel letter + bank revoke-authorization letter, both with [BRACKET] placeholders and an explicit 'never include your full card number' line. Copy per template. Totals: monthly bleed + yearly projection.

## issues
- Multi-line statement formats (desc on one line, amount on next) won't parse — needs line-joining heuristic if chat reports it.
- Currency displayed bare (no symbol) since input currencies vary.
- Chat message truncated at "Ca" — if it was a name ("Call it …"), the app is Sub-Zero until told otherwise.

## todos
- CSV upload (still client-side).
- Line-joining for two-line statement formats.
