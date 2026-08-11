# plant-tycoon (Sprout & Snip)

## log
- 2026-08-11: v1 per chat ("plant tycoon with watering, cloning, pruning, selling — single HTML, pixel art, simple and fun") + mid-build riff ("zen AND carnivorous: gentle rain, plants bite back when pruned, selling reflects temperament"). Single file, Silkscreen + VT323, greenhouse-glass dark palette, procedural pixel plants (4px cells on per-pot canvases).
  - **Seven species** (base value / growth rate / thirst): Sunflower 18/fast, Fern 22, Cactus 30 (barely drinks), Orchid 50, Monstera 45, Bonsai 60/slowest, FLYTRAP 75 (feral flag, jaw sprite with teeth pixels). Per-species pixel art per stage (seed/sprout/young/mature) incl. wilt hue-shift and droop, stray-shoot sprites.
  - **Core verbs**: water (moisture decays per species; <15 pauses growth; 0 accrues wilt → death at 100 with sad slide) · prune (mature plants sprout up to 5 shoots; pruning restores tidiness, +0.08 quality/shoot cap 1.6, 55%/shoot cutting chance) · clone (cuttings pot into empty pots at sprout stage, quality 1.05) · sell (base × stage × quality × messiness × wilt × collector).
  - **Temperament** (the carnivorous half): every plant rolls temper (docile 10-60, flytrap 60-95); 😌/😯/😈 in the stage line. Pruning risks a BITE (chance temper/140 +0.2 feral): −3 coin bandage tax, card chomp-shake, chomp thunk+crunch audio, temper +5 ("tasted blood"), but ferals prune RICHER (+0.04/shoot bonus, cap 1.8). Selling: collector multiplier 1+temper/200 (up to +50%), ⚠ on feral sell buttons — 35% chance "it bit the customer", price halves with an apology.
  - **Gentle rain** (the zen half): 🌧 toggle — diagonal glass-streak overlay (CSS, 1.2s fade), brown-noise bandpass loop faded in over 1.5s, +0.55 moisture/tick to every plant (slower than a watering can but hands-free). Persisted.
  - **Economy**: start 25 coins + young fern + empty pot; seeds 10 (mystery species), pots escalate 40×1.6ⁿ cap 8. Offline: up to 10 min of ticks simulated on load.
  - **A11y**: real buttons everywhere, aria-live log mirror, moisture aria-labels, ≥2.2rem targets, reduced-motion kills pops/chomp-shake/rain-fall.
  - Verified: syntax + id cross-check; 14-check probe (temper rolls incl. feral floor, faces, bite scaling fern vs flytrap, collector premium, sale-bite roll boundaries + halving, dry-pause + wilt, rain toggle + tick watering, flytrap sprite pixel-count, forced-bite path: coin tax + temper 100 + prune still applied). 0 errors.

## issues
- Rain is strong enough to fully replace watering for slow species — intentional zen mode, but if chat calls it OP, drop to +0.35/tick.

## todos
- Greenhouse upgrades (grow lamp = +rate, mister = slower decay).
- A "bitey leaderboard": most-bitten player hands via supabase.
- Flytrap should occasionally eat a fly for a coin.
