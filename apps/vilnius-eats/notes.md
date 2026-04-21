# Vilnius Eats

## log
- 2026-04-21: Created. Stylish neon Vilnius food map. Two-column layout: large stylized SVG map (left) + scrollable restaurant list (right). Header has filter pills (All / Lithuanian / Modern / Fine Dining / Café / Bar) with colored dot swatches. Not a geographic projection — hand-tuned SVG art. Layers (bottom-up): dot-pattern background → Neris river (wide cyan glow arc + thin inner highlight stroke, feGaussianBlur filter) → Vilnia river (smaller cyan glow) → Old Town boundary (amber dashed polygon w/ soft-glow filter) → Užupis polygon (magenta dashed) → Naujamiestis polygon (muted) → stylized street curves (10 soft-white quadratics) → district labels (Playfair italic) → landmark dots (Gediminas Tower / Cathedral / Bernardinai / TV Tower) with mono labels → restaurant markers. Each marker = category-colored halo circle (animated `pulse` 2.6s keyframe, staggered by 0.19s × index) + dark disc with colored ring + colored core, drop-shadow via CSS `filter`. 15 hand-picked restaurants (Nineteen18, Demi Lokas, Džiaugsmas, Lokys, Ertlio Namas, Bernelių Užeiga, Senatorių Pasažas, Sweet Root, Amandus, Telegrafas, Chaika, Pinavija, Saint Germain, Gaspar's, Dublis) with category, rating string, street address, cuisine tag and ~2-line vibe description. Interactions: hover marker → tooltip with name (Playfair italic), click → selects + highlights matching card + syncs to sidebar (scrollIntoView). Cards show category-color left border + matching rating color. Filter pills dim non-matching markers + hide cards. Search input does case-insensitive match across name/cuisine/desc/address. Top-left compass (Cormorant "N" + Vilnius label), bottom-left legend, bottom-right coords. Responsive — collapses to stacked layout under 820px. Palette: lithuanian amber (#ffb84d), modern aqua (#4dffd5), fine magenta (#ff4dcf), café peach (#ffd29a), bar coral (#ff7d7d) on deep indigo bg. Playfair Display + Cormorant Garamond + JetBrains Mono typography.
- Pollinations OG image.

## features
- Stylized SVG map w/ rivers, old town, Užupis, street curves, landmarks
- 5-category color system with pulsing neon markers
- Two-way selection (click marker ↔ click card)
- Live filter pills + search (name/cuisine/desc/address)
- Tooltip on hover with restaurant name
- Responsive layout (side panel → stacked)

## issues
- Restaurant positions are aesthetic, not GPS — should not be used to navigate to a location.
- Ratings are subjective labels ("★★★★½", "★ Michelin", "Tasting") not scraped from any service.
- If any named restaurant has closed, the card still renders — manual data maintenance needed.

## todos
- Add hours / website / tag: reservations-required
- Add more districts (Žvėrynas, Naujininkai)
- Photo carousel in a detail drawer
- Optional real Leaflet/OSM layer toggle (with caching caveats)
- Save favourites to localStorage + export list
