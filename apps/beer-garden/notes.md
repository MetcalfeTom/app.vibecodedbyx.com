# Beer Garden

## log
- 2025-12-28: Initial creation
  - Cozy tavern aesthetic with wood grain, warm lighting, lanterns
  - Interactive beer mugs with foam, bubbles, and drinking animation
  - Clickable pretzels that disappear when eaten
  - Stats tracking: sips, pretzels eaten, cheers count
  - Cheers button with international toast messages
  - Sound effects (gulp, munch, clink, pour) via Web Audio API
  - Almendra font for rustic tavern feel
  - Warm amber/brown color palette
  - Mobile responsive
- 2025-12-28: Kaiser branding + German characters
  - Added Kaiser beer branding (sign + mug logos with crown)
  - 4 animated background characters (sway animation)
  - Characters randomly shout German complaints every 8-15 seconds
  - Complaints about weather and beer prices with English translations
  - Speech bubbles appear near characters
- 2025-12-28: Leberkäse + Drunk dancer
  - Added Leberkäse plate with mustard (CSS-drawn)
  - Drunk character (🕺) hops on table every 25-45 seconds
  - Does clumsy dance for 5 seconds with oom-pah polka music
  - Floating music notes during performance
  - Added "Hilfe, das Bier ist nicht verfügbar!" complaint

## issues
- None so far

## todos
- Could add multiplayer/shared table functionality
- Could add more food items (bratwurst, cheese, etc.)
- Could add ambient tavern background audio
- Could add seasonal decorations (Oktoberfest, Christmas market)
- Could track "highest cheers" leaderboard

## notes
### Interactive Elements:
- **Beer Mug**: Click to take a sip (animation + sound)
- **Pretzel**: Click to eat (disappears with animation)
- **Cheers Button**: All mugs clink together, shows random toast

### Toast Messages:
- German: Prost!, Zum Wohl!, Ein Prosit!
- English: Cheers!
- Nordic: Skål!
- Italian: Salute!
- Czech: Na zdraví!
- Irish: Sláinte!
- Japanese: 乾杯!
- Hebrew: L'chaim!

### Sound Types:
- `gulp`: Drinking beer
- `munch`: Eating pretzel
- `clink`: Cheers glass clink
- `pour`: New beer ordered

### German Complaints:
- Weather: rain, cold, wind, lack of sun
- Prices: 5€, 6.50€ for beer, inflation
- Beer quality: too watery, not cold enough, too much foam
