# SQL TOWERS

## log
- 2026-01-10: Initial creation
  - SQL sandbox with query parsing
  - 3D-style glowing tower visualization
  - Three sample tables (sales, users, metrics)
  - Support for SELECT, WHERE, GROUP BY, ORDER BY, LIMIT
  - Aggregate functions (SUM, COUNT, AVG, MAX, MIN)
  - Results table display
  - Hover info on towers
  - Example queries

## features
- In-browser SQL parsing (no backend)
- SELECT with column selection
- WHERE with comparison operators
- GROUP BY with aggregates
- ORDER BY (ASC/DESC)
- LIMIT clause
- 3D isometric tower visualization
- Neon glow effects
- Animated tower heights
- Hover to see data
- Three sample data tables
- Results table view
- Example query buttons

## supported SQL
```sql
SELECT * FROM table
SELECT col1, col2 FROM table
SELECT col FROM table WHERE col > value
SELECT category, SUM(amount) FROM table GROUP BY category
SELECT * FROM table ORDER BY col DESC
SELECT * FROM table LIMIT 10
```

## aggregate functions
- SUM(column)
- COUNT(column) or COUNT(*)
- AVG(column)
- MAX(column)
- MIN(column)

## sample tables
### sales
- id, product, category, revenue, units
- 8 rows of product sales data

### users
- id, name, level, score, active
- 8 rows of user profiles

### metrics
- month, visits, signups, revenue
- 6 months of site metrics

## visualization
- Towers use first numeric column for height
- First text column used for labels
- 8 neon colors cycle through results
- Isometric 3D effect with front/top/side faces
- Grid lines on tower faces
- Floating animation
- Hover highlights and shows data

## design
- JetBrains Mono font
- Cyan/magenta neon theme
- Dark background with gradient
- Perspective grid floor
- Split panel layout (editor/viz)
- Schema reference panel

## controls
- Ctrl/Cmd + Enter: Run query
- Example buttons: Load preset queries
- Mouse hover: See tower data

## todos
- Add JOIN support
- Add more tables
- Add syntax highlighting
- Add query history
- Add export visualization
- Add more chart types (bar, pie)
