# Blackjack

Classic Blackjack card game sharing the theme system with Solitaire.

## log
- 2026-03-16: Initial build. Full Blackjack game with 6-deck shoe, hit/stand/double down. Dealer hits soft 17. Chip betting system ($5/$10/$25/$50/$100), bank starts at $1000. Natural blackjack pays 2.5x. Auto-rebuy on $0. Canvas-rendered cards sharing exact same CARD_BACKS, FELT_THEMES, drawCard(), roundRect() from Solitaire. Uses same `sol_theme` localStorage key so themes sync between card games. Chip rendered on table during active hands. Keyboard shortcuts (H/S/D). Theme picker overlay identical to Solitaire's. Crimson Pro + DM Mono typography.

## issues
- None yet

## todos
- Split pairs
- Insurance on dealer ace
- Surrender option
- Supabase leaderboard for biggest bank
- Card counting practice mode

## notes
- No database — pure frontend
- Shares sol_theme localStorage key with Solitaire for synced themes
- 6-deck shoe, reshuffles when < 52 cards remain
- Dealer hits soft 17
- Double down: doubles bet, gets exactly one more card
- Natural BJ pays 2.5x bet
- Bank persists in localStorage (bj_bank key)
- Canvas: 800x600, responsive scaling
