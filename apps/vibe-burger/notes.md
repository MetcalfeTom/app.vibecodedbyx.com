# Vibe Burger

Enter a username. Get a custom cheeseburger based on your name's vibes.

## log
- 2026-03-16: Initial build. Username-seeded burger generator with canvas-drawn burger illustration. Seeded RNG (mulberry32 from string hash) ensures same name always gets same burger. 8 bun types (sesame, brioche, charcoal, pretzel, beetroot, matcha, squid ink, saffron), 8 patty types (angus, wagyu, black bean, chicken, lamb, portobello, bison, impossible), 8 cheeses, 16 toppings with varied draw styles (wavy, slices, rings, egg, sauce). Double patty/cheese chance. Named burgers from 18x18 prefix/suffix combos. 8 vibe energy types. 12 funny descriptions. Stats: messiness, flavor, size, calories. Canvas drawing: stacked layers with bun dome/flat, grill marks, melty cheese drips, topping shapes, toothpick flag. Sizzle + ding order-up sound. Recent orders history (clickable). CRT filter overlay (scan lines + vignette), neon title buzz animation, floating dust motes, subtle flicker. Bangers + DM Mono typography, warm dark diner palette.

## issues
- None yet

## todos
- Share burger as image (canvas.toDataURL)
- Burger rarity tiers (common/rare/legendary ingredients)
- Side dishes generated from name
- Competitive: "whose burger wins?" comparisons

## notes
- No database — pure frontend
- Seeded RNG: mulberry32 from hashStr, deterministic per lowercase username
- Canvas: 280x320, layers stack bottom-up (bottom bun → patties → cheese → toppings → top bun → flag)
- Bun drawing: ellipse dome (top) or roundRect (bottom), seeds as small rects
- Patty: roundRect with grill mark lines and sizzle pixels
- Cheese: rect + 3 drip rects extending below
- Toppings: wavy=sinusoidal fill, slices=circles, rings=stroked circles, egg=ellipse+yolk, sauce=random dots
- CRT: repeating-linear-gradient 3px scan lines + radial vignette on ::after, body flicker animation
- Dust: div particles with float-up keyframe, spawned every 800ms, removed after 10s
- Sound: highpass noise burst (sizzle) + triangle 880Hz ding (order bell)
