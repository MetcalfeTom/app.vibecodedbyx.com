# Live Security Scanner

A real-time security scanner that fetches and scans apps for exposed credentials and secrets.

## Log
- 2026-01-28: Initial creation
  - Live scanning via fetch() of app HTML files
  - 18 detection patterns for various credential types
  - Real-time progress tracking
  - Severity filtering (Critical/High/Medium)
  - Redacted display of found secrets

## Features
- Live scanning of apps via HTTP fetch
- Detection patterns for:
  - Supabase/JWT tokens
  - AWS access keys and secrets
  - OpenAI API keys
  - Stripe API keys
  - GitHub tokens
  - Slack/Discord tokens
  - Google API keys
  - Firebase configs
  - Database connection strings
  - Private keys
  - Basic/Bearer auth headers
  - Generic API keys and secrets
- Real-time progress bar
- Scan log with timestamps
- Severity-based filtering
- Automatic secret redaction in display
- Stop/resume scanning

## Detection Patterns

| Pattern | Severity | Example |
|---------|----------|---------|
| Supabase JWT | Critical | eyJhbGciOiJIUzI1NiIs... |
| AWS Access Key | Critical | AKIA... |
| OpenAI Key | Critical | sk-... |
| Stripe Key | Critical | sk_live_... |
| GitHub Token | Critical | ghp_... |
| Private Key | Critical | -----BEGIN PRIVATE KEY----- |
| Supabase URL | High | https://xxx.supabase.co |
| Database URL | High | postgres://user:pass@host |
| Google API Key | High | AIza... |
| Slack Token | High | xoxb-... |
| Bearer Token | High | Authorization: Bearer ... |
| Firebase Config | Medium | firebaseConfig: { apiKey: ... } |

## Todos
- Add more apps to scan list
- Export findings as JSON/CSV
- Add pattern exclusions for false positives
- Historical scan comparison
- Webhook notifications for critical findings

## Issues
- CORS may block some app fetches from different origins
- Only scans index.html, not nested JS files
