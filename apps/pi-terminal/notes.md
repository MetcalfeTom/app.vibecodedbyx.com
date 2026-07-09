# π TERMINAL — notes

## log
- 2026-07-09: v1 — continuous π streaming terminal (chat ask: green CRT, infinite scroll, gold birthday search). **The digits**: 1,000,000 TRUE decimals computed at build time via binary-splitting Chudnovsky in pure Python (~80s; needs sys.set_int_max_str_digits! math.isqrt for the √10005 term) → pi.txt (1MB, verified: leading 1415926535…, Feynman 999999 @ index 761). App fetches it at boot. **Stream**: rAF accumulator at 10–500 digits/s (slider), lines of 50 (5×10 groups) w/ dim right-aligned 1-based offsets, blinking block cursor mid-line, DOM capped 500 lines, auto-follow disengages when the user scrolls up (re-engages near bottom), pause/resume. **Birthday search**: date input → 6 patterns (DDMMYY/MMDDYY/YYMMDD/DDMMYYYY/MMDDYYYY/YYYYMMDD, deduped) via indexOf over the megastring; result chips = gold ★ hits (click → INSPECT MODE: window of ±8 lines rendered w/ the match wrapped in <mark> — placeholder-char trick handles group-boundary spans — scrolled to center, stream frozen) or dim not-in-the-first-million; all six missing → "too legendary" line. RESUME LIVE FEED re-renders the tail + resumes. Live-stream banner if a birthday pattern flows past naturally. **CRT**: radial phosphor bulb, 3px scanlines (multiply), vignette, green glow text-shadows, gold glow for marks; Major Mono Display + VT323. Verified: loads 1M, streams from pos 0 w/ correct first line, 1999-09-09 → YYMMDD hit @ 670,872 → gold mark + inspect + resume grows pos again; zero errors.

## issues
- pi.txt is 1MB raw (gzips ~470KB); if the host doesn't gzip, first load is chunky but cached.
- Only first occurrence per format is linked (indexOf) — add find-all if chat asks.
- 8-digit formats usually miss in 1M digits (expected: ~10% each) — the misses are shown honestly.

## todos
- Find-all occurrences, arbitrary-string search box, "π day mode", digit statistics panel (frequency histogram), sound-of-π (map digits to notes).
