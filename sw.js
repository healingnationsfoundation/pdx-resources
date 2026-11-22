// Keeps the guide usable with no signal. Network first: when online, people always
// get the latest page and list (and the saved copy is refreshed). When offline, the
// last saved copy is used, marked with X-PDX-Offline so the page can say so.
// Only same-origin files are handled; nothing is sent anywhere.
const CACHE = 'pdx-guide-v1';
const CORE = ['./', 'index.html', 'resources.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  const key = url.pathname.replace(/^\//, '') || 'index.html';
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(key, copy)); }
      return res;
    }).catch(() => caches.open(CACHE).then(c => c.match(key)).then(hit => {
      if (!hit) return Response.error();
      const headers = new Headers(hit.headers); headers.set('X-PDX-Offline', '1');
      return hit.blob().then(b => new Response(b, { status: 200, headers }));
    }))
  );
});
