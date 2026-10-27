// ============================================================
// PolitiMap – Service Worker Nativo PWA
// v3 – Atualização: +18 lojas HAVAN + empresas de direita
// ============================================================

// ⚠️ IMPORTANTE: Sempre que atualizar arquivos locais, incremente
// CACHE_VERSION para forçar atualização em todos os clientes PWA.
const CACHE_VERSION = 'v4';
const CACHE_NAME = `politimap-pwa-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/data.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// ─── INSTALAÇÃO: Baixa todos os assets da nova versão ────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => {
        // Força ativação imediata — não espera fechar abas antigas
        return self.skipWaiting();
      })
  );
});

// ─── ATIVAÇÃO: Remove caches de versões anteriores ───────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('politimap-pwa-') && name !== CACHE_NAME)
          .map(name => {
            console.log(`[SW] Removendo cache antigo: ${name}`);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log(`[SW] Ativo na versão ${CACHE_VERSION}`);
      return self.clients.claim();
    }).then(() => {
      // Notifica todas as abas/PWAs abertas para recarregar
      return self.clients.matchAll({ type: 'window' }).then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: CACHE_VERSION,
            message: 'Nova versão disponível com +18 lojas HAVAN e empresas de direita.'
          });
        });
      });
    })
  );
});

// ─── MENSAGENS: Permite forçar atualização manual ────────────
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ─── FETCH: Network First com fallback para Cache ────────────
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Recursos externos (tiles de mapa, CDN): rede direta sem cache SW
  if (url.origin !== location.origin) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Recursos locais: rede primeiro → atualiza cache → fallback para cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
