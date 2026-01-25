# Wiki Scout

Wikipedia explorer with instant article summaries.

## log
- 2026-01-25: Initial creation
  - Wikipedia REST API integration
  - DOMPurify sanitization
  - Rate limiting (15/min)
  - Search with fallback suggestions
  - Responsive design

## features
- Fetch article summaries from Wikipedia REST API
- Search with OpenSearch API fallback
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
- Add search history
- Add language selection (other Wikipedia editions)
- Add random article button
- Add "related articles" section

## issues
- None yet
