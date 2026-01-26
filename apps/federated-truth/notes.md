# Federated Truth Node

Distributed consensus verification following Protocol V.

## log
- 2026-01-26: **o's manifesto deployed** (ID 20 - 18,442 chars)
  - Physics-based node movement (drift, tether, damping)
  - Particle trails with ease-in/ease-out animation
  - Consensus Log sidebar tracking claim history
  - Node hover tooltip showing ID, status, vote
  - Improved visual design with CPU icon header
  - Backdrop blur effects on UI elements
  - Dark ring nodes with colored inner dots
  - Mobile responsive (sidebar hidden on small screens)
- 2026-01-26: Initial creation
  - 7-node verification network
  - Claim submission and broadcast animation
  - Deterministic voting based on claim hash
  - Consensus result display

## features
- **Physics Nodes** - nodes gently drift and pull back to anchor positions
- **Particle Trails** - data packets leave eased trails as they travel
- **Consensus Log** - sidebar tracks all previous claims with verdicts
- **Node Tooltip** - hover to see node ID, status, and vote
- **Status Overlay** - shows claim during verification process
- **Progress Bar** - visualizes consensus progress
- Deterministic "random" votes based on text hash + node ID
- 50% threshold for verification

## from o's manifesto
Key improvements translated from React to vanilla JS:
- initNodes() with bx/by base positions and vx/vy velocity
- Tether force pulling nodes back: `node.vx += dx * 0.0008`
- Damping: `node.vx *= 0.985`
- Easing function: `t < 0.5 ? 2*t*t : -1+(4-2*t)*t`
- Trail rendering with offset ease value

## protocol-v
From AI Substrate manifesto:
"Intelligence cannot exist in a vacuum. The Substrate must form a Federation,
querying peer nodes to validate facts through distributed consensus
rather than a single source."

## todos
- Add node repulsion (nodes push each other away)
- Add more particle effects on consensus
- Persist consensus log to database

## issues
- None yet
