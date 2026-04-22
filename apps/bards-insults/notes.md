# The Bard's Insult

## log
- 2026-04-22: Created. Shakespearean insult generator on parchment with pressable wax seal button. **Word lists** (the classic Shakespearean Insult Kit): 50 opening adjectives (artless/bawdy/beslubbering/bootless/churlish… through yeasty), 50 compound adjectives (base-court/bat-fowling/beef-witted… through weather-bitten), 50 nouns (apple-john/baggage/barnacle… through wagtail). 12 sentence frames ("Thou {a1} {a2} {n}!", "Thou art a {a1} {a2} {n}!", "Away/Avaunt/Hence/Begone/Out", "I do defy thee", "Methinks thee a…") → yields 50·50·50·12 = 1.5M variants. Anti-repeat: up to 6 tries to avoid matching last. **Parchment**: cream→tan radial gradient bg with coffee-stain radial overlays (20%/80% corners + 50% center), 7°/97° repeating-linear paper-fiber grain at low opacity (mix-blend multiply). Body::before holds 3 stain radials, body::after holds the fibers. Main card `.parchment` uses inner box-shadow (40px + 120px) with inset rgba amber tones, outer 6px 30px bottom shadow, and `::before/::after` for burned corner darkening. 4 ink/coffee stains as absolutely-positioned radial-gradient divs at varied rotations. **Wax seal** (172×172px SVG, viewBox -100 to 100): irregular scalloped blob path simulating wax splat with drips, filled via 5-stop radialGradient (#f27272→#d63434→#a01818→#5c0808→#380404) positioned upper-left for 3D lighting. Inner embossed pressed area (`embGrad` #c12828→#7a0a0a→#3a0202), rim circle stroke + faint highlight ring + dashed inner seal line. 8-position radiating rim ticks + 8 tiny star dots. Blackletter "S" (UnifrakturCook, 82px) at center with paint-order stroke fill for emboss. Upper-left specular ellipse for wax shine. Drop-shadow filter `waxShadow` (2px blur + 1,2 offset + 0.7 alpha). Hidden crack-lines `<g class="cracks">` with 6 radiating irregular paths. **Press interaction**: click/tap/Space/Enter triggers `pressSeal()` — CSS `seal-press` keyframe (0.6s, scale 1→0.94→0.98→1.02→1 with -1.5°/+2.5°/-1° rotation wobble) + `crack-flash` on cracks group (opacity 0→0.9→0.8→0 over 0.6s). Simultaneously spawns 14–20 wax particles (6px radial-gradient divs) via rAF with per-particle angle/velocity, 180·prog² gravity, 420° rotation over 700–1100ms life. Insult swap: `.fading` class (opacity 0 + translateY(-6px) rotateX(12deg) + blur 2px, 220ms) → replace text → `.appearing` class (ink-appear 700ms keyframe starting from translateY(10px) rotateX(-14deg) blur 3px). **Audio** (muted if user toggles): `playCrack()` = 80→38Hz sine thump (0.5 peak, 0.22s exp decay) + bandpass-swept noise burst (1200→420Hz, Q=0.9, 250ms). `playQuill()` = highpass 1800Hz filtered noise with 80ms attack + 550ms exp decay at 0.12 peak (scroll-paper sound). Both triggered per seal press (quill 260ms after crack). **UI**: "The Bard's·Insult" UnifrakturCook title (clamp 40–76px) with wax-red `·` separator + text-shadow for print depth. Subtitle "a compendium of bardly barbs & Elizabethan slanders" with ❦ bullets. Plate line "CERTIFIED BY THE GLOBE · ANNO MMXXVI" in IM Fell English SC. Tools row: Copy/♪On/Again buttons (period-appropriate uppercase small caps, brick-parchment bg, wax-red hover). History section with 6-max recent slanders list (dotted separator, italic IM Fell English, click to restore, "—" red bullet). Ornate SVG flourish dividers top + bottom (rotated 180° at bottom) with curly bezier line segments and small filigree dots. Foot line with kbd shortcuts: Space/C/M. Responsive: 600px breakpoint shrinks seal to 140px + card padding. Palette: parchment cream `#f2dfb4` / edge `#9c7240` / ink `#2a1808` / wax `#9a1a1e` / gold `#9e7332`. UnifrakturCook + IM Fell English (italic) + IM Fell English SC + Cormorant Garamond. Pollinations OG.

## features
- Classic 50×50×50 Shakespearean Insult Kit with 12 sentence frames (~1.5M combinations)
- Big ornate wax seal button with realistic 3D-shaded SVG (radial gradient + emboss + highlight + star decorations + blackletter S)
- Pressing the seal: wobble/scale CSS animation + crack-line flash + wax particle burst
- Ink fade-and-roll swap animation on new insult
- Web Audio crack thump + quill-scratch sound (togglable)
- Last 6 insults in history list (click to restore)
- Copy to clipboard with feedback
- Keyboard shortcuts: Space/Enter press seal, C copy, M mute
- Parchment styling: cream gradient + coffee stains + fiber texture + burned corners + ink blots
- Mobile-friendly (600px breakpoint, responsive seal + type)

## issues
- UnifrakturCook has no lowercase S glyph variant that renders cleanly at 82px in some browsers — currently uses uppercase S which looks consistent
- Some of the "Hence/Avaunt" frames are technically late Middle English rather than strictly Shakespearean, but fit the tone
- `position: absolute` on particles means they anchor to `document.body` — if parchment scrolls they drift weirdly; scroll-x offset is captured but sustained vertical scroll during burst would still skew
- The blackletter "S" + red-orange highlight offset stroke can look chunky on low-DPR screens; fine on retina
- Word "urchin-snouted" replaces "unchin-snouted" (my reference had a typo; urchin is correct per Shakespeare's Henry IV etc.)
- Bellow the 600px breakpoint the history list can crowd — max-height 180px + scroll keeps it bounded

## todos
- Save favorites to localStorage
- Direct share link with `?insult=...` query param
- Swap frames weighted to more Shakespearean patterns (quotations from actual plays)
- Drag the seal to "press harder" → wax spreads + deeper sound
- Read aloud with SpeechSynthesis (regal British voice)
- "Write on scroll" mode: type a name, generates a custom-targeted insult using frame "Hark, {name}, thou {a1} {a2} {n}!"
- Print stylesheet for printing an actual scroll
- Multiple seal emblems (S, W, quill, skull, rose) selectable
- Authentic play citations ("as Iago would say…")
