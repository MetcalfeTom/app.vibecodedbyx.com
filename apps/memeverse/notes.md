# memeverse · notes

## log
- 2026-05-12: Shipped v1. Infinite-scrolling AI meme feed. 10 templates encoded as { id, name, captions count, fields[], imagePromptFn(topic), layout, captionsPrompt(topic) }: DRAKE / DISTRACTED BF / TWO BUTTONS / EXPANDING BRAIN / THIS IS FINE / CHANGE MY MIND / ROLL SAFE / SURPRISED PIKACHU / STARE CAT / GALAXY BRAIN. Each card POSTs to Pollinations openai (jsonMode) for captions matching the template's schema, then fetches a 540×540 Pollinations image as the background. Anton-font Impact-style overlay rendered via DOM divs absolutely positioned per layout type (topBottom / topOnly / bottomOnly / twoPanel / twoButtons / threeLabel / fourTier). Caption text gets 8-direction 2px black stroke + 16px black glow for the iconic Impact look. Composer at top: text input + GENERATE button (pink-violet gradient with neon shadow) + template select (random by default) + tip hint. IntersectionObserver watches the bottom status pill at 600px rootMargin and triggers loadMore() which spawns 4 more cards stitched from SEED_TOPICS. 12 seed topics + random handle from a 20-name list per card. Each card has 4 reactions: ♥ LIKE (toggles + count delta), ★ SAVE (toggles persistent localStorage memeverse-saved-v1 capped at 60), ↻ REGENERATE (re-runs populateMeme), 📋 COPY (clipboard with "/" separated captions + #memeverse). Image lazy-loads with fade-in (opacity 0 → 1 over 350ms); placeholder shows spinning ✦ during the Pollinations cold generation. JSON extraction has 3 layers (direct → openai.choices[0].message.content nested → fenced-block strip → first {...} regex). Fallback captions: uppercase "TOPIC + FIELD" if Pollinations fails. Aesthetic: deep purple cosmic bg with 3 neon radial glows (pink/cyan/violet), Audiowide gradient logo with animated 14s hue-scroll, sticky blurred header, single-column feed at max 540px width, white meme cards with chunky shadows + Space Mono handle + Audiowide neon-lime template badge. Fonts: Audiowide + Anton + Space Grotesk + Space Mono.

## issues
- Pollinations image API cold-generates each unique prompt in 30-90s; first 6 cards on load all spawn requests in parallel which can saturate the API briefly. The lazy-load + 400ms stagger in loadMore() helps avoid this on subsequent batches.
- The 'twoPanel' DRAKE layout currently shows both captions in the right half of the image; the actual Pollinations-generated DRAKE art might not perfectly split top/bottom — the captions still read but might overlap art. Acceptable noise for v1.
- No support yet for user-uploaded base templates; pure generation only.
- localStorage save panel doesn't have a UI surfacing yet — saved memes only persist; viewing them needs a future "MY SAVES" tab.

## todos
- Saved-memes drawer / tab so users can revisit their stars
- Cycle button per card to swap the template while keeping the topic
- Share-to-Twitter intent with image proxy
- Custom-template uploader (user pastes their own image + caption fields)
- Trending-topics ribbon that surfaces what's been generated most that hour
