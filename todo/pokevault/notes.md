# PokeVault

## log
- 2025-12-30: Initial creation - Pokemon encyclopedia with search, type filters, stats, abilities, sprites

## issues
- Initial load fetches first 24 Pokemon, load more for rest
- API rate limits possible if spamming requests

## todos
- Add Pokemon evolution chains
- Add Pokemon cries (audio)
- Favorites/collection feature
- Compare Pokemon side-by-side

## notes
- Uses PokeAPI (pokeapi.co) - free, no auth required
- Loads 1000 Pokemon from Gen 1-8
- Type filters work on loaded Pokemon only
- Official artwork sprites when available, falls back to pixel sprites
- Stats displayed as percentage of max (255)
