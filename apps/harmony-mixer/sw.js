/* Harmony service worker (v4.62, djdalebacon: "work offline"): network first, so every fix still arrives the moment
   you're online; the last copy answers when you're not. Only GETs under this folder and Google Fonts are cached.
   Your music never goes through here: tracks are local files and the crate lives in this browser's own storage. */
const CACHE = 'harmony-v1';
const SHELL = ['./?bare=1', './index.html', './match.js', './manifest.json', './icon-192.png', './icon-512.png'];
const SCOPE = new URL('./', self.location).pathname;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('harmony-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
function cacheable(req, url) {
  if (req.method !== 'GET') return false;
  if (url.origin === self.location.origin) return url.pathname.startsWith(SCOPE);
  return url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
}
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (!cacheable(req, url)) return;
  e.respondWith((async () => {
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); }
      return res;
    } catch (err) {
      const hit = await caches.match(req, { ignoreVary: true });
      if (hit) return hit;
      if (req.mode === 'navigate') return (await caches.match('./?bare=1')) || (await caches.match('./index.html')) || Response.error();
      return Response.error();
    }
  })());
});
