# UCMJ Translator

## log
- 2026-01-04: MAJOR UPDATE - Expanded to all 146 UCMJ articles with JSON chunking
- 2026-01-04: Added historical case examples for key articles
- 2026-01-04: Initial creation - UCMJ translation tool with 6 languages

## features
- Complete UCMJ - all 146 articles with full translations
- 6 languages: English, Spanish, German, French, Korean, Arabic
- Search/filter functionality
- Expandable article cards
- Copy to clipboard for translations
- Professional military-themed UI
- Legal disclaimer included
- Mobile responsive
- Historical case examples for major articles

## architecture
Data split into JSON chunks for performance:
- data/articles-1-35.json (Jurisdiction, Apprehension, Non-Judicial Punishment)
- data/articles-36-76.json (Trial Procedure, Sentences, Post-Trial Review)
- data/articles-77-110.json (Punitive Articles Part 1)
- data/articles-111-146.json (Punitive Articles Part 2, Miscellaneous)

## article sections
- Articles 1-6: General Provisions (jurisdiction, definitions)
- Articles 7-14: Apprehension and Restraint
- Article 15: Non-Judicial Punishment
- Articles 16-35: Pre-Trial Procedures
- Articles 36-54: Trial Procedure
- Articles 55-58: Sentences
- Articles 59-76: Post-Trial Review and Appeal
- Articles 77-134: Punitive Articles (military offenses and crimes)
- Articles 135-146: Miscellaneous Provisions

## languages
- English (Original) 🇺🇸
- Spanish 🇪🇸
- German 🇩🇪
- French 🇫🇷
- Korean 🇰🇷
- Arabic 🇸🇦

## design
- IBM Plex Sans/Mono fonts
- Dark theme with blue accents
- Military olive green accent color
- Clean, professional appearance
- Accessible card-based layout

## technical
- Pure HTML/CSS/JavaScript
- Async JSON loading for articles
- No external dependencies (except fonts)
- Client-side search filtering
- Expandable/collapsible article cards
- Clipboard API for copy function

## disclaimer
Unofficial translations for educational purposes only.
Not legally binding - consult JAG for official matters.

## issues
- None yet

## todos
- Add print functionality
- Add PDF export
- Add audio pronunciation
- Add legal term glossary
- Add article cross-references
- Add section filtering by category
