# gigglepan · notes

## log
- 2026-05-12: Shipped v1. Vibrant one-pan recipe generator using Pollinations text API (openai chat-completion, jsonMode) for recipes + image API for plating photos. 12 proteins (chicken/salmon/beef/pork/shrimp/tofu/tempeh/eggs/cottage cheese/turkey/sardines/lamb), 14 veggies multi-select, 4 heat levels, 6 moods (cozy/feisty/fancy/goblin/beach/monk), 1-8 servings stepper. System prompt enforces ONE pan + HEAVY protein + HEAVY veggies + LOW starchy carbs + funny original names + 4-8 short cooking steps + real measurements. JSON schema requires name/tagline/chef_quote/pan/prep_min/cook_min/servings/protein_g/carbs_g/fat_g/calories/ingredients/steps/image_hint. 3-layer JSON extractor (direct parse → openai.choices[0].message.content → fenced-block strip → first `{...}` regex slice) for resilience. Fallback recipe (hand-written "Sergeant Chicken's Broccoli Boot Camp") kicks in if the API errors. Pollinations image plating uses top-down vibrant cast-iron prompts with the recipe's image_hint. 4 action buttons: SAVE (toggle, persists to localStorage gigglepan-saved-v1 capped at 50), REROLL, COPY (formatted plain-text recipe to clipboard), SHARE (navigator.share or copy fallback). Saved fave grid below with auto-fill 160px cards, click-to-load, X-to-delete. Aesthetic: cream/coral/mustard/sage/plum on cream paper; Bowlby One SC chunky title with 4px-mustard 8px-coral triple-shadow + tilted "PAN" in coral; Caveat italic tagline; "TODAY" mustard tape sticker on the chooser card; "FRESH!" sage tape sticker on the result card; brown paper grain via repeating-linear 11deg overlay; 8px ink-shadow chunky cards with 22px rounded corners. Fonts: Bowlby One SC + Fraunces + Caveat + IBM Plex Mono.

## issues
- Pollinations text API can take 5-15s for cold prompts; UI shows "SIZZLING…" spinner state + "simmering ideas…" quote during the wait
- Pollinations image API cold-generation can be 30-60s; the image loads lazily so the recipe card displays immediately and the photo populates when ready
- The image prompt uses the model's `image_hint` field plus a generic "vibrant cast iron pan, bright natural light" suffix — if the model returns no hint we fall back to "name + first 4 ingredients"
- Veggie selector requires at least 1 veggie before generation (showError otherwise) — this enforces the heavy-veggie ethos

## todos
- macro estimator panel — show how the dish compares to a "balanced" target
- dietary tags (gluten-free, dairy-free, keto, halal, etc.)
- printable PDF / instagram-card export with the AI photo + recipe
- "make it for the week" — batch-cook scaling + leftover-friendly variant
- shopping list panel that combines all saved recipes
