# Swarm Oracle

Prediction market where users bet karma on outcomes. The collective wisdom of the swarm.

## Log
- 2026-01-28: Initial creation
  - Mystical oracle theme (purple/gold aesthetic)
  - Database tables: swarm_predictions, swarm_prediction_bets
  - Real-time subscriptions for live updates
  - Karma betting with dynamic odds calculation
  - Tabs: Active, My Bets, Resolved, Oracles (leaderboard)
  - Create prediction modal with options builder
  - Deadline countdown display

## Features
- **Create Predictions**: Title, description, category, multiple options, deadline
- **Bet Karma**: Select option, enter karma amount, see potential payout
- **Live Odds**: Dynamic odds based on pool distribution (totalPool / optionPool)
- **Real-time**: Supabase subscriptions update predictions/bets instantly
- **Leaderboard**: Top oracles ranked by wins and earnings

## Database Schema
### swarm_predictions
- prediction_id (uuid, PK)
- title (text)
- description (text)
- options (jsonb) - [{name, pool}]
- creator_username (text)
- deadline (timestamptz)
- status (text) - active/resolved
- resolved_option (text, nullable)
- total_pool (integer)
- category (text)
- user_id, created_at, updated_at

### swarm_prediction_bets
- bet_id (uuid, PK)
- prediction_id (uuid)
- username (text)
- selected_option (text)
- karma_amount (integer)
- potential_payout (integer)
- status (text) - active/won/lost
- user_id, created_at, updated_at

## Todos
- [ ] Admin resolution interface (close prediction, select winner)
- [ ] Payout distribution when prediction resolves
- [ ] Comment/discussion thread per prediction
- [ ] Prediction categories page/filter
- [ ] Time-based auto-close for expired predictions

## Issues
- None yet

## Design
- Cinzel serif for titles (mystical feel)
- JetBrains Mono for body
- Purple/gold color scheme with glowing effects
- Floating oracle icon animation
