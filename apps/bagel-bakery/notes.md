# Bagel Bakery — a small idle bakery

## log
- 2026-08-28: v1.0 — the queued idle prototype, per chat: automatic progress + upgrades, small and polished, offline-friendly. HONEST IDLE MATH, all pure + probed: cost(id,owned)=ceil(base·growth^owned) (pin 1.35, rest 1.18 — hand-checked at owned 0/1/10), perSec = Σ auto power·owned, perClick = 1 + pins. SIX UPGRADES: rolling pin (click +1), brick oven (+0.5/s), dough mixer (+3/s), boiling line (+12/s), delivery bikes (+55/s), midnight wagon (+240/s); broke purchases declined kindly ("the ovens believe in you"), buys narrated ("№3 joins the bakery. the hum grows warmer"). AUTOMATIC PROGRESS: 250ms tick (dt-clamped), autosave every 5s; OFFLINE CATCH-UP on load via savedAt (injectable TM.now — clock pinned first): "you were away 2h 0m. the ovens kept going — 7,200 bagels await your approval", capped kindly at 8 hours ("capped at 8 hours of diligence", stated in the footer and probe-enforced at the cap). Number formatting (k/m/b), lifetime counter, space/enter bakes when body-focused, fresh start kind ("the bagels were enjoyed by everyone — that part already happened and keeps"). Freeze seam + geometry check from day one (both banked lessons applied). Probe 13/13 first run.

## issues
- none.

## todos
- golden bagel random events, sesame prestige layer, a tiny window scene that fills with regulars, if chat asks.
