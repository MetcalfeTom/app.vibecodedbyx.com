# Neon Forecast

Fictional weather from another dimension. Type any city, get absurd weather.

## log
- 2026-02-14: Initial build. 31 fictional weather conditions, seeded RNG per city+day for consistent results, 5-slot forecast, search history, neon retro-futuristic aesthetic. Orbitron + Share Tech Mono typography. No database needed — pure frontend.
- 2026-02-14: Added "Razor Wind Advisory" condition per chat request.

## issues
- None yet

## todos
- Could add sharing feature (screenshot or URL params)
- Sound effects on scan would be fun

## notes
- Weather is deterministic per city+date via seeded PRNG (same city = same weather all day, changes at midnight)
- No real API calls — everything generated client-side
- History stored in localStorage, max 8 entries
- Loads with a random starter city if no history
