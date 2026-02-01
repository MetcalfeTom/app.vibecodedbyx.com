# Wiki Scout

Wikipedia explorer with instant article summaries.

## log
- 2026-02-01: Knowledge Graph visualization
  - Canvas-based force-directed layout showing article connections
  - Root (green), linked (blue), 2nd-degree (purple) nodes
  - Auto-expands 3 random branches to 2nd-degree depth
  - Click-to-select, drag nodes, pan canvas, double-click to search
  - Expand button to grow selected node's connections
  - Touch support for mobile
  - Tooltip shows article description on hover
  - Article/Graph view tab switcher
- 2026-01-26: Added shared database cache
  - Supabase wiki_cache table with JSONB for flexible result storage
  - Local cache as fast fallback
  - 24-hour TTL for cached articles
  - Visual indicator when result is from cache
  - Saves API calls when multiple users search same topics
- 2026-01-25: Initial creation
  - Wikipedia REST API integration
  - DOMPurify sanitization
  - Rate limiting (15/min)
  - Search with fallback suggestions
  - Responsive design

## features
- Fetch article summaries from Wikipedia REST API
- Search with OpenSearch API fallback
- **Shared database cache** - results saved to Supabase for all users
- **Local cache fallback** - instant results for repeat searches
- Article display with thumbnail images
- Direct links to full Wikipedia articles
- Topic suggestions for quick exploration
- Input sanitization (max 200 chars, dangerous chars stripped)
- Output sanitization with DOMPurify
- Rate limiting (15 requests per minute)
- Mobile responsive

## security
- ONLY fetches from en.wikipedia.org (hardcoded)
- No arbitrary URL access
- Input sanitization removes <>"';` and js: protocols
- Output sanitized with DOMPurify (only b/i/em/strong/p/br/span allowed)
- Rate limiting prevents abuse
- All user-generated content escaped for display

## api endpoints used
- `https://en.wikipedia.org/api/rest_v1/page/summary/{title}` - Article summaries
- `https://en.wikipedia.org/w/api.php?action=opensearch` - Search suggestions

## design
- Crimson Pro serif for headings (editorial feel)
- Source Sans 3 for body text
- Cream/paper color scheme
- Clean, readable layout
- Wikipedia-inspired aesthetics

## todos
- None currently

## Next Development Phase: SCOUT v2.0
**Theme: Knowledge Graph & Learning Paths**

1. **Multi-Source Knowledge**
   - Language selection (all Wikipedia editions)
   - Integration with other wikis (Fandom, WikiHow)
   - Academic paper summaries (arXiv)
   - News article context

2. **Knowledge Graph**
   - Visual article relationship map
   - Topic clusters exploration
   - "Six degrees" path finder
   - Related concepts sidebar

3. **Learning Features**
   - Random article button with categories
   - Daily knowledge challenge
   - Bookmarked articles collection
   - Reading history timeline

4. **Social Learning**
   - Share discoveries to Sloppygram
   - Collaborative reading lists
   - Group knowledge quests
   - Expert annotations

5. **AI Enhancement**
   - Article summarization levels (ELI5, detailed)
   - Key facts extraction
   - Cross-article comparison
   - Question answering from articles

## Archived Todos
- ✓ Language selection (planned for v2.0)
- ✓ Random article button (planned for v2.0)
- ✓ Related articles section (planned for v2.0)

## issues
- None yet
