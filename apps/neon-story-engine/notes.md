# neon-story-engine

## log
- 2026-05-08: **Reasoning-model awareness — minimax/deepseek-r1/qwq/o1-style support** (chat ask: "apply those reasoning-field fixes to neon-story-engine too, so hexz_cracker can use minimax"). Same root cause as the neon-chat-hub fix shipped minutes earlier: reasoning models emit chain-of-thought via `message.reasoning_content` (some providers) or `message.reasoning` (OpenRouter) and leave `message.content` blank when `max_tokens` runs out mid-think (`finish_reason: "length"`). New `extractAssistantText(j, label)` helper used by both `pollPost` (Pollinations) and `openrouterCall` (OpenRouter) — prefers `message.content`, falls back to `message.reasoning_content || message.reasoning` if content is empty (the reasoning field often contains the literal JSON the Director was about to emit, and our 4-stage parseDirectorJson can usually extract the fields anyway), and `console.warn`s a diagnostic with `finish_reason` + length / raw envelope so chat can paste from DevTools. Default `max_tokens` raised everywhere to give reasoning models headroom — Director 360 → 2048, Narrator 220 → 1500, NPC Voice 140 → 1200, pollPost default 320 → 1024. Per-agent `timeout` raised to 60000ms for the same reason (chain-of-thought is slow). For non-reasoning models this all costs nothing — they hit `finish_reason: "stop"` long before the new ceiling. hexz_cracker can now paste a minimax model id (e.g. `minimax/minimax-01`) into the BYOK custom-model field and the engine will surface either real content OR the reasoning-field fallback rather than dying silently.
- 2026-05-08: **OpenRouter BYOK backend** (chat ask: hexz_cracker, plus follow-up: "make the OpenRouter model ID fully customizable"). All three LLM calls (Director / Narrator / NPC Voice) now route through a single `llmPost(messages, opts)` dispatcher that picks between `pollPost` (default, free, no key) and `openrouterCall` based on `state.backend`. New `openrouterCall(messages, opts)` posts the same OpenAI-compatible payload to `openrouter.ai/api/v1/chat/completions` with `Authorization: Bearer <key>` + `HTTP-Referer: https://sloppy.live/neon-story-engine` + `X-Title: neon-story-engine` headers; preserves `response_format: { type: 'json_object' }` for Director calls so JSON-mode still works and the existing 4-stage parser + stripPreamble + 1-retry layer still kicks in on top. 30s timeout (vs 18s on pollinations) since OR routes through more hops. **GET fallback path skipped** for OpenRouter — its only path is POST, and we surface the actual HTTP error verbatim (e.g. `openrouter http 401 · ...`) so a missing/bad key shows up as a readable system message in the story stream rather than a generic timeout. New header pill `BACKEND · pollinations` / `BACKEND · openrouter · gpt-4o-mini` (lime border when on OR) toggles a backend-settings popover with: 2-button segmented switcher (pollinations · free / openrouter · BYOK with `aria-pressed`), masked password key input, **two model fields** — a curated dropdown (9 models: 3 free Llama/Mistral, GPT-4o + 4o-mini, Claude 3.5 Sonnet + 3 Haiku, Gemini 1.5 Flash, DeepSeek Chat) AND a free-text custom-override input where the user can paste ANY OpenRouter model id (e.g. `qwen/qwen-2.5-72b-instruct`, `nvidia/nemotron-70b`); custom field wins when populated, dropdown changes are ignored while custom is set. Persisted to `neon-story-engine-backend` / `neon-story-engine-or-key` / `neon-story-engine-or-model`. Panel closes on Escape, on outside click, and on the explicit close button. Privacy note links to `openrouter.ai/keys` for key acquisition.
- 2026-05-08: shipped — multi-agent text adventure orchestrator. 4 cooperating agents (Director · Memory · Narrator · NPC Voice) drive procedural storytelling through Pollinations text API. No keys, no signup, state in your browser.

## architecture
**Pipeline per turn:**
```
input → DIRECTOR (json, low-temp) → MEMORY (pure JS) → NARRATOR (prose, high-temp) → NPC VOICE (optional)
```

**Why split:**
- **Director** runs at temp 0.35 with `response_format: { type: 'json_object' }` — outputs strict JSON `{ outcome, changes, brief, npc_speaks? }`. Reliable state mutations require deterministic structure; mixing prose + JSON in one prompt breaks both.
- **Memory** is pure JS — no LLM call. Single writer pattern: it's the only function that mutates `state.world`. Eliminates race conditions and gives a clean place to validate deltas.
- **Narrator** runs at temp 0.95 with a genre-tinted system prompt — pure prose, 2-4 sentences, sensory, never breaks tone. Gets the Director's brief + post-mutation world state.
- **NPC Voice** only fires when the Director flagged `npc_speaks` with `{name, line_brief}`. Generates dialogue only — no narration, no stage direction. Persona pulled from `world.cast[name]`.

