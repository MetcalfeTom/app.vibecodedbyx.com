# Holiday Luck Calculator

## log
- 2026-01-18: Added checkbox selector for holidays
  - Expanded to 21 holidays (11 federal + 10 popular)
  - Added floating holidays (Labor Day, Memorial Day, etc.)
  - Checkbox grid to select which holidays count
  - Select All / Clear All / Federal Only buttons
  - Easter calculation with Computus algorithm
- 2026-01-18: Initial creation
  - Year categorization based on holiday placement
  - 9 fixed-date holidays tracked
  - Score percentage and verdict
  - Year comparison chart

## features
- Categorizes years as BLESSED, MEH, or CURSED
- Tracks fixed-date holidays:
  - New Year's Day (Jan 1)
  - Valentine's Day (Feb 14)
  - St. Patrick's Day (Mar 17)
  - Independence Day (Jul 4)
  - Halloween (Oct 31)
  - Veterans Day (Nov 11)
  - Christmas Eve (Dec 24)
  - Christmas Day (Dec 25)
  - New Year's Eve (Dec 31)
- Shows which day each holiday falls on
- Color-coded weekday (green) vs weekend (red)
- Score bar showing percentage of weekday holidays
- Year-by-year comparison chart
- Click to navigate years

## design
- Fredoka + JetBrains Mono fonts
- Warm yellow/cream background
- Green for good (weekday), red for bad (weekend)
- Card-based layout
- Bouncing emoji verdicts

## controls
- Arrow buttons to change year
- Click comparison rows to jump to year

## todos
- Add more international holidays
- Add country selector
- Add "find best year" feature
- Add holiday observance rules (Monday if weekend)

## issues
- None yet
