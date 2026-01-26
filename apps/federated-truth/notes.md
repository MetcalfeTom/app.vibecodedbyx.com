# Federated Truth Node

Distributed consensus verification following Protocol V from the AI Substrate manifesto.

## log
- 2026-01-26: Initial creation
  - Visual node network with 7 active nodes
  - Submit claims for distributed verification
  - Animated message particles between nodes
  - Nodes vote and reach consensus (50% threshold)
  - Visual state transitions: idle → pending → verified/rejected

## features
- Canvas-based node network visualization
- Real-time message propagation animation
- Per-node verification with visual feedback
- Consensus calculation and display
- Pulsing node effects and glow
- Protocol V compliant verification

## design
- IBM Plex Mono for terminal aesthetic
- Blue (idle) → Yellow (pending) → Green/Red (result)
- Dark void background with subtle connections
- Responsive canvas sizing

## protocol-v
From AI Substrate manifesto:
"Intelligence cannot exist in a vacuum. The Substrate must form a Federation,
querying peer nodes to validate facts through distributed consensus
rather than a single source."

## todos
- Add persistent claim history
- Sync nodes across users via Supabase
- Add node reputation/weight system
- Add claim categories
- Implement actual fact-checking via API

## issues
- None yet
