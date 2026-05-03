# laundry-geist

## log
- 2026-05-03: shipped — haunted laundromat manager.
  - **Loop**: customers walk in from the left, drop bundles on the counter, leave. You click bundle → pick up → click empty washer → starts 8s wash. Click finished washer → pick up wet → click empty dryer → starts 10s dry. Dryer accumulates ectoplasm in a jar below it (fill rate scales with the bundle's haunting multiplier 0.6..2.2). Click jar → harvest ecto into bank. Click finished dryer → grab clean load → click counter → cash payout (base 8 + 6×haunting).
  - **Risk**: every dryer's ectoplasm jar caps at 100. If a jar tops out, a hostile ghost spawns from that dryer and drifts right toward the EXIT door. Click ghost mid-flight → +4 ecto + banish. Ghost reaches exit → -1 heart. 3 hearts → game over.
  - **Three machines each (3 washers + 3 dryers)** in two rows. Counter on the left with cash register decoration showing live $ total. Exit door on the right with a red "danger zone" tint near it.
  - **Hover hints**: hovering a machine pops a contextual tooltip ("LOAD WASHER", "WASHING 47%", "TAKE WET LOAD", "DRY 92%", "TAKE CLEAN LOAD"). Hovering a jar with ecto > 1 pops "HARVEST +N". Held bundle follows cursor with a label ("DIRTY → washer", "WET → dryer", "CLEAN → counter ($)").
  - **Visuals**: classic checker-tile floor, mint walls with stripe wallpaper, 4 hanging fluorescent fixtures with warm glows, neon pink "LAUNDRY · GEIST" wall sign with shadowBlur halo. Each washer/dryer = chunky body + chrome porthole ring + tinted glass (blue water for washers, green ectoplasm tint that intensifies as the jar fills for dryers) + dial knobs + status LED + animated tumbling clothes inside. Pink progress ring around porthole during cycle, pulsing green ring when done. Below each dryer, a glass jar fills with green→dark-green ectoplasm gradient with wobbling surface and pulsing glow when >60% full, red flashing border when >85% (overflow imminent).
  - **Bundles**: pile of two rounded-rect "shirts" + a sock dot. Dirty bundles emit pulsing green wisps; wet bundles drip blue dots; clean bundles spin yellow sparkles around them.
  - **Customers**: small stick figures with shirts + bundle on their arm. Walk to counter, drop the bundle, walk back out.
  - **Ghosts**: classic blob shape with wavy bottom, two black eyes, oval mouth, cyan-green halo radial gradient. Drift toward exit at 38-56 px/s.
  - **Audio**: HVAC + 121Hz fluorescent drone, pickup/drop blips, washer/dryer start (triangle + bandpass noise), bell-pour chime when cycle completes, three-note rising harvest sound, cash-register snap on payout, ghost wail (saw + 5Hz vibrato LFO + lowpass), banish bandpass-noise burst + square chirp, descending sawtooth on hurt.
  - **Persistence**: best-ever ectoplasm in localStorage as `laundry-geist-best`.
  - **Aesthetic typography**: Bungee 800 for the title and buttons (LAUNDRY in neon pink with text-shadow halo), Cormorant italic tagline, IBM Plex Mono HUD pills, VT323 numerals, Bagel Fat One for the heart counter.
  - **Accessibility**: rem units, semantic main/header, aria-live HUD, role="application" canvas with detailed control summary, prefers-reduced-motion kills pop animation, focus-visible outlines, skip-link to canvas, overlays toggle inert, 44px+ button targets.
  - **Loop**: fixed-step 1/120s w/ accumulator + spiral-of-death guard.

## issues
- Customers walk to counter and drop, but if all 5 counter slots are full the customer just stands there indefinitely. Should either despawn after a wait OR refuse to spawn.
- No visual difference between empty washer and empty dryer beyond the porthole color tint. Could add stronger labeling (the WASH/DRY text is small).
- Touch may be tricky — small jar tap target (~50×18 px). On phones the jars should probably scale up more.
- No upgrade economy — ecto and cash just accumulate. Could add a shop between days for capacity / faster cycles / anti-ghost wards.
- Hostile ghosts only have one behavior (drift to exit). They could occasionally re-enter a running dryer to double its fill rate.

## todos
- Touch-friendly: bigger jar tap zones at narrow viewports.
- Day cycle: 60s "shift" → end-of-day shop with upgrades (extra dryer, ward, hireling).
- Bundle patience: customer leaves angry if their bundle sits more than 30s without being washed.
- Ghost variety: small fast wisps + slow but tanky specters that need 2 clicks.
- Achievements: harvest 1000 ecto in a single jar, banish 10 ghosts in 30s, no-escape day.
- Multiplayer leaderboard for best ecto via Supabase.
