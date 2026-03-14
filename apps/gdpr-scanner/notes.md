# GDPR Scanner

Scan any website for basic GDPR compliance issues and get actionable fix tips.

## log
- 2026-03-14: Initial build. Client-side GDPR compliance checker. 10 checks across 4 categories (Consent, Legal, Tracking, Security): cookie consent banner, privacy policy link, third-party trackers (GA, FB, Hotjar, etc.), HTTPS, contact/DPO info, terms of service, form consent elements, social media embeds, mixed content, data retention language. Fetches page via CORS proxies (allorigins, corsproxy.io), falls back to URL-only analysis with notice. Weighted scoring (high=15, medium=10, low=5 points), percentage score with grade badges. Expandable check cards with severity tags and actionable fix tips. IBM Plex Sans + IBM Plex Mono typography, dark professional dashboard aesthetic.

## issues
- CORS proxies may be unreliable or slow — graceful fallback to URL-only checks
- Surface-level HTML pattern matching only — cannot detect dynamically loaded consent tools or server-side headers
- Not legal advice — disclaimer included

## todos
- Check for CSP/security headers (would need server-side)
- Detect cookie categories (essential vs marketing)
- Export report as PDF
- History of previous scans in localStorage

## notes
- No database — pure frontend
- CORS proxies: allorigins (primary), corsproxy.io (fallback), 8s timeout each
- 10 checks, 4 categories: Consent (2), Legal (3), Tracking (2), Security (2), Legal again (1 — data retention)
- Score weights: high severity = 15pts, medium = 10pts, low = 5pts
- Regex-based detection — checks for known tracker domains, consent tool names, legal page references
