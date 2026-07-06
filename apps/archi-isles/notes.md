# Archi Isles — notes

## log
- 2026-07-06: v1 — generic Archipelago multiworld web client (chat ask "webgame that connects to an Archipelago server"). **Library**: archipelago.js@2.1.0 ESM from jsdelivr (24KB, zero deps; API verified from dist/index.d.ts — README/docs 404'd). **Flow**: connect card (host:port → wss:// auto-prefixed, slot, game, password) → client.login(url, slot, game, {password, itemsHandling:7}) → data package auto-fetched → missing/checked locations render as island buttons (names via client.package.lookupLocationName(game, id, true)); click island → client.check(id) → room 'locationsChecked' event re-renders (lit 🌋, sorted last); items via items 'itemsReceived' → 🍾 bottle feed w/ item.name + sender.alias; messages 'message' → ship's log; Say chat box; all islands lit → 🏁 DECLARE GOAL → updateStatus(clientStatuses.goal); weigh-anchor disconnect + socket 'disconnected' → back to connect card. Ids deduped in render (reconnect insurance). **Tested E2E against a MOCK AP server** (scratchpad ap-mock.js: ws@:38281 speaking RoomInfo/DataPackage/Connected/RoomUpdate/ReceivedItems/PrintJSON per network-protocol docs): login ✓, 2 Clique islands named ✓, check → lit + bottle "Feeling of Satisfaction · from Sloppy" + log line ✓, second check → goal button → STATUS:30 hit the server ✓, zero page errors. Aesthetic: nautical chart — deep teal, sand/coral, Pirata One + Atkinson Hyperlegible.

## issues
- Real AP rooms on archipelago.gg speak wss on the room port — works from https. SELF-HOSTED plain ws:// is blocked by browser mixed-content (note shown in UI).
- Mock sent cumulative checked_locations (real servers send partial per protocol) — client-side dedupe added; done-counter can over-count only against nonconforming servers.
- Untested against a live archipelago.gg room (needs an account-generated room) — chat can be the live test.

## todos
- Hints display (items.hints), DeathLink toggle, reconnect w/ session resume, per-game island colors.
