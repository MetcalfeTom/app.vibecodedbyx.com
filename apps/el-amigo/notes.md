# El Amigo

## log
- 2026-04-18: Created. Spanish-only chat companion. Uses Pollinations AI (text.pollinations.ai/openai chat endpoint with SYSTEM_PROMPT enforcing Spanish-only; falls back to the simple GET endpoint; if both fail or return the deprecation banner, uses a local phrase pool of greetings/jokes/refranes/palabras/tips/generic). Drift guard: detects English common words + missing Spanish markers, swaps to local fallback. Typewriter reveal, typing indicator, 6 suggestion chips in Spanish, clear button. Abril Fatface + Lora + Space Mono typography, terracotta/marigold/jade Mexican-Spanish palette with talavera-stripe top border.

## issues
- Pollinations text API currently returns a deprecation banner for server-IP requests; the app detects this via `badResponse()` and falls back to local phrases. Browser requests from real visitors usually still work.
- Local fallback pool is small; repeated identical questions will show repetition.
- No persistence — chat resets on reload (intentional).
- Drift guard is heuristic — might occasionally flag legitimate mixed-language jokes.

## todos
- Move to new pollinations endpoint (enter.pollinations.ai) if auth works
- Save conversation to localStorage (optional)
- Voice output via SpeechSynthesis es-ES / es-MX
- Daily "palabra del día" on open
- Regional mode toggle (México / España / Argentina) shaping slang

## design
- Palette: paper #fdf4e3, terra #c94a2b, marigold #f2a104, jade #2e6f40, ink #2a1a12
- Typography: Abril Fatface (display), Lora (body), Space Mono (labels)
- Tile border at top cycles 5 colors; hot pepper 🌶️ avatar
