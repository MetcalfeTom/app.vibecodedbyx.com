# Moat Grudge

findlogin's idea (Twitch, 2026-10-09 19:20): a 2D side-scrolling battle against a computer opponent. Coins drop, unit cards at the bottom (tank, archer, swordsman, mage) with different costs and spawn times, every unit fires an ultimate every few seconds, destroy the towers and castle.

## log
- v1 (2026-10-09 19:33 UTC): single-file canvas. World 2200 wide, ground at y 300; camera scrolls (drag, wheel, arrows, minimap tap) and follows the front line otherwise. Your sandstone castle + tower on the left, the CPU's grey moat castle + tower on the right. Coins: passive income (ramps 4 → 10/s), falling coins to tap (10 or 25), enemy soldiers drop a coin when they die. Cards train a unit (train time = card cooldown). Ultimates: Tank Door Slam (knockback + stun + shield), Archer Arrow Rain, Swordsman Whirlwind, Mage Meteor (aims at the biggest crowd). CPU AI counter-picks by difficulty (easy/normal/hard = income x .72/.95/1.18 + share of drops). Tower falls → +50 coins to the attacker, the loser earns +25%. Overtime at 2:30: buildings take x1.6 damage. Start screen = CPU vs CPU attract match. Best win time per difficulty in localStorage 'moat-grudge'.

## issues
- Random-buying sim player: easy won in ~3 min, normal 4-7 min, hard often stalls past 7 min. Real players should do better; watch for stalemates.
- Emoji coins show as boxes only in headless.

## todos
- More readable units on portrait phones (lots of empty sky).
- Ask findlogin: tank ult, slam vs charge? (the voice asked)
- Upgrades (castle level, income), hero unit, more unit types, waves of weather.
- Test hook: the scratch copy replaces /*TESTHOOK*/ with window.__MG; never ship the hook.
