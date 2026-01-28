# Sloppy.live Security Audit Plan

Red teaming assessment for the sloppy.live ecosystem. This document outlines vulnerability categories, attack vectors, and remediation priorities.

## Executive Summary

The ecosystem consists of 458+ static HTML apps with shared Supabase backend infrastructure. Primary attack surface includes:
- Client-side JavaScript with exposed API keys
- Row-Level Security (RLS) policies on shared tables
- User-generated content across multiple apps
- Real-time subscription channels

---

## 1. Authentication & Session Security

### 1.1 Attack Vectors
| Vector | Risk | Apps Affected |
|--------|------|---------------|
| Anonymous auth abuse | Medium | All apps using anon auth |
| Session token exposure | High | Apps storing tokens in localStorage |
| OAuth redirect manipulation | Medium | SloppyID, Sloppygram |
| Session fixation | Low | Apps without proper session rotation |

### 1.2 Audit Tasks
- [ ] Review anonymous auth rate limits in Supabase
- [ ] Check for session token leakage in console logs
- [ ] Verify OAuth callback URL validation
- [ ] Test session expiration handling
- [ ] Audit `supabase-config.js` exposure across apps

### 1.3 Key Files to Review
```
/vibespace/supabase-config.js
/vibespace/apps/sloppy-id/index.html (lines 1295-1310)
/vibespace/apps/sloppygram/index.html (auth section)
```

---

## 2. Database & RLS Policy Audit

### 2.1 Critical Tables
| Table | Sensitivity | RLS Status |
|-------|-------------|------------|
| `users` | HIGH | Verify policies |
| `sloppygram_profiles` | Medium | Check read permissions |
| `sloppyid_verifications` | HIGH | Verify user_id enforcement |
| `swarm_predictions` | Medium | Check creator permissions |
| `swarm_prediction_bets` | HIGH | Verify bet ownership |
| `sloppygram_karma` | Medium | Audit write permissions |

### 2.2 Audit Tasks
- [ ] Test RLS bypass via direct API calls
- [ ] Verify `user_id` enforcement on all INSERT operations
- [ ] Check for SELECT policies exposing sensitive data
- [ ] Test UPDATE/DELETE permissions for owned vs. non-owned rows
- [ ] Audit JSONB columns for injection patterns

### 2.3 Test Cases
```javascript
// Test: Can user A read user B's private vault entries?
supabase.from('sloppyid_vault')
  .select('*')
  .eq('is_public', false)
  .neq('user_id', currentUser.id)

// Test: Can user modify another's bet?
supabase.from('swarm_prediction_bets')
  .update({ karma_amount: 9999 })
  .eq('bet_id', 'other-users-bet-id')

// Test: Can anon user create predictions?
supabase.from('swarm_predictions')
  .insert({ title: 'test', user_id: null })
```

---

## 3. Cross-Site Scripting (XSS) Audit

### 3.1 High-Risk Input Points
| App | Input | Sanitization |
|-----|-------|--------------|
| Sloppygram | Post content, comments | Check escapeHtml() |
| Swarm Oracle | Prediction title/description | Check escapeHtml() |
| SloppyID | Vault key/value pairs | Check escapeHtml() |
| Confession Wall | User confessions | Verify sanitization |
| Neon Guestbook | Guestbook entries | Verify sanitization |

### 3.2 Audit Tasks
- [ ] Test all `innerHTML` assignments for unescaped user input
- [ ] Check template literals for injection points
- [ ] Verify `escapeHtml()` covers all special characters
- [ ] Test markdown/rich text renderers for XSS
- [ ] Audit real-time subscription handlers for XSS

### 3.3 Payload Tests
```javascript
// Basic XSS
<script>alert('xss')</script>

// Event handler
<img src=x onerror="alert('xss')">

// Template literal escape
${alert('xss')}

// Unicode bypass
<script>alert\u0028'xss'\u0029</script>
```

---

## 4. API Key & Secret Exposure

### 4.1 Current Status
- Supabase anon key: **Intentionally exposed** (public by design)
- Service role key: Should **never** appear in frontend code
- Third-party API keys: Audit needed

