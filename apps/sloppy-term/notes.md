# sloppy-term

## log
- 2026-04-30: Created. **Single-file CRT-themed web terminal emulator.** Sandboxed, no real shell — fake filesystem in a flat `FS` map keyed by absolute path, each entry `{type:'dir'|'file', body, locked?}`. Resolution helper handles `..` / `.` / relative paths. Boot sequence: BIOS POST → cpu/memory/network/vibes checks → mount → `/etc/motd` print, all on absolute timeouts so the cadence is consistent. **Commands** (~20): help, clear, echo, whoami, date, uname (-a aware), pwd, cd, ls (color-coded: dirs cyan, locked-files crit-red), cat (refuses dirs + locked), history, theme (phosphor/amber/cyan/pink/mono — persisted to localStorage), motd, banner (3-row block-letter ASCII font built from box-drawing chars), fortune (10 vibespace one-liners), cowsay, neofetch (ascii logo + system fingerprint w/ uptime, theme, deviceMemory), apps (linked list of vibespace apps that opens in new tab), goto (sanitized → `window.open('/<name>/')`), sudo (joke), exit (joke), about, ai (real bridge to pollinations text API w/ a brief-witty system-prompt). **History**: ↑/↓ navigation, persisted to localStorage at 200-entry cap. **Tab-complete**: completes commands on first token, file/dir names on subsequent tokens, prints all candidates + auto-fills longest-common-prefix when ambiguous. **Ctrl+L** clears, **Ctrl+C** abandons the current line. **Filesystem seed**: `/home/sloppy/{readme.txt, todo.md, secrets.txt (locked), ascii.txt, projects/vibespace.md}` + `/etc/motd` + `/etc/hostname`. **Aesthetic**: CRT phosphor on near-black `#050609`, VT323 for output (chunky terminal feel), Share Tech Mono for the title (with rare `glitch` keyframe rgb-split), Space Mono for the prompt accent. Body has fixed-position scanline overlay (`repeating-linear-gradient` at 1px/3px, `multiply` blend) + radial vignette darkening the corners. Cursor is a 10x18 phosphor block with `cursorBlink` keyframe + glow shadow. Every text class has matching glow shadow tied to its phosphor variable. Themes flip the `--phosphor` CSS var via `[data-theme="..."]` on `<html>`; old default is preserved when unset. Mobile: 18px font + tighter title spacing. Pollinations OG image (CRT terminal scene).

## issues
- The `ai` command goes through `https://text.pollinations.ai/<prompt>?referrer=sloppy.live` — slow first response (cold-cache), ~1-3s on subsequent. No streaming. Could swap to SSE if pollinations adds it.
- Tab-complete doesn't yet support `~` as a shorthand for `/home/sloppy`. cd takes it as a literal.
- localStorage history cap is 200, but each entry is unbounded length — a malicious paste could blow the quota. Practically fine for vibespace.
- The fake FS is in-memory; nothing the user does (touch, write) actually persists. Could add a `write <file>` command that mirrors to localStorage.
- `cowsay` and `banner` use unicode box-drawing chars — render fine in VT323, may look slightly off in fallback fonts.
- Ctrl+C as `^C` line-abandon doesn't interrupt async commands (e.g., a slow ai call). Low priority.

## todos
- `top` command that pipes from sloppy.live's data.json (would need fetch + parse → mini-table render).
- `chat <msg>` to broadcast to a Supabase realtime channel and let other terminal viewers see each other typing.
- `figlet` proper banner (full ASCII font set, larger).
- `wget <url>` that just fetches text and pipes into screen.
- `man <cmd>` for a longer description per command.
- `tetris` / `snake` mini-game easter egg.
- Persist the cwd across reloads.
- Auto-greet by username if logged-in supabase session is present (cross-app vibe).
