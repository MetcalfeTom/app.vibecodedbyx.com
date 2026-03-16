# Data Pet

A digital pet that only eats CSV files and spreadsheet data.

## log
- 2026-03-16: Initial build. Canvas-drawn digital pet that feeds exclusively on CSV/TSV data. 3 evolution stages: Blob (level 1-3), Dataframe/Cube (level 4-7), Crystal DB/Prism (level 8+). Pet has animated eyes (normal, happy, sad with tear), chewing mouth animation, body bounce, data antenna on evolved forms. Feed methods: drag-and-drop CSV files, click to upload, or paste CSV text directly. CSV parser handles commas, tabs, quoted fields. Nutrition calculated from row count, column count, data quality (penalized for empty cells). Data quality assessment affects happiness gain. Floating data snippets (header names) and hearts on feeding. Hunger/happiness decay over time (including while away via lastSave timestamp). Random idle mood messages based on hunger tier. Level-up system with increasing XP requirements (1.5x per level). Feed log shows recent meals with row/col counts and headers. Stats: hunger, happiness, level with XP bar. Persistent via localStorage. Space Mono + Instrument Serif typography, dark palette with teal/pink/yellow accents.

## issues
- None yet

## todos
- Favorite food types (pet prefers numeric vs text data)
- Data quality rating visualization
- Pet accessories based on data types eaten
- Multiplayer: compare pets with other users

## notes
- No database — localStorage persistence only
- CSV parser: auto-detects comma vs tab delimiter, handles quoted fields
- Nutrition: min(60, rows*2 + cols*3)
- Joy: min(40, quality/3 + cols*2)
- XP: rows + cols*2 + floor(numCount/2)
- Quality: 100 - emptyCount*5 - penalty for few rows
- Decay: hunger -0.8/2s, happiness -0.4/2s, extra -0.3 if hunger < 20
- Away decay: hunger -0.5/min, happiness -0.3/min
- Evolution: blob (1-3), cube (4-7), prism (8+)
- Max file size: 5MB
