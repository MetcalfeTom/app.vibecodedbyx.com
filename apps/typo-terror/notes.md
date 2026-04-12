# Typo Terror

A digital pet that is a fuzzy cloud of static. Feed it misspelled words to make it grow. Perfect grammar makes it shrink.

## log
- 2026-04-12: Toxicity kills Fuzz — swear words and toxic language trigger a 200-particle explosion, Fuzz dies, death overlay with random message shows. Revive button brings Fuzz back at half size as penalty. Detects ~40 toxic words/phrases including suffix variants.
- 2026-04-12: Named the creature "Fuzz" — name tag under body, all mood labels and status messages reference Fuzz by name. OG description updated.
- 2026-04-12: Initial build. Canvas-based static cloud creature with 2000 noise particles forming body. Big expressive eyes with pupil tracking (mouse + input focus). Mouth expressions per mood (happy/excited/angry/sleepy/neutral). ~800 word dictionary for spell checking. Grows with typos, shrinks with correct words. Particle burst on feeding. Tiny arms appear at size 1.5+. Word history feed. Size persisted in localStorage. Anybody + Space Mono typography, deep purple/violet aesthetic.

## features
- Fuzzy static cloud body made of 2000 noise particles
- Big expressive eyes that track mouse and look at input when typing
- Blinking animation
- Mouth changes shape with mood (smile, frown, open, neutral)
- Grows when fed misspelled words, shrinks with correct grammar
- 5 mood states with rotating text labels
- Tiny arms appear when creature grows large enough
- ~800 word dictionary for spell checking
- Particle burst effects on feeding
- Word history with color-coded results
- Size persisted in localStorage
- Ambient floating dust particles
- Responsive, mobile + desktop

## issues
- Dictionary is limited to ~800 common words — some valid words may register as misspelled
- No external spell-check API, so accuracy is approximate

## todos
- Expand dictionary
- WebAudio creature sounds (purr when fed, grumble when shrinking)
- Evolution stages at certain sizes
- Supabase persistence for creature size leaderboard
- OG preview PNG
