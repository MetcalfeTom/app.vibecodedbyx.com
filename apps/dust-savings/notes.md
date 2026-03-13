# Dust Savings

Satirical savings game where your coins constantly betray you by turning to dust or exploding.

## log
- 2026-03-13: Initial build. 5 actions: Earn (8% chance of instant dust), Save (15% dust, 10% explode on deposit), Buy Insurance (30% policy is blank), Upgrade Vault (does almost nothing), Pray to RNG Gods (10% blessing, 20% backfire). 13 disaster types on 4-12s timer (dust conversion, explosions, moth infestation, existential crisis, tax season, etc). Prayer buff reduces damage, insurance 30% chance to halve one loss. Vault upgrades reduce loss by 2% per level. 20 satirical ticker messages. Particle effects (gold/dust/explode). Bitter + Fira Code typography, aged gold/brown palette.

## issues
- None yet

## todos
- Leaderboard for highest savings achieved before total loss
- Achievement system ("Lost 1000 coins", "Survived 10 disasters")
- More disaster types

## notes
- No database — pure frontend satire
- Disasters auto-fire every 4-12s when player has coins
- Insurance: costs 20, 30% chance policy was fake, if real only 30% chance to trigger, expires after one use
- Vault upgrades: 2% loss reduction per level (effectively meaningless)
- Prayer: 10% blessing (coins + 3 buffs), 20% backfire (lose coins), rest is flavor text
- Earning has 8% chance of immediate partial dust conversion
- Saving has 25% chance of losing coins on deposit
