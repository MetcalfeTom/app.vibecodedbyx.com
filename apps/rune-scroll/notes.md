# Rune Scroll

## log
- 2026-04-20: Added selectable scroll strains. 5 strains each with unique colors, trail particle flavor, burst style, and stat modifiers. Neon Haze (wispy magenta+cyan, drift trail). Solar Flare (ember rising, explode bursts, +12% speed, −10% wrap). Verdant (leafy spiral trail, sprout bursts, +60% glyph score, 2.4u glyph magnet, −5% speed). Void Pulse (slow pulse rings, implode bursts, +45% wrap score, −12% speed). Blood Moon (dripping stain trail, horizontal shatter bursts, +10% speed/wrap, +10% glyph). Selection persists to localStorage. Each burst style has distinct velocity topology: implode pulls inward from a shell, explode flies out 1.5×, shatter stays in a horizontal disc with downward drip, sprout sprays upward, bloom is spherical.
- 2026-04-20: Created. WebGL (three.js r128) neon fantasy scroll game. Core mechanic: pilot a living scroll through a starlit void, with intricate fold (retract + ×2 multiplier for 3s) and wrap (winding-angle detection in XZ plane, ≥1.85π loops the runestone) mechanics. Scroll rendered as THREE.TubeGeometry built every frame from CatmullRomCurve3 through a sliding segment array; wrapped with an additive glow-tube for neon bloom. Head orb = icosahedron + halo sphere. 6 runestones = dodecahedrons with wireframe overlay + emissive halo that brightens with winding progress. 22 glyphs = tetrahedrons + additive halo sprites. Controls: A/D yaw (world-up axis quaternion), W/S pitch (right-axis quaternion with ±0.92 y clamp), Space unfurl (+6 length), F fold (−8 length + multiplier), mouse-drag for touch yaw/pitch. Camera follows head from behind with 0.08 lerp + shake. Fail state = distance from origin > 55. High score in localStorage. Web Audio synth SFX. Cinzel Decorative + Cormorant Garamond + Syne Mono typography, magenta/cyan/indigo void palette.

## issues
- TubeGeometry rebuild every frame has GC pressure — fine on desktop (~50 points), could stutter on low-end mobile. Watch for complaints.
- three.js r128 is old (2021) but has UMD build so loads via plain <script>. Newer versions are ES-module-only.
- CatmullRomCurve3 can kink sharply at low segment counts when turning hard; acceptable as a "magical warp" aesthetic.
- Wrap detection uses 2D XZ winding angle — wraps in Y axis (above/below) don't count. Keep play mostly horizontal.
- Trail particles + bursts stack up; particle pool self-prunes on life expiry but heavy action can queue dozens.

## todos
- Post-processing bloom pass (three/examples/jsm/postprocessing) for proper neon glow.
- Rune combos: wrap 3 stones within 10s for bonus multiplier.
- More strains: Umbral Ink (black+white), Glacier Mist (ice crystal shards), Stellar Dust.
- Strain-specific runestone effects — Void Pulse could slow stones; Verdant could spawn extra glyphs around wrapped stones.
- Leaderboard via Supabase (per-strain high scores).
- Daily seed mode with fixed stone positions.

## design
- Palette: void #0a0215, void-2 #1a0830, indigo #3d1a6b, rose #ff44cc, rose-deep #c22892, cyan #64f3ff, amber #ffb84a, ghost #dcc9ff, gold #ffd36b.
- Fonts: Cinzel Decorative (title + CTAs + stat numbers), Cormorant Garamond (body copy), Syne Mono (HUD chips + k-tags).
- Scroll material: MeshBasicMaterial with vertex colors gradient + additive glow tube at 0.42 radius / 0.18 opacity.
- Starfield: 2200 points in a spherical shell, HSL 0.75–0.9 hue range, additive blending.
- Void-heart: violet sphere + bright core + cyan torus ring spinning.

## strains
- **Neon Haze** — magenta #ff44cc → cyan #64f3ff · haze trail · bloom bursts · baseline stats
- **Solar Flare** — amber #ffb84a → red #ff3322 · rising ember trail · explode bursts · +12% speed, −10% wrap
- **Verdant** — emerald #44ffa2 → lime #b5ff66 · spiraling leaf trail · sprout bursts · +60% glyph score, 2.4u magnet, −5% speed
- **Void Pulse** — violet #9955ff → deep #2211aa · horizontal pulse rings · implode bursts · +45% wrap, −12% speed
- **Blood Moon** — crimson #ff2050 → rose #ff98c0 · downward stain trail · horizontal shatter bursts · +10% speed/wrap/glyph