### 4.2 Audit Tasks
- [ ] Grep entire codebase for potential secrets
- [ ] Verify no service_role keys in any HTML/JS
- [ ] Check for hardcoded credentials in comments
- [ ] Audit environment variable references
- [ ] Review OG image URLs for leaked tokens

### 4.3 Search Patterns
```bash
# Run in /vibespace
grep -r "service_role" apps/
grep -r "sk_live" apps/
grep -r "api_key" apps/
grep -r "secret" apps/ --include="*.html" --include="*.js"
grep -r "password" apps/
```

---

## 5. Input Validation & Injection

### 5.1 Injection Vectors
| Type | Risk | Check Points |
|------|------|--------------|
| SQL Injection | Low (Supabase ORM) | Raw query usage |
| NoSQL/JSONB Injection | Medium | JSONB operators |
| Command Injection | N/A | No server-side execution |
| Path Traversal | Low | File references |

### 5.2 Audit Tasks
- [ ] Search for `.rpc()` calls with user input
- [ ] Check JSONB column queries for operator injection
- [ ] Verify URL parameter sanitization
- [ ] Test file upload endpoints (if any)

---

## 6. Real-time Subscription Security

### 6.1 Risk Assessment
Supabase real-time channels can leak data if not properly configured.

### 6.2 Audit Tasks
- [ ] Verify subscription filters respect RLS
- [ ] Check for broadcast channels leaking private data
- [ ] Test presence channels for user enumeration
- [ ] Audit channel naming for predictability

---

## 7. Client-Side Logic Vulnerabilities

### 7.1 Trust Boundary Issues
| Issue | Apps | Impact |
|-------|------|--------|
| Client-side karma calculation | Swarm Oracle | Score manipulation |
| Client-side vote counting | Swarm Nexus | Vote manipulation |
| Local storage trust | Multiple | Data tampering |

### 7.2 Audit Tasks
- [ ] Identify calculations that should be server-side
- [ ] Check for client-side authorization bypasses
- [ ] Verify critical operations have server validation
- [ ] Test localStorage/sessionStorage manipulation

---

## 8. Denial of Service Vectors

### 8.1 Resource Exhaustion
| Vector | Target | Mitigation |
|--------|--------|------------|
| Rapid account creation | Anonymous auth | Rate limiting |
| Large payload submissions | Posts, predictions | Size limits |
| Subscription flooding | Real-time channels | Connection limits |
| Image generation abuse | Pollinations API | Referrer checks |

### 8.2 Audit Tasks
- [ ] Test rate limits on all write operations
- [ ] Check payload size limits
- [ ] Verify real-time connection limits
- [ ] Test recursive/infinite loop potential

---

## 9. Third-Party Dependencies

### 9.1 CDN Dependencies
| Library | Source | Version Pinned? |
|---------|--------|-----------------|
| Supabase JS | cdn.jsdelivr.net | Check |
| Google Fonts | fonts.googleapis.com | N/A |
| Three.js | cdn.jsdelivr.net | Check |
| Various game libs | Multiple CDNs | Audit |

### 9.2 Audit Tasks
- [ ] Inventory all CDN dependencies
- [ ] Check for version pinning (avoid @latest)
- [ ] Verify CDN integrity (SRI hashes)
- [ ] Assess supply chain risk

---

## 10. Privacy & Data Exposure

### 10.1 Data Leakage Points
- User IDs in public queries
- Username enumeration via search
- Verification status exposure
- Karma scores public by design (acceptable)

### 10.2 Audit Tasks
- [ ] Review what user data is publicly queryable
- [ ] Check for PII in console logs
- [ ] Verify email/identity data protection
- [ ] Audit public vault browser scope

---

## Priority Matrix

| Priority | Category | Effort | Impact |
|----------|----------|--------|--------|
| P0 | RLS Policy Bypass | Medium | Critical |
| P0 | XSS in User Content | Low | High |
| P1 | Secret Exposure | Low | Critical |
| P1 | Session Security | Medium | High |
| P2 | Input Validation | Medium | Medium |
| P2 | Rate Limiting | Medium | Medium |
| P3 | Dependency Audit | High | Medium |
| P3 | Privacy Review | Medium | Low |

