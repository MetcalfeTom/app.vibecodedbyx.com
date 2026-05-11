# card-lounge

## log
- 2026-05-11: shipped v1 (chat: "build the board game lounge using option A with Supabase realtime, starting with a simple shared deck"). One shared room "lobby"; Supabase Realtime broadcast as transport (no actual WebRTC, recommended trade-off — same effect for ~4 players, fraction of the code).
  - **State** lives client-side and is replicated via broadcast + presence: `{deck:[52 cards], table:[{id,suit,rank,x,y,drawnBy}], players:{}, stateVersion}`. Each cell of state is a tiny object so resync sends a snapshot blob.
  - **Boot handshake**: on subscribe each client emits `request-state`. Any peer with an existing deck replies with a `state` broadcast containing `{deck, table, version, by}`. The new joiner adopts that snapshot. After 1200ms with no reply we assume we're alone and keep our locally-seeded fresh 52-card deck (this is the "first user = host" pattern but without explicit host election — anyone with state can fulfil a request).
  - **Cards** are 52-id `{id, suit, rank}` objects. Suits use unicode glyphs `♠ ♥ ♦ ♣`. `isRed(suit)` toggles a CSS class so hearts/diamonds render in crim red.
  - **Actions** broadcast as separate events, applied locally first for snappy feedback then mirrored to peers: `draw` (top card from deck → table at jittered center position with drawnBy name), `move` (drag a table card, throttled to 40ms during drag with final flush on pointerup), `shuffle` (collect deck+table, reshuffle locally, broadcast the new deck), `clear` (put all table cards back to bottom of deck without reshuffling), `chat` (text message). All actions include sender's name so logs and card "drawn · NAME" tags survive presence churn.
  - **Presence**: each user tracks `{name, color}`. PALETTE has 8 warm/cool accents; each client picks one at random on first load. Player chips render in the top-right of the table with a colored swatch + name; the local user's chip gets an amber outline + glow. Name is editable in the right sidebar (Playfair italic input); changes broadcast as `rename` and persist to localStorage.
  - **Aesthetic**: vintage card-lounge — felt-green table (#1c4a32) with a subtle diagonal weave overlay + amber-rim ellipse vignette, deep wood frame (#2f1f12), amber accent (#d8a04a), crim red (#a02818), cream paper (#f3e8c8). Title `card · lounge` in Playfair Display italic with a crim middle dot. Sidebar uses Newsreader serif for body, JetBrains Mono for technical labels. Cards rendered as CSS divs with Playfair-Display rank glyphs in opposite corners + a big center suit, paper background with ink border + soft drop shadow. Card-back design: red gradient diamond plaid with an amber-rim border and a ♣ centerpiece (classic Bicycle-style without copyright issues). Deck stack shows a single back card with the remaining count below.
  - **Drag**: pointer-capture from pointerdown → pointermove. Cards bound to the table rect; broadcast throttled to 40ms during drag with a final synced position emit on pointerup so remote viewers always converge to the exact drop location even if intermediate frames were rate-limited.
  - **Log/chat sidebar**: aria-live polite. System lines render italic/dim (`joined`, `shuffled`, `cleared`). Card events show as `<who> drew <rank+suit>` with the suit colored. Chat shows the speaker's name in their swatch color. Capped at 120 entries, auto-scrolls.
  - **Connection status** pill top-right of header: red dot = disconnected, amber blinking = connecting, green = in the lounge. Driven by the channel.subscribe status callback.
  - **Accessibility**: rem units throughout, role=status + aria-live on connection pill, role=button + tabindex + Enter/Space keyboard activation on the deck stack, semantic <header>/<main>/<aside>/<section>, aria-label on table region + chat log, focus-visible amber outlines, 2.5rem min target on buttons, prefers-reduced-motion zeroes deck-hover transform + card transition.

## issues
- No room codes — everyone lands in the same `lobby` room. Could collide if 5+ strangers join simultaneously, but for the livestream it's fine. Easy follow-up: URL hash like `#code=ABCD`.
- "First user = host" timing race: if two people open the page within ~1.2s of each other and both don't receive a `request-state` reply, they could both keep different fresh decks. Mitigation: on any later `state` broadcast we adopt if `payload.version > state.stateVersion`. Higher-version wins in conflicts; ties keep the receiver's. Not bulletproof — could add a deterministic tiebreaker by `payload.by` ID later.
- No card flipping (face-up/face-down toggle). All drawn cards are face-up by design — chat asked for "starting with a simple shared deck" so this is intentional v1 scope.
- No private hands. Cards drawn go straight to the public table tagged with the drawer's name. Hands + privacy is a v2 ask if chat wants it.
- localStorage stores only the name; deck state is purely peer-replicated. Refresh = re-sync from peers OR fresh deck if alone.
- No authentication of actions — anyone can shuffle/clear at any time. Trust model is "you're all in the same friendly room". A vandal could trash the table. Could gate destructive actions behind a "host" role later.

## todos
- Room codes via URL hash `#room=CODE` so multiple parallel tables can coexist.
- Private hands: drag a card from table → into your hand area (bottom strip), only you see its face.
- Face-up / face-down toggle (right-click or double-click).
- Card animations on draw (slide from deck to position).
- Deal-to-everyone button (deal N cards to each player).
- Sound effects (deck shuffle whoosh, card snap, chime on chat).
- A second deck (custom decks, e.g. UNO, tarot, party).
- Persisted table state to localStorage so a refresh keeps your stuff when you're alone.
- Spectator mode for viewers who joined late.
- Voice channel (real WebRTC) layered on top once basic table works.

## design-notes
The biggest decision was using Supabase Realtime broadcast instead of true WebRTC. For a card lounge with ~4 players, the round-trip latency through Supabase's edge is comparable to peer-to-peer once both peers are NAT'd, and the code complexity is roughly 5x simpler (no signaling, no ICE, no peer connection lifecycle, no reconnect-on-stalled-channel logic). The user is asked to consent to this tradeoff (option A vs B in the chat); they picked A.

The "first user = host" resolution uses an implicit handshake rather than an explicit election. A new joiner asks for state, anyone who has state replies. If nobody replies in 1.2s, you ARE the state. This is fragile under simultaneous joins but trivially recovers because state.version tracks revisions: the next action by any client triggers a state broadcast that overrides stale views with `version > received`.

Drag throttling at 40ms is the sweet spot for Supabase — too eager and you flood the channel, too lazy and remote viewers see laggy motion. The pointerup final-flush makes sure the SAME position lands everywhere even if the throttled intermediates were dropped.

Visual choice: vintage card-room over modern flat. Felt green + dark wood + amber lamp light reads as "cozy basement card night" rather than "Discord clone". The amber accent on the connected-status dot doubles as the lighting motif so the UI feels lit by warm bulbs.
