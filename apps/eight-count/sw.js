/* Eight Count service worker (v2.51, pushedbutton 19:06: "is Eight Count going to have the same vulnerability?" as Harmony
   when the servers went down). Network first for the page, so every fix still arrives the moment you're online; the last
   copy answers when the server is down, sends an error page (5xx) or says nothing for 6 s. Emma's 3D library (three.js,
   a pinned version that never changes) comes from this cache first. Only GETs under this folder, that library and Google
   Fonts are kept. Your songs never go through here: they are files you pick, and your routines live in this browser. */
/* v2.52.2: the page and its files are always checked with the server (no-cache), so the browser's own cache can't hand back last
   week's page while you're online. */
const CACHE = 'eightcount-v1';
const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js';
const SHELL = ['./?bare=1', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
const SCOPE = new URL('./', self.location).pathname;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(
    SHELL.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {}))
      .concat(c.add(new Request(THREE_URL, { mode: 'cors' })).catch(() => {}))
  )).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('eightcount-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
function cacheable(req, url) {
  if (req.method !== 'GET') return false;
  if (url.origin === self.location.origin) return url.pathname.startsWith(SCOPE);
  if (url.href === THREE_URL) return true;
  return url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
}
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (!cacheable(req, url)) return;
  e.respondWith((async () => {
    if (url.href === THREE_URL) {
      const hit = await caches.match(THREE_URL);
      if (hit) return hit;
    }
    const fallback = async () => (await caches.match(req, { ignoreVary: true })) ||
      (req.mode === 'navigate' ? (await caches.match('./?bare=1')) || (await caches.match('./index.html')) : null);
    try {
      const res = await Promise.race([fetch(req, url.origin === self.location.origin ? { cache: 'no-cache' } : undefined), new Promise((_, no) => setTimeout(() => no(new Error('slow')), 6000))]);
      if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); return res; }
      if (res && res.status >= 500) { const hit = await fallback(); if (hit) return hit; }
      return res;
    } catch (err) {
      return (await fallback()) || Response.error();
    }
  })());
});
