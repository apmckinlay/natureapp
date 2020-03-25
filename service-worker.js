'use strict';

const CACHE_NAME = 'static-cache-v1';

const FILES_TO_CACHE = [
    // '/index.html',
    // '/nature.css',
    // '/images/background.jpg',
    // '/images/title.svg',
    // '/images/naturecompanion.svg',
    // '/images/animals.svg',
    // '/images/birds.svg',
    // '/images/herps.svg',
    // '/images/insects.svg',
    // '/images/plants.svg',
    // '/images/trees.svg',
    // '/images/help.svg',
    // '/images/search.svg',
];

self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Install');
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline page');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    ); self.clients.claim();
});

// return from cache if present
// else fetch and add to cache
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((r) => {
            console.log('[Service Worker] Fetching resource: ' + e.request.url);
            return r || fetch(e.request).then((response) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});
