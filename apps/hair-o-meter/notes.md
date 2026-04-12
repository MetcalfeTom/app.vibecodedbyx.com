# Hair-o-meter

Algorithmic hair volume analysis. Enter a username to get a deterministic hair rating, or use the slider.

## log
- 2026-04-12: Initial build. Canvas-rendered head with dynamic hair that scales from bald (shiny dome with reflection) to legendary mane (flowing strands with golden sparkles, halo). 11 rating tiers from Clinically Bald (0-5) to Legendary (95-100), each with unique color, label, and humorous verdict. Username-to-score algorithm: deterministic hash (bit mixing + multiply) maps any username to 0-100 consistently. Bonus modifiers for hair-related words (+15-20), bald-related penalties (-15-30), and special names (rapunzel=99). Animated slider easing on username analysis. Head has expressive features: pupils track rating, eyebrows lift/furrow, mouth changes from frown to grin. Individual hair strands with wave/curl animation, hair cap coverage scales with score. Random and Spin buttons. Tick sounds on slider, glory arpeggio at 95+. Background glow matches current tier color. Syne + Space Mono typography, dark void/gradient aesthetic.

## features
- Username → deterministic hair score algorithm
- 11 rating tiers with colors, labels, verdicts
- Canvas head with expressive face (eyes, brows, mouth react to score)
- Dynamic hair rendering: bald shine → thin strands → full mane → legendary sparkles + halo
- Hair strands with wave and curl animation
- Animated slider easing on username input
- Bonus/penalty modifiers for hair-related usernames
- Random and Spin buttons
- Tick and glory SFX
- Background particles at high ratings
- Touch and keyboard support

## issues
- None known

## todos
- OG preview PNG
- Leaderboard of highest-rated usernames
- Share result image
- Hair style categories (afro, mohawk, mullet)
