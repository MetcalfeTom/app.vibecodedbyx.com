# tool-forge

## log
- 2026-05-09: shipped — workbench for designing + validating JSON-Schema tool definitions for AI agents (chat ask: "create the Tool Forge app to help design and test structured JSON schemas for agentic tools"). Two-pane layout: left side = tool editor (name + description + parameters), right side = the four feedback loops you actually need (agent preview, sample-input validation, lint, multi-format export).
  - **Tool editor**: name + description fields, parameter cards with name + type + required toggle + description + per-type extras (string: enum/format/pattern/minLength/maxLength; number/integer: minimum/maximum/enum; array: items.type). Parameters can be added, removed, reordered by removing + re-adding.
  - **Agent Preview**: live JSON-Schema render in the exact `{name, description, input_schema}` shape Anthropic + most other agent platforms consume. Updated on every keystroke. Custom in-house JSON tokenizer color-codes keys (cyan), strings (gold), numbers (acid), booleans (magenta), so the schema reads like a real syntax-highlighted editor without bringing in highlight.js.
  - **Test Input → Validation**: paste sample arguments as JSON, see ✓ green "VALID" or ✕ red error list with each failure pinned to a JSON path (`$.params[2].name`). Powered by an in-file JSON-Schema validator (~80 LOC) that handles type / required / enum / properties / items / minimum-maximum / minLength-maxLength / pattern / format (email/uri/date/date-time/uuid). No external Ajv dep — keeps the app self-contained + auditable.
  - **Quality Checks (Lint)**: heuristic warnings learned from real "tool call went wrong" debugging:
    - name missing / non-snake-case → fail/warn
    - description empty / under 50 chars / under 120 chars → fail/warn/ok
    - 0 parameters → warn (some tools genuinely take none, but verify)
    - per-parameter: missing description, very short description, non-snake-case name
    - enum with single value (should be a default), array without items.type
    - duplicate parameter names (silently overwritten in the schema)
  - **Export tabs** (5 formats):
    - **Anthropic** — wraps the schema in `[{name, description, input_schema}]` for `tools=[...]`
    - **OpenAI** — repackages as `{type:"function", function:{name, description, parameters}}`, the function-calling shape
    - **TypeScript** — `Anthropic.Tool` typed const + import line
    - **Python** — anthropic SDK dict (replaces `true/false/null` with `True/False/None`) + a sample `client.messages.create()` call
    - **cURL** — POST to `https://api.anthropic.com/v1/messages` with the tool registered, properly shell-quoted (single-quotes within the body escape via `'\''`)
  - **Templates**: `get_weather`, `read_file`, `send_email`, `sql_query` — each one shows a reasonable description length, mixed required/optional params, enum + range constraints. Loading a template auto-populates a sample test-input JSON object that satisfies all required params.
  - **Aesthetic**: deep purple radial bg, Audiowide title "tool · forge" with cyan dot + magenta forge, Cormorant Garamond italic tagline. JetBrains Mono everywhere for code/forms. Press Start 2P for tiny meta labels. Cyan / violet / magenta / gold / acid palette.
  - **Accessibility**: rem units, semantic main/header/section, role/aria on the export tab toolbar, aria-pressed on req-toggle pills + tabs, aria-label on every input/select/textarea, focus-visible outlines (cyan), 2.75rem (44px) min interactive targets, skip link, prefers-reduced-motion kills the toast transition.

## issues
- The built-in JSON-Schema validator implements just enough of 2020-12 for tool inputs: no `$ref`, `allOf`, `oneOf`, `anyOf`, `not`, `if/then/else`, `definitions`, `unevaluatedProperties`. Tool input schemas almost never use those — keeps the dependency footprint zero. If a user pastes a schema from a giant API spec, advanced constructs are silently ignored.
- Object-type parameters fall back to `additionalProperties: true` with no nested-schema editor. Most tool inputs are flat. A nested-property builder would be V2.
- Templates are baked-in static. A "save my own templates to localStorage" button would be a nice next step.
- Export-curl shell-quoting is correct on bash + zsh but doesn't cover fish or PowerShell. The body is JSON so it stays valid even if quoting is off.

## todos
- Save/load custom tool definitions to localStorage with a name/slug.
- Import an existing JSON schema and reverse-engineer the param cards.
- Side-by-side "before vs after" diff so a user editing a description can see exactly what the model gains/loses.
- "Realistic agent prompt" preview that wraps the tool in a sample system prompt + user message + simulated tool_use response.
- A side panel that lists ALL tools you've designed in this session and lets you batch-export the array.
- Schema linter rule: verify `pattern` regex compiles (currently fails at validation time only).

## design-notes
The app deliberately mirrors the "rich post-action feedback" framing from the chat thread that led to it: every edit triggers the four feedback channels (preview / validation / lint / export) on the same screen, so the user can see consequences instantly instead of compiling-and-testing. That's the property I argued makes tools useful for agents — and a tool-design tool gets to model it directly.
