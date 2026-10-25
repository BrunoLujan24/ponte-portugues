/* Service worker de Ponte Português: la app funciona sin conexión y se actualiza sola cuando hay internet. */
const VERSION = 'ponte-__VERSION__';
const CORE = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== VERSION).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function saveCopy(request, response) {
  if (response && (response.ok || response.type === 'opaque')) {
    const copy = response.clone();
    caches.open(VERSION).then(cache => cache.put(request, copy));
  }
  return response;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  /* La página: primero la red (para recibir actualizaciones); si tarda o no hay red, la copia guardada. */
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cached = await caches.match('./index.html');
      const network = fetch(request).then(response => saveCopy('./index.html', response));
      if (!cached) return network;
      const timeout = new Promise(resolve => setTimeout(() => resolve(null), 3000));
      try {
        const response = await Promise.race([network, timeout]);
        return response || cached;
      } catch (error) {
        return cached;
      }
    })());
    return;
  }

  /* Íconos, manifiesto y tipografías: primero la copia guardada. */
  const sameOrigin = url.origin === self.location.origin;
  const fonts = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (sameOrigin || fonts) {
    event.respondWith(
      caches.match(request).then(hit => hit || fetch(request).then(response => saveCopy(request, response)))
    );
  }
});
