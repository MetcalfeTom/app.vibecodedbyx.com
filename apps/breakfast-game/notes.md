# Breakfast Chef

## log
- 2026-09-26: first-visit how-to card (bottom-centre, Baloo 2, pointer-events:none, role=note): tap an ingredient then its burner to cook → tap the food when the timer ends to plate it → serve when the plate matches an order. Fades 3 s after the first kitchen tap or after 12 s; shown once (`breakfast-game_howto_seen`).
- (pre-2026-09) cooking game: 6 ingredients, 2 burners with cook timers, plate, timed customer orders, score/level.
- 2026-09-26: food on a burner sat on the rim (cooking-item top:-20px) — now centred in the pan (translate -50%,-50%, hover keeps it); "Completed Plate" label wrapped onto the plate — nowrap + more top margin; Comic Sans → Baloo 2 (fallback kept); old "Built live at | View All Apps" footer removed; real og.png (both burners lit, egg + bacon) — og:image pointed at a missing breakfast-preview.png; emoji dropped from <title>.
- 2026-09-26: SEO — descriptive title/meta description, schema.org JSON-LD.
- 2026-09-27: cooked food keeps cooking — it smokes (💨) 4 s after it's done and burns 3 s later (BURN_SECS 7); burnt food is binned, not plated (tap the food or the pan). Three walked-out customers close the kitchen: hearts stat, "Kitchen closed!" card with score + best (`breakfast_best`), New shift button resets everything. Fixes: served orders kept counting down and later fired a false "Order failed" (order.timer now cleared); stopping a burner left a stale timer label that doubled on restart; done food could be "restarted" with 0 s. Phone: stats wrap, ingredients as a 3x2 tray, burners side by side, smaller plate.

## issues
- order timer badge uses ⏰ which some fonts lack.

## todos
- sound (sizzle).
- orders sit below the plate on phones; a compact orders strip near the stove would save scrolling.
