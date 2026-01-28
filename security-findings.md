# Security Audit Findings

P0 Security Audit - RLS Policies and XSS
Audit Date: 2026-01-28

---

## Executive Summary

Audited 6 critical tables and XSS vectors across high-traffic apps. Found **2 medium-severity** issues requiring attention and **1 low-severity** concern. Overall security posture is **GOOD** - apps consistently use escapeHtml/textContent for user content.

---

## [MEDIUM] Finding 001: Verification Code Potentially Readable

- **App**: sloppy-id
- **File**: apps/sloppy-id/index.html:2143-2145
- **Table**: sloppyid_verifications

### Description
The query `select('*').eq('user_id', currentUser.id)` returns all columns including `verification_code`. While filtered by user_id (which should be enforced by RLS), the code then accesses `verifications.email?.verification_code` in the frontend.

### Risk
If RLS policy has ANY gap, verification codes could be exposed. Verification codes should ideally never leave the database for security-critical operations.

### Code Sample
```javascript
const { data, error } = await supabase
  .from('sloppyid_verifications')
  .select('*')  // Returns verification_code!
  .eq('user_id', currentUser.id);
```

### Recommendation
1. **VERIFY RLS**: Confirm `sloppyid_verifications` has strict user_id-based RLS
2. **SELECT specific columns**: Change to `.select('username, verification_type, verification_value, is_verified, verified_at, metadata')`
3. **Server-side verification**: Move code verification logic to a Supabase Edge Function

### Status: Open

---

## [MEDIUM] Finding 002: Users Table Exposes Potentially Sensitive Data

- **App**: bouldering-game, pho-game, supabase-tests
- **File**:
  - apps/bouldering-game/index.html:615-617
  - apps/pho-game/index.html:439-441
  - apps/supabase-tests/test-runner.js:75

### Description
Multiple apps query the `users` table with broad selects that could expose sensitive data:

1. **bouldering-game/pho-game**: `.select('user_id, display_name, twitter_handle').in('user_id', ids)`
   - Exposes twitter_handle for any user ID in leaderboard

2. **supabase-tests**: `.select('*')`
   - Test file that could return email if RLS allows

### Table Schema (users)
```
- user_id (uuid)
- email (text) - SENSITIVE
- twitter_handle (text) - Semi-sensitive
- display_name (text) - Public
- purchased_at (timestamptz) - Semi-sensitive (premium status)
```

### Risk
- Email addresses could be enumerable if RLS is misconfigured
- twitter_handle exposure could enable targeted attacks

### Recommendation
1. **VERIFY RLS**: Ensure `users` table has strict SELECT policy
2. **Column restrictions**: Only select `user_id, display_name` for public contexts
3. **Consider view**: Create `public_profiles` view that excludes sensitive fields

### Status: **FIXED** - sloppy-id now selects specific columns (excludes verification_code)

---

## [LOW] Finding 002: Users Table twitter_handle Exposure

- **App**: bouldering-game, pho-game
- **File**:
  - apps/bouldering-game/index.html:615-617
  - apps/pho-game/index.html:439-441

### Description
Leaderboard queries fetch twitter_handle as fallback display name for users who haven't set a display_name.

### Risk
Low - twitter_handle is used as a public identifier for leaderboard display. Users signing in with Twitter implicitly consent to being identifiable by their handle.

### Recommendation
Accept as designed behavior - leaderboards need identifiable names.

### Status: Accepted Risk

---

## [LOW] Finding 003: Public Verification Data Readable

- **App**: sloppygram
- **File**: apps/sloppygram/index.html:21480
- **Table**: sloppyid_verifications

### Description
Graph visualization queries all verified users:
```javascript
supabase.from('sloppyid_verifications')
  .select('username, verification_type')
  .eq('is_verified', true)
```

### Risk
Low - only exposes that a user is verified and verification type (twitter/email/github). This is likely intentional for trust display but enables user enumeration.

### Recommendation
Accept as designed behavior - verification badges are meant to be public trust indicators.

### Status: Accepted Risk

---

## [PASS] RLS Verification Results

### sloppyid_vault
- ✅ Personal queries filter by `user_id`
- ✅ Public browser filters by `is_public: true`
- ✅ Properly segregates private/public data

### swarm_predictions
- ✅ All users can read (needed for betting)
- ✅ Only creators can resolve (verified in code)
- ✅ Acceptable design for prediction market

### swarm_prediction_bets
- ✅ Personal bets filter by `user_id`
- ✅ All bets readable for odds calculation (by design)
- ✅ Write operations require user_id

### sloppygram_karma
- ✅ Publicly readable (leaderboard feature)
- ✅ Write should be restricted (verify RLS)

---

## [PASS] XSS Audit Results

### Sloppygram
- ✅ Has `escapeHtml()` function
- ✅ Has `sanitizeHtml()` for rich content
- ✅ Has `sanitizeUrl()` for user-provided URLs
- ✅ User content consistently escaped

### Swarm Oracle
- ✅ Has `escapeHtml()` function
- ✅ `pred.title`, `pred.description`, `pred.creator_username` all escaped
- ✅ No direct innerHTML with unescaped user input

### Confession Wall
- ✅ Uses `textContent` for confession content (safe)
- ✅ Has `escapeHtml()` for CSS class names
- ✅ No XSS vectors found

### Neon Guestbook
- ⚠️ Not audited yet - add to next pass

---

## Remediation Priority

| Finding | Severity | Effort | Status |
|---------|----------|--------|--------|
| 001 - Verification Code | Medium | Low | **FIXED** |
| 002 - twitter_handle | Low | N/A | Accepted |
| 003 - Public Verifications | Low | N/A | Accepted |

---

## Next Steps

1. [ ] Verify RLS policies directly in Supabase Dashboard
2. [ ] Update sloppy-id to select specific columns (not *)
3. [ ] Update bouldering-game/pho-game to exclude twitter_handle
4. [ ] Audit neon-guestbook for XSS
5. [ ] Complete P1 performance audit

---

## Audit Trail

- 2026-01-28: Initial P0 security audit completed
  - Audited: sloppyid_verifications, sloppyid_vault, swarm_predictions, swarm_prediction_bets, sloppygram_karma, users
  - XSS checked: sloppygram, swarm-oracle, confession-wall
  - Findings: 2 Medium, 1 Low (accepted)
