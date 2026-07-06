# Hashi Isles — notes

## log
- 2026-07-06: v1 — Hashiwokakero as an Archipelago game + downloadable .apworld (chat ask, follows archi-isles). **Puzzles**: 20 seeded charts (fnv+mulberry on 'hashi-isles#n'), generator builds a known-good solution (random walk placing islands 2-4 apart, marking bridge cells to keep planarity) then presents counts; grid 7–10, islands 6–25. ANY valid config counts (counts match + connected; crossings blocked at input). Input: click island → aligned island cycles 0/1/2 bridges (canBridge checks alignment, intervening islands, occupied cells of other pairs). Win = counts exact + BFS-connected. **Offline**: all charts open, progress in localStorage. **AP mode** (archipelago.js@2.1.0, game "Hashiwokakero", BASE 746000): items key=746001/zen=746002, locations 746011..746030; unlocked = 2 + 2×keys (keys counted by item NAME from items.received); solve → client.check(746010+n); chart 20 checked → goal button → clientStatuses.goal. **.apworld** (in-app download + YAML template): World subclass w/ 20 locations, 9 progressive keys + 11 zen filler, access_rule ceil(n/2)-1 keys, completion = 9 keys; py_compile-checked, AP 0.6.x-targeted, UNTESTED against a real AP install (no AP here) — labelled experimental. **E2E vs mock AP server** (hashi-mock.js): offline solve via generator solution ✓ localStorage ✓; connect → 2 keys granted → named correctly → 6/20 unlocked, 14 locked ✓; solved chart 1 → LocationChecks 746011 hit server ✓; zero page errors.

- 2026-07-06: v1.1 — hashiwokakero.apworld.zip added beside the .apworld link (identical bytes; insurance against unknown-extension serving). REGENERATE BOTH if the apworld changes.

## issues
- MOCK GOTCHA: datapackage game KEYS must match the room's `games` — a half-sed'd mock (Clique keys) makes archipelago.js silently keep an EMPTY package → every item "Unknown Item N". Symptom looks like an app bug; it's server data.
- The .apworld has not run through a real AP generator — first user with an AP install should confirm; API surface used is conservative (Region/Location/Item, access_rule, completion_condition).
- Item counting is name-based; if the apworld renames items, update KEY_NAME in index.html.

## todos
- DeathLink (fail a chart = ?), options in apworld (puzzle count, key curve), bigger charts, hint support.
