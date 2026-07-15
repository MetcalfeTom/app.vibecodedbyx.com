# room-scanner · notes

## log
- 2026-07-15 v1.0: chat ×4 (retries clarified: clutter categories = ROOM TYPES kitchen/livingroom/bedroom/office). LOCAL-FIRST: FileReader only, zero network APIs (asserted); photos downscaled (analysis 128px, display 480px JPEG .72) and never leave the device. AI-FREE CLUTTER MATH: clutterFromImageData = cheap-sobel edge density (3×3 zone means) + hue-jump chaos → 0–100 score, zone heatmap overlaid on the photo (red = busy). Flow: BEFORE scan → pick room type (single-select) → 10:00 timer (pause/reset, last-minute red, 4-note chime) → AFTER scan → side-by-side pair + improvement % ("the pixels confirm your labor"). Brass cabinet: First Scan / Full Ten Minutes / Before&After / −30% / −50% / 3 & 5 cleanups / Full House (all 4 room types). state room-scanner-v1 {badges, sessions, roomsDone}. Staatliches + Karla.

## issues
- Score is relative pixel math, not object detection — a busy rug reads as clutter; framed honestly ("no judgment that isn't mathematical").
- Thumbs held in memory only during session (not persisted) to dodge localStorage quota; sessions counter + badges persist.

## todos
- Persist small session history thumbs if chat wants a gallery (quota math needed).
