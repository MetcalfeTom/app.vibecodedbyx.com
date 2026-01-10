# BEEF CLICKER

## log
- 2026-01-10: Added Grandma's Kitchen update
  - Added rare Grandma's Kitchen upgrade (25% multiplier per level, max 20)
  - Made all upgrades significantly cheaper
  - Added Grandma Boost stat display
  - Added 2 new Grandma achievements
  - Pink glow styling for special upgrade
  - Sizzle celebration on Grandma purchase
- 2026-01-10: Initial creation
  - Golden cow clicker
  - 8 production upgrades
  - 3 click power upgrades
  - 8 achievements
  - Sizzling particle effects
  - Auto-save to localStorage
  - Responsive layout

## features
- Click golden cow to earn beef
- Production upgrades for beef/second
- Click upgrades for beef/click
- Achievement system
- Floating number particles
- Sizzle effects (fire, steam, sparkle)
- Auto-save every 30 seconds
- Number formatting (K, M, B, T)
- Cow glow increases with progress

## upgrades (production)
1. Beef Cursor (15) - 0.1 bps
2. Backyard Grill (100) - 1 bps
3. Cattle Ranch (1,100) - 8 bps
4. Steakhouse (12,000) - 47 bps
5. Beef Factory (130,000) - 260 bps
6. Beef Portal (1.4M) - 1,400 bps
7. Beef Temple (20M) - 7,800 bps
8. Beef Planet (330M) - 44,000 bps

## upgrades (click power)
1. Stronger Hands - +1/click (max 10)
2. Golden Touch - +5/click (max 10)
3. Beef Mastery - +25/click (max 10)

## achievements
- First Taste: 1 total beef
- Century Steak: 100 total beef
- Beef Baron: 1,000 total beef
- Beef Tycoon: 1,000,000 total beef
- Clicker: 100 clicks
- Click Master: 1,000 clicks
- Upgrader: Buy first upgrade
- Collector: Own 10 upgrades

## design
- Gold/orange/red fire theme
- Bungee display font
- Dark brown background
- Glowing golden cow
- Floating click particles
- Random sizzle emojis
- Split layout (game/shop)
- Mobile responsive

## mechanics
- Cost scaling: 1.15x per purchase
- Production runs continuously
- Delta time for accurate offline gains
- LocalStorage persistence

## stats tracked
- Current beef
- Total beef earned
- Total clicks
- Beef per click
- Golden cows owned (ranch count)

## todos
- Add prestige/rebirth system
- Add more achievements
- Add golden beef random events
- Add sound effects
- Add milk upgrades from cows
- Add Supabase leaderboard
