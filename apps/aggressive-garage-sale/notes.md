# aggressive-garage-sale · notes

## log
- 2026-05-17: v1 — **haggle with a stubborn digital grandmother over cursed yard-sale items** per chat ask: "create an aggressive-garage-sale-sim where players haggle over cursed items with a very stubborn digital grandmother." Single file ~32KB. localStorage persists lifetime cursed haul across visits.
  - **12 cursed items** (8 randomly selected per yard sale via Fisher-Yates shuffle), each with `id`, `ico` emoji, `nm` name, `quirk` flavor description, `ask` (asking price), `min` (her true minimum):
    - 🐈 Ceramic cat that stares · $47 · *"Watches you eat dinner. Won't blink."*
    - 📼 VHS · "Christmas 1987 — DO NOT WATCH" · $18 · *"Smells like rust."*
    - 🪆 Doll with one eye open · $89 · *"Has been in 6 photos with my late husband."*
    - 🧚 Garden gnome with teeth · $35 · *"Used to belong to my mother. She moved out."*
    - ✉️ Box of postcards from a stranger · $12 · *"All addressed to you."*
    - 🪔 Lava lamp that hums in Latin · $65 · *"Plug it in at your own risk."*
    - 🥄 Set of 47 spoons · $9 · *"Only 46. One came back this morning."*
    - 🤡 Painting of a sad clown · $199 · *"The clown follows you. Pricing reflects this."*
    - 📒 Wedding album, 1962 (couple unknown) · $25 · *"Page 14 is sealed shut."*
    - 🪞 Antique mirror with a slight ripple · $120 · *"It looks at you. Just looks."*
    - 🟢 Bag of marbles, three are warm · $6 · *"Don't ask which three."*
    - 📖 Cookbook missing all the recipes · $14 · *"It's just commentary now."*
  - **Negotiation state machine** — click an item → grandma scene replaces the grid. Grandma greets ("Oh. You. I was hoping someone better would come by." / "Lovely day. Don't touch the spoons."). You enter an offer (number input + 4 quick-offer chips: −50% / −25% / match ask / +10% suck-up). She responds per a hand-tuned decision tree:
    1. **Offer ≥ ask** → accepts immediately ("Fine. Sold. Take it before I change my mind.")
    2. **Offer ≥ 92% of ask** → grudging accept ("Hmm. Fine. Sold. I'm doing you a favour.")
    3. **Offer ≥ minAccept** → 55-100% chance of accepting outright (rises with mood) OR counter-offer at mid-point ("I'll take **$X**. Final.")
    4. **Offer < minAccept, slight shortfall** → gentle counter ("Closer to **$X** and you've got yourself a friend.") + currentAsk rises 8%
    5. **Offer < minAccept by >50%** → OFFENDED ("How DARE you. The price is now **$X**." / "My husband would weep. **$X**." / "Did your mother teach you NOTHING?") + currentAsk jumps 18% + her mood drops 3
    6. After **5+ offended turns OR 6+ total turns OR mood ≤ -6** → KICK ("I've had ENOUGH. Get off my driveway." / "Out. Out out out. Take your offers and go.") → item is REVOKED for this session (faded grey with "REVOKED" stamp on the browse grid)
  - **5 phrase pools** (~45 lines total across the bucket): `greet` (4), `acceptFull` (4), `acceptGrudging` (4), `acceptHaggled` (3), `counter` (5), `gentleCounter` (3), `offended` (7), `kick` (5), `walked` (4), `compliment` (4). Pulled randomly per moment so even 100 negotiations feel like 100 different mean grandmas.
  - **🌸 Compliment her** — single-use button per negotiation. Lowers her `minAccept` by 8%, normalises any offended-price-raise back toward `ask`, resets her mood to ≥0. She acknowledges with one of 4 lines ("Don't think flattery works on me. But it might.") A genuine strategy lever to crack stubbornness — but you only get one shot per item.
  - **Walk away** — exits negotiation. 40% chance grandma drops the price slightly to bait you back next time (if her mood isn't too bad). Tagged with one of 4 walk-away replies ("Mmhm. I thought you would." / "Good. I didn't want to sell it to YOU anyway." / "*sips tea* That's right. Off you go.")
  - **Wallet** starts at $200 per yard sale. Bought items cost their final agreed price; the savings (ask vs paid) and curse-power are entirely vibes-based — the joy is in the haggle. Wallet displayed in HUD as `$X` chip; cards block purchase if you can't afford the offer.
  - **Lifetime cursed haul** (`localStorage['aggressive-garage-sale-v1']`): every successful purchase prepends to the haul array (cap 60). Displayed at the bottom as Caveat-style 0.95rem chips ("🐈 Ceramic cat that stares · $34" etc). Persists across reloads and new yard sales. The collection of cursed objects you've accumulated over your lifetime of bad financial decisions.
  - **New yard sale** button: confirm-gated wipe of current session — refreshes wallet to $200, re-rolls a fresh 8-item subset, resets snap counter. Lifetime haul is NOT touched.
  - **Aesthetic — mid-century garage sale on a sunny driveway**:
    - Background: cream → tan vertical gradient (#f5edd6 → #e8dab8) with 3 radial accent glows (coral + mustard + teal)
    - Title in Bungee with 3-layer drop shadow (coral offset + black ambient)
    - Tagline in Fraunces italic
    - Item cards: paper-coloured rectangles with thin ink border + 3px hard drop shadow + 7° repeating-linear paper-grain via `::before`. **Hand-written price tag** rotated 8° in Caveat red ink with 1.5px red border + 1px black hard shadow — pinned to top-right of each card like a real garage-sale label. Sold items get a giant rotated-12° red "SOLD" stamp; revoked items get a grey "REVOKED" stamp.
    - **Grandma scene**: CSS-only sprite with grey-haired head + glasses (2 cream-tinted lens circles), coral sweater torso with white-dot pattern via radial gradients, 2 coral arms (lift to ±25° when offended), teacup on the right with handle and tiny ☕ steam glyph. Background: sun-warm sky → driveway gradient with green lawn strip at the bottom.
    - Speech bubble: cream paper on 3px ink hard shadow with downward-pointing tail. Fraunces italic text with **bolded coral price callouts**.
    - Buttons: chunky 2px hard-shadow rectangles in coral/mustard/cream/ink palette
  - **Hot keys**: Enter in offer input submits; Tab through quick-offer chips; Space/Enter on item cards triggers `beginNegotiate`.
  - **HUD** (centred row of pills): wallet ($X, sage shadow), haul count (plum shadow), grandma snaps counter (coral shadow). All in Special Elite typewriter for that yard-sale receipt vibe.
  - **WCAG**: rem units, semantic main/header/section/footer/h1, `role="status" aria-live="polite"` on HUD + toast + log, `role="button" tabindex=0` + Enter/Space keyboard on item cards, `aria-label` on offer input + section regions, `:focus-visible` 3px mustard outline 3px offset, ≥44px tap targets on all controls, `prefers-reduced-motion` kills all transitions + hover transforms.
  - **OG image**: Pollinations flux seed 11919.

## issues
- The "compliment" button is only useful BEFORE the first offer if she's already escalated — but you have to take at least one turn to know if she's going to escalate. Slight skill-check that rewards smart play.
- 8 items per sale is plenty for a 5-10 minute session but a hardcore haggler will burn through them quickly. Could add an "asking-her-about-her-day" hidden interaction that unlocks 2 more items.
- Grandma's mood only goes down — there's no way to repair beyond the single compliment. Could add a "tea?" interaction for a small mood boost.
- Items don't actually do anything cursed — it's all flavour. v2 could give them passive effects on the meta-game ("the ceramic cat lowers your wallet by $1/sale because it stares at the cash").
- No achievements / milestone celebration — buying the sad clown ($199) at any price deserves a horn. Achievement system is in the todos.
- Lifetime haul caps at 60. After that, oldest items get evicted. Probably fine for most chat sessions but a hoarder might want unlimited.
- Mobile: the 2-column negotiate pane stacks to single-column at ≤36rem. Grandma scene shrinks to 12rem height — still readable but the teacup might look cramped.

## todos
- Cursed item EFFECTS: e.g. mirror = double next snaps' offended threshold; spoon set = grandma always counters −10% lower
- Achievements: "First Snap" / "Bought the Clown" / "Out-Sweet-Talked Her" / "10-Snap Streak"
- "Ask about her day" passive interaction that unlocks 2 hidden items (the gnome's wife, etc)
- "Tea?" mood-repair offer ($2 each, +1 mood)
- Bring-back mechanic: items grandma kicked you out of return in the NEXT yard sale with even-higher ask + bonus quirk line
- Grandma's voice: optional SpeechSynthesis lines (varies regional voice — Yorkshire vs Boston vs Brisbane grandma packs)
- "Show off the haul" view that lets you spawn cursed items as little floating sprites in your collection room
- Daily seed challenge — same 8 items + same starting offers for everyone today
- Twitch chat → offer: each chat message is treated as an offer ($amount in their msg); grandma reacts to chat in real time
- Multiplayer: 2 players bid against each other for the same item, grandma plays them off each other
