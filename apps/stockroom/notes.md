# stockroom · notes

## log
- 2026-07-12: v1 (chat ask: inventory management site, 3 roles admin/manager/cashier, branch system, sales charts, clean UI, no CodeIgniter, vanilla frontend + "whatever backend"). **Backend decision**: our Supabase RLS is own-rows-only for writes (see root notes) → a genuinely shared multi-user inventory can't be enforced server-side. Chose honest architecture: fully client-side demo suite, localStorage (`stockroom-v1`), seeded deterministic data (mulberry 4242: 3 branches, 18 products × per-branch stock, ~90 sales across 14 days), reset button reseeds. **Roles**: login screen = 3 demo user cards (Ada admin / Mia manager·Harbor / Cash cashier·Harbor); `PERM` matrix gates nav pages + capabilities (admin: all 6 pages + delete + all-branches selector; manager: dash/inv/pos/sales locked to own branch, restock+edit but no delete; cashier: inv read-only, POS, own receipts only). Switch role anytime. **Pages**: Dashboard (4 stat tiles incl. low-stock warn, 14-day revenue line chart + revenue-by-branch bars — both hand-drawn canvas, DPR-aware, no chart libs), Inventory (search + category filter, per-branch or summed stock, low badges, add/edit/restock/delete modals by permission), New Sale (POS product grid w/ live remaining count, cart with per-line remove, oversell blocked at add AND revalidated at checkout, stock decremented + sale recorded), Sales Log (sorted, cashier sees own only), Branches (admin CRUD; new branch zero-stocks all products), Users (admin; live manager/cashier branch reassignment). Toasts, Esc-closing modals, sticky cart. Node 22/22: seed shape, permission matrix (per role), aggregate math (day buckets vs history, branch revenue sums exactly, top-products sort), POS flow (2-stock: third add blocked, checkout zeroes stock + records, empty-cart rejected), branch-scoped stockOf + low-stock count. Sora + IBM Plex Mono, cream/teal SaaS light theme (deliberate contrast to the week's dark games).

## issues
- Client-side roles are demo-grade by design — stated on the login screen. If chat wants true multi-user, needs DB-side role enforcement we can't create with current tools (would need RPC/views).
- Sales log caps at latest 80 rows for render speed.

## todos
- CSV export of inventory + sales; date-range picker for charts.
- Category donut; per-product sales sparkline in inventory rows.
- Barcode-style quick-add (type code → cart) for cashier keyboard flow.
