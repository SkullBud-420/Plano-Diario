const CACHE_NAME = 'skull-bud-diary-cache-v3'; // Cache version incremented for update
const urlsToCache = [
  './',
  './Skull Bud 420 - Diário 0.1.html',
  './manifest.json',
  './images/icons/icon-192x192.png',
  './images/icons/icon-512x512.png',
  './images/icons/icon-maskable-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.0/Sortable.min.js'
];

self.addEventListener('install', event => {
  // Realiza os passos de instalação
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// NOVO: Evento 'activate' para limpar caches antigos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Se o cache não estiver na nossa "lista branca" (ou seja, é um cache antigo), ele será deletado.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se o recurso estiver no cache, retorna ele. Senão, busca na rede.
        return response || fetch(event.request);
      })
  );
});
