# ai-slop-generator · notes

## log
- 2026-05-17: v1 — **over-saturated AI-flavoured motivational posters that mean nothing, pumped out on demand** per chat ask: "create an app called ai-slop-generator that pumps out meaningless, over-saturated motivational posters." Single file ~30KB. Pollinations stock-photo backgrounds + procedural slogans + canvas-rendered PNG export.
  - **Slogan generator** — 14 sentence patterns mixed with 4 word pools:
    - **VERBS** (30): HUSTLE / GRIND / MANIFEST / ELEVATE / PIVOT / OPTIMIZE / DOMINATE / CONQUER / IGNITE / UNLEASH / AMPLIFY / SCALE / DELIVER / EXECUTE / SHIP / MONETISE / NETWORK / ITERATE / DISRUPT / CRUSH / SHATTER / BUILD / BREAK / AWAKEN / OUT-WORK / OUT-LEARN / LEVERAGE / SYNTHESISE / OPERATIONALISE / PROTOTYPE
    - **NOUNS** (37): SYNERGY / GRINDSET / EMPIRE / DREAMS / FAILURE / SUCCESS / VISION / PIVOT / BANDWIDTH / EXCELLENCE / MEDIOCRITY / VALUE-ADD / RUNWAY / PIPELINE / MOMENTUM / GREATNESS / EXCUSES / COMFORT-ZONE / MEETINGS / WINNERS / LIONS / WOLVES / GLASS-CEILING / LIMITS / COMPETITION / GOALPOSTS / BOXES / IMPOSSIBLE / MORNINGS / MONDAYS / BLOCKCHAINS / LANES / UPSIDE / MOAT / TRACTION / OUTLIERS / PIVOTS
    - **ADJS** (10): 7-FIGURE / NEXT-LEVEL / FOUNDER-MODE / UNCOPYABLE / MULTI-HYPHENATE / POSTHUMOUS / UNHINGED / RECESSION-PROOF / VERTICALLY-INTEGRATED / UN-NERFED
    - **Patterns**: `[VERB] YOUR [NOUN]` / `[NOUN] IS THE [NOUN] OF [NOUN]` / `DON'T [VERB] — [VERB]` / `[NOUN] BUILDS [NOUN]` / `[VERB] LIKE A [singularised NOUN]` / `EVERY [NOUN] IS A [NOUN]` / `BE THE [NOUN] YOU [VERB]` / `[VERB]. [VERB]. [VERB].` / `[ADJ] [NOUN] STARTS NOW` / `THE [NOUN] CHOOSES YOU` / `[VERB] [ADJ]` / `[NOUN] > [NOUN]` / `IF NOT YOU, WHO? IF NOT NOW, [NOUN]?` / `STOP [verbing] — START [verbing]`
    - `pickSingular()` post-processor strips trailing S / IES → Y / VES → F so you don't get "LIKE A WOLVES" or "LIKE A FAILURES" — it consistently reads as a singular subject after "A".
    - ~50% of slogans get a trailing emoji slop tail: 🔥 💸 📈 🚀 ⚡ 🦁
  - **14 subtitle one-liners**: "(buy my course)" · "— do not screenshot · do screenshot —" · "the secret? showing up. (also a $4,000 cohort.)" · "+97% retention. in 6 weeks. trust me." · "follow for more daily wisdom you'll forget by lunch." · "they laughed. (they're still laughing.)" · "I learned this from a sunset and a podcast." · "if this resonates, please consider buying my e-book." · "said no founder ever. except this one." etc.
  - **Fake author signature**: random `pick(FIRSTS) + ' ' + pick(LASTS)` (32 first names · 21 last names) + random title (12 options: CEO / Founder / Chief Bandwidth Officer / Multi-hyphenate / Self-styled Thought Leader / 5x Founder · 0x Exit / etc) + random company (15: Apex Cognitive Dynamics / GrindCore Inc / Synergy Loop Labs / OuterNorth Capital / RippleCore / BlockTrace Forge / OneTakeAI / Zenfounder.io etc). Rendered in lower-right with `— Name` then `Title · Company`.
  - **Random watermark logo** bottom-left in Bungee + cyan glow + dark backdrop: `pick([APEX, GRIND, SYNC, VRTX, ZNTH, PIVOT, RUNWAY, VITAL, SLOP]) · pick([CORE, LOOP, FORGE, LAB, CO, VENTURES, GROUP, HQ, TRUST, HOUSE])` → e.g. `APEX·CORE`, `SLOP·FORGE`, `VRTX·VENTURES`.
  - **6 visual styles** (style picker chips, default: hustle):
    - 💪 hustle — "lone climber sunset lens flare cinematic blurry overcooked colours"
    - 📈 CEO — "corporate boardroom CEO portrait skyscraper view sunlight lens flare overly saturated"
    - 🐺 lone wolf — "lone wolf silhouette mountain top orange dramatic sunset over-edited"
    - 🏋️ locker room — "gym locker room weight lifter sweat dramatic spotlight motivational poster aesthetic"
    - 🌅 sunrise — "sunrise over ocean cliff yoga pose silhouette lens flare extreme saturation"
    - 🤝 boardroom — "multi-ethnic business team handshake meeting room sunlight bokeh corporate stock photo overly saturated AI hustle culture"
    - Each prompt hits Pollinations flux at 480×600 with `enhance=true` + random seed per click. Picture preloads via `new Image()` so we never show a broken state.
  - **Poster CSS treatment** (the iconic AI-slop look):
    - Background image positioned via `background-image` with `cover`
    - **`filter: saturate(1.55) contrast(1.18) brightness(0.85)`** — the over-cooked saturation that screams "AI poster mill"
    - Top + bottom darkening gradient + radial vignette via `mix-blend-mode: multiply` overlay
    - Warm-orange to plum colour gradient via `mix-blend-mode: overlay` overlay (the "lens warmth")
    - **Lens flare**: 4rem soft radial-gradient white→amber→transparent circle with 2px blur, `mix-blend-mode: screen`, randomly positioned per generation (top 4-34% / right 12-84%, opacity 0.35-0.85)
    - **Slogan**: Anton bold 26-38px ALL CAPS centred with triple text-shadow (18px ambient black + 4px hard black drop + 40px pink glow). Auto-wraps on word breaks. Subtitle in italic Bricolage Grotesque 92-110% scale with dark + soft shadow.
    - **Pop-in keyframe** (`flashPop`) on every regen: scale 0.92→1.05→1 + rotate ±0.8° + brightness 1.4→1.1→1 over 450ms cubic-bezier(.34, 1.40, .50, 1) overshoot.
  - **4 actions**:
    - ✨ **PUMP A FRESH ONE** — new slogan + new author + new Pollinations image
    - ⟳ **new slogan only** — keeps current image, regenerates everything else (great if you've got a good background)
    - 💾 **save PNG** — renders the poster to a fresh 800×1000 canvas: draws preloaded image with `ctx.filter` saturate/contrast/brightness baked in, then the dark gradient + vignette + colour overlay, then `wrapText()` auto-fits slogan to width (78px starting, drops by 6px until ≤4 lines), then subtitle/author/title/logo. Downloads as `ai-slop-{slugified-slogan}.png` via `toBlob()`. Falls back to gradient if image fetch fails.
    - 🔗 **share text** — uses `navigator.share` if available, else clipboard. Format: `"SLOGAN"\n— Author, Title at Company\nSubtitle\n\nvia [page url]`
  - **Gallery** (last 8 generations, persisted to `localStorage['ai-slop-gallery-v1']`, capped 24): each thumb is a 4:5 aspect rounded card with the Pollinations image as background + same saturate/contrast filter + ::after overlay showing the slogan in Anton over a vertical fade-to-black gradient. Click any thumb to restore that poster as the main canvas. Keyboard accessible (Enter/Space).
  - **Aesthetic**: deep-purple cyberpunk bg (#0f0a18 → #2c1840) with 3 radial accent glows (pink + cyan + lime). Title in Bungee with pink→amber→lime 3-stop -webkit-background-clip gradient, "GENERATOR" word in solid cyan. Tagline in Fraunces italic. Buttons: chunky pink/cyan/amber pills with 2px white border + 2px outer glow ring + 6px black drop shadow.
  - **WCAG**: rem units, semantic main/header/footer/h1, `role="img" aria-label` on poster, `role="status" aria-live="polite"` on toast, `role="group"` on style picker with `aria-pressed` on chips, `role="button" tabindex=0` + Enter/Space on gallery thumbs, `:focus-visible` 3px amber outline 3px offset, ≥44px (2.75rem) min-height on all buttons, `prefers-reduced-motion` kills flashPop + all transitions.
  - **OG image**: Pollinations flux seed 42096.

## issues
- Canvas-rendered PNG via `cv.toBlob` requires the Pollinations image to load with CORS. The `crossOrigin = 'anonymous'` flag works on Pollinations' default setup but rare instances of CORS failure will fall back to the gradient — slogan + text still saved correctly.
- Pollinations cold generations take 30-90s for fresh prompts; subsequent identical seeds are edge-cached. Random seed per click means most posters generate a fresh image. The poster `.loading` class shows a diagonal-stripe placeholder while the image is in flight.
- Slogan auto-wrap on canvas tries to fit ≤4 lines and shrinks the font 78→38px in 6px increments — very long slogans (rare combinations) might still get cramped. Acceptable v1.
- No actual "rate AI slop quality" mechanic — every generation is equal-opportunity bad. Could add a toggle for "even more slop" that triples the saturation.
- Gallery is per-browser-localStorage, no cross-device sync.
- Some POLLI_STYLES prompts overlap (hustle + sunrise both feature lens flares + saturation). On purpose — the visual sameness IS the slop.
- The fake-name signature pool is finite (32 × 21 × 12 × 15 ≈ 120k combinations) but English-Anglo skewed. Could add more international name pools.

## todos
- "Even more slop" toggle: triple the filter saturate/contrast values + add chromatic aberration
- Multi-language slop: Spanish / French / German / Japanese slogan packs
- "Reply guy mode" — adds a fake quote-tweet pile underneath
- Twitter/X-card export with proper aspect ratio
- Animated saving: 3-frame "slop-mill" video export
- "Brand mode" — input your own logo + name and the posters credit you instead
- Bulk generate (10 at once for a grid you can screenshot)
- Achievement system: "First Slop" / "Generated 100 Posters" / "Used All 6 Styles"
- Sound: soft "ding" on generate, fake camera-shutter on save
- A "screenshot lottery" where chat can pick the funniest one daily
- Twitch chat input: chatters' messages get treated as slogans + rendered into posters
