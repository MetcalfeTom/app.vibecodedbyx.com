# Aditya's Gold Mine

Click to mine deeper and unearth rare gems in a 3D gold mine.

## log
- 2026-03-14: Initial build. Idle/clicker mine game dedicated to Aditya. Canvas 3D tunnel effect with converging lines, depth rings, radial lighting. Click anywhere to mine — spawns rock debris + gold sparkle particles. 6 resource types: gold (always), ruby (50m+), emerald (150m+), sapphire (300m+), amethyst (500m+), diamond (750m+). Gem probability rolls on every click with luck multiplier. 6 upgrades: Better Pick (+1 gold), Power Strike (+1 power), Auto Miner, Gem Luck (x1.5), Deeper Shaft (+200m), Magma Drill (x2 gold). Exponential cost scaling. Earth layer colors change with depth (soil → clay → sandstone → granite → deep rock → magma zone). Magma glow + ember particles at 70%+ depth. Wall-embedded gem crystals with sparkle animation. Depth progress bar. Auto-save to localStorage every 5s. Pickaxe cursor. Bungee Shade + Chakra Petch + JetBrains Mono typography, gold/amber/brown palette.

- 2026-03-14: Added fossil collection system. 12 unique fossils unlocked by depth: Trilobite (20m), Ammonite (60m), Fossil Fern (100m), Shark Tooth (150m), Dino Bone (200m), Raptor Skull (300m), T-Rex Claw (400m), Dino Egg (500m), Amber Insect (600m), Giant Footprint (700m), T-Rex Skull (850m), Preserved DNA (950m). Each is a one-time discovery with decreasing drop chance (1.2% down to 0.05%). Toggle panel shows collection grid with found/undiscovered states. Gold bonus on discovery (50 + depth*0.5). Bone-colored particle burst + 3-tone chime on find. Saved to localStorage.

## issues
- None yet

## todos
- Prestige system (reset for permanent multipliers)
- Achievement badges
- Underground creatures/encounters
- Leaderboard via Supabase

## notes
- No database — localStorage save/load
- Gem chances: ruby 8%, emerald 6%, sapphire 4%, amethyst 2.5%, diamond 1% (before luck multiplier)
- Auto miners: 1 gold*goldPerClick per second per miner, 30% gem chance vs manual
- Upgrade scaling: baseCost * scaling^level
- Max depth starts at 1000m, +200m per Deeper Shaft upgrade
- Background layers: 6 color zones based on depth ratio
- Wall gems refresh every 20 clicks
- Save format: JSON in localStorage key 'gold-mine-save'
