# FEMA Emergency Portal

## log
- 2026-01-20: Initial creation - FEMA-style emergency portal simulation

## features
- National Survivor Registry search
  - Search by name
  - Filter by state, status, shelter
  - Status indicators (safe, missing, injured, unknown)
  - Shelter location display
  - Last update timestamps
- Emergency alert banner with level indicator
- Live statistics dashboard
  - Registered survivors count
  - Active shelters
  - Missing persons
  - Rescued today
- Emergency procedures list (5 steps)
- Active incidents feed
  - Timestamped updates
  - Critical/warning/info types
- Quick links section
- Real-time clock display
- Simulated stat updates

## design
- Official U.S. government aesthetic
- Navy blue (#003366) primary color
- Red (#c41e3a) for alerts
- Inter + Roboto Mono fonts
- Card-based layout
- Responsive grid
- Status color coding:
  - Green: Safe
  - Red: Missing
  - Yellow: Injured
  - Gray: Unknown

## data
- 15 pre-defined survivors
- Dynamic fake result generation
- 6 sample incidents
- Multi-state coverage (TX, FL, LA, CA, OK)

## todos
- Add survivor registration form
- Add shelter map integration
- Add push notification simulation
- Add evacuation route display
- Add resource request form

## issues
- None yet
