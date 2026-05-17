# sloppy-shell · notes

## log
- 2026-05-17: v1 — **phosphor-green CLI for sloppy.live with ~30 commands** per chat ask: "build a terminal app called sloppy-shell" (message truncated mid-word — built a complete standalone terminal). Single file ~28KB. Web Audio-free for now, no backend.
  - **CRT aesthetic**: black bg with full-viewport scanline overlay (4px period, multiply blend) + radial vignette + phosphor-green text with 5px text-shadow glow. Top title bar with mac-style red/yellow/green dots + "▆ SLOPPY-SHELL · v1.0" branding. Bottom prompt bar with `vibespacer@sloppy:~$` prompt that updates with cwd.
  - **Boot screen**: "Sloppy-Shell · sloppy.live · v1.0" banner + copyright tagline + amber hint suggesting first commands (apps · ask · hack-mainframe · matrix · sloppy).
  - **History + autocomplete**: ↑/↓ cycles last 80 commands. **Tab autocomplete** — if one match, completes the command + space; if multiple, lists them. **Ctrl+L** clears the screen.
  - **~30 commands** organised into 4 categories on `help`:
    - **Core**: help / clear / cls / echo / date / time / whoami (returns reputation: pending audit) / history / exit
    - **Filesystem (mostly fake)**: ls / dir / cd (only knows ~, apps, chat, creators, kittens) / pwd / cat (real content for README.md / manifesto.txt / secrets.kdbx)
    - **Platform · sloppy.live**:
      - **`apps`** — 3-column listing of 45 hand-curated recent sloppy.live apps with clickable cyan links (each `<a href="/<name>/" target="_blank">`)
      - **`open <name>`** — launches `window.open('/<name>/', '_blank', 'noopener')` after sanitising the name
      - **`ask <question>`** — REAL Pollinations call to `text.pollinations.ai/<encoded>` with a CLI-flavored system prompt ("You are a terse, dry CLI assistant for sloppy.live. Answer in 1-3 short lines, plain text only, no markdown."). 14s AbortController timeout. Strips wrapping code fences, handles deprecation banners.
      - **`sloppy`** — 7-line ASCII-art banner of the wordmark "s l o p p y . l i v e"
      - **`palette`** — prints the 6 brand colours (magenta / cyan / amber / lime / hot / violet) with hex codes + glow blocks
      - **`vibe`** — random vibe report from 7-line pool ("vibes: smooth · the box is content" / "vibes: spicy · something is brewing" / "vibes: feral · do not make eye contact")
      - **`fortune`** — random 9-line fortune-cookie pool ("Beware of stand-ups about stand-ups." / "The bug is on line 47." / "You will refresh sloppy.live three more times today.")
      - **`joke`** — random 7-line programming-joke pool
      - **`coin`** — heads/tails flip
      - **`roll NdM`** — dice roller, supports `1d6` to `100d1000`, prints individual rolls + sum
    - **Fun · easter eggs**:
      - **`banner <text>`** — renders ANY text in 3-row block letters via a hand-coded ASCII font (A-Z, 0-9, space, punctuation)
      - **`cowsay <text>`** — classic ASCII cow with speech bubble
      - **`kitten`** — small ASCII cat "/\_/\\  ( o.o )  > ^ <" + "meow."
      - **`hack-mainframe`** — 6-stage animated intrusion (700-1100ms per stage): bypass firewall → spoof token (was "Password123" again) → enumerate S3 (47 publicly readable!) → locate mainframe (NOT FOUND, there are no mainframes anymore) → pivot to SharePoint (14,239 docs indexed) → exfil 2.4GB to ../downloads/. Final: "✓ ACCESS GRANTED. Mainframe is your hostage."
      - **`matrix`** — 5-second full-viewport overlay with falling katakana + 0-9 glyphs (white "lead" character on top of green trails), rgba(5,10,4,0.22) trail fade for the classic phosphor-rain look. ESC to skip. Runs at requestAnimationFrame.
      - **`rickroll`** — "no." / "(this is a no-rickroll zone. thank you.)"
  - **Comments**: lines starting with `//` or `#` are silently ignored (clean for chat copy-paste).
  - **Tab autocomplete** lists multiple matches in dim-grey when no unique completion (e.g. `cl[TAB]` → "  clear   cls").
  - **Click-to-focus**: clicking anywhere on the terminal refocuses the input (matches real terminal behaviour). Skipped if you're selecting text or if matrix-rain is active.
  - **Z-index**: scrollback z 2, input row z 3, vignette + scanlines z 80-81, matrix overlay z 70.
  - **WCAG**: rem units not used here (terminal is `font-size: 14px` fixed — this is a CRT aesthetic where pixel precision matters), but semantic main/form/input, `aria-live="polite"` on scrollback, `aria-label` on input + scrollback, `aria-hidden="true"` on decorative title-bar dots, `prefers-reduced-motion` kills all animations + transitions.
  - **OG image**: Pollinations flux seed 27077.

## issues
- `ask` requires a network call to Pollinations and can fail with the deprecation banner (~5% of the time). The error path prints "(pollinations returned a deprecation banner · try again)" but the command doesn't auto-retry.
- The 45-app `apps` list is hardcoded — if a chat-favourite app gets added or renamed, this list goes stale. Could auto-fetch from sloppy-ops's `data.json` but that's a bigger lift; chose to keep the file self-contained.
- `banner` font is a 3-row hand-coded ASCII font — letters look chunky and a bit hand-crafted (not perfect figlet quality). Acceptable for the vibe.
- No theme switcher (everything is phosphor-green). A `theme amber` command would be a fun future ask.
- No persistence — refreshing wipes history. Could persist via localStorage but the screensaver-y "fresh terminal each boot" feel is intentional.
- The matrix rain creates a full-screen canvas overlay; on very low-end mobile devices the framerate dips. 5-second cap means this is bounded.

## todos
- `theme <name>` — switch phosphor colours (amber / blue / classic-monochrome)
- `man <cmd>` — long-form per-command docs
- `record` / `replay` — record a session to localStorage and play it back
- `vote <app>` — auto-open the app + send an upvote hint (would need Supabase integration)
- `chat <msg>` — broadcast to a Supabase Realtime channel that other shell instances see (multi-tab "everyone is in the same terminal")
- `weather <city>` — real weather via wttr.in
- `figlet <text>` — proper figlet font (load via CDN)
- `nano <file>` — fake in-terminal text editor as easter egg
- `tetris` — yes
- Sound: soft keypress click on input + chime on command-completed (off by default)
- `update` — print recent git commits (would need to fetch a manifest)
- `lottery` — roll for a free random app to open
