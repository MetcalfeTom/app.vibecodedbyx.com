# Moat Grudge

findlogin's idea (Twitch, 2026-10-09 19:20): a 2D side-scrolling battle against a computer opponent. Coins drop, unit cards at the bottom (tank, archer, swordsman, mage) with different costs and spawn times, every unit fires an ultimate every few seconds, destroy the towers and castle.

## log
- v1 (2026-10-09 19:33 UTC): single-file canvas. World 2200 wide, ground at y 300; camera scrolls (drag, wheel, arrows, minimap tap) and follows the front line otherwise. Your sandstone castle + tower on the left, the CPU's grey moat castle + tower on the right. Coins: passive income (ramps 4 → 10/s), falling coins to tap (10 or 25), enemy soldiers drop a coin when they die. Cards train a unit (train time = card cooldown). Ultimates: Tank Door Slam (knockback + stun + shield), Archer Arrow Rain, Swordsman Whirlwind, Mage Meteor (aims at the biggest crowd). CPU AI counter-picks by difficulty (easy/normal/hard = income x .72/.95/1.18 + share of drops). Tower falls → +50 coins to the attacker, the loser earns +25%. Overtime at 2:30: buildings take x1.6 damage. Start screen = CPU vs CPU attract match. Best win time per difficulty in localStorage 'moat-grudge'.

- v1.1 (2026-10-09 19:34 UTC): coins now come from a rich, bored cloud in a top hat and monocle that drifts over the field and drops them (fills the empty sky on phones); the first two coins say 'tap!'.

- v1.2 (2026-10-09 19:39 UTC): Sir Drizzleworth (the voice named the cloud) likes players who grab his coins: every coin you tap fills his meter (v*.8, under the cloud); full = he zips over the CPU front line and strikes lightning (80 dmg r58, buildings x.5). Field shortened 2200 → 1900. CPU saves up for GRUDGE WAVES (normal 12%, hard 22% chance after a buy; target 170-250 coins, buys all four cards at once) and its savings show as a coin pile by its castle ('saving up… n/target'). Hard income x1.32, normal x1.0.
- Balance sims (v1.2): no coin taps = you lose (normal ~3 min, hard ~2 min); tapping half the coins = you win normal in 2.5-5 min; hard with random buys stalls, smart buys (tank+mage) win in 5-6 min. The CPU rarely touches your buildings once you tap well, so watch whether hard is hard enough for humans.

- v1.3 (2026-10-09 19:41 UTC): big events (tower fell, grudge wave, Drizzleworth strike, overtime) show as a toast under the minimap so they're seen even off-screen; phone buzz on strikes and falls (pointer:coarse only); slow motion for 1.4 s when a castle falls.

- v1.4 (2026-10-09 19:43 UTC): end screen shows your MVP unit type by damage dealt (G.dmg via G.src, set per unit action / projectile src / 'tower' / 'cloud') and how often Drizzleworth struck.

## issues
- Random-buying sim player: easy won in ~3 min, normal 4-7 min, hard often stalls past 7 min. Real players should do better; watch for stalemates.
- Emoji coins show as boxes only in headless.

## todos
- More readable units on portrait phones (lots of empty sky).
- Ask findlogin: tank ult, slam vs charge? (the voice asked)
- Upgrades (castle level, income), hero unit, more unit types, waves of weather.
- Test hook: the scratch copy replaces /*TESTHOOK*/ with window.__MG; never ship the hook.
