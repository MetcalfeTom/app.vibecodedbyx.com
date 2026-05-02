# yt-transcript

## log
- 2026-05-02: Created. **YouTube URL → transcript with clickable timeline next to the video.** Single HTML file. **Flow**: paste URL → parse video ID via 4 regex patterns (`youtu.be/ID`, `?v=ID`, `embed/ID`, `shorts/ID`, plus bare 11-char ID) → render iframe player + try fetching captions. **Caption fetch** routes through 3 fallback CORS proxies (corsproxy.io, allorigins.win, video.google.com via corsproxy) since `youtube.com/api/timedtext` doesn't allow direct browser CORS. Returns XML which we parse via DOMParser into `{start, dur, text}` segments. Each segment renders as a clickable row in the timeline panel: terra-deep timestamp pill + Newsreader italic text. Clicking a row sends a `postMessage` `{event:'command', func:'seekTo', args:[t,true]}` to the YouTube iframe (uses the official YT IFrame API protocol since the iframe has `enablejsapi=1` in its src) → video jumps. **Demo button** loads a hand-crafted 10-line transcript for "Me at the zoo" (jNQXAC9IVRw) so users can preview the layout instantly without depending on flaky proxies. **Search/filter input** above the timeline does case-insensitive substring match with `<mark>`-highlighted hits. **Copy** button writes `[mm:ss] text` lines to clipboard; **Download** button creates a `transcript-VIDEOID.txt` blob and triggers a save. **Aesthetic**: editorial cookbook — cream paper bg with 7°/97° fiber grain via repeating-linear-gradient + multiply blend, terracotta `#c4624a` accent, IBM Plex Mono UI + Newsreader italic transcript text + Fraunces italic display title `YT *Transcript*`. Two-column layout (1.4:1 video:transcript) with 8px golden-ratio drop shadows. Single-column stack at 880px. Pollinations OG, ▶️ favicon.

## issues
- CORS proxies are public + flaky — they go down, rate-limit, or refuse certain endpoints. The `<select>` of three is best-effort; if all fail the user sees an error and can fall back to the demo.
- Auto-generated captions aren't fetched — only manual `lang=en` captions. Adding `&kind=asr` might pick up more, but the format differs.
- Non-English videos default to English captions which may not exist. A language selector would help.
- The `seekTo` postMessage works but Chrome sometimes throttles cross-origin postMessages for backgrounded iframes. If the video is paused / unfocused first, the seek may not trigger until the player gains focus.
- No transcript persistence — close the tab and the loaded transcript is gone.
- No support for VTT / SRT export (just plain text).

## todos
- Language selector dropdown (try `lang=es`, `lang=fr` etc.).
- Auto-generated caption fallback (`&kind=asr`).
- Persist last-loaded video + transcript in localStorage.
- Export as SRT / VTT for editing in subtitle tools.
- Speaker diarization (split lines by speaker if metadata is present).
- AI summary button (Pollinations text endpoint → bullet summary of the transcript).
- Better empty state when proxies fail — explain CORS issue + suggest copy-paste from YT description.
- Show video title + channel name in the meta strip (would require oEmbed fetch, also CORS-bound).
