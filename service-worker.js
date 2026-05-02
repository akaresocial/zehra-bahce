const CACHE_AD = 'zehra-bahce-v10';
const ON_BELLEK = [
  './',
  './index.html',
  './styles.css',
  './game.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png',
  './icons/icon-32.png'
];

self.addEventListener('install', (olay) => {
  self.skipWaiting();
  olay.waitUntil(
    caches.open(CACHE_AD).then((cache) => cache.addAll(ON_BELLEK))
  );
});

self.addEventListener('activate', (olay) => {
  olay.waitUntil(
    caches.keys().then((adlar) =>
      Promise.all(
        adlar.filter((ad) => ad !== CACHE_AD).map((ad) => caches.delete(ad))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (olay) => {
  const istek = olay.request;
  if (istek.method !== 'GET') return;

  olay.respondWith(
    caches.match(istek).then((cevap) => {
      if (cevap) return cevap;
      return fetch(istek).then((agCevap) => {
        if (!agCevap || agCevap.status !== 200 || agCevap.type !== 'basic') {
          return agCevap;
        }
        const kopya = agCevap.clone();
        caches.open(CACHE_AD).then((cache) => cache.put(istek, kopya));
        return agCevap;
      }).catch(() => {
        if (istek.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
