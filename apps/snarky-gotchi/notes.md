# Snarky Gotchi

A virtual pet that judges your every move.

## log
- 2026-04-10: Initial build. 6 pet types (Blobbert, Thornton, Morticia, Whiskers, Unit-404, Spectra) with pixel-art rendering. 4 stats (hunger, happiness, energy, hygiene) with real-time decay. 4 actions (feed, play, sleep, clean). Contextual snarky dialogue system with 15+ categories (greet, feed good/full/starving, play good/tired/bored, sleep good/awake, clean good/already, idle happy/neutral/sad/critical, neglect, spam, milestone, death). Typing animation for speech. Spam detection (3+ rapid clicks triggers sass). Sass meter (1-5 pips based on average stat level). Age tracking. Burn log (action history). Pet states (idle/eating/playing/sleeping/cleaning) with canvas animations (bounce, jitter, dim, blink, Zzz). Death screen with unique death quotes. Silkscreen + Outfit typography, dark device aesthetic with LCD scanlines.

## features
- 6 pixel-art pet types to choose from
- 4 stats with real-time decay
- 4 care actions with contextual responses
- 100+ unique snarky dialogue lines
- Spam detection — critiques button-mashing
- Sass meter escalates with neglect
- Pet animations (bounce, blink, sleep Zzz, play jitter)
- Typing effect for speech bubbles
- Action cooldowns
- Burn log history
- Death system with unique quotes
- Mobile-friendly

## issues
- No persistence (pet resets on page reload)
- No save/load system
- No evolution stages

## todos
- localStorage save/load
- Evolution stages (baby → teen → adult → elder)
- More dialogue lines
- Sound effects
- Supabase leaderboard for longest survival
- OG preview PNG
