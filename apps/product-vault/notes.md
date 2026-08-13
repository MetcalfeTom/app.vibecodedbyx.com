# product-vault (Product Vault — numbers, warranties, deadlines)

## log
- 2026-08-13: v1 MVP per chat ("product numbers, warranties, receipts, return and recall deadlines, theft records, reminders, exportable documentation"). Single file, Familjen Grotesk + Spline Sans Mono, deep-green vault + brass.
  - **LOCAL BY DESIGN (the key call)**: serials and receipts must NOT live in the shared Supabase (read-all RLS would expose them to every user) — everything is IndexedDB on-device; exports are downloads. Footer says so.
  - **Product record**: name, brand/model, serial (mono-typeset), purchase date/price/store, return-window days, warranty months, notes, optional receipt photo (canvas-downscaled ≤1000px jpeg q0.8, size shown, device-only).
  - **Deadlines**: return deadline (purchase+days) and warranty end (purchase+months) computed live; user-entered recall notes with optional act-by date. Badges per product: ok/warn(≤14d)/bad(overdue), recall amber/red, STOLEN pink.
  - **Reminders**: "coming up" strip — return windows ≤21d, warranties ≤35d, recalls ≤60d, sorted by urgency with overdue/soon coloring, capped at 6; each row has a ⤓ .ics download (valid VCALENDAR/VEVENT with date + serial in description) so real calendars do the actual reminding. Stolen items leave the reminder strip.
  - **Theft records**: "record theft" captures timestamp + circumstances (prompt), pink border + STOLEN badge, and flows into the documentation sheet as a THEFT RECORD section flagged for police/insurance use.
  - **Exportable documentation**: per-product .txt documentation sheet (serial, purchase line, every deadline with status, recall note, theft record, receipt status, "generated locally" line); whole-vault .json export + validating import (receipts ride along as dataURLs).
  - **Safe deletes**: inline "remove for good?" confirm.
  - Verified 15/15 via keyPath-aware in-memory IDB shim (add via real form; return=10d-left & warranty≈711d math; reminder strip w/ soon-class + ics button; VCALENDAR content; badges; recall via prompt-stub with date; theft record + badges + card styling; doc-sheet contains serial/THEFT/RECALL/police line; stolen leaves reminders; delete confirm both paths). 430px seeded screenshot reviewed.

## issues
- Receipt photos as dataURLs make vault .json exports big (≈100-300KB per receipt) — acceptable MVP; blob-store + zip export is the scale answer.
- Recall/theft input uses prompt() — fastest MVP path but not stylable; inline forms are the v2 polish.
- Reminders only remind while the page is open — hence the .ics bridge to real calendars (deliberate; no notification permission nagging).

## todos
- Inline recall/theft forms replacing prompt().
- Print-styled documentation sheet (@media print) alongside the .txt.
- Warranty-claim helper: prefilled claim text with serial + purchase proof line.
