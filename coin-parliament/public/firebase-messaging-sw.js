let CACHE_NAME = 'application';
const OFFLINE_URL = '/offline.html';
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.add(OFFLINE_URL))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
            .catch(() => caches.match(OFFLINE_URL))
    );
});


importScripts("https://www.gstatic.com/firebasejs/4.13.0/firebase-app.js");
importScripts(
    "https://www.gstatic.com/firebasejs/4.13.0/firebase-messaging.js"
);
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../firebase-messaging-sw.js').then((res) => {
        console.log('FB ServiceWorker Registered');

    }).catch(() => {
        console.log('FB ServiceWorker Error');
    });
}
firebase.initializeApp({
    messagingSenderId: "950952702753",
});

const messaging = firebase.messaging();