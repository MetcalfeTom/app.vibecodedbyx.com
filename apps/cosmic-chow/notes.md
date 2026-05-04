# cosmic-chow

## log
- 2026-05-04: shipped — zero-g neon soup simulator (chat ask).
  - **Bowl**: circular containment field at canvas center (radius = 42% of min viewport dimension). Glowing cyan rim with `shadowBlur` + pulsing scale; deep purple-cyan radial-gradient interior with three drifting "broth swirl" rings drawn via `globalCompositeOperation = 'lighter'`.
  - **10 ingredients**, each with its own custom paint fn:
    - **pea** (small green sphere with light highlight)
    - **carrot** (orange disc with concentric ring detail — cross-section)
    - **noodle** (yellow ellipse with wavy stripe)
    - **shrimp** (pink elongated body + tail fan + segment lines + tiny eye)
    - **dumpling** (cream crescent with pleat lines)
    - **starfruit** (5-point star)
    - **tofu** (white rounded square with highlight)
    - **egg** (white circle with yellow yolk)
    - **bok** (blue-cyan bundle with green leafy ellipses + foam center)
    - **mushroom** (pale green cap with white stem and spots)
    Each ingredient has its own halo radial-gradient + body shape + decoration. Halos rendered with `globalCompositeOperation = 'lighter'` for the additive neon glow; outline pass after restores crisp shape.
  - **Click to spawn**: bottom dock has a row of preview buttons (each preview is a static canvas render of the ingredient sprite) plus a "?" RANDOM button. Click an ingredient button to lock subsequent clicks to that type; RANDOM rotates through all. Number keys 1-9 select dock slots; R selects random.
  - **Physics**: per-ingredient {x, y, vx, vy, rot, vRot}. Gentle damping (0.992^dt*60). Bowl wall = circular bounce inward (0.85 elasticity). Pairwise O(N²) collision with mass = r² weighting + along-normal velocity exchange + spin transfer + spark cluster spawn at impact > 30. Typical population ≤120, ~14k pair checks per tick, comfortably fast.
  - **Stir**: applies a counter-clockwise tangent force scaled by remaining stirT (1.5s decay) to every ingredient. Audio: bandpass-noise swoosh + low triangle slide.
  - **Clear**: spawns 4 sparks per ingredient as they pop out + descending square pop chord, then clears the array.
  - **Sparks**: collision impacts spawn 3 colored particles using each colliding ingredient's color, fading 0.3s with 0.92 damping.
  - **Background**: deep cosmic radial gradient (#180a3a → #0a0420 → #020210) with twinkling stars (cyan + occasional violet) — density auto-scales to viewport area.
  - **Cursor preview**: dashed ring shows where the next ingredient will land, sized by selected kind's radius.
  - **Audio**: muted by default (chat asks for audio toggles to be conservative). SOUND pill in the HUD toggles. Plop sound on spawn, throttled clink on collision (impact-scaled volume), stir swoosh, descending pop on clear.
  - **Aesthetic**: Audiowide neon title "COSMIC CHOW" with magenta accent + glow shadow, Cormorant italic tagline, Major Mono Display HUD numerals, Space Mono body. Dock is a rounded glassy bar with backdrop-blur.
  - **Loop**: fixed-step 1/120s w/ accumulator + spiral-of-death guard.
  - **Boot seed**: 6 random ingredients arranged in a ring around the bowl center so the canvas never starts empty.
  - **Accessibility**: rem units, 44px+ button targets, semantic main, role="application" canvas with control summary, aria-pressed on toggles, focus-visible outlines, prefers-reduced-motion kills hover transforms + hint fade transition, skip link.

## issues
- Ingredient outline pass uses a generic circle of radius `r * 0.92` — for non-circular shapes (shrimp's elongated body, tofu cube) the outline is just a hint. Fine visually but not perfectly snug.
- O(N²) pairwise collision will slow above ~250 ingredients. Spatial hashing would extend the cap to thousands.
- Stir uses a single tangent force; in practice the bowl quickly converges to a uniform swirl. Could add eddy turbulence.
- The dumpling visual is a crescent — could be a more explicit pleated shape.
- No way to pour out / drain a portion (just CLEAR-all). A "ladle" tool that scoops a region could be fun.

## todos
- "Recipe" presets that spawn a curated mix (Wonton, Pho, Miso, Tom Yum) on one button.
- Ingredient size slider (small / medium / large).
- Bowl-shape variants (square plate, hexagonal vessel).
- Persist last-selected ingredient + dock state to localStorage.
- Multiplayer broadcast: see other players' click-spawns in the same bowl via Supabase realtime.
- Drain / ladle tool that scoops out a chunk of the broth and removes nearby ingredients.
