# sheva-tz-na

## log
- 2026-05-08: shipped — Hebrew Scrabble (שבץ-נא) hot-seat for two players. Chat asks bundled: "create a high quality Hebrew Scrabble game with a proper right-to-left board, Hebrew letter tiles, and scoring" + "use the standard 22-letter set only and omit the sofiyot forms to keep the tile bag balanced" (sarutobiy) + "ignore the sofit forms as sarutobiy requested, stick to the basic twenty two letters for the tile bag" (confirmation) + "use a standard 15 by 15 grid with the official Hebrew tile counts for the encyclopedia challenge".
  - **15×15 RTL board** rendered as a CSS Grid with `direction: rtl` so column 0 visually appears on the right. Premium-square overlay (TWS / DWS / TLS / DLS / center star) is symmetric across both axes so the standard English-Scrabble layout works without mirroring. Cell labels read `×3 מ`, `×2 מ`, `×3 א`, `×2 א` (Hebrew shorthand for word/letter multipliers).
  - **22-letter tile bag** (sofiyot folded into base counts per chat directive): א ×6, ב ×4, ג ×1, ד ×3, ה ×8, ו ×12, ז ×1, ח ×3, ט ×1, י ×10, כ ×4 (= base 2 + sofit 2), ל ×6, מ ×7 (= 6+1), נ ×6 (= 4+2), ס ×2, ע ×3, פ ×3 (= 2+1), צ ×2 (= 1+1), ק ×2, ר ×6, ש ×4, ת ×5 + 2 blanks = **101 tiles**. Point values match official Hebrew Scrabble (1, 3, 8, 3, 1, 1, 8, 4, 8, 1, 5, 1, 3, 1, 4, 4, 5, 8, 5, 1, 3, 1).
  - **Tap-to-play interaction** (touch + desktop friendly): tap a tile in your rack → it highlights gold → tap an empty board square → tile lands. Tap a freshly-placed (green-outlined) tile to recall it to your rack. Locked tiles (committed prior turns) can't be moved.
  - **Blank tiles** (×2): when the player tries to place a blank, a modal opens with all 22 Hebrew letters as buttons; pick one and the blank is placed showing that letter (with italic gold styling so it's distinguishable). Blank scores 0 regardless of which letter it represents.
  - **Validation**: (1) all placed tiles must lie in one row or one column; (2) the first move must cover the gold center star at (7,7); (3) no gaps along the placement axis after combining with existing tiles; (4) after the first move, at least one placed tile must be orthogonally adjacent to a previously locked tile. All errors surfaced in Hebrew + English in a `aria-live="polite"` message strip below the rack.
  - **Scoring** (full Scrabble rules): main word + every cross word formed by placed tiles. Letter multipliers (DLS ×2, TLS ×3) and word multipliers (DWS ×2, TWS ×3, center as DWS) only apply on the turn the tile is placed — locked tiles use base values. Word multipliers stack multiplicatively. **Bingo bonus** = +50 if all 7 rack tiles are used in one move. Turn-summary modal lists each scored word with its individual subtotal so you can inspect the math.
  - **Honor-system word check**: no Hebrew dictionary embedded — players agree on words. (Real Hebrew dictionaries used in licensed Hebrew-Scrabble tournaments are large + copyrighted, so this prototype trusts the table.)
  - **Actions**: PLAY (commit), RECALL (return all this-turn tiles to rack), SHUFFLE (randomize rack), SWAP (mark tiles → exchange with bag → consumes turn; requires bag ≥ 7 tiles), PASS (skip turn), NEW GAME. Two passes per player (4 consecutive total) ends the game.
  - **End game**: triggered by (a) bag empty AND a player's rack empty (rack-cleared wins) OR (b) 4 consecutive passes (all-passed). Rack-cleared player adds opponents' remaining rack values to their own score; everyone else subtracts their remaining rack value.
  - **Aesthetic**: parchment cream `#f0e3c5` bg with multiply-blend repeating-linear paper grain; wine `#8b1d2c` for TWS + accents, rose `#d35a72` for DWS, royal blue `#2a4d8e` for TLS, sky `#6ba0e0` for DLS, gold `#c79a3c` for the center star and active-player ring. Tiles are warm-cream with a 140°-light radial gradient + inset highlight + 1px drop shadow so they look like tactile wooden pieces. Title "שבץ · נא" in **Frank Ruhl Libre 900** (a serif Hebrew display face — gives the apothecary/scholar feel). Body text in **Heebo** (modern geometric Hebrew sans). Latin captions in **IBM Plex Mono** at 0.55rem with 0.22em tracking. Italic English gloss in **Cormorant Garamond italic**. Tiles use Frank Ruhl Libre 700 for the big glyph + IBM Plex Mono 700 for the corner numeric.
  - **Accessibility**: `dir="rtl"` + `lang="he"` on `<html>`, semantic `<main>` / `<header>` / `<section>` / `<aside>` / `<button type=button>`, `role="grid"` + `role="gridcell"` with `aria-rowindex` + `aria-colindex` on the 225 cells, `role="dialog" aria-modal="true"` on every overlay, `aria-live="polite"` on the message strip, `:focus-visible` outlines (gold-deep), 2.75rem (44px) min-height interactive targets everywhere (rack slots, buttons, blank-letter chooser), skip link at top of page in both Hebrew + English, `prefers-reduced-motion` kills banner + tile transitions.
  - **Mobile**: layout collapses to single column under 880px (sidebar above board), action grid collapses to single column under 600px. Tap targets sized for touch (rack slots stay ≥44px square on mobile via grid sizing).

## issues
- No dictionary lookup — players honor-system word check. A real version would need a Hebrew word list (the official tournament list isn't open-source). Could embed the Hebrew Wiktionary base list or use a permissively-licensed wordbank like "milon-hahok" if one exists.
- Premium squares fade to plain colors when a tile lands on them; the original premium label disappears. Could keep a faded outline on the cell so spectators know what was used.
- The blank-tile picker doesn't let you change your mind once a blank is placed — you'd recall and re-place. Acceptable for a prototype.
- Swap consumes a turn but doesn't display in the turn summary panel — the message strip shows it but the score-row "last turn" indicator just shows 0.
- AI opponent isn't implemented (chat asked for two-player). Adding a simple AI would require a dictionary.

## todos
- Embed an open Hebrew word list and validate words on PLAY (currently honor-system).
- Single-player AI: greedy-best-word search (needs dictionary).
- Move log panel listing each turn's words + score, expandable.
- Keyboard input: type a Hebrew letter to select the matching rack tile (currently only mouse/tap).
- Drag-and-drop tile movement (currently tap-to-place).
- Custom player names instead of "שחקן · א" / "שחקן · ב".
- Online multiplayer via Supabase Realtime (room codes, persistent boards).

## design-notes
- Sofiyot (final-form letters ך ם ן ף ץ) were explicitly omitted per chat directive. The point and tile counts of the base letter were rebalanced to absorb the sofit's count, so a player picks (e.g.) a kaf and may place it anywhere in a word — Hebrew speakers will read it as kaf or kaf-sofit based on position. This trades typographic correctness for mechanical balance.
- Premium-square layout is the standard English-Scrabble layout. Standard Israeli Scrabble uses the same layout (the symmetry holds), so no remapping was needed for RTL.
- The tile graphic uses a warm beige + paint-order inner shadow + 1px drop shadow so tiles read as physically distinct from the parchment board. Real wooden Hebrew Scrabble tiles look very similar — this is an intentional homage rather than a generic "AI app" gradient.
