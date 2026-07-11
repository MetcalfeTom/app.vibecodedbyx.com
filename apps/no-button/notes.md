# no-button · notes

## log
- 2026-07-11: v1 (chat asked "did the NO button get built?" — it hadn't; spec arrived mid-build: "single button, click fills entire viewport with the word NO in massive text, pure CSS/JS no libraries"). **Core**: giant glossy 3D red arcade button (pure CSS radial gradients + layered box-shadow, 0.7rem travel on press). Click → `#flood` overlay covers viewport with "NO" at `min(56vw,86vh)` slammed in via 0.22s overshoot scale; recedes after 0.9s (0.65s at phase ≥2); clicking the flood itself = another press (chain-pressing keeps the screen filled); Esc dismisses. Faint rotated echo-NOs accumulate on the flood (1 per 5 presses, cap 14). **Escalation**: 4 quip pools by press count (polite → bureaucratic → dramatic w/ body shake → cosmic), no immediate repeats, %N% interpolation; milestones at 10/25/50/100/250/500; flying "NO" particles; descending uh-uh beep (WebAudio, M mute); count persists in localStorage; after 15 presses a tiny dashed "…yes?" button appears — it also says no. **A11y**: aria-live polite announces answer+count, flood aria-hidden (decor), button 44px+, focus-visible, reduced-motion kills slam/shake/fly. Zero libraries. Node dry-run: 120 presses through all 4 phases clean. Bricolage Grotesque + Space Mono, cream/claymation-red.

## issues
- Space/Enter global shortcut presses the button when focus is elsewhere — intentional (arcade feel), but skips native button semantics; kept the real button as primary path.

## todos
- Global NO counter via Supabase (world total) if chat wants multiplayer denial.
- Konami code → still no.