**State (single source of truth):**
```js
state.world = {
  location: string,
  inventory: string[],
  cast:     { name → persona },     // open-vocabulary
  flags:    { key → value },        // open-vocabulary
  time:     string,
  turns:    int,
}
```
- Director reads full world, returns only a `changes` delta.
- Memory applies delta in `runMemory(world, changes)`.
- Narrator + NPC Voice read post-mutation world, never write.
- Bounded JSON delta = trivial to validate + reject garbage. Open-vocabulary `cast` and `flags` mean the Director can introduce new NPCs and story flags without a schema migration.
- Full world + last 28 story turns snapshot to `localStorage['neon-story-engine-state-v1']` after every turn → reloads resume the adventure exactly.

## features
- **4 settings** with distinct genre tones, opening prose, and seed inventories:
  - **Cinder Halls** — dark fantasy dungeon (cobblestone, sigils, gloam)
  - **Neo-Kyoto 2099** — cyberpunk noir (rain, holos, chrome, syndicates)
  - **The Whispering Below** — restrained cosmic horror (brine, fathom, hush)
  - **Velvet Underwood** — Victorian gothic noir (gaslight, fog, alibis)
- **Live agent status rail**: 4 agents (Director · Memory · Narrator · NPC Voice) each with 4 LEDs that pulse cyan during work, lock lime when done, and flash rose on error. NPC Voice greys out when not invoked. Visible pipeline = visible architecture.
- **State inspector** sidebar: live readout of location / inventory / cast / flags / time / turns. Cast members hover-show their persona. Tags color-coded by type.
- **Pollinations transport**: POST `text.pollinations.ai/openai` with `Content-Type: text/plain` to skip CORS preflight, GET fallback to `text.pollinations.ai/<urlencoded prompt>` if POST fails (skipped for JSON-mode calls since GET can't enforce response format). 18s POST timeout, 12s GET fallback timeout via AbortController.
- **Director JSON parser** is defensive: strips code-fence wrappers, finds first `{...}` block, normalises missing fields with sensible defaults so a partial parse still drives a viable turn.
- **Narrator prose cleaner** strips "Sure! / Here's / Narrative:" preambles + leading/trailing quotes that some models add even when told not to.
- **Conversation context**: Narrator gets the last 3 turns plus the current world state so it can callback to recent events naturally (consistent imagery, character recognition).
- **Dark neon aesthetic**: deep navy bg with pink + cyan + violet radial glows + 46px grid mask. Audiowide title with cyan `story` accent. Newsreader italic for narrative prose, IBM Plex Mono for system text + agent labels. Magenta-bordered NPC dialogue blocks with mono-cap "X SPEAKS" labels.
- **Composer**: monospace input (so it feels like terminal commands), Enter sends, Shift+Enter newline, auto-resizes up to 7rem.
- **Restart**: "↺ new tale" button in the header asks confirmation before wiping state and returning to the setting-picker overlay.
- **Accessibility**: rem units, `<header role=banner>`, `<aside>` for state, semantic `<section>` for story, `aria-live="polite"` on the story (off on agent rail since LED pulses spam), `aria-label` on every input, focus-visible cyan/lime outlines, ≥2.4rem touch targets, skip link, `prefers-reduced-motion` no-ops the LED roll animation.

- 2026-05-08: **Refactored fetch path to strip yappy preambles + auto-retry** (chat ask: model is prefixing JSON with "Sure thing!" and other conversational fluff). Three-prong fix:
  1. **Hardened Director system prompt** — moved a five-rule "CRITICAL OUTPUT RULES" block to the TOP of the prompt and repeated the same instruction at the BOTTOM so it bookends everything else. Rules call out specific banned phrases ("Sure thing!", "Here's the JSON:", "Certainly,", "Of course!", "Let me…"), forbid markdown fences, forbid trailing prose, and tell the model the parser will reject violations.
  2. **`stripPreamble(text)` at fetch boundary**: regex chain strips conversational openings (`/^\s*(sure|certainly|of course|absolutely|got it|okay|alright|noted)[,!.]?\s*/i`, `/^\s*(here'?s|here is)\s+(the|your)?\s*(json|response|output|reply|result)?[,:.]?\s*/i`, `/^\s*(let me|i'?ll|i will|i can|i'm)\s+[^{[\n]+?[.:]\s*/i`, `/^\s*(response|json|output|result|reply)[\s:]*[:\-]?\s*/i`, plus `/^\s*```[a-z]*\s*/`), strips conversational closers ("Let me know if…", "Hope this helps!", "Feel free…", trailing fences), runs the chain up to 6 times so stacked preambles ("Sure! Sure thing! Here is the JSON:") all get peeled, and as a final safety net jumps to the first `{` or `[` if any remains within 400 chars. Verified all 10 worst-case yappy inputs clean to pure JSON via `node` — Stage 1 `JSON.parse` catches them all on the happy path now, no fallback stages needed.
  3. **`pollJSON(messages, opts, parser)` wrapper with auto-retry**: combines `pollPost` + `stripPreamble` + the parser into one fetch path. On parse failure, appends the model's bad reply to the conversation + a sterner follow-up message (`"That wasn't parseable JSON. Reply with ONLY the JSON object — no preamble like 'Sure thing!'…"`) and tries one more time. The model gets to see its own mistake which dramatically improves second-attempt compliance. After 2 attempts, console.warn dumps the last error + a 240-char raw sample for chat to paste from DevTools.
  - **runDirector** now routes through `pollJSON(messages, opts, parseDirectorJson)` so the existing 4-stage robust parser is still the safety net AFTER the new strip+retry layer. The only place fetch JSON happens flows through the same code now — clean single boundary.
- 2026-05-08: **Hardened Director JSON parser** (chat ask: more robust against model preamble / formatting errors). Replaced the single-pass `JSON.parse` with a 4-stage progressively-lenient pipeline:
  1. **Raw**: `JSON.parse` straight off the response (handles well-behaved models).
  2. **Fenced**: strip every ` ```json … ``` ` and ` ``` ` block, parse again.
  3. **Block + repair**: brace-balanced scan (`findBalancedJsonBlock`) extracts the first complete `{…}` accounting for nested braces and string-literal escapes; if that still won't parse, run `repairJson` over it (smart-quote normalisation, `//` + `/* */` comment stripping, single→double-quote conversion, unquoted-key quoting, trailing-comma removal) and parse again.
  4. **Regex extract**: last-resort field-by-field scrape of `outcome`, `brief`, `changes.{location, inventory_add[], inventory_remove[]}`, and `npc_speaks.{name, line_brief}` so a partly-truncated response still drives a viable turn.
  - **Diagnostics**: the FIRST parse error is captured into a closure variable and dumped via `console.warn` with a 240-char sample if the parser ever gives up entirely or has to fall through to regex extract. Lets chat paste a quick diagnostic from DevTools without the parser spamming the console on the happy path.
  - **`normaliseDirector`** is now a separate function the parser hands off to. Type-checks every field it cares about, drops malformed values with `delete`, ensures arrays are arrays and objects are objects, coerces `npc_speaks` to a clean `{name, line_brief}` shape or null.
  - Verified all 10 sanity cases via `node`: happy path → raw, preamble + postamble → block, code-fenced → fenced, trailing comma / unquoted keys / single quotes → repaired, line-comment-prefixed → block, nested objects → raw, truncated → correctly rejected (would land in regex stage in the real engine).

## issues
- Pollinations occasionally returns malformed JSON or empty content — Director call falls back to a system error message in the story stream rather than crashing the whole turn. Memory + Narrator are skipped in that case so the world stays consistent.
- The Narrator can ignore the no-dialogue rule on rare occasions and slip a quoted line into the prose; the NPC Voice agent runs separately so dialogue still gets its own block when properly flagged. Trade-off of LLM compliance.
- 4 agents in series ≈ 2 LLM calls per turn (Director + Narrator) plus a 3rd if NPC Voice fires → ~5-12s end-to-end depending on Pollinations latency. Could parallelize Narrator + NPC Voice since they only depend on the post-Memory state, not on each other.
- No multi-character party — single PoV protagonist by design. Could add a `players[]` array in state if chat ever asks.
- World state grows unboundedly (cast + flags accumulate). For long adventures this could bloat the prompt context. A future pass could prune old inactive cast members.

## todos
- Optional **Editor** agent (5th agent): post-Narrator consistency check that verifies the prose doesn't contradict established facts (inventory references, character locations). Returns `{ok, fix?}`.
- Parallelise Narrator + NPC Voice (`Promise.all`) since neither depends on the other.
- Conversation export: dump the full story + final world state as a markdown file.
- Image generation per turn via Pollinations image API for a "scene illustration" panel.
- Save slots — multiple named adventures.
- Streaming Narrator output for that classic typewriter feel.
- Voice mode — Web Speech API reads the narrator's prose aloud per turn.
