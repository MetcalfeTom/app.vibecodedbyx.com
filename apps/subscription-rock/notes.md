# subscription-rock · notes

## log
- 2026-07-21: v1 — chat ask "single-page marketplace, one product, a subscription rock, buy button, price tag, sold counter". SLOPPY·MART "a marketplace of one": hand-drawn SVG rock on a lit pedestal (Best Seller №1 ribbon, "in stock · always · forever"), $14/mo price tag (was $15 · save 6.7%), satirical feature list, Subscribe button, fine print ("you are subscribing to the idea of a rock"). **DB**: rock_subscriptions (qty, plan; read-all/own-writes) — every buy = one insert; global counter via select count:exact head:true (verified RLS allows global row count even though app_votes-style aggregate blocks don't apply here — probed live: count=1 after insert). Buys are unlimited per user; button flips to "Subscribed ✓ · buy it again" (sage), toast escalates ("that's N subscriptions to the same rock. bold."). **Live**: broadcast channel rock-sales-v1 'sold' → optimistic +1 tick w/ pop animation + 1.5s later authoritative recount; 25s polling safety. 🪨 confetti on purchase. Offline-graceful ("the till is offline — the rock remains"). Young Serif + Sono. WCAG basics: aria-live counter/toast, focus-visible, ≥3.4rem button, reduced-motion. TESTS: node e2e real DB (insert + global count + cleanup); stubbed live-fire (boot paint 41, buy→42+insert row+broadcast, second buy toast, remote tick→44); id cross-check; module syntax.

## issues
- Counter counts ROWS (sales), not distinct subscribers — intended: it's "rocks sold".
- No unique constraint per user — by design, you can subscribe to the same rock many times. That's the joke.

## todos
- "Manage subscription" page that is just the rock, again
- Annual plan ($168/yr · save $0)
- A single review section where every review is 5 stars and says the same thing
