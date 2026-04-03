# Bee Chess

## log
- 2026-04-02: Initial build — pixel art chess with angry bee swarms on capture. Full chess rules (castling, en passant, promotion, check/checkmate/stalemate). Press Start 2P + Silkscreen fonts, muted purple/gold pixel palette, CRT scanline overlay. Bees scale with capture count and piece value.

## features
- Complete chess: all legal moves, castling, en passant, pawn promotion (auto-queen)
- Pixel art pieces drawn from 6x6 patterns
- Bee swarm on every capture — count scales with total captures + piece value
- Bees have physics: wobble, drift, fade out over time
- CRT scanline + vignette overlay
- Check/checkmate/stalemate detection
- Responsive canvas sizing, touch support
- Captured piece tracking

## issues
- No AI opponent — two-player only (or play yourself)
- Pawn auto-promotes to Queen (no choice)
- No move history / undo
- Bees are purely visual, don't affect gameplay

## todos
- Add simple AI opponent (minimax with basic evaluation)
- Add Supabase leaderboard (track fastest checkmates?)
- Add OG image
- Sound effects (buzz on capture, click on move)
- Promotion choice UI
- Move history sidebar
