# fab-lab-atlas (Fab Lab Atlas — find the machines, learn them safely)

## log
- 2026-08-13: v1 per chat ("curated sample locations with source and last-updated labels, searchable map/list browsing, safe beginner guides for 3D printing, laser cutting, soldering") + follow-up ("beginner project library, focused verification"). Single file, Unbounded + Sometype Mono, blueprint-cobalt on warm paper.
  - **Curated sample, honestly labeled**: 12 famous Fab-Foundation-network labs (Vigyan Ashram — first lab outside MIT, MIT CBA, Barcelona/IAAC, Waag, Berlin, Lima, CEPT, Nairobi, Kamakura, Reykjavík, Torino, Santiago) with city-level coords and short editorial notes ONLY (no invented hours/addresses). EVERY card carries source ("Fab Foundation network — editorial sample") + last-updated ("2026-08 knowledge snapshot"); the data-note banner says no live lookups, verify before traveling.
  - **Browsing**: search across name/city/country/note (live filter, honest empty state); MAP tab reuses the repo's stylized landmass set (self-contained copy per convention) on blueprint cobalt — amber pins, click-to-select jumps to the list card; LIST with selection highlight.
  - **Safety-first guides** (accordion): 3D printing (nozzle temps, ventilation/ABS, watch first layers, bed-cool), laser cutting (the serious box: NEVER PVC/vinyl→chlorine gas, never unattended, extraction, induction-required; smell test tip), soldering (iron discipline, flux fume extraction, lead-free + handwashing, eye protection, heat-the-joint rhythm).
  - **Beginner project library**: 9 projects across the three skills (calibration companion → macropad), each with difficulty/time/what-you-learn + its own ⚠ safety note; skill filter chips.
  - Verified 18/18: 12 labs, provenance on every card, verify-before-traveling note, search (india→2, "first fab lab"→Vigyan, zzzz→honest empty), map land+pin pixels, pin-click selects Barcelona + highlights card, PVC/chlorine + never-unattended + fume-extractor/lead-free + temp/ventilation warnings all present, accordion aria-expanded, 9 projects all with safety notes, laser filter→3, four tabs, zero external links.

## issues
- The sample is 12 labs on purpose — chat may ask for "add my city"; additions should keep the same honesty (famous/verifiable, city-level, no hours).
- Map is the shared stylized landmass set — same "coastline pedant" caveat as Umbra.

## todos
- "Suggest a lab" form → Supabase (name+city only, moderated by being clearly user-submitted + labeled).
- Guide printables in the product-vault documentation style.
- Per-lab "what machines" chips (only where famously known).
