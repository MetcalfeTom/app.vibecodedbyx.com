# Swarm Intelligence Nexus

## log
- 2026-01-28: History View & Amendment System
  - Added view tabs to switch between Active Proposals and History
  - History view with search, sorting (newest/oldest/most votes/consensus)
  - Filter by passed/failed status
  - Amendment system for active proposals
  - Database table: swarm_proposal_amendments
  - Users can propose changes to active proposals
  - Community can vote on amendments
  - Amendments show status (pending/accepted/rejected)
- 2026-01-28: Quadratic Voting Implementation
  - Voting cost now scales quadratically (cost = votes²)
  - Slider UI to choose vote intensity (1 to max based on power)
  - Max votes = floor(sqrt(power))
  - Real-time cost/impact display
  - User badge shows max votes available
  - Encourages thoughtful voting - strong opinions cost more
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
- None currently

## Next Infrastructure Milestones

### 1. Vote Delegation
Allow users to delegate their voting power to trusted community members.
- Delegate to username with optional category restrictions
- Delegator can override on specific proposals
- Delegatee sees combined power when voting
- Delegation chain limit (prevent loops)
- Revoke delegation anytime
- Database table: `swarm_delegations` (delegator, delegatee, categories, created_at)

### 2. Quorum Requirements
Minimum participation threshold for valid proposals.
- Configurable quorum per category (e.g., Rules: 20%, Features: 10%)
- Display quorum progress bar on proposals
- Proposals without quorum marked "Invalid - No Quorum"
- Quorum based on total active voters (voted in last 30 days)
- Warning when proposal approaching deadline without quorum
- Stats: avg quorum reached, proposals failed due to quorum

## notes
### Amendment System
- Users can propose amendments to active proposals
- Amendments have title, description, and vote counts
- Community votes to show support/opposition
- Amendments shown inline on proposal cards
- Status: pending → accepted/rejected (manual for now)

### Quadratic Voting
- Cost = votes² (1 vote = 1 power, 2 votes = 4 power, 3 votes = 9 power)
- Max votes = floor(sqrt(power))
- Example: User with 20 power can cast max 4 votes (cost 16)
- Prevents plutocracy while allowing strong preferences
- Lower-power users can still meaningfully participate

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
