# VaultGrid — notes

## log
- 2026-08-18 v1.0 (shipped as one pass, chat steered live across 10 messages):
  backup inventory & disaster terminal, simulator sibling of backup-rack. NOTE: chat
  referenced "the established plan" — no prior VaultGrid plan existed; built from the
  live directives + backup-rack lineage, said so honestly.
  **Inventory core** (prioritized per chat): dropdown-driven add-unit form — kind
  SSD/HDD/cloud; capacity TB (validated 0.05–1000); interface NVMe/SATA/USB3/TB (disk)
  or provider/latency-tier/redundancy (cloud); health healthy/aging/failing; location
  desk/shelf/office/relative. Editable (edit loads form, save re-mounts, shrink blocked
  below used capacity), removable, persisted (localStorage vaultgrid-v2). Label field
  clears after mount (screenshot-found papercut).
  **Derived facts**: speedOf by kind+iface/latency; isOffsite (office/relative/cloud);
  isConnected (desk, or cloud low-latency sync — ransomware surface); resilientTB
  (failing ×0, aging ×0.5); per-unit simulated temps (base by kind/loc + load + sine).
  **LED rack nav**: green/amber/red = health, blue = cloud, blink rates by severity,
  click scrolls+flashes the unit panel; .fx fast-blink feedback from terminal commands.
  **Summary**: raw vs usable-resilient TB (formula shown), on-site/offsite split,
  3-2-1 per data type, untested count, plain-language verdict (good/mid/bad border)
  built from sentence parts.
  **Drills** (deceptive, health-aware): drivefail kills failing>aging>busiest;
  fire = primary+on-site; ransomware = primary+connected; cloudgone. Untested copies
  carry hidden corruption rolled at assignment by health (25/40/60%) — revealed only
  in drills ("DECEPTION") or by test-restore (finds+re-copies).
  **Terminal**: help/status/clear/drill <sc>/test-failover (per-type takeover paths +
  longest path, coin-flip warnings on untested)/audit-backups (read-only findings sweep
  + LED shaming). All commands stated as simulations.
  Michroma + Martian Mono, phosphor-terminal scanlines. 32/32 end-to-end probe
  (engine math, validation, edit, capacity refusal, 3-2-1, summary numbers hand-computed
  19/11/5+6 TB, unlucky ordering, rigged fire+ransom drills incl. deception, terminal
  commands, LED classes g,a,b,r, persistence) + boot probe post-deploy + screenshot.

- 2026-08-18 v1.1: **3-2-1 placement advisor** (advise --placement card), per two chat
  requests. Per active data type, three "seats": LOCAL (fast restore, second media),
  OFFSITE (survives the building), OFFLINE (!isConnected — no cable for ransomware).
  Each seat: ✓ covered-by (with never-test-restored flag) / → recommendation from REAL
  mounted units with free capacity (candidateFor ranks healthy>aging, speed for local,
  free space; failing NEVER recommended) with one-click assign / ✗ gap with concrete
  mount advice. Unit warnings: aging, single-region cloud, cold latency, desk-connected.
  **Independence warnings** (⛓ red rows): all-copies-same-roof, all-copies-connected
  (ransomware sweeps the set), same-provider clouds. 16/16 advisor probe + 32/32
  regression + screenshot; label-clear papercut from v1.0 screenshot also fixed.

- 2026-08-18 v1.2: **top-of-app 3-2-1 explainer** (#explainer aside between masthead and
  .cols): three numeral blocks — 3 three copies (original + two INDEPENDENT copies, no
  shared disk/roof/cable fate), 2 two media kinds, 1 one offsite & offline. Teal/amber/
  blue numerals w/ glow, single-column ≤720px. Layout probe 8/8 at 1280 AND 390px
  (exists, 3 blocks, DOM-and-visually above .cols, full width, content phrases, grid
  columns, seam intact) + screenshot + boot probe after atomic deploy.

- 2026-08-18 v1.3: **hardware-differences warning block** (#hwwarn, amber-bordered card
  directly under add-unit where the dropdowns invite the mistakes): 5 topics —
  interfaces (slowest link sets tempo, check the actual port), capacities (marketed vs
  ~90% formatted, buy 2× today's data), reliability (SSD sudden-silent / HDD noisy but
  drop-shy / cloud is a contract; nothing replaces test restores), encryption (software
  over mystery firmware; lost key = very secure brick, key on paper twice),
  compatibility (filesystems/enclosures/ports; verify mounts on the RESTORE machine).
  7/7 layout probe (presence, 5 topics, keyword coverage, amber border, position between
  form and rack nav, visible height, seam+explainer intact) + 32/32 regression +
  screenshot + boot probe after atomic deploy.

- 2026-08-18 v1.4: **recurring checkup alerts** (checkup --alerts card + red count badge):
  four clocks — restore tests 180d per copy (never-tested = instant NEVER DONE, over=9999),
  drive health review 90d per non-cloud disk, sync review 30d app-wide, offsite
  verification 120d per offsite unit. Timestamps: migrate() stamps missing fields on
  load AND on seam fresh() (probe caught NaN clocks when seam reset skipped migration —
  fixed in app); mount stamps healthCheckedAt/offsiteCheckedAt; testRestore stamps
  testedAt. Due list sorted worst-first, overdue red / due-within-14d amber, per-kind
  action buttons (test restore routes to the real testRestore; others reset their clock).
  16/16 probe (rigged clocks, sort order, badge counts, marks reset, persistence) +
  32/32 regression + full-page screenshot + boot probe after atomic deploy.
  Screenshot lesson: scrollIntoView before --screenshot captures past the page → blank
  frame; use a tall viewport instead.

- 2026-08-18 v1.5: **setup-usability pass** (chat asked for an end-to-end review + the
  highest-impact fixes). Findings→fixes: (1) blank-page problem — new ✨ demo-grid button
  (3 units, 5 assignments, 2 tested / 3 deliberately untested so drills+advisor+checkups
  all demo instantly; two-click confirm when a grid already exists, self-disarms in 4s);
  (2) no post-mount guidance — mounting now flashes the new unit panel + teal "next:
  tick which data it should hold" hint; (3) hardware warnings pushed mobile setup far
  down — #hwwarn is now a <details> (open on ≥980px, folded on phones, summary keeps
  the amber h2 + hint); (4) duplicate auto-labels made rack-nav rows ambiguous — mount()
  suffixes ' #2' etc. 12/12 usability probe + 2/2 mobile fold probe + 32/32 and 16/16
  regressions + demo-state screenshot + boot probe after atomic deploy.

## issues
- Corruption odds re-roll if you unassign+reassign a type — acceptable (it's a new copy).
- Terminal output uses innerHTML with fixed strings; user input echoed via runCmd is
  angle-bracket-escaped in the unknown-command line — keep that if editing.

## todos
- `drill all` chained scenario report; export grid as JSON like tnr-lab's evidence chain.