---

## Recommended Tools

```bash
# Static analysis
grep -r "innerHTML" apps/ --include="*.html"
grep -r "eval(" apps/ --include="*.html"
grep -r ".rpc(" apps/ --include="*.html"

# Browser DevTools
# - Network tab: Monitor API calls
# - Console: Check for leaked data
# - Application: Inspect storage

# Supabase Dashboard
# - Check RLS policies directly
# - Review table permissions
# - Monitor real-time connections
```

---

## Execution Timeline

1. **Week 1**: RLS policy audit + secret scanning
2. **Week 2**: XSS audit across high-traffic apps
3. **Week 3**: Auth flow testing + session security
4. **Week 4**: Input validation + rate limiting
5. **Ongoing**: Dependency monitoring + new app reviews

---

## Reporting

Document findings in `/vibespace/security-findings.md` with format:
```markdown
## [SEVERITY] Finding Title
- **App**: affected-app
- **File**: path/to/file.html:line
- **Description**: What the vulnerability is
- **Reproduction**: Steps to reproduce
- **Remediation**: How to fix
- **Status**: Open/Fixed/Accepted Risk
```

---

---

# Part II: Performance Optimization Audit

## 11. Frontend Performance

### 11.1 Critical Metrics
| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | Audit |
| Time to Interactive | < 3s | Audit |
| Largest Contentful Paint | < 2.5s | Audit |
| Cumulative Layout Shift | < 0.1 | Audit |

### 11.2 Audit Tasks
- [ ] Run Lighthouse on top 10 apps
- [ ] Identify render-blocking resources
- [ ] Check for layout shifts on load
- [ ] Audit image loading strategies
- [ ] Test on mobile network throttling

### 11.3 Common Issues to Check
```javascript
// Font loading optimization
// Bad: blocking render
<link href="fonts.googleapis.com/..." rel="stylesheet">

// Good: non-blocking
<link href="fonts.googleapis.com/..." rel="stylesheet" media="print" onload="this.media='all'">
```

---

## 12. JavaScript Bundle Analysis

### 12.1 Audit Tasks
- [ ] Identify apps with excessive inline JS (>50KB)
- [ ] Check for duplicate library loads
- [ ] Audit unused code in large apps
- [ ] Verify async/defer on script tags
- [ ] Check for synchronous API calls blocking render

### 12.2 Heavy Apps to Prioritize
| App | Estimated Size | Priority |
|-----|----------------|----------|
| Sloppygram | Large | P0 |
| Swarm Nexus | Large | P0 |
| SloppyID | Medium | P1 |
| App Taxonomist | Medium | P1 |

### 12.3 Optimization Patterns
```html
<!-- Defer non-critical scripts -->
<script src="..." defer></script>

<!-- Lazy load below-fold content -->
<img loading="lazy" src="...">

<!-- Preconnect to API endpoints -->
<link rel="preconnect" href="https://gfzaoppypyaatzglamjv.supabase.co">
```

---

## 13. Database Query Optimization

### 13.1 Query Patterns to Audit
| Pattern | Risk | Apps |
|---------|------|------|
| SELECT * | High | All apps |
| Missing indexes | Medium | High-traffic tables |
| N+1 queries | High | List views |
| Unbounded queries | High | Feeds, leaderboards |

### 13.2 Audit Tasks
- [ ] Add LIMIT to all feed queries
- [ ] Select only needed columns
- [ ] Check for compound index opportunities
- [ ] Profile slow queries in Supabase dashboard
- [ ] Implement pagination where missing

### 13.3 Query Improvements
```javascript
// Bad: fetches all columns
const { data } = await supabase.from('sloppygram_posts').select('*')

// Good: fetch only needed columns with limit
const { data } = await supabase
  .from('sloppygram_posts')
  .select('post_id, content, username, created_at')
  .order('created_at', { ascending: false })
  .limit(20)
```

---

## 14. Caching Strategy

### 14.1 Current State
Most apps fetch fresh data on every load with no caching layer.

