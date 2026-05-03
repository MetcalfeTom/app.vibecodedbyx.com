# app-gallery-search

## log
- 2026-05-03: shipped — searchable catalogue of all 1029 vibespace apps.
  - **Manifest**: a Node script scans `apps/`, reads each `index.html`, extracts `<title>` + `<meta name="description">` + `<meta property="og:image">`, plus the file's mtime. Writes `apps/app-gallery-search/manifest.json` (~170KB). Screenshot field prefers `/screenshots/<slug>.jpg` if it exists, falls back to the og:image url.
  - **Search**: text input matches case-insensitively against slug, title, and description. Debounced 60ms. URL syncs to `?q=<term>` so searches are shareable.
  - **Match scoring**: exact slug match > slug startsWith > slug includes > title includes > description includes. Recency adds a tiny tiebreak. So `?q=fish` floats slug-named apps to the top, then title hits, then descriptions.
  - **Highlight**: matched substring wrapped in `<mark>` (gold highlight) inside title/description/slug. Regex special chars escaped.
  - **Sort cycler**: button cycles RECENT → A → Z → Z → A. Defaults to RECENT (manifest's mtime sort).
  - **Filter pill**: "WITH IMAGE" toggle — `aria-pressed` true narrows results to apps with a real screenshot file.
  - **Card grid**: responsive `repeat(auto-fill, minmax(15rem, 1fr))`, 2-col on phones. Each card = 16:9 thumbnail + Newsreader title + 2-line clamped Plex Sans description + Plex Mono slug. Lazy-loaded screenshots; first letter of title rendered as a colored fallback (HSL hashed from slug) shows behind any failed/missing image.
  - **Card hover**: lifts 2px and snaps a 6px tomato shadow (no shadow at rest).
  - **Page virtualization**: renders 60 cards per page, infinite-scrolls via IntersectionObserver with 600px rootMargin so loading feels seamless. Manual LOAD MORE button as fallback. Avoids dumping 1029 DOM nodes at once.
  - **Keyboard**: `/` from anywhere focuses the search box. `Esc` clears the search.
  - **Aesthetic**: cream paper bg with multiplied paper-fiber grain + radial corner glows (warm museum catalogue feel). Newsreader 500 italic title with tomato accent; IBM Plex Sans body; IBM Plex Mono mono. Two-color shadow palette (ink + tomato). Magnifier glyph (⌕) in front of search input.
  - **Accessibility**: rem units throughout, 44px+ button targets, semantic header/main/section, aria-live grid, aria-pressed on filter button, focus-visible outlines, skip-link to results, search input has hidden label, prefers-reduced-motion kills hover transforms.

## issues
- Manifest is a frozen snapshot — new apps added after this commit don't appear until someone regenerates manifest.json. Regen one-liner is in this notes file under "todos" for future-me.
- Full title/description embedded in the JSON means search is purely client-side string matching (no fuzzy/typo tolerance). Could swap in a tiny FlexSearch instance later if chat asks.
- 1029 cards × 1 lazy-load image each = ~1029 image requests if user scrolls through everything. Browser handles it but it's not free. Could add explicit virtualization (only DOM-mount visible cards) if perf complaints arrive.
- Cards link via target="_blank" — opens each app in a new tab. If chat prefers same-tab navigation we can flip this.
- Screenshot fallback uses the first letter of the title. For apps whose title starts with "The" or punctuation it can look funny.

## todos
- Regenerate manifest after a batch of new apps. One-liner from project root:
  ```sh
  node --input-type=module -e "import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'fs'; import { join } from 'path'; const out=[]; for (const n of readdirSync('apps')) { const i=join('apps',n,'index.html'); if(!existsSync(i)) continue; const h=readFileSync(i,'utf8'); const t=h.match(/<title>([^<]+)<\/title>/i); const d=h.match(/<meta\s+name=[\"']description[\"']\s+content=[\"']([^\"']+)[\"']/i); const og=h.match(/<meta\s+property=[\"']og:image[\"']\s+content=[\"']([^\"']+)[\"']/i); const s=existsSync(join('screenshots',n+'.jpg'))?'/screenshots/'+n+'.jpg':(og?og[1]:null); out.push({slug:n,title:(t?t[1].trim():n).slice(0,90),description:(d?d[1].trim():'').slice(0,240),screenshot:s,mtime:statSync(i).mtimeMs}); } out.sort((a,b)=>b.mtime-a.mtime); writeFileSync('apps/app-gallery-search/manifest.json',JSON.stringify(out));"
  ```
- Add tag-based filtering — parse a `<meta name="keywords">` if present, or curated tags in a separate JSON.
- "Random" button that picks a single app and opens it.
- Wire to Supabase: track which apps the user has visited (per session) and surface a "you haven't tried these" view.
- Color-by-vibe: cluster by the dominant CSS variable hue across each app's index.html.
