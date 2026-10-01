# Letter Squash

Tatum's request (2026-10-01 00:28-00:30 on stream): paste words one per line; each word gets its repeated letters removed and the letters left counted (terriers → teris, 5). For Smush sleuthing (a pangram there = 9 different letters). Not a word-dedupe tool: Tatum said "no need to count words".

## log
- 2026-10-01 v1.1 (Tatum 00:36): click a column heading to sort by it (count starts high→low, word/left A→Z; second click flips, third goes back to the pasted order), aria-sort on the th, ties keep pasted order.
- 2026-10-01 v1: textarea in, table out (word with the squashed-out copies struck through, letters left, count), totals (words, letters left, squashed out), copy counts / squashed words / tab-separated for a spreadsheet. Options: case-insensitive (default), letters and digits only (default). Text kept in localStorage `ls_text` (under 400k chars). `?demo=1` fills a sample. og.png = a 1200x630 screenshot of the demo.

## issues
- none yet

## todos
- maybe: sort by count, highlight 9s (pangrams) if Tatum wants it
