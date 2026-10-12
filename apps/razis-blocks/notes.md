# Razis Blocks — notes

iamflax's pitch (2026-10-12): "a cyberpunk version of the game tetris with special boosters like candy crush, game is called razis blocks. Playable on mobile with music."
Credit line "idea by Flax" on the title card. Never use Tetris branding or music; the 4-line clear is called "RAZIS!".

## log
- v1 (2026-10-12): core falling-block game. 10x20 well + 2 hidden rows, 7-bag, SRS rotation + wall kicks (I and JLSTZ tables), hold, 3-piece next queue, ghost, soft/hard drop, 0.5 s lock delay with 15 move resets, DAS 160 ms / ARR 45 ms. Touch: drag sideways = move (one column per 0.85 cell of drag), drag down = soft drop, tap = rotate, flick down = hard drop, swipe up = hold, HOLD button. Keys: arrows/WASD, Z/Ctrl rotate back, Space drop, C/Shift hold, P/Esc pause. Score: 100/300/500/800 x level, combo multiplier 1 + 0.5 x (combo-1), back-to-back 4-line x1.5. Level every 10 lines, gravity 0.85 s x 0.82^(level-1), floor 0.04 s. Rainy neon city background (3 building layers, katakana signs that flicker, rain), glitch slices + magenta flash on clears, particles, shake, hard-drop trail, lock flash. Run-over card with best (localStorage razis-best).

## issues
- (none reported yet)

## todos
- boosters (charged blocks + chain blasts, color bomb, laser/overdrive, rainbow)
- music + sfx, mute toggle
- polish: share line, difficulty curve check, small phones

## art direction
- Night city in rain: deep indigo sky, magenta halo, cyan accents, acid-yellow for numbers/buttons. Blocks are dark glass tiles with a bright neon border, glow baked into sprites (buildSprites) so the frame stays cheap.
- Fonts: Tektur 900 (title, callouts), Martian Mono (HUD/UI, 100/400/800), DotGothic16 (katakana signs). No Orbitron/Space Grotesk.
- No opacity-0 load fades (the auto preview shoots at load). The title card sits over a demo stack so the preview shows the game.

## testing
- Scratch: $SP/razis (index.html is the source; build_test.py injects window.__RB + a freeze flag into gaunt/sw/hm43/razis/t.html). Live page has only a `/*@@HOOK@@*/` comment.
- Probe hm/rz1.js: greedy bot plays 2x400 pieces + a random bot tops out, then touch (tap/drag/flick/swipe) and key tests. v1: 0 errors, 158 lines per 400 pieces, game over works.
