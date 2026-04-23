# Critter Crunch

## log
- 2026-04-23: Created. Luck Be A Landlord-style slot-machine roguelike on a **5×4 grid** (20 cells). Food-chain theme. **Starting bag** (15 symbols): 4 🌱 Seed, 3 🐛 Worm, 2 🐦 Bird, 2 ☀️ Sun, 4 🪨 Rock. Every **3 spins** rent is due; **10-rent** schedule `[25, 50, 100, 175, 275, 425, 625, 900, 1300, 1900]`. Miss rent → EVICTED. Survive all 10 → THE CHAIN HOLDS. **Core loop**: click SPIN → grid fills from shuffled bag (without replacement, padded with empties if bag<20) → resolve adjacency (all 8 directions) → stagger-pulse each cell with floating `+N` coin → eaten symbols animate out → removed from bag AND grid → check rent → shop overlay. **Symbol effects** (implemented in one-pass `resolveGrid()`):
  - **Seed**: base 1, +2/adj Sun
  - **Worm**: base 2, +5/adj Seed (Seed destroyed, still pays this spin)
  - **Bird**: base 3, +8/adj Worm (Worm destroyed)
  - **Sun**: base 3, silenced by adj Moon, feeds adj Seeds
  - **Rock**: flat 1
  - **Tree** (uncommon): base 4, +3/Sun, +2/Bird
  - **Flower** (common): base 2, +2/Sun, +3/Bee
  - **Bee** (uncommon): base 3, +4/Flower
  - **Mushroom** (common): base 2, +3/Tree, +1/Worm
  - **Rain** (uncommon): base 2, +2/Seed+Flower+Tree
  - **Snake** (rare): base 4, +15/Bird (destroys)
  - **Fox** (rare): base 5, +18/Bird (destroys)
  - **Beetle** (common): base 2, +2/Rock, +1/Mushroom
  - **Cherry** (uncommon): base 3, +4/Tree, +2 bonus to adj Birds
  - **Moon** (rare): base 4, +5/Moon, silences Suns
  - **Worm King** (rare): base 3, +10/Seed (destroys), +4/Worm
  **Shop**: appears after each spin unless rent-due triggers; 3 choices drawn with rarity weights (common 60% / uncommon 32% / rare 8% + 2%/rent-stage), SKIP button grants +10 coins consolation. **Connectors**: on spin resolve, draws short gradient rectangles (red "eat", amber "feed") between interacting cells for 0.65s via `drawConnectors()`. **Visuals**: parchment wooden frame with amber CRT-style `Bungee Shade` title ("Critter" amber / "Crunch" worm-pink), 3-stat HUD (coins/rent/spin) with `VT323` digits on `Silkscreen` labels. Eaten animation: scale 1→1.3→0.2 + hue-rotate + blur. Pulse: scale 1.22 with amber drop-shadow. Float-coin: `+N` rises from each cell in VT323 amber. Rent-due pre-alert slides a red `◆ RENT DUE NEXT SPIN ◆` bar from the top when 1 spin remains. **Audio**: Web Audio synth — spin (5 ascending squares), coin (720+1080 tri), eat (saw 140→60 + bandpass noise), grow (tri 420+620), rent (saw thump), pay (523-659-784-1047 arp), buy (3-note triangle), lose (saw sweep + noise), win (5-note pentatonic up). Mute ♪ toggle top-right. **Overlays**: SHOP (3-card grid w/ emoji + rarity badge + desc), RENT (landlord knocks, pay button or evicted), END (win/lose w/ spins/coins/bag stats), HELP (symbol reference). **Keyboard**: Space/Enter = spin (or primary action on current overlay), M = mute. Mobile: responsive grid scale, 3-col stats collapse, big touch-friendly spin button. Fonts: Bungee Shade + VT323 + Fraunces (italic) + Silkscreen. Palette: deep wood `#120f08` / paper `#efe0b8` / amber `#e5b84b` / worm pink `#c67a8f` / rent red `#b83d2b` / leaf green `#4e8036`. Pollinations OG (no referrer).

## features
- 16-symbol food chain: seeds feed worms feed birds, snakes/foxes eat birds, mushrooms grow on trees, bees pollinate flowers
- 5×4 slot grid with all-8-direction adjacency
- 10-rent roguelike progression (25 → 1900)
- Post-spin shop with rarity-weighted draws + skip-for-coins
- Eat-connector animations (red line) and feed-connectors (amber line)
- Eaten symbols removed from bag permanently (LBAL-style bag curation)
- Per-cell floating coin values with stagger animation
- Rent pre-alert banner 1 spin before due
- Full Web Audio synth SFX (no external assets)
- Keyboard (Space to spin, M mute) + mobile-friendly layout
- Help overlay with full symbol reference

## issues
- Emoji rendering is platform-dependent — `🌧️`, `☀️` use variation selectors and may render differently on iOS vs Windows vs older Android.
- Worm King and Moon are both rare and interact with commons (seed/worm and sun/moon) — on an unlucky early draw they can feel niche until you have enough commons.
- Bag can briefly dip under 20 mid-game as destruction outpaces shop picks — this is intentional (LBAL tension) but new players may not realize eaten = permanently gone.
- SKIP gives +10 coins which trivially covers rent 1 — might nerf to +5 or make it "destroy 1 symbol" later.
- Resolve is a single pass, so chain reactions beyond 1-step don't cascade (e.g., Worm King eaten by Bird still counts its seed kills, but nothing eats the Bird further in the same spin unless Snake/Fox is adjacent).

## todos
- Symbol rerolls in shop (cost coins to reroll the 3 offerings)
- Remove-a-symbol shop option between rents (pay coins to evict a rock)
- More symbols: 🦋 Butterfly (moves each spin), 🍎 Apple (grown by Tree, destroys self for big coins), 🦊 Fox → Wolf chain
- Boss "landlord" events every 3rd rent with unique demand (e.g., "must have 1 coin exactly")
- Supabase leaderboard (lowest spins to beat all 10 rents)
- Persistent best run in localStorage
- Cascade resolution so a Bird eating a Worm can then be eaten by an adjacent Snake in the same spin
- Daily seed / shared-grid mode
