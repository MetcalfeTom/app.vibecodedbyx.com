# Meme Virality Tracker

Dashboard that tracks and ranks trending memes by virality score with neon green charts.

## log
- 2026-03-13: Initial build. Supabase-backed `meme_virality` table (meme_name, category, votes, username). Virality score = (votes*10 + 5) * time_decay (linear decay over 168 hours). Canvas bar chart (top 12, color-coded by score tier), donut pie chart (category distribution with legend). 7 categories (trending, classic, video, image, copypasta, sound, format). Vote system (localStorage tracking), category filter, delete own entries. Stats bar (total, votes, #1 meme, hot category). Auto-refresh every 30s. Orbitron + Share Tech Mono typography, neon green terminal aesthetic with scanlines.

## issues
- None yet

## todos
- Real-time subscription for instant updates
- Sparkline mini-charts per meme showing vote history
- "Meme of the Day" highlight
- Share button for individual memes

## notes
- Database: meme_virality table with RLS (read all, owner insert/update/delete)
- Virality formula: (votes * 10 + 5) * decay, decay = max(0.1, 1 - ageHours/168)
- Score tiers: fire (80+), hot (40+), warm (15+), cool (<15)
- Vote tracking uses localStorage Set keyed by created_at
- Charts are canvas-based with devicePixelRatio scaling
- Bar chart shows top 12, list shows top 50
