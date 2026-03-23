# Neon Aquarium

Glowing fish ecosystem with predator-prey dynamics, lightning strikes, and placeable decor.

## log
- 2026-03-23: V3 — Removed chat bar, added species selector sidebar with all 7 fish types. Added 4 placeable decor types (Coral, Rock, Anemone, Crystal) with neon glow rendering. localStorage persistence for fish, decor, and feed count. Auto-saves every 10 seconds. Clear Tank button. Toggle sidebar with +Fish button.
- 2026-03-23: V2 — Added predator-prey system (fish size 16+ hunt smaller ones), neon lightning strikes on click (branching bolts scare predators away, shrink them). Predators have red-tinted aura and red pupils.
- 2026-03-23: Initial build. 7 species, canvas aquarium, chat-based feeding, Supabase realtime.

## issues
- None currently

## todos
- Fish breeding (two large fish produce a baby)
- Day/night cycle
- Sound effects (bubbles, ambient)
- Double-click decor to remove it

## notes
- 7 species: Tetra, Angel, Guppy, Betta, Neon, Molly, Danio
- 4 decor types: Coral (branching), Rock (ellipse), Anemone (tentacles), Crystal (faceted)
- Predator threshold: size >= 16 (red aura, red pupils, chases smaller fish)
- Big predators (35+) sluggish, lightning shrinks them by 1.5
- Lightning: branching bolt from surface to click, flickers for 0.6s, pushes fish away
- localStorage key: neon_aquarium (fish positions/sizes/species + decor + totalChats)
- Auto-save every 10s, save on add fish / place decor / clear
- Population floor: 6 fish minimum (auto-replenish if overhunted)
- Max fish: 30
