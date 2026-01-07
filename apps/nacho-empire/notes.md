# Doubloon Empire

## log
- 2026-01-07: Converted to pirate theme "Doubloon Empire"
  - Golden nacho chip → Giant golden doubloon with skull and crossbones
  - Nachos → Doubloons
  - Nacho-themed upgrades → Pirate upgrades (Pickpocket to Pirate Emperor)
  - Warm orange → Ocean night blue background
  - Seahorse → Treasure parrot (kept from previous version)
- 2026-01-07: Added rare parrot companion - glowing bonus creature
- 2026-01-07: Initial creation - infinite clicker with golden chip and 10 upgrades

## features
- Giant golden doubloon coin to click
- Skull and crossbones emblem on coin
- 10 pirate upgrade tiers from Pickpocket to Pirate Emperor
- Exponential cost scaling (1.15x per purchase)
- Click power scales with production
- Coin/treasure particle effects
- Rare treasure parrot (spawns every 30-90 seconds)
  - Glowing orange/gold mystical bird
  - Click to catch for 10 seconds worth of production bonus
  - Flies away after 12 seconds if not caught
  - Counter tracks total parrots caught
- Auto-save to localStorage every 10 seconds
- Number formatting (K, M, B, T, Q)
- Mobile responsive layout

## upgrades
1. Pickpocket - 0.1/s
2. Deckhand - 1/s
3. Smuggler - 8/s
4. Privateer - 47/s
5. Galleon - 260/s
6. Pirate Hideout - 1,400/s
7. Kraken Tamer - 7,800/s
8. Ghost Ship - 44,000/s
9. Pirate Armada - 260,000/s
10. Pirate Emperor - 1,600,000/s

## design
- Ocean night blue/gold color scheme
- Pirata One / IM Fell English SC fonts
- SVG golden doubloon with skull emblem and sparkles
- Shimmering glow animation
- Floating treasure emoji particles on click
- Coin press animation with slight rotation

## technical
- localStorage for persistence with migration from old saves
- 60fps game loop for smooth production
- Cost formula: baseCost * 1.15^count
- Click power: 1 + floor(doubloonsPerSecond / 100)

## todos
- Add achievements system
- Add prestige/reset mechanic
- Add golden doubloon random events
- Add sound effects
- Add cloud save with Supabase
