# Search Bridge

Secure query processor for internal data sources with full sanitization and audit trails.

## log
- 2026-01-25: Initial creation
  - 6-layer security architecture
  - DOMPurify input sanitization
  - Forbidden pattern detection
  - Rate limiting (10 req/min)
  - Audit trail logging
  - Logic core output format

## features
- Search across internal data sources only (messages, posts, manifestos, feedback)
- NO external URL fetching - security by design
- Multi-layer input sanitization:
  - Length limit (256 chars)
  - Forbidden pattern regex matching
  - DOMPurify sanitization
  - Additional character filtering
- Output sanitization and escaping
- Rate limiting with visual meter
- Real-time audit logging
- Cognitive engine compatible output format
- Source filtering (all, messages, posts, manifestos, feedback)
- Query highlighting in results

## security layers
1. **Input Sanitization** - DOMPurify strips all HTML/JS
2. **Query Length Limit** - Max 256 characters
3. **Pattern Validation** - Blocks script tags, event handlers, eval, fetch, etc.
4. **Output Escaping** - All displayed content escaped
5. **Rate Limiting** - 10 requests per minute window
6. **Audit Trail** - All queries logged with timestamps

## forbidden patterns
- `<script`, `javascript:`, `data:`, `vbscript:`
- Event handlers (`on\w+=`)
- `eval()`, `expression()`, `url()`, `import()`, `fetch()`
- `XMLHttpRequest`, `__proto__`, template literals

## design
- IBM Plex Mono + IBM Plex Sans typography
- Dark command center aesthetic
- Cyan/green accent colors
- Real-time status indicators
- Sidebar with security panels

## data sources
- sloppygram_messages
- sloppygram_posts
- sloppygram_manifestos
- feedback

## logic core output format
```json
{
  "mode": "DETERMINISTIC",
  "confidence": 1.0,
  "variance": 0.0,
  "status": "VERIFIED",
  "lastQuery": "...",
  "resultCount": 0,
  "timestamp": "ISO8601"
}
```

## todos
- Add search history for session
- Add export results function
- Add keyboard shortcuts

## issues
- None yet
