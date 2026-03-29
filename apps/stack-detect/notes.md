# Stack Detect

## log
- 2026-03-29: V1 — Website framework/library analyzer. Paste HTML source to detect tech stack. 70+ detection rules across 10 categories: Frameworks (React, Vue, Angular, Svelte, Next, Nuxt, Astro, htmx, etc.), CSS (Tailwind, Bootstrap, Material UI, etc.), Libraries (jQuery, D3, Three.js, GSAP, Supabase, Firebase, etc.), Build tools (Vite, Webpack, Parcel), Platforms (WordPress, Shopify, Webflow, Wix), Analytics (GA, GTM, Hotjar, Sentry), CDN, Hosting, Meta (OG, JSON-LD, PWA), Fonts. Auto-analyze on paste. Demo buttons for this page and sloppy.live homepage. IBM Plex Mono + Newsreader typography, teal-on-dark terminal aesthetic.

## features
- 70+ regex-based detection rules
- 10 categories: Framework, CSS, Library, Build, Platform, Analytics, CDN, Hosting, Meta, Fonts
- Auto-analyze on paste
- Demo button (analyze this page)
- Try sloppy.live button (fetches homepage via XHR)
- Confidence levels (high/med/low) per detection
- Color-coded tags per technology

## issues
- None currently

## todos
- Add URL input that fetches via a CORS proxy
- Detect specific versions from script src URLs
- Add meta tag quality score
- Add performance hints based on detected stack
- Export report

## notes
- Detection is purely client-side regex matching on pasted HTML
- Cannot fetch arbitrary URLs due to CORS — user must paste source
- sloppy.live homepage works because same-origin XHR
- Patterns target script src URLs, CDN paths, class names, data attributes, global variable names
