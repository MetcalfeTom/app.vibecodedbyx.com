# Fake News Generator

## Log
- 2025-10-21: Initial creation
  - Created satirical news headline and article generator
  - 7 categories: Politics, Tech, Science, Sports, Entertainment, Business, Lifestyle
  - Mad Libs style template system with randomized elements
  - Newspaper-style design with classic serif fonts
  - Generates headlines, bylines, and article text
  - Share functionality for generated articles
  - Mobile and desktop responsive
  - Clear disclaimer about fictional content
- 2025-10-21: Added predefined extra word banks
  - Added modern/internet culture words to all categories
  - Extra nouns: Memes, Bitcoin, NFTs, TikTok, Zoom, Air Fryers, etc.
  - Extra verbs: Vibe, Manifest, Speedrun, Go Viral, Rizz Up, etc.
  - Extra adjectives: Based, Cringe, Sus, Bussin, Slay, Unhinged, etc.
  - Extra people: Influencer, Content Creator, Streamer, TikToker, etc.
  - Automatically merged with default word banks for variety

## Issues
- None yet

## Todos
- Could add ability to customize news elements
- Could add image generation for fake news photos
- Could add more article templates and variations
- Could add ability to save/export articles as images
- Could add more categories (weather, local news, weird news)
- Could add option to chain multiple stories together
- Could add "breaking news" ticker animation

## Technical Notes
- Fully client-side, no backend needed
- Template-based generation with placeholder replacement
- Each category has 7+ headline templates
- Multiple word banks per category (10+ words each)
- Randomized article intros, bodies, and conclusions
- Uses classic newspaper styling with Georgia/Times fonts
- Category badges color-coded
- Auto-generates article on page load
- Share API integration for mobile sharing
- Extra words system:
  - Deep copy of templates to avoid mutation
  - Predefined extraWords object with modern/internet slang
  - Merges with things, devices, foods, animals (nouns)
  - Merges with actions, activities (verbs)
  - Merges with adjectives
  - Merges with subjects, celebrities (people)
  - 15 extra nouns, 10 extra verbs, 11 extra adjectives, 8 extra people
  - Creates more varied and modern-sounding headlines
