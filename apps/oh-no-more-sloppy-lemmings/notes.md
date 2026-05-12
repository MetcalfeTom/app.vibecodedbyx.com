# oh-no-more-sloppy-lemmings · notes

## log
- 2026-05-12: Shipped v1. 640×480 retro Lemmings clone with paint-dripping physics. Pixel-perfect destructible terrain stored in a Uint8Array(W*H) mask + mirrored in an offscreen terrCanvas; collision sampled by isSolid(x,y) on the mask. Paint accumulates on a separate paintCanvas via dripped particles that splat into pixels when they hit terrain. 7 skills (CLIMB/FLOAT/BOMB/BLOCK/BUILD/BASH/DIG) wired to a bottom panel + 1-7 keyboard. Click skill → click lemming to assign. Bombers get a 5s countdown rendered above the sprite; on detonation eraseTerrainCircle carves a 14px-radius crater. Builders place 12 brick steps in the lemming's own color, basher horizontally carves 10×12 chunks, digger vertically 11×4. Splat at fall >80 px. Lemming sprites are 6×10 px blobs with 2-frame walk cycle, eye that tracks dir, action glyph above when assigned, umbrella while floating, blocker arms out. Web Audio: pop on spawn, bash noise burst with bandpass, splat sub-thump + lowpass noise, yippee triangle ascending arp on save, bomb sub-sweep + noise crash. Title splash card with dripping "SLOPPY" tag; pause/restart via Space/R; mute on M. Aesthetic: neon-green border + violet stone walls + bright lemming hues; CRT scanline overlay.

## issues
- The skill panel covers the bottom ~10% of the play area visually but the canvas is the full 640×480; lemmings can walk under the panel. This is intentional — the panel is semi-transparent and the floor sits at y=432 which is mostly above the panel.
- Mobile is functional but not optimized — small skill buttons. Could add a long-press tooltip later.
- The level is hand-tuned for one playthrough; level 2+ would need a level generator or hand-author table.
- No "Nuke all" button yet (mass-explode). Could add as a danger button in the future.

## todos
- Multi-level support with hand-authored levels
- Mining tool (diagonal down-bash)
- Time freeze / fast-forward speeds
- Sound mix toggle separate from full mute
- Background chiptune loop (currently the only ambient is silence)
- A "nuke all" button if all lemmings are stuck

## design notes
- Terrain mask is the authority — the canvas mirror exists only for rendering. Always update both via fillTerrain/eraseTerrain.
- Paint particles deposit into paintCanvas when they hit a solid pixel. The paintCanvas is drawn AFTER terrain but BEFORE lemmings so trails read on top of bricks.
- Lemming color comes from LEM_PALETTE cycled by spawn order. The bomber crater paint burst uses the lemming's hue, so splat sites are color-tagged.
- Climber + Floater are PASSIVE traits (don't override walking state); the other skills are ACTIVE actions that take over the walk loop.
