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
- 2025-10-21: Added custom word inputs
  - Users can add custom nouns, verbs, adjectives, and people names
  - Custom words mixed with default word banks
  - Comma-separated input for easy entry
  - Collapsible custom input section
  - Custom words apply across all categories

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
- Custom words system:
  - Deep copy of templates to avoid mutation
  - Merges custom arrays with default arrays
  - Applies to things, devices, foods, animals (nouns)
  - Applies to actions, activities (verbs)
  - Applies to adjectives
  - Applies to subjects, celebrities (people)
  - Comma parsing with trim and filter
