# Swarm Oracle

Prediction market where users bet karma on outcomes. The collective wisdom of the swarm.

## Log
- 2026-02-05: Phase 4 — Migrated to header sync hub context
  - loadUserProfile() uses sloppyBarGetContext() as fast path (profile, karma, trust) — 3 DB queries eliminated
  - loadUserTrustScore() extracted renderUserTrustBadge() for reuse
  - 3 duplicate username lookups (submitPrediction, placeBet, resolvePrediction) replaced with cachedUsername
  - Sync hub listeners: karma-changed, verification-changed, identity-changed, context-ready
  - DB queries kept: getCreatorTrustScore() (other-user lookups), all prediction/bet table queries
  - Net: ~6 current-user DB queries eliminated per page load
- 2026-01-28: Major feature update
  - Admin resolution interface: creators can resolve their predictions
  - Payout distribution: marks bets as won/lost on resolution
  - Category filter: filter predictions by category
  - Auto-close expired predictions: checks periodically
  - SloppyID integration: displays trust scores for creators
  - Trust badges: ⚡ score shown on user bar and prediction cards
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
- **Category Filter**: Filter by general, ecosystem, features, community, markets
- **Admin Resolution**: Prediction creators can resolve and select winners
- **Auto-Close**: Expired predictions automatically marked as closed
- **SloppyID Integration**: Trust scores displayed for prediction creators

## Database Schema
### swarm_predictions
- prediction_id (uuid, PK)
- title (text)
- description (text)
- options (jsonb) - [{name, pool}]
- creator_username (text)
- deadline (timestamptz)
- status (text) - active/closed/resolved
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

## SloppyID Metrics Integration
- Fetches `sloppyid_verifications` table
- Calculates trust score: Twitter +100, Email +150, GitHub +200
- Displays trust badges with color coding:
  - Default: cyan (score > 0)
  - High: green (score >= 150)
  - Verified: purple glow (score >= 300)

## Completed Todos
- [x] Admin resolution interface (close prediction, select winner)
- [x] Payout distribution when prediction resolves
- [x] Prediction categories page/filter
- [x] Time-based auto-close for expired predictions
- [x] SloppyID trust score integration

## Future Todos
- [ ] Comment/discussion thread per prediction
- [ ] Karma payout to winners (requires karma system integration)
- [ ] Prediction edit/delete for creators
- [ ] Search predictions

## Issues
- None

## Design
- Cinzel serif for titles (mystical feel)
- JetBrains Mono for body
- Purple/gold color scheme with glowing effects
- Floating oracle icon animation
- Trust badges integrate with SloppyID
