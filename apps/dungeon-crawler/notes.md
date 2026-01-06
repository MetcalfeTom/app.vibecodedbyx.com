# Dungeon Crawler

## log
- 2026-01-06: Reviewed - full party RPG with inventory, spells, and recruitment
- 2026-01-03: Major expansion - 6-member recruitable party, inventory, 12 spells
- 2026-01-03: Added party system with 4 character classes
- 2026-01-02: Initial creation - retro first-person dungeon crawler

## features
- First-person pseudo-3D dungeon view
- Grid-based movement (WASD/arrows)
- Procedurally generated dungeons per floor
- 6 recruitable character classes
- Turn-based combat with party selection
- 12 spells across classes
- Full inventory system (12 slots)
- Equipment slots (weapon, armor, accessory)
- 8 item types including consumables and gear
- 6 monster types scaling with floor depth
- Hero recruitment on even floors
- Individual character leveling
- CRT scanline overlay

## character classes
1. **Warrior** 🛡️ - HP 32, ATK 9, DEF 7 - bash, taunt
2. **Mage** 🔮 - HP 18, MP 30, MAG 10 - fire, ice, bolt
3. **Rogue** 🗡️ - HP 24, ATK 8 - poison, steal
4. **Cleric** ✝️ - HP 26, MP 25 - heal, cure, smite
5. **Ranger** 🏹 - HP 22, ATK 7 - arrow, trap
6. **Paladin** ⚔️ - HP 30, DEF 6 - smite, heal

## spells
- fire (6 MP), ice (5 MP), bolt (8 MP) - Damage spells
- heal (6 MP), cure (12 MP) - Healing
- smite (7 MP), poison (4 MP) - Special damage
- steal (3 MP), taunt (4 MP), bash (5 MP), trap (6 MP)

## items
- HP Potion, MP Potion, Elixir (stackable consumables)
- Steel Sword (+3 ATK), Magic Staff (+4 MAG)
- Iron Shield (+3 DEF), Mage Robe (+2 MAG, +10 MP)
- Power Ring (+2 ATK, +2 MAG)

## monster types
1. Rat - HP 10, ATK 4, XP 10
2. Goblin - HP 18, ATK 6, XP 18
3. Skeleton - HP 28, ATK 9, XP 28
4. Orc - HP 40, ATK 12, XP 40
5. Demon - HP 55, ATK 16, XP 55
6. Dragon - HP 90, ATK 22, XP 120

## controls
- W/↑: Move forward, S/↓: Move backward
- A/←: Turn left, D/→: Turn right
- 1-6: Select party member
- Space: Attack in combat
- Click actions: Attack, Spell, Item, Defend

## design
- Dark dungeon aesthetic with muted colors
- Tabs: Party / Items / Spells
- Mobile-responsive layout
- Combat overlay with monster sprite

## todos
- Add save/load to localStorage
- Add boss encounters every 5 floors
- Add sound effects
- Add more loot variety
