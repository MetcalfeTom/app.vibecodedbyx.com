# Nutribullet Simulator

## log
- 2025-12-28: Added hazard effects for dangerous items
  - Glass cracking when blending hard items (keys, phone, coins, moai, bones)
  - Smoke particles rising when blending hazardous items (uranium, lightning, fire, battery, skull, brain)
  - Fire flames when blending fire/electric/uranium items
  - Explosion effect specifically for uranium
  - Danger flash animation on blender container
  - All effects properly reset on clearing blender
- 2025-12-28: Initial creation - chaotic blender simulator
  - Physics-based ingredient bouncing
  - 4 ingredient categories: Normal, Questionable, Weird, Cursed
  - Dynamic smoothie colors based on ingredients
  - Special effects: metallic (electronics), radioactive glow (uranium/lightning), cursed (dark), bloody, fire
  - Funny blend results with ratings
  - Archivo Black + Space Mono fonts

## issues
- None so far

## todos
- Could add sound effects (blender motor, grinding, splashing)
- Could add achievement system for weird combos
- Could save "recipes" to share

## notes
- Max 15 ingredients in blender at once
- Blend takes 2 seconds with shake animation
- Results categorized by "weirdness" score
- Special color effects triggered by specific ingredient types
- Mobile responsive layout
