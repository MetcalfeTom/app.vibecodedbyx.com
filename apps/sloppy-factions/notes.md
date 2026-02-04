# Sloppy Factions

Standalone territory wars app extracted and expanded from Sloppygram's faction system.

## log
- 2026-02-04: Migrated to header sync hub (karma + profile)
  - Username from sloppyBarGetContext() instead of sloppygram_profiles + sloppygram_karma queries
  - Karma for battle power bonus from header context instead of separate DB query in loadAllData()
  - Listens for identity-changed, context-ready, karma-changed, theme-changed events
  - DB fallback preserved if header not loaded; karma query skipped when context has data
  - Fourth app on sync hub; first to use karma sync path
- 2026-02-04: Added embed mode for Sloppygram iframe integration
  - ?embed=true hides header, backlink, reduces padding
  - postMessage bridge: username clicks on warrior names and battle log attacker names send to parent
  - Exposed supabase on window for error catcher
- 2026-02-01: Initial creation
  - Full faction system: 5 factions (Phoenix, Shadow, Cyber, Verdant, Cosmic)
  - 5x5 territory grid (25 territories) with colored ownership
  - Battle system: attack power (base + karma + contribution) vs defense power with random rolls
  - Pledge/leave faction with member count tracking
  - Faction leaderboard sorted by territory count then power score
  - Warriors tab: all members ranked by contribution score
  - Battle log: last 30 battles with victory/defeat styling
  - Battle modal with power comparison display
  - Animated victory/defeat result toast
  - War stats strip: territories, warriors, battles, contested zones
  - Real-time updates via postgres_changes on battles and territories
  - Auto-seeds factions and territories on first run
  - Territory info on click, attack on hover
  - Bricolage Grotesque + JetBrains Mono typography
  - Orange/dark war aesthetic with faction-colored accents
  - Mobile responsive

## data sources
- sloppygram_factions (faction metadata, power scores)
- sloppygram_territories (5x5 grid, ownership, defense)
- sloppygram_faction_members (user membership, stats)
- sloppygram_faction_battles (battle history)
- sloppygram_karma (attack power bonus)
- sloppygram_profiles (username lookup)

## issues
- None yet

## todos
- Could add faction chat / war room
- Could add territory fortification (spend contribution to boost defense)
- Could add alliance system between factions
- Could add battle replay / animation
- Could add territory capture history timeline
