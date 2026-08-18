# The Backup Rack — notes

## log
- 2026-08-18 v1.0: merged chat's two backup requests (local-first advisor + server-farm
  rack visualization) into one app. 5-question advisor (size/budget/privacy/RTO/churn,
  segmented aria-pressed buttons, answers persisted to localStorage) drives plan():
  always 3 copies — Copy 1 internal SSD; Copy 2 branches SSD (RTO=hour) / NAS
  (daily churn + budget) / HDD (default cheap); Copy 3 branches encrypted-cloud or
  rotated-drive (high privacy), cold-archive tier (>4TB on a budget, with an honest
  "your hour goal rides on the LOCAL copy" warning), sneakernet (low budget), else
  encrypted cloud autopilot. Standing orders: encrypt-offsite + test-restore always,
  churn-matched frequency, paper-key reminder for high privacy. Rack render: units with
  rail-hole pseudo-elements, calm staggered LED blinks (2.2–3.1s, reduced-motion kill),
  vent grills, ghost "expansion bay". HDD-vs-SSD placement panel. "Copy plan as text"
  strips tags → clipboard. Oxanium + IBM Plex Mono. 17/17 probe (13 engine-branch checks
  + DOM render/click/persist/LEDs) + screenshot review.

## issues
- Advice is deliberately generic rules-of-thumb (says so in the footer) — no product
  names, no external links, per security conventions.

## todos
- Possible: per-copy cost ballpark sliders; printable one-page plan view.
