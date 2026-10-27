// ============================================================
// PolitiMap – Service Worker Nativo PWA
// v5 – Força Atualização: Categorias + Lojas Havan + Cache Buster
// ============================================================

const CACHE_VERSION = 'v5';
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

// ─── INSTALAÇÃO: Baixa os assets na rede SEM usar cache HTTP ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // Força download direto da rede (cache: 'reload') para evitar servir cache do browser
      await Promise.all(
        STATIC_ASSETS.map(async url => {
          try {
            const req = new Request(url, { cache: 'reload' });
            const res = await fetch(req);
            if (res && res.status === 200) {
              await cache.put(url, res);
            }
          } catch (err) {
            console.warn('[SW] Falha ao pré-cachear:', url, err);
          }
        })
      );
    }).then(() => {
      // Força o novo SW a entrar imediatamente sem esperar fechar o app
      return self.skipWaiting();
    })
  );
});

// ─── ATIVAÇÃO: Limpa TODOS os caches antigos imediatamente ─────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('politimap-pwa-') && name !== CACHE_NAME)
          .map(name => {
            console.log(`[SW] Removendo cache antigo obsoleto: ${name}`);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log(`[SW] Ativo na versão ${CACHE_VERSION}`);
      return self.clients.claim();
    }).then(() => {
      // Notifica abas/instâncias abertas para sincronizar
      return self.clients.matchAll({ type: 'window' }).then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: CACHE_VERSION,
            message: 'App atualizado para a versão mais recente com novas categorias e locais.'
          });
        });
      });
    })
  );
});

// ─── MENSAGENS: Permite forçar ativação imediata via app ──────
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ─── FETCH: Rede primeiro com revalidação imediata ────────────
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Recursos externos (tiles de mapa, CDN, Google Fonts)
  if (url.origin !== location.origin) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Recursos locais: busca na rede (com no-cache) para sempre pegar a versão atualizada
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
