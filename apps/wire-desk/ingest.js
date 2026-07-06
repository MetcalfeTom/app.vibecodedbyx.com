#!/usr/bin/env node
/**
 * wire-desk feed ingester — runs OUTSIDE the browser (sandbox/cron).
 * Fetches official RSS feeds, dedupes against rows already in Supabase
 * (by link), inserts new items as kind='feed' articles with
 * created_at = the article's real pubDate.
 *
 * The browser app never fetches these feeds itself (they don't send CORS
 * headers); it only reads the table. Zero deps — plain node.
 */
'use strict';

const SUPABASE_URL = 'https://yjyxteqzhhmtrgcaekgz.supabase.co';
// public anon key (same one shipped to every browser in supabase-config.js)
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqeXh0ZXF6aGhtdHJnY2Fla2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTg3NDIsImV4cCI6MjA3MjkzNDc0Mn0.G8SRde7IN2QFW1EnASM8IS32IUYR2eenCCjdDdioiBU';
const TABLE = 'wire_desk_articles';
const PER_FEED = 12;

const FEEDS = [
  { source: 'NZ Herald',  url: 'https://rss.nzherald.co.nz/rss/xml/nzhrsscid_000000001.xml' },
  { source: 'RNZ',        url: 'https://www.rnz.co.nz/rss/national.xml' },
  { source: 'Stuff',      url: 'https://www.stuff.co.nz/rss' },   // Atom, not RSS
  { source: 'BBC',        url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
  { source: 'Reuters',    url: 'https://news.google.com/rss/search?q=source:reuters&hl=en-US&gl=US&ceid=US:en' },
  { source: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml' },
];

function decodeEntities(s) {
  return String(s || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&');
}
function stripTags(s) {
  // CDATA must unwrap BEFORE tag-stripping: <![CDATA[x]]> has no '>' until
  // its terminator, so the <[^>]*> pass would swallow the entire payload.
  let out = String(s || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
  out = out.replace(/<[^>]*>/g, ' ');
  out = decodeEntities(out);
  out = out.replace(/<[^>]*>/g, ' ');   // tags that arrived entity-encoded
  return out.replace(/\s+/g, ' ').trim();
}
function tag(block, name) {
  const m = block.match(new RegExp('<' + name + '(?:\\s[^>]*)?>([\\s\\S]*?)</' + name + '>', 'i'));
  return m ? m[1].trim() : '';
}

function parseRss(xml) {
  const items = [];
  // RSS 2.0 <item> blocks or Atom <entry> blocks (Stuff serves Atom)
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>|<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  for (const b of blocks) {
    const title = stripTags(tag(b, 'title'));
    let link = stripTags(tag(b, 'link'));
    if (!link || !/^https?:\/\//.test(link)) {
      const alt = b.match(/<link[^>]*href=["']([^"']+)["']/i);
      if (alt) link = decodeEntities(alt[1]);
    }
    const desc = stripTags(tag(b, 'description') || tag(b, 'summary') || tag(b, 'content:encoded') || tag(b, 'content'));
    const pub = stripTags(tag(b, 'pubDate') || tag(b, 'dc:date') || tag(b, 'published') || tag(b, 'updated'));
    if (!title || !link) continue;
    const d = new Date(pub);
    items.push({
      headline: title.slice(0, 200),
      link: link.slice(0, 600),
      content: (desc || title).slice(0, 4000),
      created_at: isNaN(d) ? new Date().toISOString() : d.toISOString(),
    });
  }
  return items;
}

async function fetchText(url) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 15000);
  try {
    const res = await fetch(url, {
      signal: ctl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (wire-desk ingest; sloppy.live)' },
      redirect: 'follow',
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.text();
  } finally { clearTimeout(t); }
}

async function sb(path, opts = {}, token) {
  const res = await fetch(SUPABASE_URL + path, {
    ...opts,
    headers: {
      apikey: ANON_KEY,
      Authorization: 'Bearer ' + (token || ANON_KEY),
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  const body = await res.text();
  if (!res.ok) throw new Error(path + ' -> HTTP ' + res.status + ': ' + body.slice(0, 300));
  return body ? JSON.parse(body) : null;
}

(async () => {
  // 1. anonymous session for RLS-compliant inserts
  const auth = await sb('/auth/v1/signup', { method: 'POST', body: '{}' });
  const token = auth.access_token;
  const uid = auth.user && auth.user.id;
  if (!token || !uid) throw new Error('anon auth failed');

  // 2. existing feed links (latest 1000) for dedupe
  const existing = await sb(
    '/rest/v1/' + TABLE + '?select=link&kind=eq.feed&order=created_at.desc&limit=1000',
    { method: 'GET' }, token
  );
  const seen = new Set(existing.map(r => r.link));

  // 3. fetch + parse + insert
  let inserted = 0, failed = [];
  for (const feed of FEEDS) {
    try {
      const xml = await fetchText(feed.url);
      const items = parseRss(xml).slice(0, PER_FEED);
      const fresh = items.filter(i => !seen.has(i.link));
      if (!fresh.length) { console.log(feed.source + ': 0 new (' + items.length + ' seen)'); continue; }
      const rows = fresh.map(i => ({
        ...i,
        source: feed.source,
        byline: feed.source + ' wire',
        kind: 'feed',
        user_id: uid,
      }));
      await sb('/rest/v1/' + TABLE, {
        method: 'POST',
        body: JSON.stringify(rows),
        headers: { Prefer: 'return=minimal' },
      }, token);
      fresh.forEach(i => seen.add(i.link));
      inserted += rows.length;
      console.log(feed.source + ': +' + rows.length);
    } catch (e) {
      failed.push(feed.source + ' (' + e.message.slice(0, 80) + ')');
    }
  }
  console.log('DONE: inserted ' + inserted + (failed.length ? ' | FAILED: ' + failed.join(', ') : ''));
  if (inserted === 0 && failed.length === FEEDS.length) process.exit(1);
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
