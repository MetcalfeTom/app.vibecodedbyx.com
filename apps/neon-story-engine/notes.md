# neon-story-engine

## log
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
