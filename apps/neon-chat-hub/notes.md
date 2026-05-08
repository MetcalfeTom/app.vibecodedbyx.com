# neon-chat-hub

## log
- 2026-05-08: shipped — bring-your-own-key chat UI for **OpenRouter** + **NVIDIA NIM**. Both expose OpenAI-compatible `/chat/completions` endpoints with SSE streaming, so the same fetch + ReadableStream code path drives both. Keys live exclusively in `localStorage`; nothing else touches any other server.
  - **Two providers, two-button segmented switcher** at the top of the settings panel. Each provider has its own key slot in localStorage (`neon-chat-hub-or-key`, `neon-chat-hub-nv-key`), its own curated model menu, its own request URL, its own header set:
    - **OpenRouter** → `openrouter.ai/api/v1/chat/completions` with `Authorization: Bearer <key>` + the OR-recommended `HTTP-Referer` + `X-Title` so the app shows up correctly in their dashboard. Curated models include 3 free tagged with `:free` (Llama 3.2 3B, Llama 3.1 70B, Mistral 7B) plus paid GPT-4o · Claude 3.5 Sonnet · Gemini Flash · DeepSeek · Llama 405B.
    - **NVIDIA** → `integrate.api.nvidia.com/v1/chat/completions` with `Authorization: Bearer <key>` + `Accept: text/event-stream`. Curated NIM models: Llama 3.1 (8B / 70B / 405B), Mistral Large, Mixtral 8x22B, Nemotron-4 340B, Phi-3 Medium 128K, Gemma 2 27B.
  - **Curated dropdown + free-text override**: model select shows the per-provider list with friendly labels, but a sibling text input lets users paste any model id the provider supports. The free-text input wins when populated; persisted in localStorage so it survives reloads.
  - **Optional system prompt** — single-line text input fed in as a `{role:'system'}` message at the head of every request when non-empty. Persisted.
  - **Streaming SSE parser**: standard `data: {json}` line splitter with `[DONE]` terminator. Buffer-aware so chunks split mid-line don't drop tokens. `j.choices[0].delta.content` appended to the live assistant message; the visible body re-renders through `marked.parse` + `DOMPurify.sanitize` on every chunk so code blocks / lists / links / bold / italics / blockquotes render cleanly while the response streams in. Caret-blink `▍` after the role label during streaming.
  - **Stop button**: while streaming, the SEND button flips to a rose-tinted STOP that aborts the in-flight `AbortController`. Esc key also aborts. Aborted messages get a `_⏸ stopped_` italic suffix so users know it was their cancellation, not an error.
  - **Markdown rendering**: `marked@12.0.0` + `DOMPurify@3.0.6` from jsdelivr CDN. GFM enabled (`gfm: true, breaks: true`). Sanitizer allows `href`/`target`/`rel`/`class` only.
  - **Header pill bar**: 2 status pills — `provider · openrouter` + `key · ready/missing`. Both glow lime when configured, rose when missing. Send button auto-disables until the active provider has a key saved.
  - **Conversation memory**: full `state.history` array of `{role, content}` persists in localStorage capped at 80 messages so token budget stays sane. New chat = "✕ clear" button in the header (disabled mid-stream).
  - **Composer**: auto-growing textarea (max 14rem), Enter sends, Shift+Enter newline, Esc stops. Hint line below in mono small-caps explains the keys. Input refocuses after each send.
  - **Three message styles**: user (right-aligned, cyan-tinted glass card), assistant (left-aligned, magenta-violet glass), system (centered amber inline note for save/clear toasts) and error (centered rose for HTTP failures). Each has a tiny role label in IBM Plex Mono.
  - **Aesthetic**: deep navy `#06031a` bg with three radial glows (pink + cyan + violet), 46px subtle grid mask. Audiowide title with cyan `chat` accent. IBM Plex Sans body, IBM Plex Mono for labels + status. Glassmorphic panels with `backdrop-filter: blur(8px)`. Pink-magenta `▍` blinking caret during streaming.
  - **Privacy note** in settings: "keys are stored only in this browser's localStorage. they're sent directly to the provider over HTTPS — they never touch any other server."
  - **Accessibility**: rem units, `<header role="banner">`, semantic `<section>`s, `aria-label` on every input, `aria-pressed` on provider segmented buttons, `aria-live="polite"` on the chat region, `<kbd>` markup in the hint line, focus-visible cyan/lime outlines on every control, ≥2.4rem touch targets, skip link at top.

## issues
- OpenRouter free-tier keys still need a small payment / phone verification on signup; truly anonymous one-shot use isn't possible from either provider. App is honest about this in the settings notes (links to `openrouter.ai/keys` and `build.nvidia.com`).
- Some browsers don't expose `ReadableStream` on fetch responses — fallback parses the full JSON instead of streaming. Modern Chrome/Firefox/Safari all support streams.
- Token usage isn't surfaced — providers return it in the final SSE chunk, could display in a footer pill later.
- No "regenerate" button — workaround: clear last assistant message, hit send.
- No conversation export. localStorage holds it, so users can paste from DevTools if needed; could add a "↓ download chat as markdown" button.
- No multi-conversation tabs — single rolling history per browser. A future enhancement.

## todos
- Token usage pill in the header (read `usage` from final SSE chunk).
- Per-conversation tabs (sidebar with named threads).
- "↓ export markdown" / "↓ export json" buttons.
- Image attachment for vision models (encode to base64 data URL, send as multimodal content).
- Anthropic + OpenAI direct providers for users who already have native keys (skip OpenRouter middleman).
- Auto-fetch model list from OR's `/api/v1/models` on key save so the dropdown always reflects what's available.
- Slash commands (`/clear`, `/system "..."`, `/model gpt-4o`).
- Whisper/STT input via the Web Speech API on coarse-pointer devices.
