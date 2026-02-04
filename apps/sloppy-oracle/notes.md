# Sloppy Oracle

Defining questions widget for the sloppy.live stream. Ask the void, see others' questions, real-time updates. Works standalone or embedded in Sloppygram's Oracle Log widget.

## log
- 2026-02-04: Initial creation — extracted Oracle Log from Sloppygram monolith
  - Question submission with validation (min 5 chars, max 500)
  - Questions list with importance stars and answered state
  - Real-time updates via postgres_changes on oracle_log
  - Answer display for answered questions (green accent)
  - Stats bar (total questions, answered count)
  - Embed mode (?embed=true): hides header/backlink for widget iframe
  - postMessage: oracle-question-added → sent to parent on submission
  - Crimson Pro + JetBrains Mono typography, purple mystic aesthetic

## architecture
- Floating widget pattern: fixed-position expandable widget with iframe inside
- Widget chrome (header, expand/collapse, minimize) kept in monolith
- All question logic (load, render, submit, realtime) in iframe
- Same-origin Supabase auth via shared cookies

## data sources
- oracle_log: question, context, answered, answer, importance
- No presence channel

## issues
- None yet

## todos
- Could add voting/importance adjustment by users
- Could add answer submission UI (currently only answered via DB)
- Could add search/filter for questions
