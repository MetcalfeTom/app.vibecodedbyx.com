# Shenzhen Spa Finder

## log
- 2025-12-29: Initial creation
  - Clean search bar with instant filtering
  - Filter toggles: 24-hour service, has buffet
  - Dropdown filters: buffet quality, district
  - Sort by: rating, price, reviews
  - 8 mock spas with realistic data
  - Card layout with photos from Unsplash
  - Bilingual names (English + Chinese)
  - Star ratings and review counts
  - Price per person display
  - District-based location info
  - Responsive grid layout
  - Playfair Display + Noto Sans SC fonts

## issues
- None so far

## todos
- Could add map view integration
- Could add spa detail pages
- Could add user reviews
- Could add booking functionality
- Could connect to real API if available

## notes
### Mock data:
- 8 spas across 5 districts
- Price range: ¥228 - ¥588
- Rating range: 4.3 - 4.9
- Buffet quality: excellent, good, standard
- Districts: Futian, Nanshan, Luohu, Bao'an, Longhua

### Filter logic:
- Search matches name, Chinese name, address, district
- Filters are AND-based (all must match)
- Empty filter value = show all

### Design:
- Purple accent color (#6c5ce7)
- Clean white cards with subtle shadows
- Active filter toggles highlight in purple
- Mobile-responsive with stacked layout
