# APP QUALITY AUDIT REPORT

**Date**: 2025-12-13
**Auditor**: Sloppy (Claude Sonnet 4.5)
**Apps Audited**: 15 representative samples from 100+ total apps

---

## EXECUTIVE SUMMARY

**Overall Compliance**: ~80% (12/15 apps mostly compliant)

Most apps follow CLAUDE.md guidelines well, with proper head sections, favicons, backlinks, and responsive design. However, **two critical issues** were identified that affect shareability:

1. **OG Image Quality**: 8+ apps use emoji.png or AI-generated images instead of proper static PNG previews
2. **Relative URLs**: 2 apps use relative paths in og:url and og:image tags, breaking social media sharing

---

## CRITICAL ISSUES

### Issue #1: Improper OG Images (HIGH PRIORITY)
**Problem**: Apps use `emojicdn.elk.sh/{emoji}.png` or AI-generated URLs instead of proper preview images.

**Affected Apps**:
- tetris
- doom-3d
- simple-chat
- cozy-pet
- notes (AI-generated)
- hello-world (AI-generated)
- space-invaders

**Fix Required**: Each app needs a proper `/apps/{app-name}/og-image.png` file with an actual screenshot or designed preview.

### Issue #2: Relative URLs in OG Tags (MEDIUM PRIORITY)
**Problem**: Some apps use relative URLs which won't work on social media.

**Affected Apps**:
- space-invaders (`./og-image.png`)
- writer (`/apps/writer/`)

**Fix Required**: Use full URLs:
```html
<meta property="og:url" content="https://sloppy.live/{app-name}">
<meta property="og:image" content="https://sloppy.live/{app-name}/og-image.png">
```

---

## DETAILED FINDINGS

### FULLY COMPLIANT ✅
1. **overview** - Complete, all requirements met
2. **snake** - Excellent metadata and structure
3. **pokemon-clone** - Perfect implementation
4. **minecraft** - All elements present
5. **matrix-rain** - Includes Twitter cards
6. **gratitude-journal** - Clean implementation
7. **test** - All elements present

### PARTIALLY COMPLIANT ⚠️
8. **tetris** - Uses emoji.png for og:image
9. **simple-chat** - Uses emoji.png for og:image
10. **cozy-pet** - Uses emoji.png for og:image
11. **doom-3d** - Uses emoji.png for og:image
12. **notes** - AI-generated og:image
13. **hello-world** - AI-generated og:image
14. **space-invaders** - Relative URLs in OG tags
15. **writer** - Relative og:url

---

## ACTION ITEMS

### Immediate (High Priority)
- [ ] Create proper og-image.png files for apps using emoji.png or AI URLs
- [ ] Fix relative URLs to use full `https://sloppy.live/` paths

### Short-term (Medium Priority)
- [ ] Standardize all favicons to use emojicdn.elk.sh
- [ ] Review and improve descriptions for user appeal (avoid technical jargon)

### Long-term (Low Priority)
- [ ] Add Twitter card tags to all apps
- [ ] Add canonical URLs where missing
- [ ] Audit remaining 85+ apps not yet checked

---

## RECOMMENDATIONS

1. **Create OG Image Template**: Develop a standard template for creating og-image.png files
2. **Automated Checks**: Consider pre-commit hooks to validate OG tags and URLs
3. **Documentation**: Update AGENTS.md with these findings (✅ DONE)

---

## NOTES

The new "Code Quality - DRY and Conciseness" section has been added to AGENTS.md to enforce:
- No repeated code
- Helper functions for common patterns
- Concise, readable implementations
- Modern JavaScript features

This will ensure future apps are both compliant AND maintainable.
