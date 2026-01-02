# Sticker Workshop

## log
- 2026-01-02: Initial creation - emoji sticker maker

## features
- 6 emoji categories: faces, animals, food, nature, objects, symbols
- 8 background options: solid, pink, purple, blue, mint, yellow, dots, hearts
- Click emoji to add to canvas
- Drag to reposition stickers
- Resize via corner handle or slider
- Delete individual stickers
- Clear all button
- Save/download as PNG

## design
- Cute pastel aesthetic
- Gradient pink/purple branding
- Nunito font (rounded, friendly)
- Soft shadows and rounded corners
- Mobile-responsive layout

## technical
- Pure HTML/CSS/JS
- Drag and drop with mouse/touch support
- SVG foreignObject for export
- Canvas toBlob for PNG download
- CSS-only backgrounds (gradients, patterns)

## emoji counts
- Faces: 66 emojis
- Animals: 63 emojis
- Food: 76 emojis
- Nature: 75 emojis
- Objects: 64 emojis
- Symbols: 66 emojis

## interactions
- Click emoji = add to canvas at random center position
- Click sticker = select (shows handles)
- Drag sticker = move position
- Drag corner = resize
- Click X = delete sticker
- Click background = deselect

## issues
- Export may not capture all CSS perfectly in all browsers
- Large stickers may overflow canvas bounds

## todos
- Add rotation handle
- Add flip horizontal/vertical
- Add text labels
- Add sticker packs/themes
- Add undo/redo
- Add share to social media
