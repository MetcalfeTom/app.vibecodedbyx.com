# Swarm Intelligence Nexus

## log
- 2026-01-28: Discussion & Notifications Update
  - Added proposal discussion/comments section
  - Discussion modal with real-time comment updates
  - Comment counts displayed on proposal cards
  - Pass notification system with celebration animation
  - Real-time notifications when proposals pass consensus
  - localStorage tracking for seen passed proposals
  - Database table: swarm_proposal_comments
- 2026-01-27: Initial creation
  - Real-time collective decision engine
  - Proposal creation with categories (feature, ui, rules, integration, other)
  - Voting periods: 1h, 24h, 3d, 1 week
  - Weighted voting power based on Sloppygram karma
  - 66.67% consensus threshold for passing
  - Real-time vote tallying with Supabase subscriptions
  - Visual consensus bars with animated fills
  - Countdown timers for voting periods
  - Category filtering tabs
  - Hexagonal background with swarm particle animation
  - Stats dashboard (active proposals, implemented, total voters, avg consensus)
  - Database tables: swarm_proposals, swarm_votes

## issues
- None so far

## todos
- Add proposal history view
- Consider quadratic voting option
- Add proposal amendment system

## notes
### Voting Power Calculation
Power is calculated from Sloppygram activity:
- Posts: 3 points each
- Doodles: 5 points each
- Manifestos: 10 points each
- Messages: 1 point each
- Base power: 1 (minimum)
- Max power: 100

### Consensus Threshold
- 66.67% required to pass
- Proposals auto-close when voting period ends
- Status: active → passed/failed

### Categories
- Features: New functionality requests
- UI/UX: Design and interface changes
- Rules: Community guidelines
- Integration: External service connections
- Other: Miscellaneous proposals
