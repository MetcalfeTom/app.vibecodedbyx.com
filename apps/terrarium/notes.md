# Digital Terrarium

A living ecosystem where plants grow from community activity.

## log
- 2026-03-13: Initial build. Supabase-backed `terrarium_plants` table (plant_type, plant_name, x_pos, growth, waters, username). 7 plant types: fern (fronds + curled tip), succulent (rosette leaves), mushroom (stem + spotted cap), flower (petals + golden center), cactus (ridges + arms + bloom), vine (bezier curve + leaves), moss (particle clusters + glow). 5 growth stages per type. Canvas rendering with soil gradient, ambient moisture motes, mist layer, glass reflection overlay. Plant mode (click to place) and water mode (click near plant, +2 growth). Water drop particle effects, shimmer on watered plants. Hover shows name/level/grower. Auto-refresh 20s. Newsreader + DM Mono typography, earthy green/brown terrarium palette.

## issues
- RLS: can only water own plants (update restricted to owner). Others' plants get visual feedback only.
- x_pos stored as 0-1000 integer (MCP doesn't support float/real)

## todos
- Community watering: separate "water_log" table so anyone can water any plant
- Seasonal effects (day/night cycle, rain)
- Rare plant types unlocked by growth milestones
- Bugs/butterflies that appear at high total growth
- Plant death if not watered for a long time

## notes
- Growth stages: 0-4 (seed<5, sprout<15, small<35, bush<70, lush>=70)
- Plant height = 8 + stage*12 + growth*0.3
- Soil line at 82% canvas height
- Minimum 30px between plants (x_pos units)
- Each plant type has unique canvas drawing with stage-dependent detail
