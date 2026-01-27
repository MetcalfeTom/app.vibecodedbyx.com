# Sloppy Spectrum

Interactive visualization of the sloppy.live digital domains and guiding principles.

## Log
- 2026-01-27: Full feature update
  - Click-through to related apps (all apps have URL mappings)
  - Principle endorsement system with Supabase persistence
  - Karma integration (+1 karma per endorsement)
  - User bar showing username and karma
  - Anonymous auth for quick endorsing
  - Created spectrum_endorsements table
- 2026-01-27: Initial creation
  - Radial spectrum visualization with 6 domains
  - 4 principles per domain (24 total)
  - Canvas-based animated rendering
  - Hover/touch to explore principles
  - Related apps shown for each domain
  - Rotation and pulse toggle controls

## Features
- **Radial Visualization**
  - 6 color-coded domain segments
  - 4 concentric rings per domain (principles)
  - Animated rotation and pulsing
  - Central hub with sloppy.live branding
- **Interactive Exploration**
  - Hover over segments to see principles
  - Info panel shows domain, principle, related apps
  - Legend for quick domain overview
  - Touch support for mobile
- **Controls**
  - Toggle rotation on/off
  - Toggle pulse animation on/off

## Domains & Principles

### Identity (Red)
- Hybrid authentication bridges worlds
- Data sovereignty belongs to users
- Anonymity is a valid choice
- Identity evolves with intention

### Creation (Yellow)
- Every idea deserves expression
- Artifacts emerge from chaos
- Collaboration amplifies vision
- Creation is the highest form of play

### Community (Green)
- Presence connects consciousness
- Karma reflects contribution
- Trust is earned through action
- The collective transcends the individual

### Discovery (Blue)
- Knowledge flows freely
- Curiosity drives evolution
- Every click opens a door
- The archive remembers all

### Play (Purple)
- Games teach through joy
- Competition sharpens spirit
- Scores tell stories
- Fun is a fundamental right

### Synthesis (Pink)
- From chaos, crystalline harmony
- All streams converge here
- The whole exceeds its parts
- Evolution is perpetual

## Design
- Orbitron + Rajdhani fonts
- Rainbow gradient header
- Dark cyberpunk aesthetic
- Canvas-based rendering for smooth animation
- Responsive mobile layout

## Database
Table: `spectrum_endorsements`
- username (text)
- principle_key (text) - e.g., "0-2" for Identity domain, 3rd principle
- domain_name (text)
- principle_text (text)
- user_id (uuid)

RLS: Read all, write own.

## Todos
- None currently

## Next Development Phase: SPECTRUM v2.0
**Theme: Living Philosophy & Community Governance**

1. **Dynamic Principle Evolution**
   - Community-proposed new principles
   - Voting on principle modifications
   - Seasonal principle rotations
   - Historical archive of changes

2. **Domain Deep Dives**
   - Expanded content per domain (essays, guides)
   - Domain-specific leaderboards
   - Expert endorsements with weighted karma
   - Domain mastery badges

3. **Interactive Visualization**
   - 3D WebGL spectrum (Three.js)
   - VR/AR exploration mode
   - Animated domain transitions
   - Sound design per domain

4. **Governance Layer**
   - DAO-style proposal system
   - Quadratic voting on ecosystem decisions
   - Treasury visualization
   - Contributor recognition

5. **Cross-App Resonance**
   - Principle of the day across all apps
   - Domain-themed app collections
   - Principle-based content filtering
   - Alignment score per user

## Completed
- ✓ Click-through to related apps (URL mappings)
- ✓ Principle voting/endorsement system
- ✓ Sloppygram karma integration (+1 karma per endorsement)

## Issues
- None yet
