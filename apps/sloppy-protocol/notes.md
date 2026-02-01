# Sloppy Protocol — Notes

## log
- 2026-02-01: Initial build. Mission-control dashboard for ecosystem improvements. DB tables: protocol_improvements, protocol_log. Pre-seeded 10 critical items across Sloppygram, SloppyID, Swarm Nexus. Canvas priority matrix, health cards, ranked queue with filter/sort, protocol log feed, add improvement modal. Victor Mono + Orbitron typography, dark terminal green aesthetic with scanlines. Real-time updates via postgres_changes.

## issues
- RLS means users can only update/delete their own rows — status changes on seed data require being the seed user
- Canvas priority matrix doesn't show tooltips on hover (future enhancement)

## todos
- Add hover tooltips on matrix bubbles showing improvement title
- Add bulk status update capability
- Add export/import for improvement data
- Add comment thread per improvement
- Consider adding dependency tracking between improvements
