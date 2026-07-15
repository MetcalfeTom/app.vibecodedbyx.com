# folder-patrol · notes

## log
- 2026-07-15 v1.0: chat "Windows folder-patrol Python script — watch a dir, auto-sort by extension into documents/images/media/archives etc, include a config fi[le]". Not a web app, so shipped as a Win95-setup-wizard page hosting the script with copy + Blob-download. Script: stdlib-only (no watchdog/pip), self-writes patrol_config.json on first run (watch_dir/poll/dry_run/categories/other_folder/ignore_names), 7 default categories + Other, polling loop w/ Ctrl+C, --once for Task Scheduler, --dry-run. Safety: never delete/overwrite (" (1)" renames), drive-root refusal, two-scan size-stability gate, partial-download + hidden + Thumbs.db skips, ignores itself+config. SANDBOX-TESTED end-to-end pre-ship: 10-file sort (case-insensitive ext, no-ext→Other), collision rename, dry-run inertness, pre-sorted files untouched.

## issues
- Docs table notes: last category listed wins per duplicated extension — keep each ext in exactly one category.
- Script displayed via <script type="text/plain"> — python must never contain "</script" (asserted at build time).

## todos
- Optional date-based subsorting (Images/2026-07).
- PowerShell one-liner variant if chat asks.
