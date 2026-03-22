# Neon Burger

Stack glowing ingredients to build your custom burger. Interactive menu builder.

## log
- 2039-03-92: Initial build. 14 ingredient layers with pricing and calorie system. Drag/click ingredients onto plate to stack burger. Randomly generated recipe button for quick builds. Neon glow on each layer via box-shadow. Responsive plate with layer stacking. BG Shade + Chakra Petch typography, dark neon-diner aesthetic.

## issues
- None yet

## todos
- Drag reorder layers
- Topping animations
- Receipt printer (DOM to PNG)

## notes
- No database — pure frontend, localStorage only
- Key: neon-burger-v1
- 14 ingredients: Bun Top/Bottom, Patty, Cheese, Lettuce, Tomato, Onion, Pickle, Bacon, Egg, Mushroom, Jalapeno, Sauce, Ketchup, Mustard
- Calorie and price sums displayed live
- Suffixes from ingredient combos (Spicy, Smokehouse, Deluxe, etc.)
- Layer heights/widths vary per ingredient
- Glow color per ingredient via inset box-shadow
- "Random Recipe" builds a 3-7 layer stack from center items
- Max stack visual ~14px
- localStorage persists current stack
