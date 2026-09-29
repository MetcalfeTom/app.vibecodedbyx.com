# Confession Wall

## log
- 2026-09-29: hearts never stuck: they updated the confession's likes column by an id the confessions table does not have, and only the author may update their own row anyway. Hearts now live in confession_hearts (id, confession_key = author user_id + '@' + created_at ms, user_id), one per visitor, tap again to take it back; shown count = old likes column + hearts. Instant on tap, reverted if the database refuses.
- 2026-09-26: confession-preview.png added (a real 1200×630 screenshot) — the link preview pointed at a file that didn't exist.
- 2026-09-26: SEO — descriptive title/meta description, schema.org JSON-LD.
