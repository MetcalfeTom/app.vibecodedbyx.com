# Local Flora Finder

## log
- 2026-04-22: Created. Field-guide style app mapping a US ZIP code to a curated list of ~10 common plants and wildlife of its bioregion. **Regions** (9 hand-curated): NE (Northeastern Woodlands, 0–1xxxx), MA (Mid-Atlantic & Piedmont, 1–2xxxx), SE (Southeastern Coastal Plain, 3xxxx), GL (Great Lakes & Midwest, 4xxxx), NP (Northern Plains & Upper Midwest, 5xxxx), CP (Central Plains & Ozark Edge, 6xxxx), SC (South-Central & Texas, 7xxxx), MW (Mountain West & Southwest, 8xxxx), PC (Pacific Coast & Cascadia, 9xxxx). **ZIP → Region**: first-digit map with refinement (two-digit 10–19 = MA for NY/PA differentiation, 00–02 = NE for offshore/NE New England, 03–09 = NE). **Species data**: each region has ~10 entries with `{name, latin, cat, emoji, desc, badges[]}`. Categories: tree / plant / bird / mammal / herp / insect / aquatic — each with its own color-coded tag (moss/moss-deep/sky/ochre-deep/olive/ochre/teal). Descriptions written in short naturalist prose (1-2 sentences). Badges show seasonality, habit, native/status. **UI**: Victorian field-guide aesthetic. Cream parchment bg with repeating-linear noise + radial specks (mix-blend multiply). Title block: Playfair Display 800 "LOCAL FLORA & FAUNA" with italic ampersand in moss-green; Alegreya SC ornamental subtitle with ❦ flourishes; Crimson Pro italic tagline. Search card: Alegreya SC "POSTAL CODE — FIVE DIGITS" label + IBM Plex Mono input (letter-spacing 0.25em, placeholder dots) + terra-red "CONSULT" button w/ 3px offset shadow. Try-these chips preset common ZIPs (02139, 10001, 33101, 78701, 80202, 94110). Region card: double inset border (outer + inner rule), "PLATE I · ZIP 12345" red tag anchored at top-left edge, 2-col grid (desc prose | metadata meta-rows w/ Alegreya SC keys and Crimson italic values). Specimen grid: auto-fill 240px cards with category tag ribbon, "SPECIMEN" framed emoji block (corner "№ 01" labels), Playfair name + italic Latin binomial + Crimson description + dashed-border IBM Plex Mono badge row. Staggered 50ms animation-delay on reveal. **Persistence**: last ZIP stored to localStorage, restored on reload. **Fonts**: Playfair Display + Crimson Pro + IBM Plex Mono + Alegreya SC. **Palette**: parchment #f3e8cd / ink #2d2012 / moss #6a7b3a / ochre #c68b2a / terra (ink red) #9a2f1e / sky #46678a.
- Pollinations OG image.

## features
- 9 curated US bioregions, ~10 species each (90 total entries)
- ZIP → region detection with first-digit + two-digit refinement
- Field-guide card design with plate number, scientific names, badges
- Try-these preset chips for quick exploration
- localStorage persistence of last ZIP
- Mobile responsive (single-column region grid, single-column specimens)
- Categorical color-coding (tree/plant/bird/mammal/herp/insect/aquatic)
- No backend — fully offline-capable

## issues
- Coverage only within US 5-digit ZIP range; no Canadian postal codes, no international.
- ZIP → region is a rough approximation. Real bioregion boundaries aren't aligned with postal codes — a Colorado mountain town and a Denver suburb share `8xxxx` but have very different ecologies.
- Species lists are hand-curated, not exhaustive — 10 entries per region is a sampling, not a complete field guide.
- Some species appear in multiple regions (deer, monarchs, red fox) — intentional, they really do range widely; descriptions are regionally flavored.
- First-digit 0 returns NE even for Puerto Rico (006xx, 007xx, 009xx) — tropical PR flora not included in the guide.
- Alaska (995xx) and Hawaii (967–968xx) roll up into Pacific Coast region — simplification, their biomes are distinctive.

## todos
- Expand to ~15 regions to separate: Appalachian Highlands, Florida peninsula, Sonoran vs Chihuahuan, Pacific NW vs California, AK tundra, HI tropical.
- Canadian postal code support (FSA letter-digit pattern)
- Per-species detail panel (click card → larger description + range map)
- AI-generated pollinations image per species (cache by binomial name)
- Seasonal filter (show only what's visible *now*)
- Companion "what's singing / blooming this week" hint
- Export a PDF plate for printing
- User contributions: suggest a species for a region
