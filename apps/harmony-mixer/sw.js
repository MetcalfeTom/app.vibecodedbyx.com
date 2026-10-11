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
    const fallback = async () => (await caches.match(req, { ignoreVary: true })) ||
      (req.mode === 'navigate' ? (await caches.match('./?bare=1')) || (await caches.match('./index.html')) : null);
    try {
      /* v4.114 (pushedbutton: "when the servers went down I'd be lost"): a server that answers with an error page (502/503/504)
         or doesn't answer within 6 s counts as offline too, so the last good copy opens instead of the error */
      const res = await Promise.race([fetch(req), new Promise((_, no) => setTimeout(() => no(new Error('slow')), 6000))]);
      if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); return res; }
      if (res && res.status >= 500) { const hit = await fallback(); if (hit) return hit; }
      return res;
    } catch (err) {
      return (await fallback()) || Response.error();
    }
  })());
});
