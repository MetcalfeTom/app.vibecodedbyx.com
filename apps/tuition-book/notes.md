# Tuition Book

A tutor's day book for Gleamray's request, built from three public messages on 2026-09-23 and merged into one app:
1. "test results with uploaded marks, and generate clear progress reports for each student"
2. "Build the full Tuition Book app requested by Gleamray: tutor dashboard opening to today's classes, student records with attendance and fee-payment status, class schedules, daily lesson plans with" (cut off)
3. The resend that completed it: "…daily lesson plans with objectives, activities, checklists" (this was also cut off after "checklists", so nothing past that was guessed).

No Tuition Book, tutor, gradebook or earlier Gleamray app existed in the repo, so these requests are the whole spec.

## log
- v1.1 (2026-09-23): per chat ("weekday checkboxes for class scheduling and a student dropdown on Results, test both safely").
  - **Weekday checkboxes.** The class editor's single Day dropdown is now seven Mon–Sun checkbox chips (44 px, ✓ plus a filled background, so the state isn't shown by colour alone). A new class starts with today ticked; saving with none ticked is refused with an inline error. Classes store `days: []`. v1.0 books and backups stored a single `day`, which `E.daysOf()` still reads everywhere. Editing an old class converts it to `days` and drops `day`. Schedule and Today show a multi-day class on each of its days, and attendance and plans are keyed by class and date, so nothing else changed. The sample English class now meets twice a week.
  - **Student dropdown on Results.** The row of name buttons became a labelled `<select>` ("Name · level") with ‹ › stepper buttons (disabled at the ends) and "n of N" in the label. Focus stays on the dropdown after switching. It stays on one row at 320 px.
  - **Safety.** The v1.0 sources were kept as *.v10.js / shell.v10.html in the scratchpad. The new build went live only after the full battery passed on the scratch copy. engine 81/81 (+7: legacy `day` read, dedup and Monday-first ordering, an empty `days` list wins over an old `day`, twice-weekly sample, v1.0 backup still validates and schedules, empty or out-of-range days rejected). probe 82/82 at 1200/390/320 (+9 net: today pre-ticked, 44 px weekday targets, no-weekday refusal, two-day class in both columns, old class ticked and converted on edit, dropdown lists 7, prev disabled on the first student, next keeps focus, dropdown selection). Every v1.0 check still passes; three were rewritten for the new controls: slot count 4→5 because the sample class now meets twice, the button-picker checks now drive the dropdown, and the day `<select>` assignment became checkbox clicks.
- v1.0 (2026-09-23): first release.
  - **Today** opens by default and shows the day's classes in time order. Each class has a P/L/A attendance roll (tap the same mark again to clear it) and a "mark rest present" button. Students who owe fees get a fee chip. The lesson plan holds objectives, activities, a checklist (add, tick, remove) and homework, plus a "lesson taught" tick. "Copy plan from <date>" appears on an empty plan and copies the previous plan with its checklist unticked. You can move a day back or forward, and an empty day offers a jump to the next class day.
  - **Students** can be searched and filtered (all, fees owed, attendance under 75%). The editor covers name, level, monthly fee, joined date, guardian and notes. The fee table covers six months: record a payment (leave the amount empty to pay the full balance), see the status chip (paid, part-paid, due, overdue, upcoming) and the outstanding total. Deleting a student uses an arm-then-confirm button.
  - **Schedule** is a Monday–Sunday grid of weekly classes. On phones it stacks and hides empty days. Classes have their own add, edit and delete forms.
  - **Results** covers progress reports, mark upload and the tests list.
    - A report shows the average, the trend (a least-squares slope in points per test), attendance and fees; a summary in plain sentences; an SVG chart against the class average; the test table; and averages by subject. It has a tutor's note, "Print / save as PDF", "Print all N reports" (one page each) and "Copy as text".
    - Mark upload accepts a CSV file, a drag-and-drop, or pasted text. It shows a preview with warnings before anything is saved.
    - Marks can also be typed in by hand, and tests can be edited or deleted.
  - **Book** holds the currency symbol and fee due day, JSON backup and restore (validated, arm-confirmed), load sample and erase everything.
- Privacy: everything is kept in localStorage (`tuition-book-v1`). There is no database, and no student data leaves the device, on purpose, because marks and fees are personal data. The footer says so.

## design
- The data logic is one block of pure functions, `<script id="engine">` (`window.TBE`, also exportable for node), with no DOM, storage or network access. The engine test checks for that by scanning the code.
- CSV import (`planImport` / `commitImport`):
  - Detects the delimiter (`,` `;` or tab) and handles quotes and decimal commas. The name column is the one headed name, student or pupil, otherwise the first column. Every mostly-numeric column becomes a test.
  - Headers like `Algebra /20`, `Essay (out of 30)` or `(30)` set the maximum. A cell like `17/20` sets or checks it. Words like abs, absent, `-` and n/a count as absent.
  - Names match exactly after normalising, including accents and "Last, First" order, then with the words in any order. Two students with the same name are refused, never guessed.
  - Problems are listed by row: over the maximum, not a mark, marks with no name, a student listed twice. The same test name, date and subject merges into the existing test instead of duplicating it.
  - Names not in the book can be added as new students with an opt-in tick box.
- Fees: a month is overdue after the due day (default 10) or once the month is over. Months before the joined date don't count. Outstanding fees look back at most 24 months.
- Destructive actions all use one arm-then-confirm gate (second tap confirms; tapping anywhere else or waiting 5 s cancels).
- Sample book: six made-up students, four classes (two on today's weekday, so the dashboard is never empty), four weeks of attendance, five tests with built-in trends (one improving, one slipping), and fee gaps. "Start my own book" clears it.
- Look: navy cloth book cover with gold Gloock title; the page is paper with faint ledger rules; body text in Atkinson Hyperlegible, numbers in Red Hat Mono.

## tests (scratchpad job 31975160/tb)
- engine.test.js: 74/74 checks covering dates, attendance, every fee status, plans and checklists, CSV parsing and every import path, the HTML-injection name stored verbatim, progress trends and lines, backup validation, and the no-DOM/network/storage scan. Run it against the shipped file with `node engine.test.js index.html`.
- probe.js: 73/73 checks at 1200, 390 and 320 px covering every tab, attendance, the checklist, plan fields, copying a plan, fee payments, the confirm gates, adding a class, the import preview and save (the injected `<img>` name stays text), manual marks with the over-maximum check, print-all (7 reports), start own book and persistence. Also 44 px minimum targets on Today and no sideways page scroll anywhere.

## issues
- A name with no spaces can push a phone layout wider than the screen. `main{overflow-wrap:anywhere}` fixed it; keep that rule.
- `required` on inputs blocks the friendly inline error messages (the browser's own popup shows instead), so validation lives only in JS.
- Headless screenshots can catch the fade-in half done. Use `--virtual-time-budget=15000`.

## todos
- Ask Gleamray what came after "checklists", since the second message was cut off too.
- Possible: syncing between devices (would need the Supabase login plus an explicit opt-in because of personal data), a per-class attendance register export (CSV), fee receipts, a per-term report range.
