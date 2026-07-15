# brass-ledger · notes

## log
- 2026-07-15 v1.0: chat ×2 ("steampunk life admin dashboard, five brass pressure gauges: bills/subscriptions/renewals/appointments/paperwork, local-first, zero network, lever generates a[…]" → retry completed: "lever generates cancellation letters"). LOCAL-FIRST: zero network APIs (asserted), localStorage brass-ledger-v1. Five SVG brass gauges (radial-gradient bezels, tick arcs, red zone 84–120°, needle spring-eased 1.1s cubic-bezier, transform-origin center): pressure = Σ urgency(daysUntil) per open item (overdue 30 / ≤1d 24 / ≤3d 16 / ≤7d 10 / ≤14d 5 / else 2), capped 100, needle −120°→+120°. Add form (chamber/matter/date), open-matters ledger sorted by due w/ hot flags + done buttons. THE LEVER: clank (square drop + highpass hiss) + 4 steam puffs, then print-trick brief — OVERDUE / This week / On the horizon with pen checkboxes — followed by a page-break CANCELLATION LETTER for every open subscription (never-share-card-number line, signature row). Ewert + IM Fell English.

## issues
- Letters generate only for the Subscriptions chamber (per spec); bills/renewals get the brief but no letters.
- Gauge pressure is per-chamber sum — 4 far-future items ≈ one 3-day item by design.

## todos
- Recurring auto-rollover (monthly bills re-arm after done) if chat asks.