### 14.2 Opportunities
| Data Type | Cache Strategy | TTL |
|-----------|----------------|-----|
| User profile | sessionStorage | Session |
| Karma scores | Memory + periodic refresh | 60s |
| App directory | localStorage | 1 hour |
| Static content | Service Worker | 24 hours |

### 14.3 Implementation Tasks
- [ ] Add sessionStorage caching for user data
- [ ] Implement stale-while-revalidate for feeds
- [ ] Cache app taxonomist data locally
- [ ] Add ETag support for static assets

---

## 15. Real-time Subscription Efficiency

### 15.1 Audit Tasks
- [ ] Identify redundant subscriptions
- [ ] Check for subscription cleanup on unmount
- [ ] Verify filter specificity (avoid broad channels)
- [ ] Monitor connection count in Supabase

### 15.2 Optimization Pattern
```javascript
// Bad: subscribe to all changes
supabase.channel('all-posts').on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, ...)

// Good: subscribe to specific filter
supabase.channel('user-posts').on('postgres_changes', {
  event: 'INSERT',
  schema: 'public',
  table: 'posts',
  filter: `user_id=eq.${currentUser.id}`
}, ...)
```

---

## 16. Image & Asset Optimization

### 16.1 Audit Tasks
- [ ] Check OG images are optimized (< 200KB)
- [ ] Verify image dimensions match display size
- [ ] Audit Pollinations API usage for caching
- [ ] Check for missing width/height attributes
- [ ] Implement lazy loading on image-heavy apps

### 16.2 Apps with Heavy Assets
- SloppyFM (audio visualization)
- Generative Art apps
- Game apps with sprites
- Gallery/portfolio apps

---

## 17. Mobile Performance

### 17.1 Audit Tasks
- [ ] Test touch responsiveness
- [ ] Check viewport meta tags
- [ ] Verify no horizontal scroll
- [ ] Test with 3G throttling
- [ ] Audit canvas/WebGL performance on mobile

### 17.2 Critical Mobile Apps
| App | Mobile Usage | Priority |
|-----|--------------|----------|
| Sloppygram | High | P0 |
| Swarm Oracle | Medium | P1 |
| Games | High | P1 |

---

## 18. Memory Management

### 18.1 Leak Patterns to Check
- Event listeners not removed
- setInterval not cleared
- WebSocket connections not closed
- Canvas contexts not released
- Large arrays accumulating

### 18.2 Audit Tasks
- [ ] Profile memory in long-running apps
- [ ] Check for detached DOM nodes
- [ ] Verify cleanup in SPA-like apps
- [ ] Test real-time apps for memory growth

---

## Performance Execution Timeline

1. **Phase 1**: Lighthouse audit on top 10 apps
2. **Phase 2**: Database query optimization
3. **Phase 3**: JavaScript bundle reduction
4. **Phase 4**: Caching implementation
5. **Phase 5**: Mobile optimization pass

---

## Combined Priority Matrix

| Priority | Category | Type | Effort | Impact |
|----------|----------|------|--------|--------|
| P0 | RLS Policy Bypass | Security | Medium | Critical |
| P0 | Query Optimization | Performance | Low | High |
| P0 | XSS in User Content | Security | Low | High |
| P1 | Secret Exposure | Security | Low | Critical |
| P1 | JS Bundle Size | Performance | Medium | High |
| P1 | Session Security | Security | Medium | High |
| P2 | Caching Strategy | Performance | Medium | Medium |
| P2 | Input Validation | Security | Medium | Medium |
| P2 | Image Optimization | Performance | Low | Medium |
| P3 | Mobile Performance | Performance | High | Medium |
| P3 | Dependency Audit | Security | High | Medium |

---

## Success Metrics

### Security
- Zero critical vulnerabilities
- All RLS policies verified
- No XSS in user-generated content
- Session handling audit complete

### Performance
- Top 10 apps < 3s TTI on mobile 3G
- Database queries < 100ms p95
- No memory leaks in 30-min sessions
- Lighthouse scores > 80 for critical apps

---

*This plan should be reviewed and updated as the ecosystem evolves.*
