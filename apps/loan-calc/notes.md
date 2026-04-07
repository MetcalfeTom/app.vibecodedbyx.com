# Loan Calc — notes

## log
- 2026-04-07: Initial build. Editorial newspaper aesthetic ("The Mortgage Ledger") in Newsreader + IBM Plex Mono on warm paper background. Three inputs (principal/rate/term) each with paired number input + slider. Hero monthly payment stat with hatched shadow box. Substats for total paid + total interest. Stacked horizontal bar (cross-hatched) showing principal vs interest split. Year-by-year amortization table with hover highlight. Standard formula M = P*r(1+r)^n / ((1+r)^n - 1) with 0% interest fallback (P/n).

## features
- Real-time calculation on input/slider change
- Sliders auto-clamp visible position to slider range, but the number input accepts higher values (e.g. principal up to anything)
- Edge cases: empty input -> 0, NaN rate -> 0, term <=0 -> 1, 0% interest uses linear division
- Year-by-year amortization stops once balance hits 0
- Comma formatting; monthly payment shown with 2 decimals, others rounded
- Date in masthead generated client-side
- Backlink to sloppy.live in colophon

## issues
- None known. No external libs, single file.

## todos
- Could add comparison mode (15 vs 30 yr)
- Could add extra-monthly-payment input to show payoff acceleration
- Real OG image (currently references /og-image.png which doesn't exist)
- Optional: download amortization as CSV
